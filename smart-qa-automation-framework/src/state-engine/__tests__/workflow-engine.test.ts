import { describe, expect, it } from 'vitest';
import { WorkflowStop } from '../stop-reasons';
import { type ActionTask, decideNextTask, type WorkflowSnapshot } from '../task-types';
import { WorkflowEngine, type WorkflowDriver } from '../workflow-engine';

type Misbehaviour = 'none' | 'stall-on-transit' | 'jump-back' | 'throw-on-plan';

/** In-memory stand-in for the system under test, with switchable misbehaviour. */
class FakeShipment implements WorkflowDriver {
  readonly performed: ActionTask[] = [];
  reads = 0;

  constructor(
    private state: WorkflowSnapshot = { status: 'CREATED', pendingTasks: [] },
    private readonly misbehave: Misbehaviour = 'none',
  ) {}

  async readState(): Promise<WorkflowSnapshot> {
    this.reads += 1;
    return { ...this.state, pendingTasks: [...this.state.pendingTasks] };
  }

  async perform(task: ActionTask): Promise<void> {
    this.performed.push(task);
    const s = this.state;
    if (task === 'PLAN_ROUTE' && this.misbehave === 'throw-on-plan') throw new Error('button not found');
    if (task === 'IN_TRANSIT' && this.misbehave === 'stall-on-transit') return;
    switch (task) {
      case 'ASSIGN_VEHICLE':
        this.state = { status: 'ASSIGNED', pendingTasks: [] };
        return;
      case 'PLAN_ROUTE':
        this.state = {
          status: this.misbehave === 'jump-back' ? 'CREATED' : 'ROUTE_PLANNED',
          pendingTasks: [],
        };
        return;
      case 'START_JOURNEY':
        this.state = { status: 'IN_TRANSIT', pendingTasks: ['LOADING', 'TRANSIT', 'UNLOADING'] };
        return;
      default: {
        const rest = s.pendingTasks.slice(1);
        this.state = { status: rest.length === 0 ? 'DELIVERED' : 'IN_TRANSIT', pendingTasks: rest };
      }
    }
  }
}

const fast = { stallIntervalMs: 0, sleep: async () => undefined };

async function stopOf(engine: WorkflowEngine): Promise<WorkflowStop> {
  try {
    await engine.run();
  } catch (e) {
    if (e instanceof WorkflowStop) return e;
    throw e;
  }
  throw new Error('expected the engine to stop');
}

describe('decideNextTask', () => {
  it.each([
    [{ status: 'CREATED', pendingTasks: [] }, 'ASSIGN_VEHICLE'],
    [{ status: 'ASSIGNED', pendingTasks: [] }, 'PLAN_ROUTE'],
    [{ status: 'ROUTE_PLANNED', pendingTasks: [] }, 'START_JOURNEY'],
    [{ status: 'IN_TRANSIT', pendingTasks: ['LOADING', 'TRANSIT'] }, 'CARGO_LOADING'],
    [{ status: 'IN_TRANSIT', pendingTasks: ['TRANSIT', 'UNLOADING'] }, 'IN_TRANSIT'],
    [{ status: 'IN_TRANSIT', pendingTasks: ['UNLOADING'] }, 'CARGO_UNLOADING'],
  ])('%j -> %s', (snapshot, task) => {
    expect(decideNextTask(snapshot)).toEqual({ kind: 'act', task });
  });

  it('treats DELIVERED and CLOSED as complete', () => {
    expect(decideNextTask({ status: 'DELIVERED', pendingTasks: [] }).kind).toBe('complete');
    expect(decideNextTask({ status: 'CLOSED', pendingTasks: [] }).kind).toBe('complete');
  });

  it('never guesses for unknown input', () => {
    expect(decideNextTask({ status: 'ON_HOLD', pendingTasks: [] }).kind).toBe('unknown');
    expect(decideNextTask({ status: 'IN_TRANSIT', pendingTasks: [] }).kind).toBe('unknown');
    expect(decideNextTask({ status: 'IN_TRANSIT', pendingTasks: ['INSPECTION'] }).kind).toBe('unknown');
  });

  it('reports CANCELLED as terminal', () => {
    expect(decideNextTask({ status: 'CANCELLED', pendingTasks: [] }).kind).toBe('terminal');
  });
});

describe('WorkflowEngine', () => {
  it('drives a new shipment to DELIVERED with one evidence entry per action', async () => {
    const fake = new FakeShipment();
    const result = await new WorkflowEngine(fake, fast).run();

    expect(result.outcome).toBe('COMPLETED');
    expect(result.finalState.status).toBe('DELIVERED');
    expect(fake.performed).toEqual([
      'ASSIGN_VEHICLE',
      'PLAN_ROUTE',
      'START_JOURNEY',
      'CARGO_LOADING',
      'IN_TRANSIT',
      'CARGO_UNLOADING',
    ]);
    expect(result.evidence.map((e) => e.outcome)).toEqual(Array(6).fill('progressed'));
    expect(result.evidence[2]).toMatchObject({
      before: { status: 'ROUTE_PLANNED' },
      after: { status: 'IN_TRANSIT', pendingTasks: ['LOADING', 'TRANSIT', 'UNLOADING'] },
    });
  });

  it('resumes from a mid-journey state without repeating earlier steps', async () => {
    const fake = new FakeShipment({ status: 'IN_TRANSIT', pendingTasks: ['TRANSIT', 'UNLOADING'] });
    await new WorkflowEngine(fake, fast).run();
    expect(fake.performed).toEqual(['IN_TRANSIT', 'CARGO_UNLOADING']);
  });

  it('does nothing when the workflow is already complete', async () => {
    const fake = new FakeShipment({ status: 'CLOSED', pendingTasks: [] });
    expect((await new WorkflowEngine(fake, fast).run()).actions).toBe(0);
    expect(fake.performed).toEqual([]);
  });

  it('stops early and successfully when stopWhen matches', async () => {
    const fake = new FakeShipment();
    const result = await new WorkflowEngine(fake, {
      ...fast,
      stopWhen: (s) => s.status === 'IN_TRANSIT',
    }).run();
    expect(result).toMatchObject({ outcome: 'STOPPED_BY_CONDITION', finalState: { status: 'IN_TRANSIT' } });
    expect(fake.performed).toHaveLength(3);
  });

  it('stops on an unknown state without acting on it', async () => {
    const fake = new FakeShipment({ status: 'ON_HOLD', pendingTasks: [] });
    const stop = await stopOf(new WorkflowEngine(fake, fast));
    expect(stop.reason).toBe('UNKNOWN_STATE');
    expect(fake.performed).toEqual([]);
  });

  it('stops on a terminal state', async () => {
    const stop = await stopOf(
      new WorkflowEngine(new FakeShipment({ status: 'CANCELLED', pendingTasks: [] }), fast),
    );
    expect(stop.reason).toBe('TERMINAL_STATE');
  });

  it('detects a stall, re-reading (not re-acting) before giving up', async () => {
    const fake = new FakeShipment(undefined, 'stall-on-transit');
    const stop = await stopOf(new WorkflowEngine(fake, { ...fast, stallChecks: 4 }));

    expect(stop.reason).toBe('STALLED');
    expect(fake.performed.filter((t) => t === 'IN_TRANSIT')).toHaveLength(1);
    expect(stop.lastSnapshot).toEqual({ status: 'IN_TRANSIT', pendingTasks: ['TRANSIT', 'UNLOADING'] });
    expect(stop.evidence.at(-1)).toMatchObject({ task: 'IN_TRANSIT', outcome: 'stalled' });
  });

  it('reports an action failure once and never retries it', async () => {
    const fake = new FakeShipment(undefined, 'throw-on-plan');
    const stop = await stopOf(new WorkflowEngine(fake, fast));

    expect(stop.reason).toBe('ACTION_FAILED');
    expect(fake.performed.filter((t) => t === 'PLAN_ROUTE')).toHaveLength(1);
    expect((stop.cause as Error).message).toBe('button not found');
  });

  it('rejects a transition to an unexpected state', async () => {
    const stop = await stopOf(new WorkflowEngine(new FakeShipment(undefined, 'jump-back'), fast));
    expect(stop.reason).toBe('UNEXPECTED_TRANSITION');
    expect(stop.message).toContain('ASSIGNED -> CREATED');
  });

  it('enforces the action budget', async () => {
    const stop = await stopOf(new WorkflowEngine(new FakeShipment(), { ...fast, maxActions: 2 }));
    expect(stop.reason).toBe('MAX_ACTIONS');
    expect(stop.evidence).toHaveLength(2);
  });

  it('enforces the deadline with an injectable clock', async () => {
    let t = 0;
    const stop = await stopOf(
      new WorkflowEngine(new FakeShipment(), { ...fast, deadlineMs: 100, now: () => (t += 60) }),
    );
    expect(stop.reason).toBe('TIMEOUT');
  });

  it('reports each step as it happens', async () => {
    const seen: string[] = [];
    await new WorkflowEngine(new FakeShipment(), { ...fast, onStep: (e) => seen.push(e.task) }).run();
    expect(seen).toHaveLength(6);
  });
});
