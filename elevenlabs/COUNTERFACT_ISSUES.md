# Counterfact compatibility status

The simulator now pins Counterfact 3.2.1 and runtime 0.4.1. Regeneration fixes
collection context bindings and supplies MultipartFile request types. Nullable
primitive and array query conversion, optional bodies, version availability,
initial module identity are fixed upstream. Several recursive request schemas now
validate, but agent configuration graphs can still exhaust memory (see #2626).
The affected collection casts and query coercion workarounds have been removed.
Stable error tags remain a valid application convention, rather than a runtime
requirement. The Dispatcher harness remains the project's deliberate integration
test boundary; it is not a compatibility workaround.

The original reports below are historical evidence for 3.1.0 / 0.3.2.
The remaining generated handlers are an implementation backlog after the upgrade.
Use the operation audit for current counts. Actual multipart parser behavior is
owned by Counterfact; simulator tests supply the public MultipartFile shape.

## Current schema expansion blocker — #2626

[Counterfact #2626](https://github.com/counterfact/api-simulator/issues/2626)
contains a public synthetic shared-schema graph reproducer: depth 5 reaches its
handler and returns 200; depth 22 exhausts a 256 MB heap after document load and
before handler entry. A bounded full-contract agent-create probe also exhausts
512 MB. This is a remaining 0.4.1 limitation, not the old cycle traversal error.

Exact-template probes on 0.4.1 return 200 for valid input and 400 for invalid
controls for tools POST/PATCH, agent-test create/PUT, both conversation simulation
routes and Flows template run creation. Agent create/PATCH, branch and draft
creation, run-tests and resubmit abort before their handlers under the 256 MB
probe limit. Keep these six operations generated pending an upstream fix; do not
run them unbounded in the normal test suite or disable request validation.

## Remaining scalar numeric coercion limitation — #2627

[Counterfact #2627](https://github.com/counterfact/api-simulator/issues/2627)
records remaining lossy scalar numeric parsing in runtime 0.4.1.
For example, `aggregation_bucket_size=3600junk` arrives as 3600. Nullable numeric
conversion is fixed, but strict lexical rejection is not promised here. The old
nullable-string workaround could reject those spellings before conversion; it
cannot do so after conversion. Simulator tests cover valid decimal queries and
invalid business values directly; they do not duplicate transport parsing.

# Historical issue evidence

Observed with Counterfact 3.1.0 and `@counterfact/runtime` 0.3.2.
New reports were filed using `pmcelhaney-codex`; existing reports were reused.
The simulator targets its installed runtime without compatibility paths for older versions.

| Issue | Evidence and effect | Current simulator approach |
| --- | --- | --- |
| [#2607: Multipart request parsing](https://github.com/counterfact/api-simulator/issues/2607) | Existing report. Multipart-dependent voice editing cannot be simulated faithfully with the installed body parser. | Leave multipart-dependent operations generated; do not fake successful parsing. |
| [#2608: Generated collection context type differs from runtime](https://github.com/counterfact/api-simulator/issues/2608) | Existing report. A sibling collection handler is typed against its parent context while Dispatcher supplies the nested context. | Use one explicit context assertion at collection boundaries; regenerate descendant and scenario bindings normally. |
| [#2609: Version-specific route availability](https://github.com/counterfact/api-simulator/issues/2609) | New report. A synthetic shared-registry reproduction executes a V1-only operation through a V2 Dispatcher even when it is absent from the V2 contract. | Use documented versioned paths; the README records this runtime limitation. |
| [#2610: Invalid boolean text becomes false](https://github.com/counterfact/api-simulator/issues/2610) | New report. A required boolean query accepts `not-a-boolean` as `false`, while a missing value correctly fails. This concerns lossy coercion; current docs do not promise comprehensive parameter-schema validation. | Report parsing behavior upstream rather than duplicate transport conversion in simulator tests. |
| [#2611: ModuleLoader class identity](https://github.com/counterfact/api-simulator/issues/2611) | New report. On initial ESM load, a context instance and its custom error fail `instanceof` checks against the same constructors imported by the route. No hot reload is needed. | Prefer explicit result discriminants or stable application error tags. |
| [#2612: Nullable primitive query conversion](https://github.com/counterfact/api-simulator/issues/2612) | New report. A synthetic Dispatcher reproduction returns integer query text as a string for `anyOf(integer, null)`, while plain integer queries become numbers; nullable booleans behave similarly. | Strictly normalize affected secrets/tool numeric and agent/tool boolean query values at thin route boundaries before context validation. |
| [#2613: Recursive request schemas overflow validation](https://github.com/counterfact/api-simulator/issues/2613) | New report. Public `loadOpenApiDocument` and Dispatcher with a synthetic recursive Node schema throw `RangeError: Maximum call stack size exceeded` for a finite POST body; the handler is never called. Agent create and PATCH have recursive request schemas and reproduce the failure; tool create and PATCH use the same recursive schema family. | Leave agent/tool create and PATCH generated and uncounted; support scenario-seeded discovery, summaries, duplication and deletion with real validation enabled. |

The new issues contain self-contained synthetic reproductions using public
Dispatcher and ModuleLoader APIs. They require no API account, credentials,
network listener, or simulator-specific test harness.

Existing wildcard-ambiguity and date-format diagnostics are observed during
tests. They are not treated as additional confirmed bugs without a concrete
incorrect routing or validation result.

## Optional request bodies

[Counterfact #2614](https://github.com/counterfact/api-simulator/issues/2614):
Counterfact 3.1.0 / runtime 0.3.2 rejects an absent optional object body before
invoking the handler. Reproduced using a minimal public Dispatcher request with
`requestBody.required: false`; sending JSON `{}` permits a no-op service-account
key PATCH. The simulator keeps request validation enabled and tests the installed
runtime limitation without changing its source contract.

## Single array query values

[Counterfact #2615](https://github.com/counterfact/api-simulator/issues/2615):
A single value for both a plain array query schema and a nullable array schema
reaches a public Dispatcher handler as a string. Repeated values remain arrays.
The conversation context normalizes only its six supported array query filters
from a string to a singleton list, validates list items, and preserves repeated
values. Request and response validation remain enabled.

## Agent-test recursive request schemas

The same [#2613](https://github.com/counterfact/api-simulator/issues/2613) family
affects `POST /v1/convai/agent-testing/create` and the recursive request schemas
of `PUT /v1/convai/agent-testing/{test_id}`. A guarded public Dispatcher probe
loaded the unchanged V1 contract and registered a finite custom handler, with
request/response validation enabled. The finite create body was
`{"type":"llm","name":"Local probe","success_condition":"Clear response"}`.
The subprocess used a 256 MB heap, 256 KB stack and 12-second timeout; it aborted
with `SIGABRT` and heap exhaustion before returning a result. This was not a
provider or model call.

A separate guarded PUT probe registered the exact template
`/convai/agent-testing/{test_id}` and dispatched `/convai/agent-testing/probe`
with `{"name":"Local probe","type":"llm","success_condition":"Clear response"}`.
It used the unchanged V1 contract, enabled request/response validation and the
same resource bounds. It aborted with `SIGABRT` before the handler's synchronous
`HANDLER_ENTERED` output marker ran, with empty stdout. The saved stderr tail
contains native frames only; it does not establish heap exhaustion as the PUT
abort cause or a caught `RangeError`. This is direct pre-handler abort evidence
for PUT. Create and PUT remain generated and uncounted.

A separate guarded probe against the same contract returned HTTP 200 for
`GET /v1/convai/agent-testing/{test_id}` with the handler called and a finite
`{"id":"probe","name":"Local","type":"llm","chat_history":[]}` response.
The management subset uses finite scenario definitions, keeps validation enabled,
and does not run recursive create/PUT probes as part of normal tests.

## Test invocation execution requests

The same [#2613](https://github.com/counterfact/api-simulator/issues/2613) request
validation failure affects `POST /v1/convai/agents/{agent_id}/run-tests` and
`POST /v1/convai/test-invocations/{test_invocation_id}/resubmit`. Their optional
configuration override references recursive input schemas. Finite requests with
the override omitted throw `RangeError` in `json-schema-traverse` before the
handler runs. Both remain generated and uncounted.

Corrected public-runtime probes register each canonical template in `Registry`
and dispatch a concrete path against the unchanged V1 contract, with explicit
`application/json` responses and request/response validation enabled. Registering
a concrete literal instead skips exact template contract lookup and cannot
establish feasibility. Resource limits were 256 MB heap, 256 KB stack and a
12-second subprocess timeout. A same-contract invocation PATCH control returns
200 and invokes its handler for `{"name":"Local"}`, while `{"name":42}` returns
400 before invoking it. These controls identify the request failure; they do not
establish a response-generation bug. This is the same cause as the existing
issue; no duplicate response-generation issue is asserted.

## Additional recursive request operations

The same [#2613](https://github.com/counterfact/api-simulator/issues/2613) request
validation failure is confirmed for five additional operations:

- POST /v1/convai/agents/{agent_id}/branches
- POST /v1/convai/agents/{agent_id}/drafts
- POST /v1/convai/agents/{agent_id}/simulate-conversation
- POST /v1/convai/agents/{agent_id}/simulate-conversation/stream
- POST /v1/flows/templates/{template_id}/runs

Each exact-template public Dispatcher probe against the unchanged V1 contract
throws RangeError: Maximum call stack size exceeded in json-schema-traverse
before its custom handler is called. The probes use explicit JSON request and
response media, enabled validation, finite synthetic bodies, a 256 MB heap, a
256 KB stack and a 12-second subprocess timeout. They differ from the agent-test
create heap-exhaustion/SIGABRT and PUT pre-handler SIGABRT observations above.
None of these results establishes a response-generation failure. [The blocker inventory](BLOCKED_OPERATIONS.md#additional-exact-template-probes)
records the five bodies and the exact registration/control protocol.

All 43 remaining generated operations are accounted for in
[blocked-operations.json](blocked-operations.json): 30 multipart-input operations
under #2607 (25 required wire bodies and five optional bodies needing meaningful
file/URL/audio input), and 13 recursive JSON request operations under #2613.
Bodyless Studio content reset and procedure compile are authored and excluded.
