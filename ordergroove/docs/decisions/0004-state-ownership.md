# ADR 0004: State ownership and cross-resource transactions

Status: accepted — 2026-08-02

A single commerce store owns customers, products, subscriptions, orders, and items. Resource services query that graph but do not own duplicated state. Cross-resource actions execute in the store so validation completes before mutation. All public reads return deep clones. Startup seed composition is deterministic; a new Counterfact instance creates a fresh graph.
