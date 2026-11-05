# ElevenLabs simulator tests

For this project, test API behavior through Counterfact's public Dispatcher API
using `test-support/dispatcher.ts`. This replaces the repository-wide requirement
to run integration tests through a listening HTTP server.

Assume Counterfact's body parsing and transport behavior work correctly. Do not
add duplicate tests of those layers here. Dispatcher integration tests must still
use the real route handlers, contexts, version-specific contracts, request and
response validation, and scenarios, and assert statuses, bodies/headers, and state
changes as applicable. In the pinned runtime, response validation checks declared
headers, not body schemas; assert response body structure and values explicitly.

Keep the repository's TDD, direct context unit tests, scenario-owned fixtures,
and per-slice commit requirements.

## Reusable checks

Read `../docs/agent-workflow.md` for slice packets, verification and publishing.
Run `npm run audit:operations -- --check-blockers` to compare canonical operations
with the committed blocker manifest. See `npm run probe:operation -- --help` for
resource-limited public Dispatcher probes and `npm run verify:command -- --help`
for unique logs tied to the exact source state. Run `npm run test:tools` after
changing these development tools.

Before a runtime capability claim, consult `COUNTERFACT_ISSUES.md` and
`BLOCKED_OPERATIONS.md`, then reproduce against the installed version if needed.
Register the exact OpenAPI template, request a concrete path, and include a
negative request control proving contract selection. Use JSON media explicitly.
Never run suspected recursive schemas in an unbounded main test process.

Reuse scenario-owned media in `api/scenarios/bounded-speech.ts` and
`api/scenarios/bounded-music.ts` when appropriate; inspect their actual exports first.
Keep media types, bytes and documented buffered behavior consistent. The pinned
runtime's async stream path frames sequential data; a logical chunk collector
must not be presented as proof of raw binary HTTP streaming.
