import { expect, type Locator, type Page } from '@playwright/test';
import type { CreateShipmentRequest } from '../api/models/shipment.types';
import { ShipmentTable } from '../components/shipment-table.component';

export type CreateShipmentForm = Omit<CreateShipmentRequest, 'weightKg'> & { weightKg: number | '' };

export class ShipmentsPage {
  readonly heading: Locator;
  readonly table: ShipmentTable;
  readonly search: Locator;
  readonly statusFilter: Locator;
  readonly createButton: Locator;
  readonly formError: Locator;
  readonly formSuccess: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Shipments', level: 1 });
    this.table = new ShipmentTable(page.getByTestId('shipment-table'));
    this.search = page.getByRole('searchbox', { name: 'Search shipments' });
    this.statusFilter = page.getByLabel('Status');
    this.createButton = page.getByRole('button', { name: 'Create shipment' });
    this.formError = page.getByTestId('form-error');
    this.formSuccess = page.getByRole('status');
    this.emptyState = page.getByText('No shipments found');
  }

  async goto(): Promise<void> {
    await this.page.goto('/shipments.html');
    await expect(this.heading).toBeVisible();
    await this.table.waitUntilReady();
  }

  async searchFor(text: string): Promise<void> {
    await this.table.waitUntilReady();
    await this.search.fill(text);
    await this.table.waitUntilReady();
  }

  async fillCreateForm(form: CreateShipmentForm): Promise<void> {
    await this.page.getByLabel('Reference').fill(form.reference);
    await this.page.getByLabel('Customer').selectOption(form.customerId);
    await this.page.getByLabel('Vehicle type').selectOption(form.vehicleType);
    await this.page.getByLabel('Origin').selectOption(form.origin);
    await this.page.getByLabel('Destination').selectOption(form.destination);
    await this.page.getByLabel('Weight (kg)').fill(String(form.weightKg));
  }

  /** Submits the form and returns the new shipment ID from the confirmation message. */
  async createShipment(form: CreateShipmentForm): Promise<string> {
    await this.fillCreateForm(form);
    await this.createButton.click();
    await expect(this.formSuccess).toHaveText(/^Shipment DEMO-SHP-\d+ created$/);
    const id = (await this.formSuccess.textContent())?.match(/DEMO-SHP-\d+/)?.[0];
    if (!id) throw new Error('Confirmation message did not contain a shipment ID');
    await this.table.waitUntilReady();
    return id;
  }

  async openShipment(shipmentId: string): Promise<void> {
    await this.table.link(shipmentId).click();
  }
}
