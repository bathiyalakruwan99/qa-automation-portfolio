import { ShipmentFlow } from '../flows/shipment.flow';
import { LoginPage } from '../pages/login.page';
import { ShipmentDetailPage } from '../pages/shipment-detail.page';
import { ShipmentsPage } from '../pages/shipments.page';
import { test as apiTest } from './test';

export interface UiFixtures {
  loginPage: LoginPage;
  shipmentsPage: ShipmentsPage;
  shipmentDetailPage: ShipmentDetailPage;
  shipmentFlow: ShipmentFlow;
}

/** UI + API fixtures. UI specs still get the API clients for setup, verification and cleanup. */
export const test = apiTest.extend<UiFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  shipmentsPage: async ({ page }, use) => use(new ShipmentsPage(page)),
  shipmentDetailPage: async ({ page }, use) => use(new ShipmentDetailPage(page)),
  shipmentFlow: async ({ page }, use) => use(new ShipmentFlow(page)),
});

export { expect } from '@playwright/test';
