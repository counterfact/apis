# Local Flows template runs

`POST /v1/flows/templates/sim-template-text/runs` accepts
`{"inputs":{"prompt":"Local text"}}`. Omitted or `latest` version selection
uses the version marked latest; an explicit saved runnable version can be pinned.
The shared template fixture is also runnable. Missing templates or versions return
404; unavailable versions, missing/extra input ports, invalid port values and
non-null webhooks fail before state changes.

Creation returns a pending run with every output present. Existing run detail and
list routes read the same records. `completeFlowTemplateRuns` supplies the
scenario's synthetic text result and completes pending runs once. Polling alone
leaves the run pending. The selected version, input bindings and synthetic result
are captured at creation; later template or fixture changes do not rewrite them.
`reset` restores the catalog, historical runs, ID sequence and deterministic clock.

This subset executes the scenario-backed string outputs in the local fixtures.
Primitive and array input values are checked against the selected port schemas,
including string/number enums and integer types. Object bindings, media/voice and
generation references, and other output kinds are unsupported here. Execution
performs no inference, provider requests, webhook delivery or external work.
