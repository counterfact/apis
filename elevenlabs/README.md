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
the stateful voices implementation. The remaining 415 operations retain their
generated random responses. This simulator does not synthesize speech.

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
`next_page_token`, `gender`, `age`, `accent`, `language`, `use_cases`, and
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
