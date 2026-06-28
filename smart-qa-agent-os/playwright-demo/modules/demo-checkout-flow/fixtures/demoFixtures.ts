import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { ShippingPage } from '../pages/shipping.page';
import { CouponPage } from '../pages/coupon.page';
import { PaymentPage } from '../pages/payment.page';
import { OrderConfirmationPage } from '../pages/order-confirmation.page';
import { AccountOrdersPage } from '../pages/account-orders.page';
import type { DemoCheckoutTestData } from '../data/types';
import demoData from '../data/demo-checkout.test-data.json';

interface Pages {
  login: LoginPage;
  home: HomePage;
  products: ProductsPage;
  cart: CartPage;
  shipping: ShippingPage;
  coupon: CouponPage;
  payment: PaymentPage;
  orderConfirmation: OrderConfirmationPage;
  accountOrders: AccountOrdersPage;
}

interface Env {
  baseUrl: string;
  data: DemoCheckoutTestData;
}

export const test = base.extend<Pages & { env: Env }>({
  login: async ({ page }, use) => use(new LoginPage(page)),
  home: async ({ page }, use) => use(new HomePage(page)),
  products: async ({ page }, use) => use(new ProductsPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
  shipping: async ({ page }, use) => use(new ShippingPage(page)),
  coupon: async ({ page }, use) => use(new CouponPage(page)),
  payment: async ({ page }, use) => use(new PaymentPage(page)),
  orderConfirmation: async ({ page }, use) => use(new OrderConfirmationPage(page)),
  accountOrders: async ({ page }, use) => use(new AccountOrdersPage(page)),
  env: async ({}, use) =>
    use({
      baseUrl: process.env.DEMO_BASE_URL ?? 'https://demo.invalid',
      data: demoData as DemoCheckoutTestData,
    }),
});

export { expect };
