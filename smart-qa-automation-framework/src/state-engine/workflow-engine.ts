import { type EvidenceEntry, WorkflowStop } from './stop-reasons';
import {
  type ActionTask,
  decideNextTask,
  expectedStatusesAfter,
  fingerprint,
  remainingActions,
  type WorkflowSnapshot,
} from './task-types';

/** Connects the engine to a system: how to observe it and how to perform each task. */
export interface WorkflowDriver {
  readState(): Promise<WorkflowSnapshot>;
  perform(task: ActionTask, snapshot: WorkflowSnapshot): Promise<void>;
}

export interface EngineOptions {
  /** Overrides the computed action budget (remaining actions + buffer). */
  maxActions?: number;
  actionBuffer?: number;
  /** Overall deadline for the run. */
  deadlineMs?: number;
  /** After an action, how many times to re-read the state before declaring a stall. */
  stallChecks?: number;
  stallIntervalMs?: number;
  /** Stop successfully as soon as this returns true (e.g. "stop once IN_TRANSIT"). */
  stopWhen?: (snapshot: WorkflowSnapshot) => boolean;
  onStep?: (entry: EvidenceEntry) => void;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

export interface EngineResult {
  outcome: 'COMPLETED' | 'STOPPED_BY_CONDITION';
  finalState: WorkflowSnapshot;
  actions: number;
  evidence: EvidenceEntry[];
}

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Drives a workflow from whatever state it is in to completion.
 *
 * Guardrails:
 * - reads the real state before every decision and after every action;
 * - never acts on an unknown state, never forces completion;
 * - repeats only reads (safe); never retries an action;
 * - stops on stall, unexpected transition, action budget or deadline;
 * - records before/after evidence for every step.
 */
export class WorkflowEngine {
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(
    private readonly driver: WorkflowDriver,
    private readonly options: EngineOptions = {},
  ) {
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? realSleep;
  }

  async run(): Promise<EngineResult> {
    const evidence: EvidenceEntry[] = [];
    const startedAt = this.now();
    const deadlineMs = this.options.deadlineMs ?? 60_000;
    let snapshot = await this.driver.readState();
    const maxActions =
      this.options.maxActions ?? remainingActions(snapshot) + (this.options.actionBuffer ?? 2);
    let actions = 0;

    const stop = (reason: ConstructorParameters<typeof WorkflowStop>[0], message: string, cause?: unknown) =>
      new WorkflowStop(reason, message, snapshot, [...evidence], cause === undefined ? undefined : { cause });

    for (;;) {
      if (this.options.stopWhen?.(snapshot)) {
        return { outcome: 'STOPPED_BY_CONDITION', finalState: snapshot, actions, evidence };
      }

      const decision = decideNextTask(snapshot);
      if (decision.kind === 'complete')
        return { outcome: 'COMPLETED', finalState: snapshot, actions, evidence };
      if (decision.kind === 'unknown') throw stop('UNKNOWN_STATE', decision.detail);
      if (decision.kind === 'terminal') throw stop('TERMINAL_STATE', decision.detail);

      if (actions >= maxActions) {
        throw stop('MAX_ACTIONS', `${actions} actions used; budget was ${maxActions}`);
      }
      if (this.now() - startedAt > deadlineMs) {
        throw stop('TIMEOUT', `deadline of ${deadlineMs} ms passed after ${actions} actions`);
      }

      const task = decision.task;
      const before = snapshot;
      const stepStart = this.now();
      try {
        await this.driver.perform(task, before);
      } catch (error) {
        evidence.push(this.entry(actions + 1, task, before, null, stepStart, 'failed', String(error)));
        throw stop('ACTION_FAILED', `${task} failed in status ${before.status}`, error);
      }
      actions += 1;

      const after = await this.awaitChange(before);
      if (after === null) {
        evidence.push(this.entry(actions, task, before, before, stepStart, 'stalled'));
        throw stop('STALLED', `${task} was accepted but the state stayed ${fingerprint(before)}`);
      }
      snapshot = after;

      const allowed = expectedStatusesAfter(task, before);
      if (!allowed.includes(after.status)) {
        evidence.push(this.entry(actions, task, before, after, stepStart, 'unexpected'));
        throw stop(
          'UNEXPECTED_TRANSITION',
          `${task} moved ${before.status} -> ${after.status}; expected ${allowed.join(' or ')}`,
        );
      }
      evidence.push(this.entry(actions, task, before, after, stepStart, 'progressed'));
    }
  }

  /** Re-reads the state until it differs from `before`. Returns null if it never changes. */
  private async awaitChange(before: WorkflowSnapshot): Promise<WorkflowSnapshot | null> {
    const checks = this.options.stallChecks ?? 3;
    const interval = this.options.stallIntervalMs ?? 250;
    for (let i = 0; i < checks; i++) {
      const current = await this.driver.readState();
      if (fingerprint(current) !== fingerprint(before)) return current;
      if (i < checks - 1) await this.sleep(interval);
    }
    return null;
  }

  private entry(
    step: number,
    task: ActionTask,
    before: WorkflowSnapshot,
    after: WorkflowSnapshot | null,
    stepStart: number,
    outcome: EvidenceEntry['outcome'],
    note?: string,
  ): EvidenceEntry {
    const entry: EvidenceEntry = {
      step,
      task,
      before,
      after,
      durationMs: this.now() - stepStart,
      outcome,
      ...(note ? { note } : {}),
    };
    this.options.onStep?.(entry);
    return entry;
  }
}
