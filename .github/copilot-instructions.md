# Copilot Instructions for `counterfact/apis`

This repository contains Counterfact-based API simulators.

## Mission

Generate and evolve simulator code **one API (or coherent API subset) at a time**. Keep each change focused to a single endpoint group or behavior slice.

## Required workflow

1. **Pick a small scope**
   - Work on one API or one subset of an API in each iteration.
   - Do not mix unrelated endpoints or behaviors in the same change.

2. **Use TDD for simulator behavior**
   - Start by writing or updating tests that describe expected HTTP behavior.
   - Execute tests against a **running Counterfact instance**.
   - In tests, start Counterfact via the **programmatic API** instead of shelling
     out to the CLI.
   - Tests must exercise the simulator via real HTTP calls and assert:
     - response status
     - response body/headers as applicable
     - resulting state changes
   - Keep HTTP integration coverage in `test/routes.test.ts` rather than
     placeholder `dummy` test files.

3. **Implement state and business logic in route context files**
   - Put simulator state and business rules in `routes/**/_.context.ts`.
   - Do not edit generated `types/_.context.ts` files.
   - Keep route handlers thin by delegating behavior to context classes/methods.

4. **Unit test Context classes directly**
   - Add direct unit tests for `Context` class behavior in `routes/**/_.context.ts`.
   - Cover state transitions and core business logic independently of HTTP tests.

5. **Use scenarios for startup init and REPL setup flows**
   - Use `startup` to initialize simulator state when the server starts.
   - Use other scenario functions for REPL-invoked setup/actions after startup.
   - Keep scenarios simple and declarative.
   - Scenario code is intentionally lightweight and **does not require unit tests**.

## Quality bar for every change

- Tests fail first, then pass after implementation.
- HTTP-level tests verify externally visible API behavior and state effects.
- Context unit tests verify internal logic.
- Scenario updates follow the startup-init and REPL-invoked scenario model.
- Scope remains limited to one API/subset per iteration.
