import type { ShipmentClient } from '../api/clients/shipment.client';

/**
 * Records every shipment a test creates and deletes them afterwards, even when the test fails.
 * 404 on delete is fine (the test may have deleted it itself); anything else is reported.
 */
export class CleanupRegistry {
  private readonly shipmentIds = new Set<string>();

  track(shipmentId: string): string {
    this.shipmentIds.add(shipmentId);
    return shipmentId;
  }

  async run(shipments: ShipmentClient): Promise<string[]> {
    const problems: string[] = [];
    for (const id of this.shipmentIds) {
      const res = await shipments.delete(id);
      if (res.status() !== 204 && res.status() !== 404) problems.push(`${id}: HTTP ${res.status()}`);
    }
    this.shipmentIds.clear();
    return problems;
  }
}
