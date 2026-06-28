import { Page } from '@playwright/test';
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

export interface FlowContext {
  page: Page;
  baseUrl: string;
  data: DemoCheckoutTestData;
}

export interface CheckoutResult {
  orderRef: string;
}

export async function signIn(ctx: FlowContext): Promise<void> {
  const login = new LoginPage(ctx.page);
  await login.goto(ctx.baseUrl);
  await login.signIn(ctx.data.user);
  await new HomePage(ctx.page).expectLoaded();
}

export async function addItemsToCart(ctx: FlowContext): Promise<void> {
  await new HomePage(ctx.page).openShop();
  const products = new ProductsPage(ctx.page);
  await products.expectLoaded();
  await products.addItems(ctx.data.items);

  const cart = new CartPage(ctx.page);
  await cart.goto(ctx.baseUrl);
  await cart.expectLoaded();
  await cart.expectRowCount(ctx.data.items.length);
  await cart.checkout();
}

export async function enterShipping(ctx: FlowContext): Promise<void> {
  await new ShippingPage(ctx.page).fillAddress(ctx.data.shipping);
}

export async function applyCoupon(ctx: FlowContext): Promise<void> {
  await new CouponPage(ctx.page).apply(ctx.data.coupon);
}

export async function completePayment(ctx: FlowContext): Promise<CheckoutResult> {
  await new ShippingPage(ctx.page).continueToPayment();
  const payment = new PaymentPage(ctx.page);
  await payment.fillPayment(ctx.data.payment);
  await payment.placeOrder();

  const confirmation = new OrderConfirmationPage(ctx.page);
  await confirmation.expectStatus(ctx.data.expected.finalStatus);
  const orderRef = await confirmation.readOrderRef();
  return { orderRef };
}

export async function verifyOrderInHistory(
  ctx: FlowContext,
  result: CheckoutResult,
): Promise<void> {
  const account = new AccountOrdersPage(ctx.page);
  await account.goto(ctx.baseUrl);
  await account.expectOrderVisible(result.orderRef);
  await account.expectOrderStatus(result.orderRef, ctx.data.expected.finalStatus);
}

export async function runEndToEnd(ctx: FlowContext): Promise<CheckoutResult> {
  await signIn(ctx);
  await addItemsToCart(ctx);
  await enterShipping(ctx);
  await applyCoupon(ctx);
  const result = await completePayment(ctx);
  await verifyOrderInHistory(ctx, result);
  return result;
}
