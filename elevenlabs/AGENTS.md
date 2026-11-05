# ElevenLabs simulator tests

For this project, test API behavior through Counterfact's public Dispatcher API
using `test-support/dispatcher.ts`. This replaces the repository-wide requirement
to run integration tests through a listening HTTP server.

Assume Counterfact's body parsing and transport behavior work correctly. Do not
add duplicate tests of those layers here. Dispatcher integration tests must still
use the real route handlers, contexts, version-specific contracts, request and
response validation, and scenarios, and assert statuses, bodies/headers, and state
changes as applicable.

Keep the repository's TDD, direct context unit tests, scenario-owned fixtures,
and per-slice commit requirements.
