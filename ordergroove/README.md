# Ordergroove API simulator

This package simulates the documented Ordergroove REST API subset in
`openapi.yaml`. It is intentionally a simple, deterministic fake: the HTTP
contract is the boundary, public in-memory arrays are the state, and scenarios
are the control plane.

## Implementation note

The code in this simulator was generated with OpenAI Codex. Its behavior is
checked locally against the OpenAPI contract, type checks, HTTP tests, and
formatting/linting gates described below.

## Run it

Use Node.js 22 or newer.

```bash
npm install
npm run generate
npm run verify
npm start
```

The startup scenario installs `happyPath`. Counterfact listens at
`http://localhost:3100` and opens an interactive REPL. The only accepted
credential is the deliberately fake header:

```text
x-api-key: ordergroove-simulator-key
```

Never use a real Ordergroove credential with this simulator.

## Follow the first workflow

Retrieve the seeded customer:

```bash
curl -H 'x-api-key: ordergroove-simulator-key' \
  http://localhost:3100/customers/customer_demo/
```

List that customer's subscriptions:

```bash
curl -H 'x-api-key: ordergroove-simulator-key' \
  'http://localhost:3100/subscriptions/?customer=customer_demo'
```

Then follow `subscription_demo` to its order:

```bash
curl -H 'x-api-key: ordergroove-simulator-key' \
  'http://localhost:3100/orders/?subscription=subscription_demo'
```

The order/subscription relationship is represented by the matching item in
state. It is an explicit fixture relationship, not a simulated recurrence
engine.

## Make a change

Create a customer using the required contract fields, or change a subscription
without needing a production account. For example, this updates the seeded
subscription and its matching unsent item:

```bash
curl -X PATCH -H 'content-type: application/json' \
  -H 'x-api-key: ordergroove-simulator-key' \
  -d '{"quantity": 2}' \
  http://localhost:3100/subscriptions/subscription_demo/change_quantity/
```

Use the same pattern with `change_shipping/` and `change_payment/` on either a
subscription or order. Address and payment changes require a live record for
the same customer. `skip_subscription/` moves matching unsent items to one
deterministically generated next order; see `ASSUMPTIONS.md` for its exact
conventions.

The complete read surface is available at `/addresses/`, `/payments/`,
`/customers/`, `/products/{product_id}/`, `/subscriptions/`, `/orders/`, and
`/items/`, with the corresponding documented retrieve routes. List responses
always use the same local cursor envelope: `next`, `previous`, and `results`.

## Arrange and reset state

From the Counterfact REPL, named scenarios replace the complete state:

```text
.scenario happyPath
.scenario emptyAccount
.scenario multipleSubscriptions
.scenario inactivePayment
.scenario crossCustomerReferences
.scenario prepaidSubscription
.scenario placedOrder
.scenario monthEndSubscription
```

The public context can also be inspected, edited, or cleared directly:

```text
$.context.state
$.context.state.orders[0].status = 5
$.context.reset()
```

Run `.scenario happyPath` again to restore the deterministic default world.
Fixture builders in `domain/fixtures.js` accept ordinary property overrides so
new scenarios can compose unusual state without hidden invariants. The scenario
catalog is: `happyPath`, `emptyAccount`, `multipleSubscriptions`,
`inactivePayment`, `crossCustomerReferences`, `prepaidSubscription`,
`placedOrder`, and `monthEndSubscription`.

See `IMPLEMENTATION_PLAN.md` for the remaining slices and `HANDOFF.md` for the
design constraints. `ASSUMPTIONS.md` records deterministic behavior where the
published contract does not define production details.
