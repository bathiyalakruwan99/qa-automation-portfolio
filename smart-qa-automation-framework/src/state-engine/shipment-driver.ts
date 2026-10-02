import type { ShipmentClient } from '../api/clients/shipment.client';
import { readJson } from '../api/helpers/expect-response';
import type { Shipment, TaskType } from '../api/models/shipment.types';
import type { ShipmentDetailPage } from '../pages/shipment-detail.page';
import type { WorkflowDriver } from './workflow-engine';
import type { ActionTask, WorkflowSnapshot } from './task-types';

const TASK_TO_JOURNEY: Partial<Record<ActionTask, TaskType>> = {
  CARGO_LOADING: 'LOADING',
  IN_TRANSIT: 'TRANSIT',
  CARGO_UNLOADING: 'UNLOADING',
};

export function toSnapshot(shipment: Shipment): WorkflowSnapshot {
  return {
    status: shipment.status,
    pendingTasks: shipment.tasks.filter((t) => t.status === 'PENDING').map((t) => t.type),
  };
}

/**
 * Hybrid driver for the demo shipment workflow: it observes state through the API (the source of
 * truth) and performs every task through the UI, like a user would.
 */
export class ShipmentUiDriver implements WorkflowDriver {
  constructor(
    private readonly shipmentId: string,
    private readonly api: ShipmentClient,
    private readonly detail: ShipmentDetailPage,
    private readonly vehicleId: string,
  ) {}

  async readState(): Promise<WorkflowSnapshot> {
    return toSnapshot(await readJson<Shipment>(await this.api.get(this.shipmentId), 200));
  }

  async perform(task: ActionTask): Promise<void> {
    await this.detail.goto(this.shipmentId);
    switch (task) {
      case 'ASSIGN_VEHICLE':
        return this.detail.assignVehicle(this.vehicleId);
      case 'PLAN_ROUTE':
        return this.detail.perform('Plan route');
      case 'START_JOURNEY':
        return this.detail.perform('Start journey');
      case 'CARGO_LOADING':
      case 'IN_TRANSIT':
      case 'CARGO_UNLOADING':
        return this.detail.completeTask(TASK_TO_JOURNEY[task] as TaskType);
    }
  }
}
