# Sample Page Object Model Responsibilities (Synthetic)

> Fictional example. Not runnable. Illustrates POM responsibility separation only.

```mermaid
flowchart TD
    Spec[Test Spec] --> Flow[Checkout Flow]
    Flow --> Cart[CartPage]
    Flow --> Coupon[CouponPanel]
    Flow --> Payment[PaymentPage]
    Cart --> Locators1[Locators + actions only]
    Coupon --> Locators2[Locators + actions only]
    Payment --> Locators3[Locators + actions only]
```

| Layer | Responsibility | Does NOT do |
|---|---|---|
| Test Spec | Arrange/act/assert, test data selection | Hold locators |
| Flow | Orchestrate multi-page journeys | Hold assertions |
| Page Object | Locators and page actions | Make assertions or hold test data |

QA value: locators live in one place, so a UI change is fixed once. Test specs stay readable and assertion-focused.
