# ElevenLabs API simulator

Stateful local simulator generated from the pinned official ElevenLabs OpenAPI
contracts. All **437 contract operations** have authored handlers: 436 V1
operations and one V2 operation. There are no generated fallback, missing or empty
operations. The unversioned upstream `/docs` redirect is excluded.

Counterfact 3.2.2 and runtime 0.4.2 are pinned. The upgrade resolves the shared
schema memory failure that blocked the final agent/test operations. Contracts and
provenance hashes are unchanged; request and response validation stay enabled.

## Run

Requires Node.js 22.22 or newer.

```sh
cd elevenlabs
npm ci
npm start
```

The API listens at http://localhost:3100. `npm run serve` starts without the REPL.
V1 paths use `/v1`, and V2 voice discovery uses `/v2/voices`. Swagger is available
at http://localhost:3100/counterfact/swagger/api/?version=v1 and
http://localhost:3100/counterfact/swagger/api/?version=v2.

No ElevenLabs account or API key is needed. Authentication is generally synthetic
or unenforced; credential-specific fixtures are described in their scenarios.

## Behavior and state

Outputs are bounded synthetic fixtures, including actual MIME-matched MPEG and
archive bytes. No provider inference, remote source fetching or real billing is
performed. Advanced options and format/size limits fail explicitly rather than
claiming unsupported execution. Documented stream variants may buffer a complete
response instead of simulating network timing.

Contexts own empty state containers and business operations. Startup and reset
scenarios populate fixtures. Callers share in-memory state within an instance;
independent instances isolate it. Restart or run `.scenario reset` to restore the
baseline. Programmatic clients can call `app.scenario("reset", "api")`.
Completion scenarios advance queued synthetic jobs; their names and limits are
listed in each feature's documentation.

Counterfact separately caps the complete multipart wire body at 10 MiB including
framing. Local group limits may be smaller. Upload bytes are copied into their
canonical owner and are not leaked through metadata projections. Fixture URLs
are opaque references unless an existing contract route explicitly serves bytes.

## Current documentation

[Implementation status](IMPLEMENTATION_STATUS.md) maps all 43 operations added
after the runtime upgrade to their focused slices and documentation. It also
summarizes the compatibility cleanup, pure audio/ZIP utilities and test boundary.
[Operation inventory](BLOCKED_OPERATIONS.md) records zero remaining operations;
the historical filename and `blocked-operations.json` are retained for continuity.

[Runtime observations](COUNTERFACT_ISSUES.md) distinguish resolved failures from
reproduced nonblocking class-identity and optional-body typing issues. Stable
application error tags and explicit optional-body defaults keep behavior coherent
across fresh loader instances. Obsolete collection casts, scalar query coercions
and blanket multipart/body rejection have been removed.

The [historical detailed notes](docs/legacy-implementation-notes.md) preserve
prior behavior descriptions. Their milestone counts and old runtime limitations
are superseded by this guide and the current feature documents.

## Development

```sh
npm run generate
npm run typecheck
npm test
npm run test:tools
npm run audit:operations -- --check-blockers
```

Generation reads local `openapi.v1.yaml` and `openapi.v2.yaml` through
`counterfact.yaml` and preserves authored handlers. Do not hand-edit generated
schema/context bindings. The audit counts one operation per method and versioned
path and checks the exact remaining set against the manifest.

Tests exercise Context classes directly and the real handlers, routing,
contracts and scenarios through Counterfact's public Dispatcher API. The project
assumes transport and body parsing work correctly. `requestMultipart` supplies
already-parsed public MultipartFile values through the real validators; it does
not reimplement HTTP multipart parsing. Response body values and structure are
asserted explicitly because the runtime's response validation checks declared
headers rather than body schemas.

See [agent instructions](AGENTS.md) and the [repository workflow](../docs/agent-workflow.md)
for focused TDD slices, scenario-owned setup and per-slice commits.
