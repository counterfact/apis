# Open questions and explicit simulator conventions

Reviewed: 2026-08-02

## Unresolved production behavior

1. **List envelopes.** Cursor pagination documents `{next, previous, results}` and no `count` when `X-OG-API-VERSION: 2` is sent. Some endpoint fragments show `count`, page-number URLs, a lone object, or no schema. The simulator consistently returns the documented v2 cursor envelope.
2. **Cursor encoding.** The cursor is opaque in public docs. The simulator uses a base64url-encoded zero-based offset. Clients must treat it as opaque.
3. **Required action fields.** Several embedded schemas do not mark `quantity`, `subscription`, `shipping_address`, or `payment` required even though the operations cannot be meaningful without them. The simulator requires the applicable body ID and labels this as strongly implied.
4. **Customer creation fields.** The create fragment requires timestamps, session/token fields, and merchant while leaving the request body optional. The simulator requires the listed fields because that is the only explicit field-level contract; it does not generate missing production fields.
5. **Authentication wording.** The authentication page says HTTP Basic Auth while examples and the security scheme use `x-api-key`; Storefront authentication is a JSON HMAC authorization value. The initial simulator implements only a deterministic application-scope `x-api-key` convention.
6. **Scope ownership.** Public docs do not define how an application key maps to a merchant/customer in a simulator. The accepted key `ordergroove-simulator-key` represents the seeded merchant and has bulk permission. This is simulator-only and not a real credential.
7. **Trailing slashes.** Published paths include trailing slashes. Whether production redirects or rejects slashless paths is not stated. The simulator contract publishes only trailing-slash paths; runtime framework handling is not asserted as production behavior.
8. **Change-quantity propagation.** The endpoint documents updating subscription quantity and a prepaid 400, but not whether existing unsent items update. The simulator atomically updates matching status-1 items so later reads remain coherent.
9. **Skip recurrence.** Skip is documented to remove a subscription's items and generate the next order. The data model says the next place date is previous order date plus subscription frequency and maps `every_period` as 1 days, 2 weeks, 3 months, 4 years. The simulator uses calendar addition from `every`/`every_period`, falling back to `frequency_days` only when the period fields are unavailable.
10. **Month-end and leap-year recurrence.** Public docs do not specify overflow semantics. The simulator clamps to the last valid day of the target month/year (for example, Jan 31 + 1 month becomes Feb 28/29). This is deterministic simulator behavior.
11. **Multi-subscription order skip.** Public docs say to remove “all items belonging to the given subscription,” implying unrelated items remain. The simulator preserves the source order and unrelated items, and moves only matching items to one newly generated order.
12. **Repeated skip.** Public docs do not define repeating the same order/subscription action after its matching items are gone. The simulator returns 400 and does not mutate state.
13. **Empty source order.** Public docs do not say whether an order with no remaining items is deleted or cancelled. The simulator retains it unchanged except that its matching item relationships are removed.
14. **Generated IDs and timestamps.** The simulator uses deterministic readable IDs and a fixed UTC clock (`2026-08-02T12:00:00Z`) for startup and derived state. These are not production algorithms.
15. **Errors.** Endpoint pages enumerate statuses but do not consistently define all bodies. The simulator uses the documented `detail` object where available and deterministic `detail` messages elsewhere.
16. **Item list schema.** The embedded fragment has no success schema. The maintained schema uses fields documented in the item response table and retrieve example.
17. **Product ID terminology.** Product pages alternate among product ID, merchant product ID, and `external_product_id`. The simulator does not translate or alias these identifiers.
18. **Address and payment list shapes.** Their endpoint prose describes arrays/lists while their embedded success schemas describe one object. As with the other list operations, the simulator consistently uses the API-v2 cursor envelope.
19. **Nullable address and payment fields.** Examples return null for several fields whose embedded schemas have no type. The simulator models those documented examples as nullable fields rather than inventing non-null values.
20. **Association target validation.** The change-address/payment pages do not specify whether the target must be live or belong to the same customer as the order/subscription. The simulator requires both and returns 400 without mutation for inactive or cross-customer targets.
21. **Individual association propagation.** The pages describe changing one order or one subscription, but do not explicitly say whether related resources change. The simulator mutates only the resource named in the path: subscription changes do not update existing orders, and order changes do not update subscriptions or other orders.
22. **Payment billing-address propagation.** The order action says it changes the payment method “and associated billing address,” but Ordergroove order responses expose only `payment` and `shipping_address`. The simulator changes the payment reference and leaves shipping unchanged; billing remains a property of the payment record.
23. **Reset API.** No production reset exists. Simulator state resets only by starting a fresh Counterfact instance; there is no public reset route.

## Questions for Ordergroove

- Which list response shape applies without `X-OG-API-VERSION: 2`, and is that header required or merely opt-in?
- Are `quantity`, `subscription`, `shipping_address`, and `payment` required request properties in production, and what are their accepted ranges or identifier constraints?
- Must replacement addresses/payments be live and owned by the same customer as the order or subscription?
- Do individual order/subscription association changes propagate to any related resources?
- Does change quantity update already-materialized unsent items?
- What exact recurrence and timezone rules apply to skip-generated orders, especially month-end, leap day, and daylight-saving transitions?
- Is an emptied source order retained, cancelled, or deleted after skipping its last subscription?
- What response and state result from repeating a skip action?
- What exact error bodies and media types accompany each 400/403/404 response?
- Are slashless variants redirected, accepted, or rejected?
