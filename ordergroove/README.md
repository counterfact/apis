# Ordergroove API simulator

This package simulates the documented Ordergroove REST API subset in
`openapi.yaml`. It is intentionally a simple, deterministic fake: the HTTP
contract is the boundary, public in-memory arrays are the state, and scenarios
are the control plane.

## Run it

Use Node.js 22 or newer.

```bash
npm install
npm run generate
npm test
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

## Arrange and reset state

From the Counterfact REPL, named scenarios replace the complete state:

```text
.scenario happyPath
.scenario emptyAccount
.scenario multipleSubscriptions
.scenario inactivePayment
.scenario crossCustomerReferences
```

The public context can also be inspected, edited, or cleared directly:

```text
$.context.state
$.context.state.orders[0].status = 5
$.context.reset()
```

Run `.scenario happyPath` again to restore the deterministic default world.
Fixture builders in `domain/fixtures.ts` accept ordinary property overrides so
new scenarios can compose unusual state without hidden invariants.

See `IMPLEMENTATION_PLAN.md` for the remaining slices and `HANDOFF.md` for the
design constraints.
