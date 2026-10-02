import type { ActionTask, WorkflowSnapshot } from './task-types';

export type StopReason =
  /** The system is in a state the engine has no rule for. It refuses to guess. */
  | 'UNKNOWN_STATE'
  /** The workflow can never reach the goal from here (e.g. cancelled). */
  | 'TERMINAL_STATE'
  /** An action was accepted but the observed state did not change. */
  | 'STALLED'
  /** The state changed, but not to a state the action may lead to. */
  | 'UNEXPECTED_TRANSITION'
  /** More actions than the workflow can need: a loop or a regression. */
  | 'MAX_ACTIONS'
  /** The overall deadline passed. */
  | 'TIMEOUT'
  /** Performing an action threw. It is reported, never retried. */
  | 'ACTION_FAILED';

export interface EvidenceEntry {
  step: number;
  task: ActionTask;
  before: WorkflowSnapshot;
  after: WorkflowSnapshot | null;
  durationMs: number;
  outcome: 'progressed' | 'stalled' | 'unexpected' | 'failed';
  note?: string;
}

/** Typed stop raised by the engine. Carries the evidence collected up to the stop. */
export class WorkflowStop extends Error {
  constructor(
    readonly reason: StopReason,
    message: string,
    readonly lastSnapshot: WorkflowSnapshot,
    readonly evidence: readonly EvidenceEntry[],
    options?: { cause?: unknown },
  ) {
    super(`[${reason}] ${message}`, options);
    this.name = 'WorkflowStop';
  }
}
