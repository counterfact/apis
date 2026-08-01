# Ordergroove REST API simulator

This runnable, stateful simulator lets client developers explore the published
Ordergroove REST API contracts together: Customers, Items, Offers, Orders,
Products, and Subscriptions all run at their canonical paths, without
API-group prefixes. Use it to build and try an integration locally, including
requests that change state across related resources.

It is a first draft built by an engineer outside of Ordergroove from the
published specifications. It is not an official Ordergroove project, and its
business behavior should be read as explicit, testable assumptions—not as a
claim about production semantics. An Ordergroove expert can use this as a
starting point to validate those assumptions, supply the real rules, and add
the corresponding acceptance tests.

> **Implementation note:** this project also demonstrates Counterfact with
> AI-assisted engineering. See [how the simulator was built](./COUNTERFACT_DEMO.md).

## About Counterfact

[Counterfact](https://github.com/counterfact/api-simulator) is a local API simulator driven by OpenAPI contracts. It reads the specifications in `openapi/`, starts an HTTP server that validates requests and responses against them, and lets this project provide the stateful behavior behind each operation.

For a client developer, that means you can run this package locally and point
an integration at it as if it were the relevant Ordergroove REST endpoints. Use
`npm run serve` for a straightforward local server. Use `npm start` when you
want Counterfact's interactive development mode, including its REPL and file
watching, while you experiment with or refine simulator behavior.

## Generated and maintained code

The `openapi/` documents are the input contracts. Counterfact-generated files
under `types/` and `counterfact-types/` provide the typed, validated interface
to those contracts. The maintained behavior is concentrated in `_.store.ts`,
`routes/`, `scenarios/`, and `test/`. In particular, generated context type
files are not edited; the route contexts adapt them to the shared store.

That separation is deliberate: a new API specification can receive a complete
validated scaffold quickly, while the code a team owns remains focused on
product-specific behavior.

## Install and start

From this directory, install the locked dependencies and start the HTTP server:

```sh
cd ordergroove
npm ci
npm run serve
```

The server listens at `http://localhost:3100` by default. Use `npm start` instead
when you want Counterfact's full interactive development mode, including its
REPL and file watching. Stop either process with Ctrl-C. Restarting the server
resets all resources to the deterministic startup data below.

## Authentication

All REST operations require the `x-api-key` request header. The simulator's
local test key is:

```text
ordergroove-local-api-key
```

Missing or incorrect keys receive a `401 Unauthorized` response. For example:

```sh
curl \
  -H 'x-api-key: ordergroove-local-api-key' \
  http://localhost:3100/customers/
```

## Canonical API URLs

All six specifications are mounted on the same origin:

| API           | Canonical collection URLs                     |
| ------------- | --------------------------------------------- |
| Customers     | `/customers/`                                 |
| Products      | `/products/`                                  |
| Offers        | `/offer_profiles/`, `/otd/`, `/entitlements/` |
| Subscriptions | `/subscriptions/`                             |
| Orders        | `/orders/`                                    |
| Items         | `/items/`                                     |

Detail and action URLs extend those paths directly. Examples include
`/customers/customer-001/`, `/products/product-001/`,
`/subscriptions/subscription-001/cancel/`, `/orders/order-001/send_now/`, and
`/items/item-001/`. Paths such as `/customers/customers/` or
`/subscriptions/subscriptions/` do not exist.

## Seeded data

Every API has a `startup` scenario. Together they create two coherent commerce
chains:

| Customer                      | Product                       | Offer profile       | Subscription       | Order       | Item       |
| ----------------------------- | ----------------------------- | ------------------- | ------------------ | ----------- | ---------- |
| `customer-001` (Ada Lovelace) | `product-001` (`sku-coffee`)  | `offer-profile-001` | `subscription-001` | `order-001` | `item-001` |
| `customer-002` (Grace Hopper) | `product-002` (`sku-filters`) | `offer-profile-002` | `subscription-002` | `order-002` | `item-002` |

The first subscription is live and monthly; the second is inactive and runs
every two weeks. `order-001` starts unsent, while `order-002` starts successful.
The offer data also includes `discount-001` for `customer-001` and three
entitlements: two for `customer-001` and one for `customer-002`.

State changes persist for the lifetime of the server. Created customers,
one-time discounts, and items can be retrieved or listed afterward; product,
customer, subscription, and order updates are also visible to later requests.

## Shared state

The root `_.store.ts` is one in-memory store shared by all six API groups. This
lets requests to different services observe the same customers, products,
subscriptions, orders, and items instead of maintaining isolated copies. The
store retains its identity across route reloads and a stop/start cycle of the
same programmatic simulator; a new simulator instance or process restart gets
fresh state, which the `startup` scenarios seed deterministically.

In interactive development, the live store is available as `store` in the
Counterfact REPL. Programmatic callers can supply the local `Store` type to
`counterfact<Store>(...)` and access that same object through the simulator's
optional `store` property.

## Example flows

Inspect the seeded resources for the first customer:

```sh
curl -H 'x-api-key: ordergroove-local-api-key' \
  'http://localhost:3100/subscriptions/?customer=customer-001'

curl -H 'x-api-key: ordergroove-local-api-key' \
  'http://localhost:3100/orders/?customer=customer-001'

curl -H 'x-api-key: ordergroove-local-api-key' \
  'http://localhost:3100/items/?subscription=subscription-001'

curl -H 'x-api-key: ordergroove-local-api-key' \
  'http://localhost:3100/entitlements/?customer=customer-001'
```

Cancel and reactivate a subscription:

```sh
curl -X PATCH -H 'x-api-key: ordergroove-local-api-key' \
  http://localhost:3100/subscriptions/subscription-001/cancel/

curl -X PATCH -H 'x-api-key: ordergroove-local-api-key' \
  http://localhost:3100/subscriptions/subscription-001/reactivate/
```

Send the seeded unsent order immediately, then retrieve its persisted pending
state:

```sh
curl -X PATCH -H 'x-api-key: ordergroove-local-api-key' \
  http://localhost:3100/orders/order-001/send_now/

curl -H 'x-api-key: ordergroove-local-api-key' \
  http://localhost:3100/orders/order-001/
```

Create a one-time item linked to the first seeded chain:

```sh
curl -X POST \
  -H 'x-api-key: ordergroove-local-api-key' \
  -H 'content-type: application/json' \
  --data '{"order_id":"order-001","subscription_id":"subscription-001","product_id":"product-001","quantity":1,"price":"19.99","total_price":"19.99","offer_id":"offer-profile-001","one_time":true}' \
  http://localhost:3100/items/
```

Unknown detail IDs return realistic `404` responses. Collection filters include
customer and status for orders; subscription and order for items; customer,
product, live state, and documented creation dates for subscriptions; and
customer for entitlements.

## Contracts and scope

`openapi/` contains the six authoritative local REST contracts. Differences
between those contracts and the current public API reference are recorded in
[`DOCUMENTATION_DIFFERENCES.md`](./DOCUMENTATION_DIFFERENCES.md). The
multi-spec `counterfact.yaml` consumes them directly with an empty prefix for
each API; there are no normalized contract copies or duplicated group paths.

Ordergroove's Early Access GraphQL API is explicitly out of scope because no
public schema or confirmed endpoint is available.

## Validation

Run the complete package checks from `ordergroove/`:

```sh
npm test
npm run lint
```
