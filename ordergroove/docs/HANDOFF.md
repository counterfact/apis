# Ordergroove simulator handoff

Updated: 2026-08-02

Use this file as the starting context for continuing the Ordergroove simulator work.

## Repository state

- Repository: `/Users/pmcelhaney/code/counterfact-apis`
- Package: `/Users/pmcelhaney/code/counterfact-apis/ordergroove`
- Branch: `codex/build-ordergroove-simulator`
- Base: `main` at `db2adedd007b508fa282daa963ac9732e7066b4b`
- Nothing has been pushed and no pull request has been opened.

Commits before this handoff file, oldest first:

1. `250eac2` — research initial API coverage
2. `0311b09` — define the validated initial OpenAPI contract
3. `6b3d951` — generate scaffolding and add intentionally failing tests
4. `0b8c3d0` — implement the stateful commerce workflow
5. `890f656` — add first-reader documentation and CI
6. `fd5d8e8` — harden programmatic startup

## Implemented API surface

The simulator implements 20 HTTP operations across 20 production-style trailing-slash paths:

| Resource      | Method | Path                                                |
| ------------- | ------ | --------------------------------------------------- |
| Customers     | GET    | `/customers/`                                       |
| Customers     | POST   | `/customers/create/`                                |
| Customers     | GET    | `/customers/{merchant_user_id}/`                    |
| Products      | GET    | `/products/{product_id}/`                           |
| Addresses     | GET    | `/addresses/`                                       |
| Addresses     | GET    | `/addresses/{address_id}/`                          |
| Payments      | GET    | `/payments/`                                        |
| Payments      | GET    | `/payments/{payment_id}/`                           |
| Subscriptions | GET    | `/subscriptions/`                                   |
| Subscriptions | GET    | `/subscriptions/{subscription_id}/`                 |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_quantity/` |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_shipping/` |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_payment/`  |
| Orders        | GET    | `/orders/`                                          |
| Orders        | GET    | `/orders/{order_id}/`                               |
| Orders        | PATCH  | `/orders/{order_id}/change_shipping/`               |
| Orders        | PATCH  | `/orders/{order_id}/change_payment/`                |
| Orders        | PATCH  | `/orders/{order_id}/skip_subscription/`             |
| Items         | GET    | `/items/`                                           |
| Items         | GET    | `/items/{item_id}/`                                 |

The official `llms.txt` index contained 116 API-reference entries when reviewed. Roughly 90–100 appeared to represent callable operations, making current operation-count coverage approximately 20–22%, or approximately 17% of the complete reference index. This estimate is not complexity-weighted.

## Important files

- `ordergroove/openapi.yaml` — maintained external contract
- `ordergroove/README.md` — installation, startup, seed data, and curl workflow
- `ordergroove/docs/API_COVERAGE.md` — researched endpoint matrix
- `ordergroove/docs/OPEN_QUESTIONS.md` — unresolved production behavior and simulator conventions
- `ordergroove/docs/decisions/` — architecture decisions
- `ordergroove/domain/store.ts` — commerce graph and cross-resource transactions
- `ordergroove/domain/recurrence.ts` — recurrence and calendar arithmetic
- `ordergroove/domain/pagination.ts` — cursor-page convention
- `ordergroove/routes/_.middleware.ts` — shared application-key authentication
- `ordergroove/scenarios/index.ts` — deterministic startup reset
- `ordergroove/scripts/start.ts` — programmatic Counterfact startup
- `ordergroove/test/` — direct domain and real-HTTP tests
- `.github/workflows/ordergroove.yml` — CI quality gates

## Source and contract rules

- Ordergroove-owned public documentation is the only production authority.
- Start research from <https://developer.ordergroove.com/llms.txt>.
- Each implemented operation has `x-ordergroove-source`.
- Each unresolved behavior has `x-simulator-limitation`.
- The contract includes every order status documented when reviewed.
- Preserve published field names, identifier distinctions, methods, and trailing slashes.
- Do not edit generated `types/_.context.ts` files.
- Research and validate each new API slice before generating or implementing it.

## Architecture and explicit conventions

One `CommerceStore` owns customers, products, addresses, payments, subscriptions, orders, and items. It validates relationships before mutation, performs cross-resource changes atomically, and returns deep clones from public reads.

The runtime currently supports only Application API Scope. The deterministic non-secret key is:

```text
ordergroove-simulator-key
```

Storefront HMAC and trust-level authentication are documented but intentionally unsupported.

The following are explicitly simulator-only conventions rather than confirmed production behavior:

- API-v2 cursor envelopes with a simulator-defined opaque cursor encoding;
- association actions require their address/payment body ID;
- replacement addresses and payments must be live and belong to the resource's customer;
- changing one order or subscription association does not cascade to related resources;
- changing a subscription quantity also updates matching unsent items;
- skip moves only matching subscription items and retains the source order;
- repeated skip and invalid cross-customer relationships return 400 without mutation;
- UTC calendar arithmetic clamps invalid month/year days to month end;
- deterministic generated IDs and timestamps; and
- process restart is the reset mechanism.

## Deterministic seed and acceptance result

The seed includes customers `customer_demo` and `customer_other`; addresses `address_demo`, `address_alternate`, and `address_other_customer`; payments `payment_demo`, `payment_alternate`, and `payment_other_customer`; products `coffee_demo` and `tea_demo`; subscriptions `subscription_coffee`, `subscription_tea`, and the cross-customer fixture `subscription_other_customer`; multi-subscription order `order_upcoming`; and items `item_coffee` and `item_tea`.

The initial manual live acceptance demonstrated:

- missing authentication returns 403;
- subscription quantity changes from 2 to 3 and persists;
- the matching unsent item quantity changes atomically;
- skip moves only `item_coffee` to `order_generated_1`;
- the generated order date is `2026-09-30`;
- repeated and cross-customer skips return 400 without mutation; and
- restart restores quantity 2 and removes the generated order.

The expanded automated suite additionally covers address/payment filtering, cursor pagination and retrieval; all four association actions; required request bodies; missing, inactive, and cross-customer targets; non-cascading individual changes; and deterministic restart of the added seed records.

## Verification status

After the focused address/payment expansion, the following passed:

- OpenAPI validation without warnings;
- 16 tests: 9 direct domain tests and 7 real-HTTP tests;
- ESLint and Prettier;
- strict TypeScript typechecking; and
- `git diff --check`.

The locked dependency installation reported 17 transitive audit findings: 14 moderate and 3 high. No audit fix was applied because it was outside the requested gates and could introduce breaking dependency changes.

Counterfact is pinned to version 2.16.0. Its published package omitted the declaration file referenced by its package metadata, so `ordergroove/adapters/counterfact.d.ts` narrowly declares only the programmatic surface used by this package.

`npm start` sets `CHOKIDAR_USEPOLLING=true` before importing Counterfact because its lightweight context/store watchers exceeded the macOS file-descriptor limit during manual startup.

## How to verify

From `ordergroove/`, run each gate independently:

```bash
npm ci
npm run validate:openapi
npm test
npm run lint
npm run typecheck
git diff --check
```

Start the simulator with:

```bash
npm start
```

The API listens on `http://localhost:3100` by default. Set `ORDERGROOVE_SIMULATOR_PORT` to use another port.

## Recommended next work

The immediate follow-up is the remaining focused address/payment mutation surface: create, update (activation/deactivation), and `use_for_all` for both resources. These operations need explicit conventions for defaults, nullable fields, bulk propagation, empty success bodies, and Shopify-specific payment warnings before implementation.

The legacy `POST https://api.ordergroove.com/customer/update_payment_default` integration is out of scope because it uses a different host, authentication, URL-encoding, encryption, and response model.

Major deferred areas include Storefront authentication, offers and incentives, discounts, purchase post/cart, product mutation, prepaid subscriptions, bundles/components, webhooks, bulk operations, one-click actions, and order placement.

Important unresolved production questions include list shapes without API version 2, required action fields, association ownership/live validation, individual-change propagation, quantity propagation, recurrence timezone and month-end behavior, empty-order handling after skip, repeated-action behavior, exact error bodies/media types, and slashless-path behavior.

No subagents were used for the initial implementation.
