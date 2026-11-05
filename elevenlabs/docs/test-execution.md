# Local agent test execution

`POST /v1/convai/agents/{agent_id}/run-tests` creates a pending invocation using
the agent's published main configuration, or its selected published branch.
LLM, tool and simulation test definitions are supported. Saved agent drafts are
excluded. An optional ad-hoc override is validated through the shared detached
agent configuration validator and marks the run as `ran_against_draft`; it does
not publish or change the agent.

Each invocation stores the original request and independent per-run request,
agent and test definition snapshots on the canonical invocation record. Later
renames, publications and test deletion leave these snapshots and returned
historical results intact. Responses and attempt-history reads are detached.
Explicit folder references must exist and contain the test; a supplied folder
name must match. Workflow node references must exist in the selected snapshot.

`POST /v1/convai/test-invocations/{test_invocation_id}/resubmit` retries selected
runs within the same invocation and preserves their run IDs. It validates all
selected runs, the same live agent, the new published branch and any override
before changing state. Each selected prior result, finalized synthetic price,
request and configuration is copied into immutable record-local attempt history.
The selected runs become pending with cleared results/costs; other runs remain
unchanged. Retry uses the original test snapshot, including after test deletion.
Older seeded records without snapshots resolve the current test definition for
the new attempt and explicitly retain null historical agent/test snapshots;
they fail if the needed definition is missing. Deleted agents cannot run or
retry tests; existing history remains readable. Renaming an invocation preserves
its attempts. List summaries reflect the latest run states, costs and versions.

The named `completePendingTestInvocations` scenario explicitly marks pending runs
as passed with null credits and price. Context callers may supply explicit passed
or failed synthetic outcomes and nonnegative synthetic costs through `complete`.
Only pending runs can complete. Cancel changes only pending runs. Repeated runs
are grouped by test/node and assigned local status, using scenario-owned labels;
these groups contain no inferred assessment. Resubmitting a run updates those
groups and removes its old price from the current summary while retaining it in
attempt history.

Scenario defaults limit a request to 100 total runs and repeat counts from 1 to
10. Names are limited to 140 characters. Unsupported agent override settings fail
through the existing agent validator. All request validation happens before IDs,
clocks or records change. Startup/reset replaces canonical maps and restores
fixtures, ID allocation, limits and the synthetic clock; live accessors follow
those replacements.

No actual test execution, model evaluation, provider requests, network access or
billing occurs. A pending response alone does not imply a test passed.
