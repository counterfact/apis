# ADR 0003: Supported authentication scope

Status: accepted — 2026-08-02

The initial simulator supports Application API Scope via `x-api-key` only. The deterministic key `ordergroove-simulator-key` represents the seeded merchant and bulk permission. Missing or different keys return 403. Storefront HMAC, recognized trust, key expiry, HTTPS enforcement, and real merchant-key mapping remain unsupported and are not represented as production semantics.
