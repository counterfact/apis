# Remaining generated operations

Counterfact 3.2.1 and runtime 0.4.1 are installed. The contracts contain 437
operations: 431 authored and six generated, with no missing or empty handlers.
The 37 formerly blocked multipart/JSON operations that now work were implemented
in separate verified slices. The six remaining operations exhaust memory during
request validation before the handler runs; they are not counted as implemented.

| Method | Path | Current blocker |
| --- | --- | --- |
| PATCH | `/v1/convai/agents/{agent_id}` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |
| POST | `/v1/convai/agents/{agent_id}/branches` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |
| POST | `/v1/convai/agents/{agent_id}/drafts` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |
| POST | `/v1/convai/agents/{agent_id}/run-tests` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |
| POST | `/v1/convai/agents/create` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |
| POST | `/v1/convai/test-invocations/{test_invocation_id}/resubmit` | [#2626](https://github.com/counterfact/api-simulator/issues/2626) |

## Shared-schema expansion (runtime 0.4.1)

Exact-template probes register a custom finite handler against the unchanged V1
contract, send finite JSON requests, and keep both validators enabled. The six
operations abort before handler entry under the 256 MiB probe bound. Agent create
also exhausts a 512 MiB heap. The public synthetic reproducer in #2626 uses a
small shared schema graph: depth five succeeds; depth 22 exhausts 256 MiB after
document loading and before handler entry. This is not the old cycle traversal
failure or a claim about response generation.

The upstream fix has been merged. It is not present in the pinned 3.2.1/0.4.1
packages. Recheck these operations after upgrading to a release containing that
fix; do not disable request validation or alter the contracts to mark them done.

Run `npm run audit:operations -- --check-blockers` to verify exact agreement with
[blocked-operations.json](blocked-operations.json). All multipart handlers are now
authored. [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) summarizes the work.

## Historical evidence from 3.1.0 / 0.3.2

The notes below explain the original runtime limitations. They are historical;
the table above and current manifest are authoritative for this checkout.

## Multipart parser

Existing [Counterfact #2607](https://github.com/counterfact/api-simulator/issues/2607)
and the pinned server source establish the parser limitation. All 30 listed
operations declare multipart/form-data, with no JSON alternative. Twenty-five
have a required request body. Passing a preconstructed object directly to
Dispatcher would bypass the missing HTTP multipart parser and would not establish
usable multipart support. The simulator does not add a private parser or pretend
that multipart input was received.

Five listed operations have optional wire bodies: both dubbing creation routes,
AudioNative file-content update, similar-voice search and legacy knowledge-base
creation. Their operation descriptions and body properties require a source
file/URL, article file or audio to accomplish their purpose. A bodyless handler
can be reached, but has no input for that operation. The per-operation reasons
record this semantic distinction rather than claiming request validation fails.

The sixth optional multipart operation, POST /v1/studio/projects/{project_id}/content,
has a meaningful blank-content reset and is already authored. It is excluded from
this inventory. Bodyless legacy procedure compile also proved feasible and is
authored; its recursive response graph did not justify marking it blocked.

## Reproduction protocol for recursive requests

Use the public Registry, ContextRegistry, Dispatcher and loadOpenApiDocument
exports from @counterfact/runtime with the pinned V1 contract. Register the exact
versionless template (including brace parameters), and dispatch a concrete
versionless URL with each brace value replaced by probe. Use the listed HTTP
method, application/json request header, a finite JSON body and a custom handler
that records whether it was invoked and returns explicit application/json
content. Enable both validateRequests and validateResponses. For example, the
branch registration is /convai/agents/{agent_id}/branches and the dispatched URL
is /convai/agents/probe/branches; pass v1 as the Dispatcher version.

Registering only a concrete literal can skip exact template contract lookup;
such a result is not evidence of successful validation. Run each recursive
probe in a separate subprocess with --max-old-space-size=256 and --stack_size=256,
and a 12-second parent timeout. Do not include these potentially aborting probes
in ordinary simulator tests. Bodies below are synthetic, not provider requests.

### Agent tool recursive requests

Agent create/PATCH and tool create/PATCH use recursive request schemas. The
existing [#2613 report](https://github.com/counterfact/api-simulator/issues/2613)
documents the public synthetic recursive Node-schema reproduction and agent
mutation failure; guarded agent/tool mutation checks confirm failure before
handler invocation. They remain generated with validation enabled. This is a
request-validation failure, not a conclusion about response generation.

### Agent test guarded abort

Agent-test create and PUT belong to the same recursive request-schema family.
The guarded create probe used
`{"type":"llm","name":"Local probe","success_condition":"Clear response"}`.
It exhausted its 256 MB heap and aborted with SIGABRT before returning a result,
under the bounds above. This observation is an abort, not a caught RangeError
or a returned HTTP status.

A separate guarded PUT probe registered `/convai/agent-testing/{test_id}` and
dispatched `/convai/agent-testing/probe` with the finite synthetic JSON body
`{"name":"Local probe","type":"llm","success_condition":"Clear response"}`.
It used the unchanged V1 contract, enabled request and response validation, and
the same 256 MB heap, 256 KB stack and 12-second subprocess timeout. It aborted
with SIGABRT before the handler's synchronous `HANDLER_ENTERED` output marker
ran; stdout was empty. The saved stderr tail contains native frames only, so
this PUT observation establishes neither heap exhaustion as its cause nor a
caught RangeError. It directly establishes an abort before handler execution,
without relying solely on similarity to the create schema.

A separate exact-contract GET agent-test control reached its handler and returned
200 with a finite JSON response. No model or provider was called.

### Invocation exact template probes

POST run-tests used `{"tests":[{"test_id":"probe"}]}` and POST resubmit used
`{"agent_id":"probe","test_run_ids":["probe"]}`. Both throw RangeError:
Maximum call stack size exceeded before their custom handlers run, even though
the recursive optional override is omitted. The same-contract PATCH invocation
control with `{"name":"Local"}` returns 200 and invokes its handler;
`{"name":42}` returns 400 without invoking it. That control confirms selection
of a request contract. It does not prove response-contract validation correctness.

### Additional exact template probes

Five more operations fail with RangeError: Maximum call stack size exceeded in
json-schema-traverse before their custom handlers are invoked. Each was tested
under the same resource bounds and registration protocol. The manifest records
these exact finite synthetic bodies:

| Operation | Synthetic JSON request body |
| --- | --- |
| POST `/v1/convai/agents/{agent_id}/branches` | `{"parent_version_id":"probe","name":"Probe","description":"Synthetic"}` |
| POST `/v1/convai/agents/{agent_id}/drafts` | `{"conversation_config":{},"platform_settings":{},"workflow":{"nodes":{"start":{"type":"start"}},"edges":{}},"name":"Probe"}` |
| POST `/v1/convai/agents/{agent_id}/simulate-conversation` | `{"simulation_specification":{"simulated_user_config":{}}}` |
| POST `/v1/convai/agents/{agent_id}/simulate-conversation/stream` | `{"simulation_specification":{"simulated_user_config":{}}}` |
| POST `/v1/flows/templates/{template_id}/runs` | `{"inputs":{}}` |

These observations extend the existing #2613 request-validation evidence to
branch creation, draft creation, both conversation simulation variants and Flows
run creation. They do not establish that all recursive responses are broken or
that these finite bodies satisfy every business constraint: the failure occurs
while traversing request schemas before a handler can apply business rules.
No validation bypass, placeholder implementation or duplicate upstream issue is
needed to account for these operations.
