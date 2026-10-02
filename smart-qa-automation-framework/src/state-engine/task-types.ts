/** Workflow tasks the engine knows how to perform, derived from the observed state. */
export type WorkflowTask =
  | 'ASSIGN_VEHICLE'
  | 'PLAN_ROUTE'
  | 'START_JOURNEY'
  | 'CARGO_LOADING'
  | 'IN_TRANSIT'
  | 'CARGO_UNLOADING'
  | 'COMPLETE';

export type ActionTask = Exclude<WorkflowTask, 'COMPLETE'>;

/** What the engine observed at one moment. Built by a driver from the system's own state (API). */
export interface WorkflowSnapshot {
  status: string;
  /** Journey tasks still pending, in order. */
  pendingTasks: readonly string[];
}

export type Decision =
  | { kind: 'act'; task: ActionTask }
  | { kind: 'complete' }
  | { kind: 'unknown'; detail: string }
  | { kind: 'terminal'; detail: string };

const BY_STATUS: Readonly<Record<string, ActionTask>> = {
  CREATED: 'ASSIGN_VEHICLE',
  ASSIGNED: 'PLAN_ROUTE',
  ROUTE_PLANNED: 'START_JOURNEY',
};

const BY_PENDING_TASK: Readonly<Record<string, ActionTask>> = {
  LOADING: 'CARGO_LOADING',
  TRANSIT: 'IN_TRANSIT',
  UNLOADING: 'CARGO_UNLOADING',
};

/** Pure decision: which task comes next for this snapshot. Never guesses for unknown input. */
export function decideNextTask(snapshot: WorkflowSnapshot): Decision {
  const { status, pendingTasks } = snapshot;
  const byStatus = BY_STATUS[status];
  if (byStatus) return { kind: 'act', task: byStatus };
  if (status === 'DELIVERED' || status === 'CLOSED') return { kind: 'complete' };
  if (status === 'CANCELLED')
    return { kind: 'terminal', detail: 'shipment is CANCELLED and cannot be delivered' };
  if (status === 'IN_TRANSIT') {
    const next = pendingTasks[0];
    if (next === undefined) return { kind: 'unknown', detail: 'IN_TRANSIT with no pending task' };
    const task = BY_PENDING_TASK[next];
    return task ? { kind: 'act', task } : { kind: 'unknown', detail: `unknown journey task "${next}"` };
  }
  return { kind: 'unknown', detail: `unknown status "${status}"` };
}

/** Statuses an action may legitimately lead to. Anything else is an unexpected transition. */
export function expectedStatusesAfter(task: ActionTask, before: WorkflowSnapshot): readonly string[] {
  switch (task) {
    case 'ASSIGN_VEHICLE':
      return ['ASSIGNED'];
    case 'PLAN_ROUTE':
      return ['ROUTE_PLANNED'];
    case 'START_JOURNEY':
      return ['IN_TRANSIT'];
    case 'CARGO_LOADING':
    case 'IN_TRANSIT':
    case 'CARGO_UNLOADING':
      return before.pendingTasks.length <= 1 ? ['DELIVERED'] : ['IN_TRANSIT'];
  }
}

/** Upper bound of actions still needed from this snapshot (used to size the max-action guard). */
export function remainingActions(snapshot: WorkflowSnapshot): number {
  switch (snapshot.status) {
    case 'CREATED':
      return 6;
    case 'ASSIGNED':
      return 5;
    case 'ROUTE_PLANNED':
      return 4;
    case 'IN_TRANSIT':
      return snapshot.pendingTasks.length;
    default:
      return 0;
  }
}

export function fingerprint(snapshot: WorkflowSnapshot): string {
  return `${snapshot.status}|${snapshot.pendingTasks.join(',')}`;
}
