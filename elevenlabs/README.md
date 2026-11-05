# ElevenLabs API simulator

Multi-version Counterfact simulator generated from the official
[ElevenLabs OpenAPI spec](https://api.elevenlabs.io/openapi.json).

## Run

Requires Node.js 22.22 or newer. Counterfact is pinned to 3.1.0.

```sh
cd elevenlabs
npm ci
npm start
```

The API listens at http://localhost:3100. Use `npm run serve` without the REPL.
The simulator uses local specs and does not need an ElevenLabs account or API key.

## Versions and generation

`counterfact.yaml` configures two versions in the same `api` group:

| Version | Local contract    | URL prefix | Paths | Operations |
| ------- | ----------------- | ---------- | ----- | ---------- |
| v1      | `openapi.v1.yaml` | `/v1`      | 329   | 436        |
| v2      | `openapi.v2.yaml` | `/v2`      | 1     | 1          |

Version prefixes are removed from the contract paths and supplied by the config.
Each contract retains the upstream components and declares its version in
`info.version` and its upstream prefix in `servers`. The unversioned `/docs`
redirect is excluded. `openapi.provenance.json` records the original source hash,
per-file hashes, operation counts, and exclusion.

The versions share generated handlers under `api/routes`, shared context and
scenarios, version-specific schemas under `api/types/v1` and `api/types/v2`,
and combined route types. The generation baseline is committed separately from
the stateful voices implementation. Of 437 operations, 104 now have authored
behavior. The remaining 333 operations retain their generated random responses. This simulator does not synthesize speech.

Swagger UI is at http://localhost:3100/counterfact/swagger/api/?version=v1
and http://localhost:3100/counterfact/swagger/api/?version=v2.

## Stateful voices

Two fictional voices, `sim-narrator` and `sim-assistant`, share in-memory state
across both API versions. Seed data and baseline restoration are defined in
`api/scenarios/index.ts`; contexts start with empty state containers.

| Method | Path                                  | Behavior                                               |
| ------ | ------------------------------------- | ------------------------------------------------------ |
| GET    | `/v1/voices`                          | List current voices and settings                       |
| GET    | `/v2/voices`                          | Search, filter, sort, and paginate the same collection |
| GET    | `/v1/voices/{voice_id}`               | Read a voice and its current settings                  |
| DELETE | `/v1/voices/{voice_id}`               | Remove a voice from both lists                         |
| GET    | `/v1/voices/settings/default`         | Read fixed default settings                            |
| GET    | `/v1/voices/{voice_id}/settings`      | Read a voice's current settings                        |
| POST   | `/v1/voices/{voice_id}/settings/edit` | Persist settings changes                               |

```sh
curl -X POST http://localhost:3100/v1/voices/sim-narrator/settings/edit \
  -H 'Content-Type: application/json' \
  -d '{"stability":0.3,"speed":1.1}'

curl 'http://localhost:3100/v2/voices?page_size=1&search=narration'
```

V2 supports `search` (name, description, category, and labels), `category`,
`sort` (`name` or `created_at_unix`), `sort_direction`, `page_size` (1–100),
`next_page_token`, `gender`, `age`, `accent`, `language`, `use_cases`, `collection_id`, and
`voice_ids` (at most 100 IDs). Tokens are local integer offsets. Other V2 filters
return HTTP 400 rather than being silently ignored. `total_count` is always
returned, as required by the snapshot's response schema; `include_total_count`
is accepted. A page beyond the end returns an empty list and a null token.

Label filters read `labels.gender`, `labels.age`, `labels.accent`,
`labels.language`, and `labels.use_case`. They use exact, case-sensitive values
as a local simulator convention; the contract does not specify case handling.
Multiple languages or use cases match any supplied value. Different filters
combine with AND before sorting and pagination. Voices missing a requested
label do not match, even if `verified_languages` contains that language.
Unknown voice IDs are omitted and repeated IDs do not duplicate results.
Omitted/null arrays leave the filter inactive; empty arrays match no voices.

Send array values as repeated query parameters:

```sh
curl 'http://localhost:3100/v2/voices?language=en&language=es&use_cases=narration'
curl 'http://localhost:3100/v2/voices?voice_ids=sim-narrator&voice_ids=sim-assistant'
```

The optional `voiceDiscovery` scenario adds a Spanish narrator and a voice
without discovery labels to the current collection. It replaces its own two
fixtures and leaves other voices alone; `reset` removes these extra fixtures. In programmatic use, call
`app.scenario("voiceDiscovery", "api")`.

Settings edits preserve omitted and null values and leave defaults and other
voices unchanged. Missing voices return HTTP 404 with
`detail.status: "voice_not_found"`. Invalid bodies return HTTP 400 through
Counterfact's request validation. These error and partial-update conventions
are local simulator behavior. Authentication and other ElevenLabs business
rules are not implemented.

Restart or run `.scenario reset` to restore the fixtures. In programmatic use,
call `app.scenario("reset", "api")`. All callers share state; it is not persisted.

## Voice collections

Seven collection operations now persist state: `GET`/`POST /v1/voices/collections`,
`GET`/`PATCH`/`DELETE /v1/voices/collections/{collection_id}`, and
`POST`/`DELETE /v1/voices/collections/{collection_id}/voice/{voice_id}`.
Lists sort by title with collection ID as a tie-breaker. Creation returns admin
metadata with IDs `sim-collection-created-1`, then increasing suffixes.
PATCH preserves omitted/null fields; an empty object is a no-op.

Membership is stored on the canonical voice's `collection_ids`, visible through
V1 voice list/detail and V2 voice reads. V2 `collection_id` filtering combines
with other supported filters before sorting and pagination; an unknown collection
matches no voices. Adding a member twice succeeds without duplicates. Removing a
nonmember succeeds without changes. Deleting a collection clears its memberships
and preserves voices. Deleting a voice preserves collection metadata.
Missing collections or voices return HTTP 404 with `detail.status` set to
`collection_not_found` or `voice_not_found`; collection lookup takes precedence.
Malformed bodies return HTTP 400 without changing state.

Startup and `reset` populate `sim-collection` (Simulator Favorites) with
`sim-narrator` and restore the creation counter in `api/scenarios/collections.ts`.
Run `.scenario emptyCollections` (or `app.scenario("emptyCollections", "api")`)
to clear collections, memberships, and the counter. Each simulator instance is
isolated. Metadata reads return defensive copies. Collection business logic
lives in `api/routes/voices/collections/_.context.ts`; scenarios wire a live
root-voice accessor so replacing the voice map during reset is safe.
These null-update, sorting, ID, error, and nonmember-removal rules are local
conventions. Authentication and permission enforcement are not simulated.

## Model discovery

`GET /v1/models` returns a stable two-model catalog containing
`eleven_multilingual_v2` and `eleven_flash_v2_5`. Voice fixtures reference an ID
in this catalog. Responses include capabilities, languages, request limits,
and rate fields, with defensive copies of the stored model data.

Catalog values are synthetic local fixtures, including limits and rates; they
are not current ElevenLabs product or pricing claims. This simulator does not
synthesize audio or charge for requests. Authentication is not enforced.

Startup and `reset` populate the catalog from `api/scenarios/models.ts`.
Run `.scenario emptyModels` (or `app.scenario("emptyModels", "api")`) to return
an empty catalog for model-picker testing. Run `reset` to restore both catalog
and voice fixtures. Voice changes do not change the model catalog.

Voice metadata editing remains generated. Its contract requires multipart form
data, which the pinned Counterfact runtime's default body parser does not
parse. That operation needs [runtime multipart support](https://github.com/counterfact/api-simulator/issues/2607)
before it can be simulated faithfully.

## Speech history

`GET /v1/history` returns two synthetic historical metadata items, newest first.
`GET /v1/history/{history_item_id}` reads an item; `DELETE` on the same path
removes it from subsequent reads and history lists. Missing or already deleted
items return HTTP 404 with `detail.status: "history_item_not_found"`, a local
simulator convention. Deleting history does not change voices, models, or quota.
Deleting a voice leaves its historical metadata intact. Run `reset` to restore
deleted history items.
These fixtures do not represent generated audio; audio retrieval remains generated.
Startup and `reset` populate `api/scenarios/history.ts`. Run `.scenario emptyHistory`
(or `app.scenario("emptyHistory", "api")`) to exercise an empty collection.

Listing supports `page_size` (1–1000, default 100),
`start_after_history_item_id`, `voice_id`, `model_id`, `source`, `search`,
`date_before_unix` (exclusive), `date_after_unix` (inclusive), and
`sort_direction` (`asc` or `desc`, default `desc`). Filters combine with AND;
search is a case-insensitive substring of the stored text, a local convention.
Equal timestamps sort by history ID in the same direction for stable pagination.
The cursor identifies a record in the complete sorted collection before filtering;
unknown cursors return HTTP 400. Invalid page sizes also return HTTP 400.
The final returned item's ID and timestamp populate `last_history_item_id` and
`scanned_until`; empty pages return null for both. Responses are defensive copies.

## Account and subscription discovery

`GET /v1/user` returns the fictional `sim-user` in `sim-workspace`.
`GET /v1/user/subscription` returns the same quota and plan fields plus extended
subscription fields, including an empty invoice list. Both responses read shared
in-memory account state and return defensive copies. The profile's embedded
subscription omits the extended invoice and promotion fields.

Startup and `reset` populate the identity and subscription in
`api/scenarios/account.ts`. Run `.scenario quotaExhausted` (or
`app.scenario("quotaExhausted", "api")`) to set character usage to the limit in
both endpoints. Run `reset` to restore baseline usage, voices, and models.

As a local convention, every current simulator voice occupies one voice slot:
deleting a voice or running `voiceDiscovery` changes `voice_slots_used` in both
account responses. Other counters and limits are synthetic fixtures. Quota
exhaustion only changes account data; it does not enforce limits on other
operations. The fixed creation and reset timestamps do not advance with time.
These fixtures do not represent ElevenLabs plans, prices, or billing behavior.
Authentication, billing, and audio generation are not simulated.

The shared runtime currently dispatches V1-only handlers through the V2 prefix
too (for example, `/v2/user`), even though those paths are absent from the V2
contract. Use the documented V1 paths for account and model discovery; contract
selection does not currently enforce route availability by version.

## Pronunciation dictionary browsing

`GET /v1/pronunciation-dictionaries` lists stable synthetic dictionary metadata.
`GET /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}` returns the
metadata and latest alias/phoneme rules. The baseline contains `sim-dictionary`
and `sim-dictionary-archived`; each retains a separate rules snapshot per version.
Responses are defensive copies. These rules are fixtures, not speech processing.

The list supports `page_size` (1–100, default 30), `cursor`, `sort` (`name` or
`creation_time_unix`), `sort_direction` (`ascending` or `descending`, case
insensitive), and `include_archived` (default true). Numeric offset cursors and
ID tie-breaking are local conventions. Filtering and sorting precede pagination.
An offset beyond the end returns an empty page. Invalid cursors or sort options
return HTTP 400; unknown dictionary IDs return HTTP 404 with
`detail.status: "pronunciation_dictionary_not_found"`.

Fixtures live in `api/scenarios/dictionaries.ts`, and state/business operations
live in `api/routes/pronunciation-dictionaries/_.context.ts`. Startup and `reset`
populate this context. Run `.scenario emptyDictionaries` (or
`app.scenario("emptyDictionaries", "api")`) to clear it; `reset` restores it.
Other simulator instances and voice/model/history state remain isolated.
The collection handler uses the same documented context assertion as history.

`POST /v1/pronunciation-dictionaries/add-from-rules` creates a dictionary from
alias and phoneme rules. The returned ID and first version are persisted and
visible in list/detail responses. Empty rule lists are accepted; a rule's
`string_to_replace` must be non-empty. Malformed bodies return HTTP 400 without
creating a dictionary. Stored rules are isolated from caller edits.

Created dictionaries use `sim-dictionary-created-1`, then increasing numeric
suffixes, and a first version ending in `-v1`. Creator and fixed timestamp
defaults are populated by the dictionary scenario; creation timestamps advance
one second per allocated ID. `reset` removes created dictionaries and restores
the ID sequence. These are local simulator conventions. The fictional creator
has `admin` permission; `workspace_access` is accepted but sharing and permission
enforcement are not simulated.

`POST /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/add-rules`
adds alias or phoneme rules and replaces existing rules with the same
`string_to_replace`, as specified by the contract. Each successful request stores
a new version snapshot and updates the latest version and rule count in both
metadata and detail responses. Earlier snapshots remain unchanged.

Matching strings are exact and case-sensitive. When a request repeats a string,
the last rule wins; an empty rule list still creates a new version with the
current rules. These are local simulator conventions. Empty replacement strings
and malformed bodies return HTTP 400 without changing state; unknown IDs return
HTTP 404. `reset` restores the original versions and rules.

`POST /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/remove-rules`
removes rules whose `string_to_replace` exactly matches a supplied `rule_strings`
value. Matching is case-sensitive; repeated and unknown strings have no extra
effect. Each successful request creates a version, including an empty list or a
request that removes nothing. Removing every rule leaves an empty dictionary.
Latest metadata and detail responses reflect the resulting count; earlier
snapshots remain unchanged. Malformed bodies return HTTP 400 without changing
state, and unknown dictionary IDs return HTTP 404. `reset` restores the baseline.

`POST /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/set-rules`
replaces every current rule with the supplied `rules` array. An empty array
clears the dictionary. Each successful request creates a version and updates
the latest metadata and rule count while preserving earlier snapshots.
As a local convention, array order and duplicate replacement strings are
preserved, including for an unchanged rule list. Malformed bodies and empty
replacement strings return HTTP 400 without changing state; unknown dictionary
IDs return HTTP 404. `reset` restores the original rules and versions.

`PATCH /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}` updates
`name` and/or `archived` without changing rules, version IDs, or rule counts.
Omitted fields are preserved, and an empty object is a no-op. Archiving changes
the results of `include_archived=false`; renaming changes name-based sorting.
Unarchiving sets `archived_time_unix` to null. As a local convention, new archive
events use the fixed scenario-owned timestamp `1735689900`; repeated archiving
preserves an existing archive timestamp. Responses contain metadata without
rules and are isolated copies. Malformed bodies return HTTP 400 without changing
state, and unknown dictionary IDs return HTTP 404. `reset` restores metadata,
archive timestamps, and all rule versions.

`GET /v1/pronunciation-dictionaries/{dictionary_id}/{version_id}/download`
returns the requested version's alias and phoneme rules as XML PLS with the
contract's `text/plain` content type and a fixed attachment filename,
`pronunciation-dictionary.pls`. Older versions remain available after rule and
metadata edits; resetting removes versions created after startup. Unknown
dictionary or version IDs return HTTP 404. Empty versions return an empty
lexicon, and reads do not change state.

XML text and attributes are escaped, and versions containing characters forbidden
by XML 1.0 return HTTP 400. As local export conventions, the lexicon declares
`en-US` and a default `ipa` alphabet; phoneme rules retain their own alphabet.
Rule order and duplicates are preserved. Matching flags (`case_sensitive` and
`word_boundaries`) have no PLS representation here and are omitted from the
export. This simulator does not apply pronunciation rules to speech.

## Workspace usage analytics

`POST /v1/workspace/analytics/query/usage-by-product-over-time` returns synthetic
credit usage from a separate ledger in `api/routes/workspace/analytics/_.context.ts`.
Startup and `reset` populate that ledger in `api/scenarios/usage.ts`; the two
fixtures total 1,000 credits on January 1, 2025 UTC. Run `.scenario emptyUsage`
(or `app.scenario("emptyUsage", "api")`) to clear it, then `reset` to restore it.
History or voice deletion does not remove ledger entries. `quotaExhausted`
changes account quota data without changing this synthetic usage report.

Supply integer millisecond `start_time` and `end_time` values from 2020 onward,
with start before end. The window includes start and excludes end. Supported
`interval_seconds` values are 60 (default), 3600, and 86400, aligned to UTC
minute, hour, or day boundaries. Only `time_zone: "UTC"` is supported.
Omitted/null `group_by` defaults to `["product_type"]`; an empty list aggregates
all products. Supported distinct grouping fields are `product_type`, `model`,
`voice_id`, and `user_id`. Nonempty filters, unsupported groups, time zones,
and intervals return HTTP 400 rather than being ignored.

As local table conventions, columns are `time`, the requested grouping fields
in their supplied order, and `credits`. Their types are `DateTime`, `String`
for each group, and `Float`, with units `ms`, null for groups, and `credits`.
Rows are ordered by bucket time then grouping values. Only occupied buckets
are returned; empty windows have no rows. Bucket times can precede an unaligned
window start, but only ledger entries inside the window contribute. The
simulator does not calculate invoices, enforce billing, or append display-name
columns. Values and product labels are local fixtures, not pricing claims.

```sh
curl -X POST http://localhost:3100/v1/workspace/analytics/query/usage-by-product-over-time \
  -H 'Content-Type: application/json' \
  -d '{"start_time":1735689600000,"end_time":1735776000000,"interval_seconds":86400}'
```

## Workspace webhook configuration

Four operations persist webhook configuration: `GET`/`POST /v1/workspace/webhooks`
and `PATCH`/`DELETE /v1/workspace/webhooks/{webhook_id}`. Creation accepts the
contract's HMAC settings and returns a synthetic ID and secret. IDs start at
`sim-webhook-created-1`; creation timestamps advance from the fixed scenario
baseline by one second per allocated ID. Lists preserve insertion order and
never expose secrets, request headers, or retry settings. `include_usages=true`
adds usage and event arrays; otherwise both fields are omitted.

PATCH requires `name` and `is_disabled`. Omitted/null optional fields preserve
their values; empty `events` and `request_headers` clear those configurations.
Event arrays replace previous subscriptions. Missing IDs return HTTP 404 with
`detail.status: "webhook_not_found"`; malformed request bodies return HTTP 400
without changing state. These null, ID, timestamp, ordering, and error rules are
local conventions. Configuration reads return defensive copies.

Startup and `reset` load one fictional `sim-webhook` from
`api/scenarios/webhooks.ts` and restore the creation counter. Run
`.scenario emptyWebhooks` (or `app.scenario("emptyWebhooks", "api")`) to clear
webhooks and the counter. Instances have isolated state. Business operations
live in `api/routes/workspace/webhooks/_.context.ts`; the root stays unchanged.
The simulator stores configuration only: it makes no callback requests, checks
no remote URLs, and simulates neither delivery, signing, retries, automatic
disabling, authentication, nor admin permissions. Secrets are predictable test
values.

## Workspace auth connection configuration

Four operations store local auth connections: `GET`/`POST
`/v1/workspace/auth-connections` and `PATCH`/`DELETE
`/v1/workspace/auth-connections/{auth_connection_id}`. Supported types are
`basic_auth`, `bearer_auth`, and `oauth2_client_credentials`; other credential
families return HTTP 400. An omitted creation `auth_type` is inferred only when
one complete supported request shape matches. Responses always include the
inferred discriminator. Mixed family fields and unknown fields return HTTP 400.

Responses explicitly project the contract's public fields and omit passwords,
bearer tokens, and client secrets. OAuth public configuration includes scopes,
extra parameters, custom headers, and the Basic Auth header flag. Lists preserve
insertion order; this contract defines no list filters or pagination. Status is
always `active`, a local configuration default rather than credential verification.

PATCH preserves omitted/null fields and accepts empty arrays/maps to clear OAuth
options. It cannot change the credential family. Name, status, and token URL are
not PATCH fields in this snapshot and return HTTP 400. An empty object is a no-op.
Missing IDs return HTTP 404 with `detail.status: "auth_connection_not_found"`;
invalid changes return HTTP 400 without altering state or consuming creation IDs.
These validation, null, ordering, status, and error rules are local conventions.

Startup and `reset` populate one fictional `sim-auth-connection` and restore the
creation counter in `api/scenarios/auth-connections.ts`. IDs start at
`sim-auth-connection-created-1`. Run `.scenario emptyAuthConnections` (or
`app.scenario("emptyAuthConnections", "api")`) to clear this configuration and
counter; `reset` restores the baseline. Responses are defensive copies and
instances are isolated. State and business rules live in the separate
`api/routes/workspace/auth-connections/_.context.ts`; the root context is unchanged.
This is configuration storage only: no token requests, remote credential checks,
OAuth flows, authentication, or permission enforcement occur. Use synthetic
credentials only. Other credential types are intentionally unsupported.

## Conversation tags

Five operations persist workspace tags: `GET`/`POST /v1/convai/tags` and
`GET`/`PATCH`/`DELETE /v1/convai/tags/{tag_id}`. Lists return
`conversation_tags`, `has_more`, and `next_cursor`, ordered by creation time
newest first with tag ID as a tie-breaker. `page_size` defaults to 100 and
accepts integers from 1 through 100. Cursors are nonnegative integer offsets;
invalid cursors return HTTP 400. Offsets beyond the end return an empty page.
Pagination reflects current state rather than a snapshot.

Creation returns full metadata with IDs starting at `sim-tag-created-1`, a
fixed fictional workspace/owner, and timestamps advancing one second per
allocated ID. Duplicate titles are allowed, without trimming or case changes.
PATCH preserves omitted fields and null titles; explicit null clears the
description and an empty object is a no-op. Titles require 1–120 characters
and descriptions allow up to 1000. Missing IDs return HTTP 404 with
`detail.status: "tag_not_found"`; invalid requests return HTTP 400 without
mutating state or allocating IDs. Successful deletion returns an empty HTTP 204.
These IDs, duplicate-title, null, tie-breaker, cursor, and error rules are local
simulator conventions. Reads return defensive copies and instances are isolated.

Startup and `reset` populate one fictional `sim-tag` and restore metadata and
counters in `api/scenarios/tags.ts`. Run `.scenario emptyTags` (or
`app.scenario("emptyTags", "api")`) to clear tags and reset creation numbering.
Business rules live in `api/routes/convai/tags/_.context.ts`; the root context
is unchanged. Conversation assignment, ownership checks, authentication, and
permissions are not simulated. Stateful coverage is now 54 of 437 operations.

## Environment variable configuration

Five operations store environment variables: `GET`/`POST
`/v1/convai/environment-variables` and `GET`/`PATCH`/`DELETE
`/v1/convai/environment-variables/{env_var_id}`. String values must be nonempty;
secret and auth connection values store `secret_id` and `auth_connection_id`
references, respectively. Creation requires a production value and a unique,
case-sensitive label. A duplicate label returns HTTP 409. PATCH merges the
supplied environment values, preserves omitted values, and removes values set
to null, except production. Each value must match the stored variable type.
An empty values object is a no-op. Invalid requests return HTTP 400 atomically;
missing IDs return HTTP 404. Successful deletion returns empty HTTP 204.

Lists preserve insertion order and support exact `label`, `type`, and
`environment` filters combined before pagination. Environment filtering also
projects each values map to that environment. Page size defaults to 100 with
a 1–100 range. Cursors are nonnegative integer offsets; malformed cursors
return HTTP 400 and offsets beyond the end return an empty page. These ordering,
cursor, label comparison, and empty error-response rules are local conventions.

Startup and `reset` populate a fictional string variable in
`api/scenarios/environment-variables.ts`; `emptyEnvironmentVariables` clears
variables and resets allocation and metadata. IDs start at
`sim-environment-variable-created-1`. Creation timestamps advance from a fixed
scenario baseline; updates advance from a separate fixed baseline. Contexts
start empty, return defensive copies, and isolate instances. Business rules
live in `api/routes/convai/environment-variables/_.context.ts`; the root context
is unchanged, and the variable map is available for scenario-wired relationships.

This is reference configuration storage only. The simulator does not resolve
secrets, validate referenced auth connections or environment names, make network
requests, enforce permissions, or track variable usage by tools, agents, MCP
servers, or initiation webhooks. Deletion does not enforce those usage conflicts.
Use synthetic values and references only.

## Workspace environments

Three operations maintain the workspace environment registry: `GET`/`POST
`/v1/convai/environments` and `DELETE /v1/convai/environments/{environment}`.
Lists put production first, then preserve insertion order, and return defensive
copies. Creation requires a nonblank unique name; matching is case-sensitive
and accepted names are stored unchanged. Invalid bodies return empty HTTP 400;
duplicate names return empty HTTP 409. Failed requests do not change state or
advance the creation counter. These validation and ordering details are local
simulator conventions.

Production cannot be deleted (HTTP 400). Unknown names return HTTP 404.
Successful deletion returns empty HTTP 204 and removes only that environment's
values from every variable, including secret and auth connection references.
The live scenario-wired relationship follows variable map replacement by reset
or `emptyEnvironmentVariables`. Creating an environment does not populate
variable values; this registry does not resolve production fallback values.
Existing variable endpoints still accept names outside the registry.

Startup and `reset` populate production and staging in
`api/scenarios/environments.ts`. Run `.scenario productionEnvironmentOnly`
(or `app.scenario("productionEnvironmentOnly", "api")`) to keep production,
remove other environments and their variable values, and reset creation metadata.
`reset` restores both registry and variable fixtures. New environments use a
fictional `sim-user` creator and timestamps advancing one second from the fixed
scenario baseline; production omits its creator. Instances isolate state.
Business operations live in `api/routes/convai/environments/_.context.ts`;
the root context is unchanged. Authentication and permissions are not simulated.

## Conversation workspace settings

Four operations persist settings: `GET`/`PATCH /v1/convai/settings` and
`GET`/`PATCH /v1/convai/settings/dashboard`. PATCH preserves omitted fields;
an empty object is a no-op. Explicit null clears the initiation webhook,
embedding retention override, post-call webhook ID, or deprecated `send_audio`
value where the contract allows null. Null embedding retention means use the
system default of 30 days. Other fields reject null.

Nested `webhooks` patches merge individual fields. A supplied initiation webhook
replaces the whole object and requires both `url` and `request_headers`;
headers are replaced rather than merged. Event and chart arrays replace their
previous contents; empty arrays clear them. Charts accept the three contract
variants with explicit `type` values and at most four entries. Retention limits,
enums, and required nested fields follow the local contract. Invalid requests
return HTTP 400 atomically. Unknown fields are rejected at every fixed object
level. Merge, replacement, unknown-field, explicit chart-type, and error rules
are local conventions because the snapshot does not fully specify PATCH behavior.

Startup and `reset` populate both sections in `api/scenarios/settings.ts`.
Run `.scenario alternateSettings` (or `app.scenario("alternateSettings", "api")`)
for static LiveKit, alternate retention/webhook options, and no dashboard charts.
Reads and update responses are defensive copies. Instances isolate state and
each section changes independently. The context starts empty and lives in
`api/routes/convai/settings/_.context.ts`; the root context is unchanged.
This stores configuration only: no callbacks, network connections, webhook or
secret reference resolution, MCP enablement, LiveKit connections, retention jobs,
authentication, or permission checks occur.

## Workspace secrets

Six `/v1/convai/secrets` operations store synthetic configuration: POST/GET the
collection, GET/PATCH/DELETE a secret, and GET its dependencies by resource type.
POST requires `type: "new"`, a nonblank name, and a nonempty value. PATCH requires
`type: "update"`, name, and value; it replaces both fields atomically. Unknown
fields, including permission changes, return 400. Names need not be unique.
POST/PATCH return only `type`, `secret_id`, and `name`; GET/list add `used_by`.
Secret values stay in local memory and never appear in response projections.
No encryption, credential validation, permission enforcement, or external calls
are simulated. Use fictional values only.

Listing uses case-sensitive name prefixes, insertion order, and local integer
offset cursors. Without `page_size`, it returns all matches; explicit page sizes
and `dependency_limit` must be integers from 1–100. Dependency lists paginate
`tools`, `agents`, or `phone_numbers`, defaulting to 100 per page. Previews expose
per-type `*_has_more` flags. Missing secrets return 404; deletion returns 409
while dependency configuration or canonical secret environment-variable values
reference the secret, otherwise 204. Invalid inputs return 400 without mutation.

Startup/reset seed one fictional secret and one `unknown` tool reference in
`api/scenarios/secrets.ts`. This is a scenario-owned dependency configuration,
not a claim that a tool exists or a permission lookup succeeded. Agent and phone
secret dependencies start empty and remain scenario-owned; phone endpoints are
still generated. Agent configuration storage is described below. Canonical
environment-variable references protect deletion but cannot appear in dependency
responses because the contract has no environment-variable identifier variant.
Run `.scenario emptySecrets` to clear this group's records and counters; `reset`
restores the baseline. Contexts start empty and isolate instances. A new nested
secrets context holds this bounded slice; no root-context refactor was needed.

The installed Dispatcher leaves nullable `anyOf(integer, null)` query values as
text ([upstream #2612](https://github.com/counterfact/api-simulator/issues/2612)). The collection route converts only decimal integer text before applying
range checks. This narrow boundary conversion targets the installed runtime;
contracts and generated bindings remain unchanged.

## Agent configuration discovery and duplication

Five operations maintain a bounded agent configuration registry: `GET
/v1/convai/agents`, `GET`/`DELETE /v1/convai/agents/{agent_id}`, `GET
/v1/convai/agents/summaries`, and `POST /v1/convai/agents/{agent_id}/duplicate`.
Startup and `reset` restore fictional `sim-agent` in `api/scenarios/agents.ts`.
`emptyAgents` clears agents, allocation counters and mutation timestamps while
restoring scenario-owned defaults. Contexts start empty and isolate instances.
Reads return defensive copies. The canonical `agents` map stores each
`configuration` and `creatorUserId`, so later domains can derive actual references.
The small root context remains unchanged; a nested agents context owns this slice.

Lists support case-insensitive name substring search, exact archived status,
creator IDs (`@me` means the fictional `sim-user`), ownership, and matching any
supplied tag. A creator filter takes precedence over ownership. Omitted archived
status includes both states. Sorting supports `name`, `created_at` (default), and
`updated_at`, descending by default with ascending agent-ID ties. `call_count_7d`
is unsupported (400). Filtering precedes pagination; page size defaults to 30
and accepts 1–100. Cursors are decimal nonnegative integer offsets; offsets beyond
the end yield empty pages. Invalid queries return 400. The route normalizes the
installed runtime's nullable boolean text and singleton query array values.

Summaries derive names, voice IDs, tags, archive status, access info and timestamps
from current stored configuration. Supply 1–100 agent IDs; missing IDs return a
per-ID failure with `error_code: 404`, alongside successful summaries. No calls
have occurred, so `last_call_time_unix_secs` is null. Duplicate copies the entire
supported configuration and tags independently, defaults its name to the source
name plus ` (copy)`, and assigns a fresh ID, creator/access metadata and time.
New IDs are `sim-agent-created-N`; timestamps advance one second per successful
creation or effective internal update from the fixed scenario baseline. Invalid
duplicate names do not allocate IDs. Deletion returns empty 204; missing agents
return 404. `force=true`, branch/version selectors, and requests for generated
workflow elements return 400. There are no subagent cleanup or branch semantics.

The directly tested context helpers also support bounded configuration creation
and partial updates for duplication and REPL use. Supported fields are name,
tags, `conversation_config.agent.first_message`, `language`, and prompt fields
`prompt`, `llm`, `temperature`, `max_tokens`, `tool_ids`, `tools`; TTS accepts
`voice_id`, and platform settings accept `archived`. The supported LLM names are
`gemini-3.5-flash`, `gemini-2.5-flash`, `gpt-4o`, and `gpt-4o-mini`. Inline tools
accept only client configuration with explicit `type: "client"`, name,
description, optional `expects_response`, and `response_timeout_secs` (1–120,
or -1 when expecting a response). Other fields, workflow and procedures are
rejected. Partial updates merge nested fixed objects; arrays replace, including
empty arrays. Top-level null name/tags/config/platform fields preserve existing
values; nested temperature null is stored. Empty or unchanged updates preserve
timestamps. IDs, defaults, merge/null rules, cursor ordering and errors are local
simulator conventions. No LLM, tool, audio, network, permission or reference
resolution behavior is performed. Configured tool IDs need not exist.

HTTP agent creation and PATCH remain generated and are not counted as authored
behavior. Their recursive request schemas crash the installed runtime's AJV
validation before the handler executes, even for finite minimal bodies
([upstream #2613](https://github.com/counterfact/api-simulator/issues/2613)).
Request validation stays enabled; contracts remain unchanged and bindings are
regenerated normally.
Use startup/reset fixtures and duplication for the supported HTTP lifecycle.
Agent workflows, versions, deployment and execution endpoints remain generated.

## Tool configuration and execution history

Five operations now read and delete tool configuration: `GET /v1/convai/tools`,
`GET`/`DELETE /v1/convai/tools/{tool_id}`, and `GET` on the tool's
`dependent-agents` and `executions` subpaths. Startup and `reset` seed a fictional
`sim-tool` client tool (`display_help`) and two synthetic historical execution
records in `api/scenarios/tools.ts`. These are stored configuration and history:
no tool calls, client events, callbacks, conversations, or network requests occur.
Usage statistics are fixed fixture metadata, not counters updated by reads.

Tool lists support case-sensitive name prefix search, creator (`@me` means
`sim-user`), ownership, type and agent-reference filters. Creator takes precedence
over ownership. Type arrays match any requested type. Agent-reference filters
and dependent-agent reads derive current canonical
`conversation_config.agent.prompt.tool_ids`; deleting or duplicating an agent
changes the results immediately. Inline tools do not create tool-ID dependencies.
Workflows, procedures, branches, permission lookups and environment-variable
resolution are not simulated. The detail endpoint accepts `environment` but the
client fixture has no environment-dependent values to resolve.

Lists sort by `created_at` descending by default or `name`, with `asc`/`desc`
direction and ascending tool-ID ties. Dependents sort by agent ID. Execution
history sorts newest first with ascending execution-ID ties, and supports exact
`is_error`, `agent_id`, `branch_id` and inclusive `start_time`/`end_time` filters.
Historical agent IDs remain after an agent is deleted. All lists filter before
pagination, default to 30 records, and accept page sizes from 1–100. Cursors are
nonnegative decimal offsets; invalid cursors return 400 and offsets beyond the
end produce empty pages. Invalid filters and reversed time bounds return 400.
The installed runtime's nullable query text is normalized only for tool list
`page_size` and execution `is_error`, `start_time`, and `end_time`.

Missing tools return 404. Deletion returns 409 while canonical agents reference
the tool. `force=true` returns 400 because branch cleanup is outside this slice.
Successful deletion returns 200 with `{}` and removes only that tool and its
execution records; agents and other tools remain unchanged. Deletion protection,
errors, ordering, cursors and fixed metadata are local simulator conventions.
Authentication and permissions are not enforced.

`emptyTools` clears this group's tool map and execution ledger; `reset` restores
them. `toolDiscovery` adds a second client tool and assigns `sim-tool` to the
existing baseline agent, without creating an agent. These scenarios own all
fixtures and metadata; there are no creation or mutation counters in this read
and delete slice. The nested context starts empty, returns defensive copies,
and uses a live scenario-wired accessor so agent map replacement is reflected.
Instances isolate state. The small root context remains unchanged.

Tool POST and PATCH retain generated behavior and are not counted as authored
operations: their recursive request schemas share the installed validation
blocker [#2613](https://github.com/counterfact/api-simulator/issues/2613).
Validation remains enabled and bindings are generated normally. Use startup,
reset and named fixtures for configuration setup.

## Workspace groups

| Method | Path | Behavior |
| ------ | ---- | -------- |
| GET | `/v1/workspace/groups` | Read a group-ID keyed map of groups and member IDs |
| GET | `/v1/workspace/groups/search` | Find groups by a case-insensitive name substring |
| POST | `/v1/workspace/groups/{group_id}/members` | Add an existing synthetic workspace member |
| POST | `/v1/workspace/groups/{group_id}/members/remove` | Remove a member from a group |

Startup and reset seed two groups and an email-to-member-ID directory in
`api/scenarios/groups.ts`. Membership changes are visible in both group listing
and search results, which project member emails. Search trims the input; blank
or unmatched names return an empty list. Groups retain scenario insertion order.
Adding an existing member and removing an absent member are idempotent.
Missing groups or workspace members return 404; SCIM-frozen groups return 409.
Invalid emails or extra membership fields return 400. These are local simulator
conventions; authentication, authorization and external SCIM calls are not run.

`emptyGroups` clears groups and the member directory; `reset` restores both.
The nested context starts empty and returns defensive read copies. Each simulator
instance owns independent state. Group creation and deletion remain generated.

## Service accounts and API keys

Seven operations now persist synthetic service-account and key configuration:
`GET`/`POST /v1/service-accounts`, `GET`/`POST` on each account's `api-keys`,
`PATCH`/`DELETE` on a key, and `POST` on its `disable` subpath.
Startup and `reset` restore `sim-service-account` and its read-only fixture key
from `api/scenarios/service-accounts.ts`. `emptyServiceAccounts` clears all
accounts, keys, and ID counters. Contexts begin empty. Each instance is isolated.

Accounts list in insertion order and include their current keys. Creation
returns `service-account-user-id`; lists use `service_account_user_id`.
Accounts accept a nonempty name and optional default sharing groups. Groups
must exist, have a unique ID per request, and use admin/editor/viewer permission.
Shared group metadata is read live, including membership changes. The simulator
allows 20 accounts, returning 409 at the limit. IDs use increasing
`sim-service-account-created-N` and `sim-service-key-created-N` suffixes.

Key creation returns a clearly synthetic `xi-api-key` exactly once. Reads expose
only hints and synthetic hashes, plus configuration metadata; these keys cannot
authenticate to ElevenLabs. `permissions: "all"` reads back as null; an empty
array remains empty. Limits, IP allowlists, expiry and disable settings persist
without enforcing authentication, quotas, network access, expiry jobs or plan
entitlements. Bare IPv4/IPv6 addresses get /32 or /128 suffixes; supplied valid
CIDRs are preserved. Credit/concurrency limits must be nonnegative safe integers.

The installed runtime rejects an absent PATCH body despite its optional contract
([Counterfact #2614](https://github.com/counterfact/api-simulator/issues/2614));
send `{}` for a no-op. Request validation remains enabled.
PATCH preserves omitted fields and `no_update` values. Null names and nullable
numeric limits preserve their values; `clear` removes numeric limits, IP
allowlists or expiry. `third_party_disable_allowed: "clear"` restores the local
true default. `is_enabled` toggles `is_disabled`; disabling records
`self_disabled`, and enabling clears that reason. The disable endpoint is
idempotent. Updates validate the entire request before changing state.
Successful PATCH, DELETE and disable return 200 with `{}`. Missing accounts or
keys return 404, with account lookup taking precedence. Unknown fields and
invalid configurations return 400. Repeated deletion returns 404.

Expiry is validated against a scenario-owned fixed clock, 1735689600 (2025-01-01
UTC), accepting 15 minutes through 90 days ahead inclusively. Omitted/null
create expiry means never expires. Creation timestamps use this same clock.
ID allocation, frozen time, limits, defaults, null handling and errors are local
simulator conventions. Workspace downgrade and enterprise policy are not modeled.

## Phone-number configuration

Seven phone operations now share canonical configuration: import/list at
`/v1/convai/phone-numbers`, detail/PATCH/DELETE at its `/{phone_number_id}`
subpath, SIP-log reads at `/{phone_number_id}/sip-messages`, and the paginated
list at `/v1/convai/v2/phone-numbers` (this path belongs to the V1 contract).
The root context stays unchanged; a small V2 context forwards to the phone context.

Imports accept Twilio, Exotel and SIP-trunk configuration. Provider omission is
inferred from `sid` (Twilio), `account_sid` (Exotel), or otherwise SIP. The local
simulator requires nonempty labels and E.164-style numbers, rejects duplicate
numbers with 409, and allocates `sim-phone-created-N` IDs. Provider credentials
are accepted for schema-shaped requests but never returned or retained as secrets.
SIP credentials are projected to username and `has_auth_credentials`; supplying
a new password sets the flag, an omitted/null password preserves the existing
flag, and null credentials clear it. No authentication, network connections,
webhook setup, SMS, live calls, provider verification, or secret resolution occurs.
Twilio `region_config` is explicitly unsupported (400).

PATCH is atomic and supports label, agent assignment, environment/branch metadata,
and SIP trunk, stack, and message-storage configuration. Omitted fields preserve
state; null label/stack/message-storage fields preserve values; null agent unassigns
and clears its environment/branch; null environment/branch clears that metadata.
Null trunk configuration removes the trunk. A supplied trunk object replaces its
configuration using contract defaults, retaining the prior credential flag when
no new password is provided. SIP-only settings on non-SIP phones return 400.
Agent assignment requires an existing agent; list/detail resolve its current name
from canonical agent state, and a deleted agent projects as unassigned. Branch and
environment strings are stored metadata, without branch or environment lookup.

V1 list filters combine provider, assigned agent, and assigned branch. The paged
list adds case-insensitive label/phone substring filters, exact ID or label/phone
substring search, outbound capability filtering, and `label`/`phone_number` sorting.
IDs break sort ties in ascending order. The default sort is label ascending;
filters combine before pagination. Page sizes are 1–1000 (default 100), cursors
are decimal offsets, and offsets beyond the end produce an empty page. The nullable
outbound boolean uses the same narrow boundary normalization documented in
[Counterfact #2612](https://github.com/counterfact/api-simulator/issues/2612).

Startup and `reset` seed synthetic Twilio and SIP phones plus two historical SIP
messages in `api/scenarios/phone-numbers.ts`; `emptyPhoneNumbers` clears both
collections and the ID counter. Log pages sort newest first, accept 1–20 records
(default 20), and use decimal offset cursors. Imports create no logs; message-storage
settings do not erase historical fixtures. Deletion removes the phone and its
logs, preserving agents. Missing phones return 404. Responses are defensive copies
and instances isolate state. Error codes, IDs, pagination and the above metadata
and update conventions are local simulator behavior.

## Conversation records

Nine conversation operations now use synthetic historical records: list, resolve,
detail, delete, lightweight summary, SIP-message history, feedback, tag assignment
and tag removal. Startup/reset seed `sim-conversation` and `sim-conversation-old`
in `api/scenarios/conversations.ts`; `emptyConversations` clears these records,
reference mappings, and SIP logs. Contexts initialize empty. Restart/reset restores
all baseline state; simulator instances isolate changes. These are stored records,
without running conversations, calls, analysis, or audio generation.

Lists sort by start time (descending by default, ascending with `sort_direction`)
with ascending conversation-ID ties, then paginate with decimal-offset cursors.
Page sizes are 1–100, default 30. Supported filters include agent/user/branch/version,
visited agent/branch IDs, success, inclusive start-time and duration bounds, rating,
feedback-comment presence, language, termination reason, status exclusion, tags,
initiation source, text-only mode, product, and case-insensitive transcript substring
search. Arrays match any supplied value; different filters combine with AND.
Empty inclusion arrays match no records; empty status exclusions exclude nothing.
`summary_mode=include` returns stored title/summary;
default list results omit them. Advanced evaluation, data-collection, dynamic-variable,
tool, topic, parent-conversation, guardrail and workflow filters return 400.
`include_invalid_tool_calls=true` and `format=opentelemetry` also return 400.
The installed runtime's nullable numeric/boolean queries and single array query
values are normalized strictly at this group's boundary; invalid values return 400
([nullable scalars #2612](https://github.com/counterfact/api-simulator/issues/2612),
[single arrays #2615](https://github.com/counterfact/api-simulator/issues/2615)).

Detail, list and summary derive from the same record; deleting an agent preserves
historical agent IDs and names. Summary returns plain role/message pairs and omits
tool-only and contextual-update turns. When plain-message count exceeds
`max_messages` (1–200, default 40), messages are null and `messages_omitted` is true.
SIP logs paginate newest first (1–20, default 20); they are independent synthetic
historical fixtures. Resolution accepts HTTPS Slack message/Zendesk ticket URLs
and looks them up with the supplied historical agent ID in scenario-owned mappings.
The baseline maps `https://simulator.zendesk.com/agent/tickets/12345` and
`https://simulator.slack.com/archives/C123/p1735689602000000` to `sim-conversation`
for `sim-agent`. It makes no external lookup or undocumented ID-hashing claim.
Unmapped valid references return 404; malformed/unsupported references return 400.

Feedback stores `like`/`dislike` as one current thumbs vote, so repeated votes do
not accumulate counts. Explicit null clears that vote; omitted feedback preserves
it. Tag assignment validates every ID against the live canonical workspace tag
collection before mutation and ignores duplicate assignments. Removing an absent
assignment succeeds. Deleted tags disappear from conversation projections and list
filtering; resetting the tag map is reflected immediately. Both tag mutations
return 204 without a body. Deleting a conversation removes its SIP logs and
reference mappings, and subsequent operations return 404. Errors, pagination,
filter bounds, current-vote semantics, reference mappings and ordering are local
simulator conventions. Authentication/permissions are not enforced.

## Realtime conversation groups

Seven operations manage fictional realtime group metadata: GET/POST
`/v1/convai/realtime/conversation-groups`, GET/PATCH/DELETE on
`/{conversation_group_id}`, and PUT/DELETE
`/v1/convai/realtime/conversations/{conversation_id}/conversation-group`.
Titles are trimmed and repeated whitespace collapsed; names are unique ignoring
case and whitespace, with a 64-character limit. Descriptions allow 500 characters.
PATCH preserves omitted fields, preserves a null title, and clears a null description.
Conflicting titles return 409; invalid input returns 400 without mutation.
Missing groups or realtime conversation identities return 404.

Lists search title/description case-insensitively, sort newest first with ascending
ID ties, and paginate using decimal-offset cursors (1–100 records, default 100).
Responses are defensive copies. Creation uses `sim-realtime-group-created-N` IDs
and fixed synthetic timestamps. These ordering, ID, error and null-title rules are
local conventions. Authentication, permissions and sharing changes are not simulated;
new groups have creator/admin metadata and no additional sharing.

Startup/reset seed `sim-realtime-group`, `sim-realtime-group-old`, and two separate
known realtime identities: `sim-realtime-conversation` (initially in the first group)
and `sim-realtime-conversation-ungrouped`. These are synthetic identity fixtures,
separate from historical agent conversation records; no live realtime session is
started. Assignment replaces the previous group; clearing is idempotent. Deleting
a group clears all of its memberships while preserving conversation identities.
The contract exposes no realtime membership-read endpoint; internal state tests
verify these transitions directly. `emptyRealtimeGroups` clears groups and known
realtime identities; reset restores both and the creation counter. State is isolated
per simulator instance. Fixtures live in `api/scenarios/realtime-groups.ts` and
business logic in `api/routes/convai/realtime/_.context.ts`.

## Development

```sh
npm run generate
npm run typecheck
npm test
```

Generation reads both local contracts and preserves authored handlers.
History state and operations live in `api/routes/history/_.context.ts`; the root
context owns voices, models, and account data. History scenarios load their own
context with `$.loadContext("/history")`, and `reset` orchestrates all route contexts.
`test-support/scenarios.ts` discovers real context classes for direct tests, so
new route contexts participate in scenario setup without custom test registries.

The generator currently types a collection handler such as `routes/history.ts`
using its parent directory's context, while the runtime resolves `/history` to
the nested history context. That handler uses an explicit context type assertion
at this boundary. Descendant handler types and scenario context overloads are
regenerated from the local configuration; generated files are not edited by hand.

Tests verify spec provenance, version routing, and shared voice behavior over
Counterfact’s Dispatcher, plus context state transitions, model catalog isolation,
account quota and voice-slot consistency, and listing rules directly.
`test-support/dispatcher.ts` loads the actual route, context, and scenario modules
using Counterfact's public runtime exports. It reads both configured contracts,
runs `startup`, shares state across V1/V2, and exposes `request(path, options)`
and `scenario(name, "api")`. Each harness instance has isolated state. No port,
file watcher, or cleanup step is needed.

Requests support `method`, `headers`, and JSON string `body` options, with
repeated query parameters preserved. Other Fetch options are not simulated.
Responses expose the standard `Response` status, headers, `json()`, and `text()`
interfaces. Unsupported body formats and streaming responses fail explicitly.

These are Dispatcher integration tests: routing, parameter conversion, handler
execution, content negotiation, and request/response validation run in the real
runtime. This project assumes Counterfact's transport and body parsing work
correctly; the harness does not test those layers. Scenario route-client helpers
are unsupported; scenarios here initialize or change context directly.

For the discovery slice, Jev checked the public contract's natural-language
filter descriptions. It supported matching any supplied language/use case and
using labels, and found no stated case-insensitive rule. Those readings were
reviewed against the contract and implemented with deterministic code and
tests. The [exact request](../scripts/typesafe/requests/elevenlabs-voice-filters.json)
and [returned judgments](../scripts/typesafe/results/elevenlabs-voice-filters.json)
are retained for review. Jev is not called by the simulator or its tests.

Some upstream paths have sibling wildcard parameters with different names
(agent branches, knowledge-base documents, pronunciation dictionaries, and
voice generation). Counterfact may report routing ambiguities in those areas.
