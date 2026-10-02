import { expect, type Locator } from '@playwright/test';

/** The shipment list table. Exposes data-state="loading|ready" so callers wait for real readiness. */
export class ShipmentTable {
  readonly rows: Locator;

  constructor(readonly root: Locator) {
    this.rows = root.getByTestId('shipment-row');
  }

  async waitUntilReady(): Promise<void> {
    await expect(this.root).toHaveAttribute('data-state', 'ready');
  }

  row(shipmentId: string): Locator {
    return this.root.locator(`[data-testid="shipment-row"][data-shipment-id="${shipmentId}"]`);
  }

  status(shipmentId: string): Locator {
    return this.row(shipmentId).getByTestId('shipment-status');
  }

  link(shipmentId: string): Locator {
    return this.row(shipmentId).getByRole('link', { name: shipmentId });
  }
}
