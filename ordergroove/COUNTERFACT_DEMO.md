# How the simulator was built

This project is a proof of concept for Counterfact used alongside AI-assisted
software engineering. The goal is to show a practical workflow for turning
unfamiliar published OpenAPI contracts into a working, stateful simulator while
keeping assumptions that require domain expertise visible and easy to replace.

The runnable simulator remains the main artifact. These notes explain the
implementation approach for readers who are interested in how it was made.

## Division of responsibility

Counterfact generates the contract-aware scaffolding from the six OpenAPI
specifications: route and type structure, operation types, request and response
validation, and the development server. The maintained code supplies the
behavior a schema cannot define:

- one shared in-memory `Store` for cross-API state;
- deterministic startup scenarios that form connected commerce examples;
- API-key middleware and thin route handlers;
- localized lifecycle, filtering, and persistence rules; and
- HTTP integration tests plus direct state-logic tests.

The source contracts live in `openapi/`. Generated files in `types/` and
`counterfact-types/` are not hand-edited. The maintained behavior is
concentrated in `_.store.ts`, `routes/`, `scenarios/`, and `test/`. This
separation makes specification regeneration routine while keeping the code the
team owns small and recognizable.

## Agentic workflow

The repository's [agent instructions](../AGENTS.md) are durable context for an
AI coding agent. They ask it to work in small API slices; write behavior tests
against a live, programmatically started simulator; use middleware for shared
request behavior; and keep state and business rules out of generated files.

The intended loop is simple: generate from a contract, ask an agent to add or
revise one behavior, run the tests against the simulator, and review the
assumption with a domain expert. With `npm start`, Counterfact reloads route and
context changes while retaining the live store, making a rule easy to change
and try without rebuilding the entire environment.

This workflow does not make generated behavior authoritative. The published
contract defines the HTTP surface; a person with Ordergroove knowledge must
validate and refine the semantics before the simulator should be used as a
reliable representation of production behavior.
