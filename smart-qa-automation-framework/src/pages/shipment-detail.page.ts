import { expect, type Locator, type Page } from '@playwright/test';
import type { TaskType } from '../api/models/shipment.types';
import { TaskList } from '../components/task-list.component';

export type DetailAction =
  'Assign vehicle' | 'Plan route' | 'Start journey' | 'Close shipment' | 'Cancel shipment';

export class ShipmentDetailPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly status: Locator;
  readonly vehicle: Locator;
  readonly vehicleSelect: Locator;
  readonly error: Locator;
  readonly tasks: TaskList;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('shipment-detail');
    this.title = page.getByRole('heading', { level: 1 });
    this.status = page.getByTestId('shipment-status');
    this.vehicle = page.getByTestId('shipment-vehicle');
    this.vehicleSelect = page.getByLabel('Vehicle', { exact: true });
    this.error = page.getByRole('alert');
    this.tasks = new TaskList(page.getByRole('list', { name: 'Journey tasks' }));
  }

  async goto(shipmentId: string): Promise<void> {
    await this.page.goto(`/shipment.html?id=${encodeURIComponent(shipmentId)}`);
    await this.waitUntilReady();
    await expect(this.title).toHaveText(`Shipment ${shipmentId}`);
  }

  async waitUntilReady(): Promise<void> {
    await expect(this.root).toHaveAttribute('data-state', 'ready');
  }

  action(name: DetailAction): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  /** Clicks an action and waits for the page to re-render from the server's answer. */
  async perform(name: DetailAction): Promise<void> {
    await this.action(name).click();
    await this.waitUntilReady();
  }

  async assignVehicle(vehicleId: string): Promise<void> {
    await this.vehicleSelect.selectOption(vehicleId);
    await this.perform('Assign vehicle');
  }

  async completeTask(type: TaskType): Promise<void> {
    await this.tasks.completeButton(type).click();
    await this.waitUntilReady();
  }
}
