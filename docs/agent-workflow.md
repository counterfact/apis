# Simulator implementation workflow

Use this reference for implementation or coordination. Keep root instructions
short; load this file and the relevant API's runtime notes only as needed.

## Slice packet

Give a fresh agent this small packet, using paths rather than copied documents:

```text
Scope: exact method/version/path set and observable behavior.
Checkout: absolute path, branch and verified parent commit.
Read: root/API AGENTS files, relevant context/scenario/test paths.
State: canonical owner, live readers/writers, immutable snapshots.
Dependencies: normal defaults, fixtures/models, prerequisite decision.
Evidence: relevant installed-version limitations and probe/log paths.
Checks: focused command, final checks, audit command.
Finish: commit/push authorization and required handoff fields.
```

Do not send full conversation history, unrelated endpoint schemas, or repeated
copies of shared instructions. Keep one behavior slice active at a time when
working serially. A prerequisite fix/refactor is a separate verified publication;
the following behavior slice gets a fresh implementation agent.

## Before implementation

1. Read only the target operation, referenced schemas, and neighboring patterns.
2. Identify canonical state owners and all cross-context readers and writers.
   Account for map replacement during reset, branch selection, deletion, and
   immutable historical records. Avoid parallel caches of the same fact.
3. Check normal defaults and required model/fixture dependencies. Support the
   default path; do not turn missing implementation into an unsupported option.
4. Check applicable installed-version limitations. The issue index is evidence,
   not a permanent rule: recheck after an upgrade.
5. Write and execute failing direct-context and real-handler integration tests.
   A missing import alone does not establish an HTTP behavior failure.

## Contract probes

From `elevenlabs`, use `npm run probe:operation -- --help`.
Provide a valid request, a deliberately invalid request, and a finite response
fixture as JSON files. Each request runs in a separate bounded subprocess.

Register the **exact OpenAPI path template**, such as `/items/{item_id}`, and
send a **concrete** path, such as `/items/example`. Literal registration can
bypass operation lookup even when validation flags are enabled. The runner
checks that the template/method exists and requires the invalid request to fail
before handler entry. Use the correct JSON header or other declared media.

An abort or timeout is evidence of that event, not proof of a particular cause.
Keep `handlerCalled`, process status and validation-control results distinct.
Do not infer feasibility from an invalid-control request that reaches the handler.
Do not confuse request validation, response-header validation, random-response
generation, or actual response-body assertions.

Counterfact 3.1.0 / runtime 0.3.2 checks declared response headers rather than
response body schemas. Its ordinary binary response path can return bounded
fixtures; its async stream framing is not a raw binary transport. Detailed,
version-specific evidence belongs in the API's issue/capability reference, not
in every slice prompt. Never disable validators or modify source contracts just
to declare an operation complete.

## Implement and review

Use thin route handlers, context-owned operations, and scenario-owned fixture,
reset and synthetic completion data. Reuse proven patterns and media sources.
Preserve MIME/byte agreement and independently check a new media/container format
once with a suitable decoder/parser. Normal runtime tests should not depend on
platform codecs, network access, inference providers or real credentials.

Review state transitions before polishing: failed mutations must be atomic,
resets must restore baseline, historical snapshots must remain independent, and
live projections must reflect deletes, renames and selected configurations.
Explicit advanced-option limitations are acceptable; ordinary defaults need a
working success path.

## Verification and logs

Run focused checks during iteration. Freeze implementation before the final
full suite for runtime changes. After a later change, repeat the checks that
actually cover it; do not repeatedly rerun unrelated suites for a docs fix.

`npm run verify:command -- --label voice-focused -- node --import tsx --test test/voices.test.ts`
records a unique log and metadata file, exact command, exit status, HEAD and
before/after source fingerprints. A command that passes while source changes is
not a frozen verification. Ignored files and dependency directories are excluded
from the source fingerprint. Do not put logs in tracked source directories.

Read the completed summary and exit metadata. Never report an expected test
count, a partial run, or an old log at a reused filename as a final result.

Use `npm run audit:operations -- --out /tmp/route-audit.json` for a structural
inventory against the committed generation baseline. Use `--check-blockers` to
require exact agreement with the blocker manifest. An authored classification
means the handler changed beyond the generator scaffold; behavioral checks still
establish completion. Preserve one count per method and versioned path, including
versions that share a handler. Exclude random and untouched empty scaffolds.

## Publication and fallback

Use ordinary Git publication when available. A failed shell transport does not
prove the connected GitHub integration is unavailable. When publication is
authorized and a connector fallback is necessary:

1. Read the actual remote branch head; require the intended parent to match.
2. Build a tree from **committed** changes only and verify its hash equals the
   local committed tree. Encode binary blobs properly; never reinterpret them as
   UTF-8 text or print complete source payloads.
3. Create the commit and update the branch with an expected-parent lease. Stop
   on a changed remote; inspect it rather than force-pushing.
4. API-created commits may have different metadata and IDs. Preserve a recovery
   reference, import/fetch exact objects, verify their hashes, and align the local
   branch only after tree equality and clean-state checks. Never hardcode a
   timezone or invent commit metadata to obtain a desired hash.
5. Verify actual GitHub ref/tree and local tracking state; report the published
   ID. Do not confuse a local commit with a successfully published commit.

Keep fallback mechanics conditional; avoid filling normal implementation prompts
with tool schemas or one-off machine paths. Never embed access tokens in scripts.
Do not retry an approval-rejected action through another channel. Record its
stated reason and preserve a local draft when appropriate.

## Handoff

```text
Published commit/tree and checkout status.
Added method/version/path set; completed/remaining totals from audit.
Checks: exact commands, exit metadata and unique logs.
State ownership changes and normal-default behavior.
Applicable limitations: observed failure versus unfinished implementation.
Next coherent scope and concrete prerequisites.
```

For a blocker, retain the exact operation, installed version, minimal synthetic
reproduction, control results and relevant issue. Optional multipart bodies need
a semantics check: documented blank-source behavior can work without an upload;
an operation that needs an actual source cannot be completed just by accepting an
empty request. Report only minimal public-source/synthetic evidence upstream;
exclude unpublished project details, credentials and private or ignored files.
