# Ordergroove API simulator

This package is a stateful simulation of a small, coherent part of Ordergroove's public REST API. It uses [Counterfact](https://counterfact.dev), a tool that turns an OpenAPI contract into typed request handlers and a live local HTTP server.

The contract was inferred from Ordergroove-owned public documentation reviewed on 2026-08-02. It is not authored or endorsed by Ordergroove and is not a drop-in replacement for production. Ordergroove's current documentation remains the authority for production behavior; [`openapi.yaml`](./openapi.yaml) is the authority for this simulator's exposed contract, and maintained domain code is the authority for its explicitly limited runtime behavior.

## Supported operations

| Resource      | Method | Path                                                | Behavior                                          |
| ------------- | ------ | --------------------------------------------------- | ------------------------------------------------- |
| Customers     | GET    | `/customers/`                                       | Filtered, cursor-paginated list                   |
| Customers     | POST   | `/customers/create/`                                | Create and persist a customer                     |
| Customers     | GET    | `/customers/{merchant_user_id}/`                    | Retrieve a customer                               |
| Products      | GET    | `/products/{product_id}/`                           | Retrieve a product                                |
| Addresses     | GET    | `/addresses/`                                       | Filtered, cursor-paginated list                   |
| Addresses     | GET    | `/addresses/{address_id}/`                          | Retrieve an address                               |
| Payments      | GET    | `/payments/`                                        | Filtered, cursor-paginated list                   |
| Payments      | GET    | `/payments/{payment_id}/`                           | Retrieve a payment method                         |
| Subscriptions | GET    | `/subscriptions/`                                   | Filtered, cursor-paginated list                   |
| Subscriptions | GET    | `/subscriptions/{subscription_id}/`                 | Retrieve a subscription                           |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_quantity/` | Change quantity and simulator-linked unsent items |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_shipping/` | Change only this subscription's shipping address  |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_payment/`  | Change only this subscription's payment method    |
| Orders        | GET    | `/orders/`                                          | Filtered, cursor-paginated list                   |
| Orders        | GET    | `/orders/{order_id}/`                               | Retrieve an order                                 |
| Orders        | PATCH  | `/orders/{order_id}/change_shipping/`               | Change only this order's shipping address         |
| Orders        | PATCH  | `/orders/{order_id}/change_payment/`                | Change only this order's payment method           |
| Orders        | PATCH  | `/orders/{order_id}/skip_subscription/`             | Move matching items to a generated upcoming order |
| Items         | GET    | `/items/`                                           | Filtered, cursor-paginated list                   |
| Items         | GET    | `/items/{item_id}/`                                 | Retrieve an item                                  |

Address and payment creation, activation/deactivation, and `use_for_all` actions remain unsupported, as do offers, discounts, entitlements, purchase post, product mutation, prepaid and bundle actions, webhooks, bulk operations, Storefront actions, one-click actions, and order placement. The legacy `api.ordergroove.com/customer/update_payment_default` integration is outside this REST simulator's scope. See [`docs/API_COVERAGE.md`](./docs/API_COVERAGE.md) and [`docs/OPEN_QUESTIONS.md`](./docs/OPEN_QUESTIONS.md) for evidence and limitations.

## Authentication

Production documentation describes Application API Scope (`x-api-key`) and Storefront HMAC authorization, with operation-specific trust and bulk permissions. The initial simulator implements only Application scope. Use this non-secret deterministic key:

```text
x-api-key: ordergroove-simulator-key
```

Missing or different keys return 403. Do not put real Ordergroove credentials in this project.

## Install and start

Node.js 22 or newer is required. Counterfact is locked to version 2.16.0.

```bash
cd ordergroove
npm ci
npm start
```

The canonical local API origin is `http://localhost:3100`; Swagger UI is at `http://localhost:3100/counterfact/swagger/`. Published API paths retain Ordergroove's trailing slashes.

## Deterministic seed

Every fresh process starts with:

- merchant `merchant_demo`;
- customers `customer_demo` (`ada@example.invalid`) and `customer_other` (`grace@example.invalid`);
- addresses `address_demo`, `address_alternate`, and cross-customer validation fixture `address_other_customer`;
- payments `payment_demo`, `payment_alternate`, and cross-customer validation fixture `payment_other_customer`;
- products `coffee_demo` and `tea_demo`;
- subscriptions `subscription_coffee` and `subscription_tea`;
- unsent order `order_upcoming`, placed on `2026-08-31`; and
- items `item_coffee` and `item_tea` in that multi-subscription order.

State persists in memory for the process lifetime. Stop and start the simulator to reset it. There is deliberately no production-looking reset endpoint.

## Complete commerce workflow

With the simulator running:

```bash
API=http://localhost:3100
KEY=ordergroove-simulator-key

curl -sS -H "x-api-key: $KEY" "$API/customers/customer_demo/"
curl -sS -H "x-api-key: $KEY" "$API/products/coffee_demo/"
curl -sS -H "x-api-key: $KEY" "$API/addresses/?customer=customer_demo"
curl -sS -H "x-api-key: $KEY" "$API/payments/?customer=customer_demo"
curl -sS -H "x-api-key: $KEY" "$API/subscriptions/?customer=customer_demo"
curl -sS -H "x-api-key: $KEY" "$API/orders/?subscription=subscription_coffee"
curl -sS -H "x-api-key: $KEY" "$API/items/?order=order_upcoming"

curl -sS -X PATCH \
  -H "x-api-key: $KEY" \
  -H "content-type: application/json" \
  -d '{"quantity":3}' \
  "$API/subscriptions/subscription_coffee/change_quantity/"

curl -sS -X PATCH \
  -H "x-api-key: $KEY" \
  -H "content-type: application/json" \
  -d '{"subscription":"subscription_coffee"}' \
  "$API/orders/order_upcoming/skip_subscription/"

curl -sS -X PATCH \
  -H "x-api-key: $KEY" \
  -H "content-type: application/json" \
  -d '{"shipping_address":"address_alternate"}' \
  "$API/subscriptions/subscription_coffee/change_shipping/"

curl -sS -X PATCH \
  -H "x-api-key: $KEY" \
  -H "content-type: application/json" \
  -d '{"payment":"payment_alternate"}' \
  "$API/subscriptions/subscription_coffee/change_payment/"

curl -sS -H "x-api-key: $KEY" "$API/items/?subscription=subscription_coffee"
curl -sS -H "x-api-key: $KEY" "$API/orders/order_generated_1/"
```

The coffee item now has quantity 3 and belongs to `order_generated_1`, whose simulator-defined place date is `2026-09-30`. The subscription uses the alternate address and payment; those individual changes do not cascade to its orders or to other subscriptions. Association actions require the documented body ID, and the target must be live and belong to the same customer. Repeating the skip or supplying an inactive or cross-customer target returns 400 without mutation. These validation rules, generated identifiers, and month-end clamping are explicitly documented simulator conventions where production behavior is incomplete.

## Quality checks

```bash
npm run validate:openapi
npm test
npm run lint
npm run typecheck
git diff --check
```

HTTP tests start Counterfact through its programmatic API and make real requests. A narrow declaration in `adapters/counterfact.d.ts` covers that API because the Counterfact 2.16.0 package points to a declaration file that is not present in the published tarball; no runtime behavior is replaced.

## Generated and maintained ownership

- `openapi.yaml`: maintained contract.
- `types/` and `counterfact-types/`: generated; never hand-edit.
- `routes/`: generated once as scaffolding, then maintained as thin adapters. Counterfact does not overwrite existing route logic.
- `domain/`: maintained state, relationships, recurrence, pagination, and transaction rules.
- `routes/_.middleware.ts`: maintained cross-cutting authentication.
- `scenarios/index.ts`: maintained deterministic startup seed hook.
- `test/`: maintained direct and real-HTTP tests.

To add a slice safely, research the official page, update coverage and questions, add an operation with `x-ordergroove-source`, validate it, regenerate, write failing direct and HTTP tests, implement the smallest documented behavior, run every gate, and commit the slice independently. Never edit `types/_.context.ts`.
