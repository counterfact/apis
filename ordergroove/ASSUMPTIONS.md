# Simulator assumptions

## Skip subscription

`PATCH /orders/{order_id}/skip_subscription/` is deliberately smaller than an
Ordergroove scheduling system. It accepts only an unsent source order
(`status: 1`) with matching items. It retains that source order, including an
empty one, and moves the matching items to exactly one generated order.

The generated order copies the source order without recalculating totals or
timestamps. Its public ID is `<source-order>-skip-<subscription>` and its
place date advances using the subscription's documented `every` and
`every_period` fields. Monthly and yearly advances clamp to the last calendar
day (for example, 2026-01-31 advances to 2026-02-28). Repeating a completed
skip returns 400 because no matching items remain in the source order.

These are deterministic simulator conventions, not claims about Ordergroove
production behavior.
