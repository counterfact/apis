# Ordergroove simulator implementation plan

This plan follows the handoff rule: faithful contract, simple state, explicit
scenarios. Generated Counterfact types are disposable; handwritten behavior
belongs in route handlers, context, fixture builders, scenarios, and tests.

## Slice 1: runnable read workflow — complete

Goal: a developer can start the simulator, inspect a deterministic customer,
follow that customer to a subscription and upcoming order, switch scenarios,
and reset state without reading implementation internals.

- Bootstrap Counterfact 2.16.0 with private ESM package scripts.
- Generate route and type scaffolding from the untouched `openapi.yaml`.
- Add one public in-memory `State` containing customers, addresses, payments,
  products, subscriptions, orders, and items.
- Add small fixture builders, a deterministic `happyPath` fixture, an
  `emptyAccount` fixture, and context `reset` support.
- Accept only the documented simulator credential
  `x-api-key: ordergroove-simulator-key`; return the contract's 403 error for
  missing or invalid credentials.
- Implement list and retrieve handlers for customers, subscriptions, and
  orders with direct array lookup/filtering and contract-shaped 404 responses.
- Keep pagination deliberately small for this slice: return the cursor envelope
  with local/relative links and support deterministic `page_size`/`cursor`
  traversal.
- Add route/context/scenario tests and a README workflow with exact commands.

Acceptance checks:

- A fresh install can generate, type-check, test, and start the simulator.
- The happy path exposes `customer_demo`, `subscription_demo`, and
  `order_upcoming`; list filters connect the three resources.
- Unknown resources return JSON 404s; invalid credentials return JSON 403s.
- State mutations made through context persist until `reset` is called.
- `happyPath`, `emptyAccount`, and repeated reset operations are deterministic.
- Pagination links never reference the production Ordergroove origin.

## Slice 2: complete read surface — complete

- Implement address, payment, product, and item list/retrieve handlers.
- Extend shared filtering and pagination only where required by the contract.
- Add `multipleSubscriptions`, `inactivePayment`, and
  `crossCustomerReferences` scenarios.
- Test every OpenAPI read operation and its useful 403/404 cases.

## Slice 3: customer and simple subscription/order changes — complete

- Implement customer creation.
- Implement subscription quantity, shipping, and payment changes.
- Implement order shipping and payment changes.
- Preserve direct-record mutation and return contract-shaped 400/404 errors.
- Add state-persistence tests for each mutation.

## Slice 4: skip workflow and edge scenarios — complete

- Implement skip-subscription with the minimum documented observable change.
- Prefer scenario-supplied next orders over recurrence calculation.
- Add `prepaidSubscription`, `placedOrder`, and `monthEndSubscription`.
- Document every simulator assumption that is not dictated by the contract.

## Slice 5: coverage and operator polish — complete

- Verify every OpenAPI operation is callable and contract-valid.
- Add a complete application-developer workflow and scenario catalog.
- Add CI gates for generation drift, type checking, tests, and formatting.
- Favor additional useful scenarios over speculative backend behavior.
