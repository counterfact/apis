# Ordergroove simulator rebuild handoff

This branch intentionally contains only the maintained OpenAPI contract and this handoff. Rebuild the simulator from `openapi.yaml` with Counterfact.

## Goal

Build an API simulator that is faithful at the HTTP boundary and easy to manipulate behind that boundary.

The simulator exists so application developers can exercise realistic workflows, error handling, and edge cases without an Ordergroove account or production data. Match the published paths, methods, parameters, request bodies, response shapes, and documented status codes. Do not attempt to reverse-engineer Ordergroove's internal services, transactions, propagation rules, clocks, identifier generation, or other undocumented backend behavior.

Use the following rule when deciding how much to implement:

> Faithful contract, simple state, explicit scenarios.

When production behavior is unknown, choose the smallest deterministic assumption that makes the operation useful. Record the assumption briefly near the handler or in a short assumptions document. Do not turn an assumption into a large domain model.

## Bootstrap Counterfact

Node.js 22 or newer is recommended. From this directory:

```bash
npm init --yes
npm install counterfact@2.16.0
npx counterfact openapi.yaml . --generate --no-update-check
npx counterfact openapi.yaml . --no-update-check
```

After initialization, update `package.json` so it is private, uses ESM, and exposes convenient scripts:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "generate": "counterfact openapi.yaml . --generate --no-update-check",
    "start": "counterfact openapi.yaml . --no-update-check",
    "serve": "counterfact openapi.yaml . --serve --no-update-check"
  }
}
```

Counterfact generates `routes/`, `types/`, `counterfact-types/`, and scenario/context scaffolding. Treat generated types as disposable output. Put handwritten behavior in route handlers, context, and small helper modules.

Never use real Ordergroove credentials. The contract lists the documented production server for reference, but the simulator should run locally and all examples, pagination links, and interactive requests must remain on the local origin.

## Implementation shape

Start with one plain in-memory object:

```ts
interface State {
  customers: Customer[];
  addresses: Address[];
  payments: Payment[];
  products: Product[];
  subscriptions: Subscription[];
  orders: Order[];
  items: Item[];
}
```

Keep this object public through Counterfact's context so scenarios can replace or mutate it directly. Prefer obvious array operations over repositories, aggregates, services, transaction abstractions, or lifecycle engines.

Handlers should generally do only this:

1. Read already-validated path, query, or body values.
2. Find/filter a record in the corresponding array.
3. Return a documented response shape.
4. For mutations, change the directly named record or relationship.
5. Return 400 or 404 for simple, useful failures.

Do not add cascades, ownership constraints, recurrence calculations, total recalculation, default propagation, or state machines unless the OpenAPI contract clearly requires the observable behavior for a supported workflow. It is acceptable for a scenario fixture to supply all resulting records explicitly.

Keep identifiers human-readable and deterministic. Keep time controllable in state rather than reading the wall clock throughout the implementation.

## Make scenarios the primary feature

The simulator should make it easier to arrange state than production does. Provide named scenario functions and a reset helper from the beginning. Suggested initial scenarios:

- `happyPath`: one customer, product, subscription, upcoming order, and item;
- `multipleSubscriptions`: multiple subscriptions sharing one upcoming order;
- `inactivePayment`;
- `crossCustomerReferences`;
- `prepaidSubscription`;
- `placedOrder`;
- `monthEndSubscription`; and
- `emptyAccount`.

Each scenario should build and install a complete `State` value. Prefer small fixture builders with useful defaults and overrides:

```ts
customer({ merchant_user_id: "customer_1" })
subscription({ customer: "customer_1", live: false })
order({ customer: "customer_1", status: 5 })
```

Developers should be able to combine these builders without learning hidden invariants. Validate only what is necessary to prevent a handler from crashing. Deliberately unusual or inconsistent state can be useful for testing defensive application code.

Do not add production-looking reset or fixture endpoints to `openapi.yaml`. Use Counterfact scenarios, the REPL, startup configuration, or test helpers as the simulator control plane.

## Suggested implementation order

1. Generate Counterfact scaffolding and confirm the untouched contract loads.
2. Add a public context containing `state`, `reset(state)`, and a deterministic default scenario.
3. Implement authentication as one documented fake credential, without real HMAC or permission machinery.
4. Implement retrieve and list handlers as direct array lookups and filters.
5. Add cursor-shaped pagination with relative or local-origin links; treat cursor contents as an implementation detail.
6. Implement customer creation and the simple PATCH actions.
7. Implement skip-subscription with the minimum observable change needed by the scenario. Prefer scenario-supplied next orders over a recurrence engine unless generation is essential to the test.
8. Add named failure scenarios rather than increasingly elaborate validation logic.

## Testing priorities

Test the simulator from an application developer's point of view:

- every OpenAPI operation can be called;
- requests and responses satisfy the contract;
- state changes persist until reset;
- named scenarios start in the state they advertise;
- common 400, 403, and 404 paths are easy to trigger;
- reset is deterministic;
- pagination never links to the real Ordergroove origin; and
- a fresh developer can run one complete workflow from the README.

Avoid tests that assert speculative production rules. If a test needs a complicated explanation of why Ordergroove probably behaves that way, replace it with a simpler simulator convention or a scenario fixture.

## Definition of done for the first slice

The first slice is ready when a developer can install dependencies, start Counterfact, select or edit a scenario, exercise a customer-to-subscription-to-order workflow, and reset the world without reading the implementation internals.

At that point, favor adding useful scenarios and endpoint coverage over making the fake backend more sophisticated.
