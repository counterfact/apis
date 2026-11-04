# Agent instructions for `counterfact/apis`

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
   - Do not add placeholder `dummy` test files.

3. **Implement state and business logic in route context files**
   - Put simulator state and business rules in `routes/**/_.context.ts`.
   - Do not edit generated `types/_.context.ts` files.
   - Keep route handlers thin by delegating behavior to context classes/methods.

4. **Unit test Context classes directly**
   - Add direct unit tests for `Context` class behavior in `routes/**/_.context.ts`.
   - Cover state transitions and core business logic independently of HTTP tests.

5. **Use scenarios for startup init and REPL setup flows**
   - Always define seed data, state population, and reset orchestration in the API group's `scenarios/` directory.
   - Use `startup` to initialize simulator state when the server starts.
   - Use a named `reset` scenario to restore the baseline by replacing or clearing and repopulating state.
   - Context classes initialize empty state containers and own business operations. Do not seed data in constructors or hide fixture restoration in context methods called by scenarios.
   - Scenarios must perform state population and replacement themselves. Calling a context method that hides the seeding or reset logic does not satisfy this rule.
   - Keep route handlers focused on request behavior. Tests that need seeded state should run the appropriate scenario.
   - Use other scenario functions for REPL-invoked setup/actions after startup.
   - Keep scenarios simple and declarative.
   - Scenario code is intentionally lightweight and **does not require unit tests**.

## Manual acceptance tests

Every PR description must include a section titled exactly `## Manual acceptance tests` with 3–6 checkboxes. Each checkbox must describe an observable behavior (not an implementation detail). When creating the PR, leave all boxes unchecked — the reviewer checks each one after manually verifying the behavior. All boxes must be checked before the PR can be merged.

- Cover the main success path, at least one edge case, and one regression check where applicable.
- Exception: if a PR only adds files under `.github/issue-proposals/`, this section may be omitted.

## Quality bar for every change

- Tests fail first, then pass after implementation.
- HTTP-level tests verify externally visible API behavior and state effects.
- Context unit tests verify internal logic.
- Scenario updates follow the startup-init and REPL-invoked scenario model.
- Scope remains limited to one API/subset per iteration.

## Commit each completed slice

- After completing a coherent slice of changes, run the relevant checks and commit that slice before handing it back to Patrick.
- Do not wait for a separate request to commit. If the task contains several slices, commit each completed slice separately.
- Include only changes belonging to the slice; leave unrelated work untouched.
- Honor any explicit instruction to leave changes uncommitted. If checks fail or a commit is blocked, explain what remains unresolved.

## Optional TypeSafe / Jev development checks

Use TypeSafe/Jev for narrow semantic judgments that help development, such as
checking whether an excerpt supports a documentation claim. Use deterministic
code and tests for exact facts. Jev provides evidence, not authority to approve
or merge a change.

Follow the installed `typesafe-ai` skill for question design; do not install a
duplicate. Use `scripts/typesafe/development.mjs` for prepared requests and see
`scripts/typesafe/README.md` for commands and credential setup.

Patrick's existing authorization covers routine development judgments using
public Counterfact source and synthetic examples, with spending controlled at
the provider. Do not ask again within that scope. Do not send unpublished local
changes, credentials, environment dumps, ignored/private files, personal data,
or unrelated content. Prepare only the evidence needed for each question.
Do not add client-side spending ledgers or approval files.

Keep API keys in the ignored, owner-only `.env.typesafe.local` beside the common
Git directory. Never print credentials or raw provider errors. A failed API call
is an error, never a false judgment. Ordinary simulator runtime, builds, and
tests must not call TypeSafe. The helper's default mode validates locally;
`--send` explicitly makes a live request.
