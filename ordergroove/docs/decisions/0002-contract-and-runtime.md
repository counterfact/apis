# ADR 0002: OpenAPI authority and runtime behavior

Status: accepted — 2026-08-02

`openapi.yaml` is the simulator's external contract. Runtime handlers may implement only that contract. When official documentation is incomplete, the OpenAPI operation carries `x-simulator-limitation` and runtime implements the smallest deterministic convention. Generated `types/` are reproducible and never hand-edited; maintained domain code owns behavior.
