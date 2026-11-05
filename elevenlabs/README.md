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
the stateful voices implementation. Of 437 operations, 60 now have authored
behavior. The remaining 377 operations retain their generated random responses. This simulator does not synthesize speech.

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
dependencies start empty; their domain endpoints are still generated. Canonical
environment-variable references protect deletion but cannot appear in dependency
responses because the contract has no environment-variable identifier variant.
Run `.scenario emptySecrets` to clear this group's records and counters; `reset`
restores the baseline. Contexts start empty and isolate instances. A new nested
secrets context holds this bounded slice; no root-context refactor was needed.

The installed Dispatcher leaves nullable `anyOf(integer, null)` query values as
text ([upstream #2612](https://github.com/counterfact/api-simulator/issues/2612)). The collection route converts only decimal integer text before applying
range checks. This narrow boundary conversion targets the installed runtime;
contracts and generated bindings remain unchanged.

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
