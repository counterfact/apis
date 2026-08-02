# Repository Instructions for `counterfact/apis`

This repository contains Counterfact-based API simulators.

## Mission

Generate and evolve simulator code **one API (or coherent API subset) at a time**. Keep each change focused to a single endpoint group or behavior slice.

## Required workflow

1. **Pick a small scope**
   - Work on one API or one subset of an API in each iteration.
   - Do not mix unrelated endpoints or behaviors in the same change.

2. **Research and record public API documentation**
   - Before inferring or changing externally visible behavior, find the API
     provider's current public documentation for the endpoint or behavior.
   - Prefer the provider's own API reference and guides over search-result
     summaries, third-party posts, or assumptions from similar APIs.
   - Compare the implementation and OpenAPI contract with the documented HTTP
     method, path, authentication scope, request fields, response status/body,
     query filters, and state-transition semantics.
   - Add a concise source URL comment next to every behavior derived from the
     documentation (normally in the route handler, middleware, or context
     method that implements it). Explain the documented rule when the link
     alone would not make the inference clear.
   - Treat documentation gaps as simulator limitations: preserve the smallest
     faithful behavior, state the unsupported portion in a comment or README,
     and do not invent production semantics.

3. **Write documentation for first-time readers**
   - Write for what a reader knows at that point in the document, not for
     knowledge they may have gained from this repository or an earlier
     iteration.
   - Introduce a concept before referring to it, and state the relationship
     between concepts explicitly on first use (for example, say that a project
     is a simulator before calling it “the simulator”).
   - Prefer concrete examples and links over internal shorthand, historical
     references, or configuration terminology whose meaning depends on prior
     context.

4. **Use TDD for simulator behavior**
   - Start by writing or updating tests that describe expected HTTP behavior.
   - Execute tests against a **running Counterfact instance**.
   - In tests, start Counterfact via the **programmatic API** instead of shelling
     out to the CLI.
   - Tests must exercise the simulator via real HTTP calls and assert:
     - response status
     - response body/headers as applicable
     - resulting state changes
     - no placeholder `dummy` test files

5. **Use middleware for shared cross-cutting request behavior**
   - Put authentication, authorization, and other behavior shared by all routes
     in a scope into a `routes/**/_.middleware.ts` file.
   - Export a `middleware` function that either returns a response or calls
     `respondTo($)` to continue the request chain.
   - Keep operation-specific behavior in route handlers; do not duplicate a
     uniform authentication check in every handler.
   - Follow Counterfact's [middleware pattern](https://github.com/counterfact/api-simulator/blob/main/docs/features/middleware.md), including its path-scoping and chaining semantics.

6. **Implement state and business logic in route context files**
   - Put simulator state and business rules in `routes/**/_.context.ts`.
   - Do not edit generated `types/_.context.ts` files.
   - Keep route handlers thin by delegating behavior to context classes/methods.

7. **Unit test Context classes directly**
   - Add direct unit tests for `Context` class behavior in `routes/**/_.context.ts`.
   - Cover state transitions and core business logic independently of HTTP tests.

8. **Use scenarios for startup init and REPL setup flows**
   - Use `startup` to initialize simulator state when the server starts.
   - Use other scenario functions for REPL-invoked setup/actions after startup.
   - Keep scenarios simple and declarative.
   - Scenario code is intentionally lightweight and **does not require unit tests**.

## Manual acceptance tests

Every PR description must include a section titled exactly `## Manual acceptance tests` with 3–6 checkboxes. Each checkbox must describe an observable behavior (not an implementation detail). When creating the PR, leave all boxes unchecked — the reviewer checks each one after manually verifying the behavior. All boxes must be checked before the PR can be merged.

- Cover the main success path, at least one edge case, and one regression check where applicable.
- Exception: if a PR only adds files under `.github/issue-proposals/`, this section may be omitted.

## Quality bar for every change

- Run the applicable lint command and resolve any failures before committing.
- Tests fail first, then pass after implementation.
- Documentation-derived behavior is traceable to the provider's public docs in
  the implementation and is covered by tests.
- HTTP-level tests verify externally visible API behavior and state effects.
- Context unit tests verify internal logic.
- Scenario updates follow the startup-init and REPL-invoked scenario model.
- Scope remains limited to one API/subset per iteration.
