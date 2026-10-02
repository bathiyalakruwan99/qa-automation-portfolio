import { expect, type Page } from '@playwright/test';
import type { TaskType } from '../api/models/shipment.types';
import { ShipmentDetailPage } from '../pages/shipment-detail.page';
import { type CreateShipmentForm, ShipmentsPage } from '../pages/shipments.page';

const JOURNEY: readonly TaskType[] = ['LOADING', 'TRANSIT', 'UNLOADING'];

/**
 * Business-level UI steps for a shipment. Specs express intent ("deliver this shipment");
 * the flow coordinates pages; pages own locators. The flow asserts each step's outcome so a
 * failure points at the step that broke, not at a later symptom.
 */
export class ShipmentFlow {
  readonly list: ShipmentsPage;
  readonly detail: ShipmentDetailPage;

  constructor(page: Page) {
    this.list = new ShipmentsPage(page);
    this.detail = new ShipmentDetailPage(page);
  }

  async createFromUi(form: CreateShipmentForm): Promise<string> {
    await this.list.goto();
    return this.list.createShipment(form);
  }

  async open(shipmentId: string): Promise<void> {
    await this.detail.goto(shipmentId);
  }

  async assignAndPlan(vehicleId: string): Promise<void> {
    await this.detail.assignVehicle(vehicleId);
    await expect(this.detail.status).toHaveText('ASSIGNED');
    await expect(this.detail.vehicle).toHaveText(vehicleId);
    await this.detail.perform('Plan route');
    await expect(this.detail.status).toHaveText('ROUTE_PLANNED');
  }

  async startJourney(): Promise<void> {
    await this.detail.perform('Start journey');
    await expect(this.detail.status).toHaveText('IN_TRANSIT');
  }

  async completeJourney(): Promise<void> {
    for (const task of JOURNEY) {
      await this.detail.completeTask(task);
      await expect(this.detail.tasks.task(task)).toHaveAttribute('data-task-status', 'DONE');
    }
    await expect(this.detail.status).toHaveText('DELIVERED');
  }

  async deliver(shipmentId: string, vehicleId: string): Promise<void> {
    await this.open(shipmentId);
    await this.assignAndPlan(vehicleId);
    await this.startJourney();
    await this.completeJourney();
  }

  async close(): Promise<void> {
    await this.detail.perform('Close shipment');
    await expect(this.detail.status).toHaveText('CLOSED');
  }
}
