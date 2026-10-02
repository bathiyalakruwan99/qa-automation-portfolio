import { APIRequestContext, expect } from '@playwright/test';

/**
 * Synthetic API client example for portfolio demonstration.
 */
export class OrdersApi {
  constructor(private readonly request: APIRequestContext) {}

  async createOrder(payload: {
    items: { sku: string; qty: number }[];
    couponCode?: string;
    shippingMethod: string;
  }): Promise<{ orderId: string; total: number }> {
    const res = await this.request.post('/api/demo/orders', { data: payload });
    expect(res.ok(), `POST /orders failed: ${res.status()}`).toBeTruthy();
    return res.json();
  }

  async getOrder(orderId: string): Promise<Record<string, unknown>> {
    const res = await this.request.get(`/api/demo/orders/${orderId}`);
    expect(res.ok(), `GET /orders/${orderId} failed: ${res.status()}`).toBeTruthy();
    return res.json();
  }
}
