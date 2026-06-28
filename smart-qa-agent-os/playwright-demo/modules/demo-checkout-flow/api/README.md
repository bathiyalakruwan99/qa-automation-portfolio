# API Layer (placeholder)

This folder is reserved for module-specific API clients used in hybrid UI + API checks (for example, asserting that the UI order status matches the API order status after checkout).

A typical client wraps the Playwright `request` context and exposes typed methods that return parsed payloads, so specs and flows can call `await ordersApi.getStatus(orderRef)` rather than dealing with raw HTTP details.

> Synthetic demo example. No real endpoints or auth details are included.
