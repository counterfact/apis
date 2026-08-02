# ADR 0006: Handling undocumented behavior

Status: accepted — 2026-08-02

Unsupported behavior is omitted. If coherent state requires a missing detail, the simulator uses the smallest deterministic convention, documents it in `OPEN_QUESTIONS.md`, marks the OpenAPI operation with `x-simulator-limitation`, and comments the maintained implementation with the official source plus the inference. A convention must never be described as confirmed Ordergroove production behavior.
