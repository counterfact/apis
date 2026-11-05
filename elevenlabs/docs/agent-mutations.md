# Agent mutations

The V1 agent create, PATCH, branch-create and draft-create routes use the real
validated contracts. They store local configuration; they make no inference,
provider or network requests.

Creation starts a versioned main branch, an immutable initial version and an
active 100% main deployment. Scenario-owned defaults supply the synthetic
sim-narrator voice, eleven_v4_turbo model, gemini-3.5-flash prompt configuration
and an inert start workflow. The model is also present in model discovery.
Duplicating an agent creates an independent main/version/deployment and copies
published procedure versions into the duplicate's ownership.

PATCH selects main by default or the requested branch. It publishes the saved
agent draft when present, applies the supplied changes, creates an immutable
child version and clears the published branch's agent/procedure drafts. Feature
publication leaves main unchanged. Names, tags, archived status, basic agent
prompt settings and ordinary TTS voice/model/audio controls are supported.
Unsupported advanced configuration fails explicitly. Start/end workflows with
no edges are normalized and stored; workflow execution and generated elements
are unsupported. Voice/model checks read the current canonical catalog maps.

Agent drafts leave published and historical reads unchanged. Branch creation
copies the exact historical parent version; include_draft copies its source's
working procedure set only when the parent is the current tip. The source draft
is retained. A new branch's first version has an out-of-branch parent, while
publication records its previous tip as the in-branch parent.

Explicit PATCH procedures replace the map and validate published ownership and
folder references. Omitted/null procedures publish current local procedure edits,
or retain the saved configuration's refs when there are no edits. New published
procedure versions remain immutable; publication performs no content analysis or
compilation. All validation and detached preparation happen before counters,
versions, drafts or live configuration change.

State owners are AgentsContext.agents, BranchesContext.branches/versions/history/
drafts and ProceduresContext.versions/working. Scenario reset replaces maps and
restores counters/defaults. Cross-context accessors follow those replacements.
For ad-hoc consumers, AgentsContext.prepareConfiguration(base, input) returns a
detached Agent or undefined, including structural and live voice/model/procedure
reference validation, without publishing or changing counters. Lifecycle.select
continues to return published selections, excluding saved drafts.
