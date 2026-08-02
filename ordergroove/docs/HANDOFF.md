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

The simulator implements 12 HTTP operations across 12 production-style trailing-slash paths:

| Resource      | Method | Path                                                |
| ------------- | ------ | --------------------------------------------------- |
| Customers     | GET    | `/customers/`                                       |
| Customers     | POST   | `/customers/create/`                                |
| Customers     | GET    | `/customers/{merchant_user_id}/`                    |
| Products      | GET    | `/products/{product_id}/`                           |
| Subscriptions | GET    | `/subscriptions/`                                   |
| Subscriptions | GET    | `/subscriptions/{subscription_id}/`                 |
| Subscriptions | PATCH  | `/subscriptions/{subscription_id}/change_quantity/` |
| Orders        | GET    | `/orders/`                                          |
| Orders        | GET    | `/orders/{order_id}/`                               |
| Orders        | PATCH  | `/orders/{order_id}/skip_subscription/`             |
| Items         | GET    | `/items/`                                           |
| Items         | GET    | `/items/{item_id}/`                                 |

The official `llms.txt` index contained 116 API-reference entries when reviewed. Roughly 90–100 appeared to represent callable operations, making the current operation-count coverage approximately 12–13%, or approximately 10% of the complete reference index. This estimate is not complexity-weighted.

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

One `CommerceStore` owns customers, products, subscriptions, orders, and items. It validates relationships before mutation, performs cross-resource changes atomically, and returns deep clones from public reads.

The runtime currently supports only Application API Scope. The deterministic non-secret key is:

```text
ordergroove-simulator-key
```

Storefront HMAC and trust-level authentication are documented but intentionally unsupported.

The following are explicitly simulator-only conventions rather than confirmed production behavior:

- API-v2 cursor envelopes with a simulator-defined opaque cursor encoding;
- changing a subscription quantity also updates matching unsent items;
- skip moves only matching subscription items and retains the source order;
- repeated skip and invalid cross-customer relationships return 400 without mutation;
- UTC calendar arithmetic clamps invalid month/year days to month end;
- deterministic generated IDs and timestamps; and
- process restart is the reset mechanism.

## Deterministic seed and acceptance result

The seed includes customer `customer_demo`, products `coffee_demo` and `tea_demo`, subscriptions `subscription_coffee` and `subscription_tea`, multi-subscription order `order_upcoming`, and items `item_coffee` and `item_tea`.

Manual live acceptance demonstrated:

- missing authentication returns 403;
- subscription quantity changes from 2 to 3 and persists;
- the matching unsent item quantity changes atomically;
- skip moves only `item_coffee` to `order_generated_1`;
- the generated order date is `2026-09-30`;
- repeated and cross-customer skips return 400 without mutation; and
- restart restores quantity 2 and removes the generated order.

## Verification status

The following passed after a clean `npm ci`:

- OpenAPI validation without warnings;
- 10 tests: 6 direct domain tests and 4 real-HTTP tests;
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

The highest-value next independently researched slice is addresses and payments. It would enable documented subscription and order shipping/payment changes without first introducing offers, discounts, or order-placement integrations.

Major deferred areas include Storefront authentication, offers and incentives, discounts, purchase post/cart, product mutation, prepaid subscriptions, bundles/components, webhooks, bulk operations, one-click actions, and order placement.

Important unresolved production questions include list shapes without API version 2, required action fields, quantity propagation, recurrence timezone and month-end behavior, empty-order handling after skip, repeated-action behavior, exact error bodies/media types, and slashless-path behavior.

No subagents were used for the initial implementation.
