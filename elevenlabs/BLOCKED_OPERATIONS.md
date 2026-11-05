# Remaining generated operations

The two pinned contracts contain 437 operations: 436 V1 operations and one V2
operation (GET /v2/voices). There are 394 authored operations and exactly 43
remaining generated operations. The upstream unversioned GET /docs redirect is
excluded, as recorded in [contract provenance](openapi.provenance.json).
All remaining operations have a concrete runtime blocker: 30 require multipart
input and 13 have recursive JSON request-schema failures. None is classified
merely because implementation is missing or its response schema is recursive.

[blocked-operations.json](blocked-operations.json) records the exact method and
versioned path set, operation IDs, request schema references, generated handler
kind, reasons and evidence groups. The table below has exactly the same 43 rows.
These handlers remain generated and are not counted as authored behavior;
generated output is not a supported stateful simulator implementation.

## Operation inventory

Body required/optional reflects requestBody.required in the unchanged contract;
it does not establish whether an absent body has meaningful business behavior.

| Method | Versioned path | Blocker | Wire body | Reason and evidence |
| --- | --- | --- | --- | --- |
| POST | `/v1/assets` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/audio-isolation` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/audio-isolation/stream` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/audio-native` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/audio-native/{project_id}/content` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Optional | Optional wire body, but update requires article file; absent body cannot perform a content update. [Evidence](#multipart-parser) |
| PUT | `/v1/convai/agent-testing/{test_id}` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Recursive PUT request schema shares the agent-test create schema family; guarded create probe exhausted its heap and aborted with SIGABRT. See evidence limitations. [Evidence](#agent-test-guarded-abort) |
| POST | `/v1/convai/agent-testing/create` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Guarded recursive request probe aborted with SIGABRT and heap exhaustion before a result; see agent-test evidence limitations. [Evidence](#agent-test-guarded-abort) |
| PATCH | `/v1/convai/agents/{agent_id}` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Optional | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#agent-tool-recursive-requests) |
| POST | `/v1/convai/agents/{agent_id}/avatar` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/convai/agents/{agent_id}/branches` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#additional-exact-template-probes) |
| POST | `/v1/convai/agents/{agent_id}/drafts` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#additional-exact-template-probes) |
| POST | `/v1/convai/agents/{agent_id}/hold-audio` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/convai/agents/{agent_id}/run-tests` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#invocation-exact-template-probes) |
| POST | `/v1/convai/agents/{agent_id}/simulate-conversation` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#additional-exact-template-probes) |
| POST | `/v1/convai/agents/{agent_id}/simulate-conversation/stream` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#additional-exact-template-probes) |
| POST | `/v1/convai/agents/create` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#agent-tool-recursive-requests) |
| POST | `/v1/convai/conversations/{conversation_id}/files` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/convai/knowledge-base` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Optional | Optional wire body, but document creation requires URL or file; absent body supplies neither. [Evidence](#multipart-parser) |
| PATCH | `/v1/convai/knowledge-base/{documentation_id}/update-file` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/convai/knowledge-base/file` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/convai/test-invocations/{test_invocation_id}/resubmit` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#invocation-exact-template-probes) |
| POST | `/v1/convai/tools` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#agent-tool-recursive-requests) |
| PATCH | `/v1/convai/tools/{tool_id}` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#agent-tool-recursive-requests) |
| POST | `/v1/dubbing` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Optional | Optional wire body, but dubbing creation requires uploaded media or a source URL; absent body supplies neither. [Evidence](#multipart-parser) |
| POST | `/v1/dubbing/project` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Optional | Optional wire body, but dubbing creation requires uploaded media or a source URL; absent body supplies neither. [Evidence](#multipart-parser) |
| POST | `/v1/flows/templates/{template_id}/runs` | [#2613](https://github.com/counterfact/api-simulator/issues/2613) | Required | Exact-template request validation fails with RangeError before the handler runs; finite JSON input does not avoid recursive schema traversal. [Evidence](#additional-exact-template-probes) |
| POST | `/v1/forced-alignment` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/music/finetunes` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/music/stem-separation` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/music/upload` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/music/video-to-music` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/productions/orders/{order_id}/media` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/pronunciation-dictionaries/add-from-file` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/similar-voices` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Optional | Optional wire body, but similarity requires supplied audio_file; absent body supplies no audio. [Evidence](#multipart-parser) |
| POST | `/v1/speech-to-text` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/studio/projects` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voice-changer/{voice_id}` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voice-changer/{voice_id}/stream` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voices/{voice_id}/edit` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voices/add` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voices/pvc/{voice_id}/captcha` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voices/pvc/{voice_id}/samples` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |
| POST | `/v1/voices/pvc/{voice_id}/verification` | [#2607](https://github.com/counterfact/api-simulator/issues/2607) | Required | Required multipart input; installed runtime uses default koa-bodyparser without multipart support. [Evidence](#multipart-parser) |

## Pinned sources

This evidence applies to Counterfact 3.1.0 and runtime 0.3.2, pinned in
[package.json](package.json) and [package-lock.json](package-lock.json).
The source contracts are [openapi.v1.yaml](openapi.v1.yaml) and
[openapi.v2.yaml](openapi.v2.yaml); their hashes and upstream origin are in
[openapi.provenance.json](openapi.provenance.json). Use these snapshots for
reproduction rather than a changing live contract.

The published runtime source exposes the relevant boundaries:

- [create-koa-app.js](https://unpkg.com/@counterfact/runtime@0.3.2/dist/server/web-server/create-koa-app.js) installs default koa-bodyparser.
- [dispatcher.js](https://unpkg.com/@counterfact/runtime@0.3.2/dist/server/dispatcher.js) selects the operation using the registered matched template, then validates requests before invoking the handler.
- [request-validator.js](https://unpkg.com/@counterfact/runtime@0.3.2/dist/server/request-validator.js) uses AJV for application/json request schemas; it does not parse multipart data.

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
or a returned HTTP status; the PUT classification also relies on its recursive
request schema as documented in [COUNTERFACT_ISSUES.md](COUNTERFACT_ISSUES.md#agent-test-recursive-request-schemas).
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
