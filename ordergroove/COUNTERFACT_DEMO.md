# How the simulator was built

This project demonstrates how Counterfact and AI-assisted software engineering
can turn a small set of local OpenAPI contracts into a working, stateful API
simulator. The workflow keeps assumptions that require domain expertise visible,
testable, and easy to replace.

The runnable simulator is the main artifact. This document explains how it was
built and how responsibilities are divided between generated and maintained
code.

## Division of responsibility

Counterfact generates contract-aware scaffolding from the six OpenAPI
specifications, including route and type structures, operation types, request
and response validation, and the development server. Maintained code supplies
the behavior that a schema cannot define:

- one shared in-memory `Store` for cross-API state;
- deterministic startup scenarios that form connected commerce examples;
- API-key middleware and thin route handlers;
- localized lifecycle, filtering, and persistence rules; and
- HTTP integration tests plus direct state-logic tests.

The source contracts live in `openapi/`. They are reduced local contracts derived
from Ordergroove's public REST API reference, not copies of an official
Ordergroove OpenAPI distribution. Generated files in `types/` and
`counterfact-types/` are not hand-edited. Maintained behavior is concentrated in
`_.store.ts` and the `routes/`, `scenarios/`, and `test/` directories. This
separation makes regeneration routine while keeping product-specific code small
and recognizable.

## Documentation authority

Contributors consult and reference Ordergroove's public API documentation before
changing externally visible simulator behavior. When the local contracts and
the public reference differ, the simulator follows its local contracts for HTTP
methods, paths, authentication, request and response schemas, and modeled status
codes. Known differences and their simulator decisions are recorded in
[`DOCUMENTATION_DIFFERENCES.md`](./DOCUMENTATION_DIFFERENCES.md), with links to
the relevant public documentation.

This precedence rule defines simulator behavior; it does not suggest that the
local contract is a more accurate description of Ordergroove's production API.
Behavior described by the public documentation but absent from the local
contract remains unsupported unless it can be modeled faithfully and the
limitation is stated explicitly.

## Agentic workflow

The repository's [agent instructions](../AGENTS.md) provide durable context for
an AI coding agent. They require changes to stay within a small API slice;
consult and cite the provider's public documentation; record differences between
that documentation and the local contracts; test behavior against a live,
programmatically started simulator; use middleware for shared request behavior;
and keep state and business rules out of generated files.

The intended loop is:

1. Generate the simulator scaffold from a local contract.
2. Add or revise one behavior.
3. Run direct state-logic tests and HTTP tests against the simulator.
4. Review the documented assumptions with an Ordergroove domain expert.

During interactive development, `npm start` reloads route and context changes
while retaining the live store. This makes a rule easy to revise and exercise
without recreating the entire environment.

Generated and maintained simulator behavior is not a claim about production
semantics. The local OpenAPI contracts define the simulated HTTP interface, and
the public documentation provides external context for its behavior and known
differences. A person with Ordergroove knowledge must still validate and refine
the semantics before the simulator can be treated as a reliable representation
of production behavior.
