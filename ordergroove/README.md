# Ordergroove REST API simulator

This project is a runnable, stateful simulator for a subset of
[Ordergroove's public REST API](https://developer.ordergroove.com/reference/introduction).
Built with [Counterfact](https://github.com/counterfact/api-simulator), it runs
Customers, Items, Offers, Orders, Products, and Subscriptions endpoints together
on one local server. Use it to develop and test an integration without sending
requests to Ordergroove.

This is an independent proof of concept, not an official Ordergroove project.
Its business rules are explicit, testable assumptions derived from the local
OpenAPI contracts and the public API reference; they are not a guarantee of
production behavior. An Ordergroove domain expert should validate those rules
before the simulator is used as a production-fidelity test double.

> **Implementation note:** this project also demonstrates Counterfact with
> AI-assisted engineering. See [how the simulator was built](./COUNTERFACT_DEMO.md).

## About Counterfact

[Counterfact](https://github.com/counterfact/api-simulator) is a local API
simulator driven by OpenAPI contracts. It uses the specifications in `openapi/`
to route and validate HTTP requests and responses. This project supplies the
state and business behavior behind each operation.

Run `npm run serve` for a local server. Run `npm start` for Counterfact's
interactive development mode, which adds a read-eval-print loop (REPL) and
reloads route changes as you work.

## Generated and maintained code

The documents in `openapi/` are the simulator's input contracts.
Counterfact-generated files under each API group's `types/` and
`counterfact-types/` directories provide typed interfaces to those contracts.
Maintained behavior lives in `_.store.ts` and in the `routes/`, `scenarios/`, and
`test/` directories. In particular, do not edit generated `types/_.context.ts`
files; the maintained route contexts connect those generated types to the shared
store.

## Install and start

From the repository root, install the locked dependencies and start the HTTP
server:

```sh
cd ordergroove
npm ci
npm run serve
```

The server listens at `http://localhost:3100` by default. Stop it with Ctrl-C.
Because state is stored in memory, restarting the process resets all resources
to the deterministic startup data described below.

## Authentication

Every simulated operation requires the `x-api-key` request header. Use this
local-only key:

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

Detail and action URLs extend those paths directly. Examples include `/customers/customer-001/`, `/products/product-001/`, `/subscriptions/subscription-001/cancel/`, `/orders/order-001/send_now/`, and `/items/item-001/`. Paths such as `/customers/customers/` or `/subscriptions/subscriptions/` do not exist.

## Supported operations

The simulator implements this subset of the six resource groups:

| Resource           | Collection operations | Detail and action operations                            |
| ------------------ | --------------------- | ------------------------------------------------------- |
| Customers          | List, create          | Retrieve, replace                                       |
| Products           | List                  | Retrieve, replace                                       |
| Offer profiles     | List                  | None                                                    |
| One-time discounts | List, create          | None                                                    |
| Entitlements       | List                  | None                                                    |
| Subscriptions      | List                  | Retrieve, replace, cancel, reactivate, change frequency |
| Orders             | List                  | Retrieve, cancel, send now                              |
| Items              | List, create          | Retrieve, delete                                        |

The local OpenAPI contracts define the exact HTTP methods, request bodies,
response bodies, and status codes. See
[`DOCUMENTATION_DIFFERENCES.md`](./DOCUMENTATION_DIFFERENCES.md) before adapting
a client built for the production API; several local operations intentionally
differ from Ordergroove's current public reference.

## Seeded data

Each API group has a `startup` scenario. Together, those scenarios create two
connected sets of commerce data:

| Customer                      | Product                       | Offer profile       | Subscription       | Order       | Item       |
| ----------------------------- | ----------------------------- | ------------------- | ------------------ | ----------- | ---------- |
| `customer-001` (Ada Lovelace) | `product-001` (`sku-coffee`)  | `offer-profile-001` | `subscription-001` | `order-001` | `item-001` |
| `customer-002` (Grace Hopper) | `product-002` (`sku-filters`) | `offer-profile-002` | `subscription-002` | `order-002` | `item-002` |

The first subscription is active and monthly; the second is inactive and runs
every two weeks. `order-001` starts with status `1` (`UNSENT`), and `order-002`
starts with status `5` (`SUCCESS`). The offer data also includes `discount-001`
for `customer-001` and three entitlements: two for `customer-001` and one for
`customer-002`.

State changes remain visible to later requests while the server process is
running. For example, a created customer or item can be retrieved, a created
one-time discount appears in later list responses, and replacements or lifecycle
actions update the corresponding stored resources.

## Shared state

The root `_.store.ts` defines one in-memory store shared by all six API groups.
Requests to different groups therefore observe the same customers, products,
subscriptions, orders, and items instead of isolated copies.

Counterfact retains the store across route reloads. It also retains the same
store when a programmatic caller stops and restarts one simulator instance. A
new simulator instance or process receives a new store, which the startup
scenarios seed deterministically.

In interactive development, the live store is available as `store` in the
Counterfact REPL. Programmatic callers can use the local `Store` type with
`counterfact<Store>(...)` and access the same object through the simulator's
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

Send the seeded unsent order immediately, then retrieve its persisted
`SEND_NOW` state:

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

Unknown detail IDs return `404` responses. Supported collection filters are:

- `customer` and `status` for orders;
- `subscription` and `order` for items;
- `customer`, `product`, `live`, `created_start`, and `created_end` for
  subscriptions; and
- `customer` for entitlements.

## Contracts, documentation, and limitations

The six files in `openapi/` are reduced local contracts derived from
Ordergroove's public REST API reference. They define the simulator's HTTP
interface; they are not copies of an official Ordergroove OpenAPI distribution.
The server mounts their paths directly at its root. For example, the Customers
API is available at `http://localhost:3100/customers/`, not at
`/customers/customers/`.

Before adding or changing visible behavior, contributors consult Ordergroove's
public documentation. When the public reference and a local contract disagree,
the simulator follows its local contract for the HTTP method, path,
authentication, request and response shapes, and modeled status codes. Known
differences and the resulting simulator choices are recorded in
[`DOCUMENTATION_DIFFERENCES.md`](./DOCUMENTATION_DIFFERENCES.md).

Only behavior implemented in this repository is supported. In particular, the
simulator does not implement the rest of Ordergroove's REST resources,
Storefront HMAC authentication, production permissions, rate limiting, or full
pagination. Treat unmodeled production behavior as a simulator limitation, not
as an implied default.

## Validation

Run the complete package checks from `ordergroove/`:

```sh
npm test
npm run lint
```
