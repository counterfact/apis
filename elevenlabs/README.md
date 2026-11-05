# ElevenLabs API simulator

Multi-version Counterfact simulator generated from the official
[ElevenLabs OpenAPI spec](https://api.elevenlabs.io/openapi.json).

## Bounded speech fixtures

All four `POST /v1/text-to-speech/{voice_id}` variants (plain,
`with-timestamps`, `stream`, and `stream/with-timestamps`) and all four
`POST /v1/text-to-dialogue` variants return the same small synthetic silence
fixture. No speech synthesis, normalization, model inference, audio effects or
provider request runs. Stream paths return one complete bounded ordinary binary
or JSON response, with no incremental timing or event-framing simulation.
The pinned runtime's asynchronous stream formatter supports sequential JSON/event
media; raw asynchronous audio chunks are not used here.

Binary responses are `audio/mpeg`; timestamp responses contain matching base64
MP3 bytes, original/normalized character alignments and, for dialogue, voice
segments. The fixture has twenty 417-byte MPEG-1 Layer III frames: 8,340 bytes,
stereo, 44,100 Hz, nominal 128 kbps and 23,040 decoded sample frames (about
0.52245 seconds). Synthetic alignment divides this fixed duration evenly among
Unicode code points; dialogue concatenates inputs without separators, and segment
end indexes are exclusive. These timings describe local fixtures, not spoken words.

The synthetic frame source is populated in `api/scenarios/bounded-speech.ts`.
It was independently decoded with the public
[minimp3 decoder](https://github.com/lieff/minimp3) to 23,040 sample frames with
every stereo PCM sample zero. The MP3 SHA-256 is
`5a8c648164ba405f8ddd927c3fa307e83410cedcf2ada38d4b1b14b18d0c7856`;
the decoder header used for this one-time check had SHA-256
`1a213f9cb22f5e9dca83fae14597cb74943905ab4d5371f242d528b0c84ddb80`.
No decoder or platform tool is required by simulator runtime or normal tests.

Requests require existing canonical voices and a catalog model with text-to-speech
capability. Default models are `eleven_multilingual_v2` for TTS and `eleven_v3`
for dialogue; startup/reset include the latter synthetic catalog dependency.
Inputs must contain nonblank text, with at most 2,000 Unicode code points in total;
dialogue permits up to 100 lines and ten distinct voices. Only
`mp3_44100_128` output is supported. Nondefault synthesis, effects, continuity,
language, seed and settings options return 400, including normalization `on`/`off`.
Omitted/null options, empty locator/request-ID arrays and default false flags
leave fixture rendering unchanged; deprecated latency zero is accepted.

Each accepted request charges one fictional character-quota unit per Unicode code
point, regardless of model rates. Insufficient quota returns 429 before changing
IDs, usage or history. Successful requests return a `request-id` header and,
by default, a `history-item-id` header. Retained history includes immutable input,
voice/model/settings snapshots, alignments, usage bounds and copied fixture bytes.
Dialogue stores its voice/text pairs with null top-level text and voice fields.
`enable_logging=false` consumes quota but stores no history or audio and omits the
history header. No account tier or authentication is enforced. Other unsupported
options and missing voices/models fail before mutation.

Contexts start empty; startup/reset populate the fixture, counter and accessors.
Reset removes new renders and restores quota/catalog/history. History deletion
also removes its retained audio; deleting a voice preserves earlier history.
Instances isolate all state, and returned media/metadata are defensive copies.
These IDs, accounting, retention and error rules are local simulator conventions.

## Bounded sound-effect fixture

`POST /v1/sound-generation` returns one complete ordinary `audio/mpeg` response
containing the same independently decoded 8,340-byte silence fixture above.
It does not generate sound effects, infer a duration or run a model/provider.
Startup/reset append the synthetic `eleven_text_to_sound_v2` catalog dependency
with text-to-speech capability false. That is the only supported sound model;
`eleven_text_to_sound_v3` returns 400.

Text must be nonblank and contain at most 2,000 Unicode code points. Only
`mp3_44100_128`, nonlooping output, default prompt influence 0.3 and the fixture's
exact duration (`23040 / 44100` seconds) are supported. Omitted/null duration uses
that fixed duration, without interpreting the prompt. Other durations, looping,
nondefault influence and output formats return 400 before allocating an ID or
changing state. Missing catalog models return 404.

Each accepted request consumes one fictional character-quota unit per code point
and returns `character-cost` and `request-id` headers. Insufficient quota returns
429 without mutation. Retained input/model/duration/audio snapshots live in the
sound context's separate request map; speech history remains unchanged because
its source enum has no sound-effect entry. `enable_logging=false` still consumes
quota but stores no request/audio snapshot. Returned bytes are defensive copies.
These accounting, retention, IDs and errors are local simulator conventions,
not provider pricing or billing. Context containers start empty;
`api/scenarios/bounded-sound.ts` owns fixture/default/accessor/counter population
during startup/reset. Reset clears retained sound requests and restores quota.

## Voice preview design and saving

Five `/v1/text-to-voice` operations now share local preview state: deprecated
`POST /create-previews`, `POST /design`, `POST /{voice_id}/remix`, `POST` on the
collection to save a preview, and `GET /{generated_voice_id}/stream` to retrieve
its audio. Each preview operation creates three distinct IDs with copied versions
of the independently decoded silence fixture described above. It does not design,
remix, enhance, synthesize or analyze a voice, and makes no provider request.
The source voice must exist for remixing; its audio and metadata remain unchanged.

Descriptions follow the contract's 20–1,000 character bounds (5–1,000 for remix).
Text has 100–1,000 Unicode code points. Omitted/null text uses a fixed scenario
passage, not generated text. `auto_generate_text=true` and `should_enhance=true`
return 400. Only `mp3_44100_128`, default loudness 0.5, default guidance 5
(2 for remix), and quality 0.9 are supported. Nonnull seed, reference audio,
prompt strength and remix-session options return 400 before mutation. Design
accepts the two `ttv` catalog IDs and defaults to `eleven_multilingual_ttv_v2`;
remix uses `eleven_ttv_v3`. The original catalog order remains unchanged.

Each preview request consumes one fictional character-quota unit per code point
per preview (three times the text length). Insufficient quota returns 429 before
allocating IDs. Previews live separately from speech history. Repeated retrieval
and saving consume no additional character quota. `stream_previews=true` on design
or remix returns each ID with an empty required `audio_base_64` string; retrieval
returns the copied MP3 as one complete ordinary `audio/mpeg` response. No
incremental timing or framing is simulated. Otherwise previews include base64
bytes, fixture duration and a language label (English by default, or the source
voice's language label for remix). Language is metadata, not detected speech.

Saving creates an owned generated voice in the canonical voice map. V1/V2 reads,
settings, deletion and subscription slot counts observe it. Name, description and
labels are metadata only; the saved voice has default settings and no samples or
preview URL. A preview can be saved once; reuse returns 409. All current voices
occupy a local slot, so the subscription voice limit is checked before saving.
Nonempty played-but-not-selected feedback is unsupported (400); an empty array
is accepted without an RLHF action. Deleting a saved/source voice preserves its
preview; retrieval stays available until reset. Missing previews/voices/models
return 404. These IDs, quota, reuse and error rules are local conventions.

Contexts start empty. `api/scenarios/voice-previews.ts` populates media/defaults,
accessors and counters during startup/reset; reset clears previews and new voices
and restores quota. Instances isolate state and responses return copies.

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
the stateful voices implementation. Of 437 operations, 392 now have authored
behavior. The remaining 45 operations retain their generated responses. This simulator does not synthesize speech.

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

`GET /v1/models` returns a stable seven-model catalog containing
`eleven_multilingual_v2`, `eleven_flash_v2_5`, `eleven_v3`,
`eleven_multilingual_ttv_v2`, `eleven_ttv_v3`, `eleven_text_to_sound_v2` and `music_v1`.
The two `ttv` models, the sound-effect model and the music model are synthetic dependencies
with text-to-speech capability false.
Voice fixtures reference an ID
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
The historical texts do not represent spoken recordings. Startup/reset attach
copies of the bounded synthetic silence fixture described above to both records.
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

`GET /v1/history/{history_item_id}/audio` returns the retained MP3 bytes with
`audio/mpeg` and an attachment filename. `POST /v1/history/download` returns a
valid `application/zip` attachment containing the selected MP3 files. The upstream
prose describes a direct audio response for a single ID, but its response schema
declares only ZIP; this simulator returns ZIP for both one and multiple IDs.
Use the GET audio endpoint for a direct single file.

Downloads accept 1–100 IDs, preserve first-request order and omit repeated IDs.
Every requested item and its retained audio must exist before an archive is built;
a missing member returns 404 without a partial archive. Retained payloads total at
most 16 MiB per archive. Entry names percent-encode IDs, and ZIP members use the
STORE method with CRC-32 checksums and fixed 1980-01-01 timestamps. Only omitted,
null or `default` output format is supported; WAV transcoding returns 400.
Reads do not consume quota or change metadata/audio. Deleting history removes
its retained audio; deleting voices preserves historical media. Both startup
fixtures and new retained speech/dialogue requests can be read or downloaded.

Contexts start with empty media maps. The `historyAudioFixtures` scenario explicitly
populates the baseline media after speech-fixture setup during startup/reset.
Run `historyWithoutAudio` to preserve metadata while making audio unavailable
(404); `reset` restores baseline bytes. These names, bounds, ZIP and error choices
are local conventions. No synthesis, transcoding or provider request occurs.

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
exhaustion changes account data and prevents bounded speech, sound-effect and
voice-preview fixture requests; other operations do not enforce that quota.
The fixed creation and reset timestamps do not advance with time.
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
return 404. `force=true` and requests for generated workflow elements return 400.
Branch/version selectors use the lifecycle records described below; missing
selectors return 404. Subagent dependency cleanup is not simulated.

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
Agent workflow generation and execution endpoints remain generated.
Version reads and deployment metadata use the lifecycle subset described below.

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

## Workspace members and invitations

Five operations now use local state: `GET`/`POST /v1/workspace/members`,
`POST /v1/workspace/invites/add`, `POST /v1/workspace/invites/add-bulk`, and
`DELETE /v1/workspace/invites`. Member reads include locked members and exclude
service accounts. The canonical email-to-member-ID directory remains the one
used by workspace groups; profile metadata and invitation records live in
`api/routes/workspace/_.context.ts`. Scenario-wired live accessors keep group and
member lookups consistent when the directory is replaced. Profiles absent from
the current directory are omitted. The two fictional members are distinct from
the account profile's `sim-user`; account quotas and billing do not change.

Member updates preserve omitted/null lock and role fields. The new
`workspace_seat_type` takes precedence over deprecated `workspace_role` when both
are nonnull. The downgrade flag is accepted, but no seat availability or quota
enforcement is simulated. Role and lock changes are metadata only; permissions
and authentication are not enforced. Reads sort by exact email and return
defensive copies. Missing members return 404; invalid bodies return 400 without
partial changes. Email matching is exact and case-sensitive.

Invitations store seat type, group IDs, and optional nonnegative usage limit.
They send no email, create no accounts, and add no members or group memberships.
All requested groups must exist. The new `seat_type` takes precedence over the
deprecated `workspace_permission`; omitted/null role defaults to workspace member.
Omitted/null groups become empty, and omitted/null usage limit means no custom cap.
Repeated invitations replace their stored metadata; duplicate addresses in a batch
produce one invitation. Bulk creation validates every address before mutation and
requires domains in the scenario-owned verified-domain set (baseline:
`example.invalid`, matched case-insensitively). Single invitations do not require
a verified domain. An existing member returns 400; unknown groups and missing
invitations return 404. Empty batches are rejected. These validation, ordering,
replacement, alias, and error rules are local conventions.

Startup/reset populate profiles and verified domains and clear invitations in
`api/scenarios/workspace-members.ts`, after group scenarios restore the canonical
roster. `emptyWorkspaceMembers` clears profiles, invitations, the canonical roster,
and memberships in existing groups. `emptyGroups` also empties member reads by
replacing the canonical roster; reset restores both domains. Instances isolate
state. No external domain verification, invite acceptance, billing, or seat
allocation occurs.

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

## Workspace key disabling policy

`POST /v1/workspaces/api-keys/disable?api_key_name=self` disables the current
synthetic holder's canonical service-account key. The fixture caller header
`xi-api-key: sim-workspace-caller` selects `sim-service-key`; newly created
`sim-not-a-real-key-...` tokens also resolve their live key by its synthetic hash.
No real credentials are accepted or verified. Missing or unknown synthetic
callers return 401, including keys removed by `emptyServiceAccounts`. A wrong
or absent confirmation returns 400. Allowed repeated disabling returns 200
with `{}`, stores `is_disabled: true` and `disable_reason: "self_disabled"`,
and is visible through existing service-account reads. Keys are read live,
including after PATCH replaces their metadata or reset replaces the account map.

`POST /v1/workspaces/api-keys/third-party-disabling` stores a workspace override:
`{"third_party_disable_allowed":true}` allows holder disabling for every key;
false forbids it with 403. Explicit null clears the override. With no override,
the key's own setting wins; an absent/null key setting uses the scenario-owned
plan default (true at startup). `{}` preserves the current override. Invalid
bodies leave it unchanged. The installed optional-body limitation (#2614) means
an absent policy body returns 400 before the handler; send `{}` for a no-op.

Startup/reset populate the synthetic caller binding, clear the override and
restore the plan default in `api/scenarios/workspace-key-policy.ts`.
`emptyWorkspaceKeyPolicy` clears bindings and the override, preserving canonical
keys; created synthetic tokens still resolve live. These endpoints model local
holder eligibility only. Admin authorization, public-leak detection and global
authentication enforcement are not simulated; existing administrator key PATCH
and disable operations remain independent of holder eligibility. Each instance
is isolated. All caller strings, errors and defaults are local conventions.

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

Eleven conversation operations now use synthetic historical records: list, resolve,
detail, delete, lightweight summary, SIP-message history, feedback, tag assignment
and tag removal, audio retrieval and unused-file removal. Startup/reset seed `sim-conversation` and `sim-conversation-old`
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

`GET /v1/convai/conversations/{conversation_id}/audio` returns the verified
8,340-byte synthetic silence fixture above as one complete ordinary `audio/mpeg`
response. It is an attached response-track fixture, not a recording or rendering
of the historical transcript; the original text-only metadata remains unchanged.
`sim-conversation` has this fixture and reports `has_audio`/`has_response_audio`
true; user/auxiliary audio flags are false. Detail and reference-resolution reads
derive availability from the canonical retained-media map. The historical
`sim-conversation-old` has no media and returns 409, as does any existing record
without retained audio. Missing conversations return 404. The contract declares
no audio query options; all supplied query keys return 400, including output-format
and download options. No transcoding, streaming timing, network or provider call
runs, and reads consume no quota or change state. Returned bytes are copies.

`DELETE /v1/convai/conversations/{conversation_id}/files/{file_id}` removes an
unused scenario file and returns its `file_id`. Startup/reset populate metadata
for `sim-file-unused` and the historical attachment `sim-file-used`, scoped to
`sim-conversation`. These are metadata fixtures, without uploaded file contents
or hosted assets; their example.invalid URLs are placeholders. A file referenced
by either transcript attachment field returns 409 without mutation. Missing,
already deleted or other-conversation files return 404. Removing an unused file
preserves transcript events, attachment metadata, audio and other files. Deleting
the historical agent preserves conversation media/files. Deleting the conversation
removes its retained audio and file metadata together with SIP/reference state.
`emptyConversations` clears media/files, and full `reset` replaces and repopulates
them. Instances isolate state. Multipart file upload remains generated under #2607.
These availability, ownership, usage and error rules are local simulator conventions.

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

Agent duplication copies the complete stored configuration, including analysis-item
references added by configuration operations. The copied configuration is independent;
its ID, timestamps and creator metadata are allocated for the new agent. The
`agentAnalysisReferences` scenario adds a fictional evaluation reference for testing
configuration preservation without running an evaluation.

## Analysis item configuration

Nine analysis-item operations now store evaluation criteria and data-collection
configuration: list/create, read/replace/delete, version history, copy, attachment
updates and dependent-agent discovery. No evaluations, extraction, model calls or
other AI work run. Definitions are local configuration only. Startup and `reset`
populate `sim-analysis-evaluation` and `sim-analysis-data` in
`api/scenarios/analysis-items.ts`; contexts start empty. `emptyAnalysisItems` clears
items, versions and their user references from live agents, preserving other refs
and canonical main-branch metadata.

Creation returns `sim-analysis-created-N` IDs and publishes a first version.
PATCH replaces the complete definition, preserves the item's kind, and publishes
a version only when normalized content changes; object key order has no effect.
Omitted kind is inferred from `value_schema`, otherwise evaluation. User source,
binary scoring and `use_knowledge_base=false` defaults are made explicit for
evaluations. Copy creates an independent item and first version without copying
attachments. Snapshots and responses are defensive copies. IDs, fixed timestamps,
400/404 errors, kind immutability and defaults are local simulator conventions.

Lists support name-prefix search (case-insensitive), kind, IDs, creator (`@me` is
`sim-user`), creation-time sort direction and decimal-offset cursors. Search sorts
by name; otherwise creation time sorts descending by default. IDs break ties.
Pages contain 1–100 items, default 30. Versions sort newest first. Nullable numeric
page size and single ID arrays are strictly normalized for the installed runtime
limitations already recorded in #2612 and #2615; validation stays enabled.

Attachment updates support user items and the scenario-known main branch
`sim-main-branch` on `sim-agent`. Unknown agents or branches produce per-destination
404 failures, while other destinations continue. System-source requests return
400. Attach is idempotent, detach of an absent reference succeeds without changes,
and attach destinations run before detach destinations. State projects directly
into the canonical agent's `platform_settings.analysis_items`. No branch creation,
version pinning, branch execution or permissions are simulated. The dependent-agent
list derives from live agent configuration, including duplicated agents; branch
metadata is included only for scenario-known branches. Non-main branch references
are outside this slice. Deletion returns 409 when referenced unless `force=true`,
which removes every user reference from current agents before deleting versions.
Reset restores both agent and analysis-item baselines. Simulator instances isolate
state. `agentAnalysisReferences` can add a seeded reference for testing discovery.
Main-branch identity and name belong to the canonical agent record, seeded in
`api/scenarios/agents.ts`. Analysis attachment validation and dependency reads
resolve that metadata live, including record/map replacement, rename and deletion.
Duplicating an agent copies its configuration references without borrowing the
source agent's branch identity. `agentMainBranchPreview` replaces the fictional
main-branch metadata for dependency-picker setup; `reset` restores
`sim-main-branch` and `main`. This metadata refactor adds no API operations.

## Knowledge base local records

Eight operations now share local text/folder state: list documents, create text,
create folder, read/update/delete a document or folder, read document content,
and fetch summary batches. Startup and `reset` populate `sim-kb-folder` and its
`sim-kb-text` child in `api/scenarios/knowledge-base.ts`; `emptyKnowledgeBase`
clears the collection and allocation counters. Contexts start empty and simulator
instances isolate changes. Multipart upload/update operations remain generated
because of [Counterfact #2607](https://github.com/counterfact/api-simulator/issues/2607).

Text input and PATCH content are treated as plain text and escaped for HTML,
including ampersands, angle brackets and quotes. Detail returns that escaped
`extracted_inner_html`; content reads return the same bytes as `text/html`.
`size_bytes` measures the original plain text in UTF-8. Folders have no content;
requesting folder content returns 400. Text without a name uses `Untitled text document`.
Created IDs are `sim-kb-created-N`; timestamps advance deterministically on creation
or content/name changes. Null/omitted PATCH fields preserve values; `{}` is a no-op.
Absent optional PATCH bodies remain subject to the installed runtime's
[optional-body limitation #2614](https://github.com/counterfact/api-simulator/issues/2614).

All list filters combine before decimal-offset pagination: name prefix search
(case-insensitive), creator (`@me` supported), deprecated ownership filtering,
types, direct parent and ancestor folder. An explicit creator takes precedence
over deprecated ownership. `folders_first` groups folders before the selected
`name`, `created_at`, `updated_at` or `size` sort, with ID ties ascending.
Sort direction defaults to descending, sort field to creation time, page size
to 30 (1–100). Invalid options return 400; offsets beyond the end return an empty
page. Single array values for `types` and summary `document_ids` are normalized
at this group's boundary for [Counterfact #2615](https://github.com/counterfact/api-simulator/issues/2615).
Summary batches return success or 404 failure per ID and omit duplicate keys.

Folder paths, direct child counts and recursive document counts are derived from
current state. Nonempty folders and documents referenced by canonical agents
return 409 on deletion without `force=true`. Forced deletion removes the subtree
and matching knowledge-base references from all live agents, including duplicates.
The optional `knowledgeBaseReferences` scenario assigns the text fixture to
`sim-agent`; summaries project these live dependencies. Main agent prompt
knowledge-base references are supported; workflow/branch configuration is outside
this slice. Unknown IDs return 404. Reads return defensive copies.

Automatic sync settings that request syncing, removal or a refresh frequency
return 400 explicitly; these local text/folder records perform no remote fetch,
refresh, embedding or AI processing. No permissions or authentication are enforced.
These IDs, errors, default names, ordering and text conventions are local behavior.

## Knowledge base organization and dependencies

Six further operations persist document organization: single/bulk moves,
independent bulk deletion, single/bulk dependent-agent reads, and
`GET /v1/convai/agent/{agent_id}/knowledge-base/size` (singular `agent`).
Moves return an empty HTTP 200 body and validate every ID and destination before
changing state. Omitted/null `move_to` selects the root. Moving into a document,
into itself, or into a descendant returns 400. Missing IDs return 404.
Moving folders preserves descendant relationships; paths and folder counts in
existing list/detail responses update immediately. Repeated no-op moves preserve
timestamps. Bulk requests require 1–20 unique IDs.

Bulk deletion evaluates each requested ID against the initial state, then applies
successful deletions; missing/in-use IDs produce per-ID failure records while
other IDs succeed. Overlapping force-deleted subtrees report success for each
initially existing requested ID. Force deletion removes canonical agent references,
including references in duplicated agents. Folder references also protect their
contained documents from unforced deletion.

Dependency reads return unique live agents ordered by ID, with 1–100 results
(default 30), decimal-offset cursors, and no branch records. As a local convention,
`direct` means an explicit reference to the requested document/folder;
`transitive` means a reference to an ancestor folder; `all` combines both.
Multiple document IDs combine with OR before pagination. Unknown document IDs
return 404, and invalid filters/cursors return 400. Deleted agents disappear and
duplicated agents appear immediately. Workflow and branch dependencies are outside
this local model.

Size uses one synthetic page per unique local text document, expanding folder
references and deduplicating overlapping references. This is a local counting
convention, with no PDF extraction or remote processing. Unknown agents or stale
document references return 404. Startup/reset and `emptyKnowledgeBase` wire the
singular-agent size context to live knowledge-base state; reset restores the same
baseline and `knowledgeBaseReferences` provides a referenced-text setup.

## Knowledge base retrieval and index metadata

Eight retrieval operations now share local document state: content search, chunk
list/detail, RAG overview, document index list/create/delete, and batch index
lookup/create. Startup/reset seed one fictional completed index for `sim-kb-text`
with two chunks. Index usage is synthetic metadata, initially 15 bytes; the
1,000,000-byte maximum is a fixture, not a product limit or enforced quota.
Both supported model names have independent index and chunk state.

Index creation is idempotent per document/model and stores `created` with zero
progress and usage. No background processing, embeddings or AI calls occur.
Run `.scenario completeKnowledgeIndexes` to replace queued local-text requests
with a completed synthetic index and one full-content chunk per request. Folder
requests store `cannot_index_folder`; the completion scenario leaves them alone.
Batch requests return independent success/failure results keyed by document ID;
repeating a document ID in one batch returns 400 to avoid ambiguous result keys.
`create_if_missing=false` returns a per-item 404 when that model has no index.
Deleting an index returns its final metadata and removes its chunks; repeating
the deletion returns 404. Chunk detail defaults to `e5_mistral_7b_instruct`.

Chunk lists paginate with decimal-offset cursors (1–100 items, default 30),
return defensive copies and are empty for models without chunks. Content edits
invalidate every index and chunk for that document; metadata-only edits preserve
them. Document/subtree deletion removes associated indexes and chunks. Overview
usage sums stored model usage. Empty/reset scenarios clear/restore all this state.

Content search reads current local text, independent of index completion. It
compares case-insensitive letter/number tokens. Exact token matches score 1;
query tokens of at least four characters also match words with one insertion,
deletion or substitution and score 0.75. Scores average over query tokens;
positive-score documents sort by score descending, then ID ascending. Search
snippets are null. Type filters and decimal-offset pagination apply before
returning results; blank/punctuation-only queries and invalid options return 400.
These algorithms, identifiers, statuses and index lifecycle are simulator
conventions, without remote retrieval or model execution.

## Batch call records

Seven `/v1/convai/batch-calling` operations now persist synthetic batch records:
submit, workspace list, detail, delete, cancel, retry and CSV export.
Startup/reset seed `sim-batch`, a historical record with one completed and one
failed recipient, in `api/scenarios/batch-calling.ts`. Context state starts empty.
`emptyBatchCalls` clears records and ID counters; `reset` restores them.
Each simulator instance is isolated. Reads return defensive copies.

Submission requires an existing agent and outbound-capable imported phone ID,
nonempty call name and 1–10,000 E.164-style phone recipients. Explicit recipient
IDs must be nonempty and unique, including against allocated IDs. Omitted IDs use
`sim-batch-created-N-recipient-M`; batch IDs use `sim-batch-created-N`.
Requests are validated before counters or records change. Submitted batches remain
pending until `.scenario completeBatchCalls` explicitly marks active recipients
completed. This scenario creates no conversation records or calls; its completion
is fictional. There is no timer, dispatch, provider connection or actual scheduling.

Only phone recipients, UTC (or omitted timezone), the default branch and no
environment selection are supported. WhatsApp, explicit branches/environments,
recipient initiation data and machine detection return 400. Ringing/recording and
concurrency fields are stored configuration only. Omitted schedule times use the
scenario clock; supplied nonnegative times are metadata and do not trigger work.

Cancel accepts pending/in-progress batches and marks all recipients cancelled,
as stated by the contract; repeating cancellation is a no-op. Other terminal
batches return 409. Retry accepts terminal batches with failed recipients, resets
only those recipients to pending and clears their prior conversation references;
completed recipients and their references remain. The contract's recipient enum
has no separate no-response state, so only stored `failed` outcomes are retryable.
Retry rechecks the live agent and outbound phone; missing sources return 409.
Scheduled count remains total recipient count; dispatched and finished counters
reflect current recipient outcomes rather than cumulative retry attempts.
No eligible recipients or a nonterminal retry returns 409.

Lists sort newest first with ascending ID ties. `agent_id` filters before
pagination; `limit` is 1–1000 (default 100), and `last_doc` is the prior page's
final batch ID. Unknown cursors return 400; empty pages return null `next_doc`.
CSV export requires a terminal batch, uses `text/csv`, includes
`recipient_id,phone_number,status,conversation_id`, and preserves recipient order.
Values are quoted with escaped quotes and CRLF row endings. Optional positive
`limit` previews the first recipients; its nullable integer query receives the
same narrow normalization documented for Counterfact #2612.
Deleting a batch returns 204 and removes its recipient records while preserving
conversation history. Unknown batch IDs return 404. Error codes, ID allocation,
pagination, counter projections and lifecycle restrictions above are local
simulator conventions. Authentication and permissions are not enforced.

## LLM catalog discovery

`GET /v1/convai/llm/list` returns a stable four-entry catalog for
`gemini-3.5-flash`, `gemini-2.5-flash`, `gpt-4o`, and `gpt-4o-mini`, matching
the model IDs supported by the local agent configuration helpers. The canonical
agent fixture references a catalog entry. Reads include capability flags, token
limits, service tiers and default deprecation timing, with defensive copies of
all nested data. Catalog order follows the scenario fixture order.

Every capability, limit and deprecation value is synthetic. In particular, the
`gpt-4o-mini` deprecation fixture pointing to `gpt-4o` is a local UI example,
not a claim about provider availability or retirement. These metadata fields do
not reroute requests or change agent configuration. No model inference, provider
request, residency filtering, compliance enforcement or billing occurs. This
catalog represents one fictional deployment without making regional availability
or compliance claims.

The context initializes an empty model map and no deprecation configuration.
Startup and `reset` populate both in `api/scenarios/llm-catalog.ts`.
Run `.scenario emptyLlmCatalog` to return an empty model list with the default
deprecation timing still present; `reset` restores all entries. Clearing this
catalog does not modify stored agents. Each simulator instance has isolated state.

## Agent conversation triage tickets

Eleven workspace and per-agent ticket operations now share persistent local state:
list, conversation/manual creation, detail, partial update, delete, comments,
turn comments, merge, and assignable-user discovery. Startup/reset seed
`sim-ticket` in `api/scenarios/triage-tickets.ts`; `emptyTriageTickets` clears
records and counters. Contexts start empty, and instances are isolated.

Conversation creation requires a live conversation and agent, and at least one
overall or turn comment. A repeat request for a conversation with an open or
in-progress ticket adds its description as a discussion comment, appends turn
comments, and raises priority when needed. Manual tickets have no conversations.
Titles default to the first 120 characters of the description, or a fixed local
follow-up title. IDs use `sim-ticket-created-N`, and mutation timestamps advance
from a fixed scenario clock. No Architect, clustering, AI, or provider runs.

PATCH preserves omitted fields; null clears priority/assignee and preserves
null title/description/status. Priority and status changes retain audit history.
Merged tickets cannot be reopened, and setting merged status directly is rejected.
Turn indexes must exist in one of the ticket's live conversations. Assignable users
read the current non-service workspace member directory; all members have access
in this local model. Missing assignees are rejected. Authentication and real
permission checks are not simulated.

Merge validates 1–50 distinct open source tickets belonging to the target agent
before changing any records. Targets may be open, in progress, or resolved.
Conversation IDs move to the target without duplicates, its priority rises to the
highest source priority, and sources remain as merged records pointing to it.
Source discussion stays on its original ticket. A target with merged sources
cannot be deleted until those sources are deleted, preventing dangling links.
Deleting tickets preserves agent and conversation records.

Lists combine all contract filters before decimal-offset pagination (1–100,
default 100), sort newest first with ID ties ascending, or priority descending
before creation time. Nullable source/priority arrays normalize singleton query
values for Counterfact #2615. Search matches title, description, discussion and
turn comments case-insensitively and returns the first match with a complete
whitespace-collapsed text snippet and highlight offsets. Errors, ordering, clock,
IDs, default title, null-update and deletion rules are local simulator conventions.
Unknown IDs return 404; invalid requests return 400 and merge conflicts return 409.

## MCP server configuration

Thirteen `/v1/convai/mcp-servers` operations now persist local server
configuration, server approval policy, per-tool approvals and tool overrides.
Startup/reset seed `sim-mcp` and a fictional `lookup` tool in
`api/scenarios/mcp-servers.ts`; contexts start empty. `emptyMcpServers` clears
records and counters. Creation uses IDs `sim-mcp-created-N`, scenario-owned
owner/access metadata and deterministic timestamps. Each instance is isolated.
Reads return defensive copies, including approved definition snapshots.

Server creation accepts an HTTPS URL without embedded credentials, or a secret
locator URL retained as metadata. Secret tokens, headers, request metadata and
auth references are stored configuration only: no values are resolved, no remote
MCP server is contacted, and no tool or response mock executes. Created servers
have an empty local tool catalog. Nonempty initial approval/override lists return
400; use their dedicated operations after populating local discovery state in a
scenario. PATCH supports exactly the contract's mutable fields; name, URL and
transport have no PATCH fields. Omitted/null ordinary PATCH fields preserve
values; null secret token, auth connection or tool sound clears that field.

Tool discovery reads scenario-owned definitions and supports only the default
`production` environment; other environments return 400. Per-tool approval mode
projects `not_approved`, `up_to_date` or `needs_review` for each discovered tool.
Approval records store a SHA-256 hash of the description/input-schema snapshot,
using sorted JSON object keys as a local hashing convention. A supplied definition
that differs from discovery remains `needs_review`. Run `mcpDefinitionChanged`
to replace the fixture definition and demonstrate drift; its earlier approval
snapshot remains available. Approval writes require per-tool mode (409 otherwise)
and a known local tool (404 otherwise). Removing an absent approval is a no-op.

Overrides require a known local tool; duplicate creation returns 409, and missing
override reads/updates/deletes return 404. PATCH replaces supplied fields while
preserving omitted fields. Null override values mean inheritance; null
`assignments` becomes an empty list to satisfy the response contract. Fields are
stored metadata and do not change the discovered definition or approval hash.
Invalid changes are rejected before state mutation.

Dependent agents are derived from current canonical `mcp_server_ids` and
`native_mcp_server_ids`, including duplicated agents. `mcpAgentReference` adds the
fixture reference. Deletion returns 409 while a live agent references the server;
after references/agents are removed it returns an empty JSON object and removes
its discovery/approval state. Missing server IDs return 404. All fictional
resources use admin access metadata; authentication and access enforcement are
not simulated. These errors, IDs, ordering, hashing and deletion safeguards are
local simulator conventions. No network requests, model inference or real
credentials are needed.

## Speech engine configuration

Six `/v1/speech-engine` operations now persist local speech engine configuration:
list, create, detail, PATCH, delete and duplicate. Startup/reset seed
`sim-speech-engine` in `api/scenarios/speech-engines.ts`; contexts start empty.
`emptySpeechEngines` clears engines and counters. Creation and duplication return
201 with IDs `sim-speech-engine-created-N` and scenario-owned metadata/defaults.
Deletion returns an empty 204 and removes only that engine. Missing IDs return 404.
Each instance is isolated; reads and duplicates use independent copies.

Configurations store WebSocket endpoints, ASR/TTS, turn detection, privacy,
conversation, call-limit, authentication and override settings as inert metadata.
Endpoints must use `ws:` or `wss:` without embedded credentials. No connection,
audio synthesis, transcription, retention job, authentication enforcement or billing
occurs. Voice IDs are stored references; engines do not alter voices and deleting
a voice does not rewrite engine configuration. Defaults and limits are synthetic
local fixtures, not current provider product claims.

PATCH recursively merges supplied object fields and replaces arrays. Omitted/null
top-level fields preserve existing values; explicit nested nullable values remain
null. An empty object or unchanged update preserves timestamps. Supplied partial
`tts.audio_effects` objects receive the output contract's required default fields,
including after clearing effects with null. Duplication preserves the configuration
and source name unless a new name is supplied; use a JSON `{}` or `null` body for
the optional duplicate request under the installed runtime's optional-body behavior.
All changes are validated before counters or stored records change.

Listing supports case-insensitive name search, `name`/`created_at`/`updated_at`
sorting and `asc`/`desc` direction (creation descending by default). ID ties sort
ascending. Decimal-offset cursors paginate after filtering/sorting, with page size
1–100 (default 30); invalid query options return 400 and offsets beyond the end
return an empty page. These sorting, merge, ID, timestamp and error conventions
are local simulator behavior. Authentication and permissions are not enforced.

## Agent test definitions and folders

Nine `/v1/convai/agent-testing` operations now manage scenario-seeded definitions:
list, detail, delete, summary batches, folder create/read/rename/delete, and bulk
move. Startup and `reset` populate three finite fictional LLM, tool and simulation
definitions plus one folder in `api/scenarios/agent-tests.ts`; `emptyAgentTests`
clears definitions, folders and allocation counters. Context state starts empty.
Definitions are inert metadata: no model evaluation, conversation simulation,
tool execution or provider connection occurs.

Lists support case-insensitive name search, test `types`, parent folder filtering
(`root` selects the root), creator IDs (`@me` selects the fixture user), and
`sharing_mode=shared_with_me` (records created by the other fixture user).
All stored records are visible in this local model; permissions are not enforced.
Without `types`, folders are included unless `include_folders=false`; explicit
`types` takes precedence. Records sort newest first with ascending ID ties;
`folders_first` groups folders before this ordering. Decimal-offset cursors apply
after filters and sorting, with page size 1–100 (default 30). Unknown parent
folders return 404; invalid options return 400. The list boundary narrowly
normalizes nullable boolean and single array values for Counterfact #2612/#2615.

Folder paths and direct child counts reflect current hierarchy. Folder reads
include the folder itself in its path; test summaries include their parent path.
Renaming a folder updates descendant paths. Bulk moves require nonempty unique
IDs and validate every source/destination before changing state; moving a folder
into itself or its descendants returns 400. Null/omitted `move_to` selects root.
No-op moves and unchanged renames preserve timestamps. Nonempty folder deletion
returns 409 unless `force=true`, which removes the complete subtree. Test deletion
and bulk move return HTTP 200 with `{}`; folder deletion returns empty HTTP 204.
Missing records return 404. Summary batches omit unknown IDs, reject duplicate
IDs, preserve requested key insertion order, and accept an empty list.

Reads return defensive copies; instances are isolated. IDs use
`sim-test-folder-created-N`, and mutation times advance from the scenario clock.
These IDs, ordering, filters, sharing, path and error rules are local conventions.
Test create and PUT remain generated and uncounted because their recursive
request schemas hit [Counterfact #2613](https://github.com/counterfact/api-simulator/issues/2613).
Finite detail responses validate normally; the guarded request probe is recorded
in `COUNTERFACT_ISSUES.md`. Request and response validation remain enabled.

## Studio project and chapter metadata

Eleven Studio operations now share scenario-seeded local projects and chapters:
project list/detail/update/delete, chapter list/create/detail/update/delete,
pronunciation-dictionary attachment, and muted-track reads. Startup and `reset`
seed `sim-project` and `sim-chapter` in `api/scenarios/studio-projects.ts`;
`emptyStudioProjects` clears projects, chapters, muted flags and the chapter ID
counter. Context state starts empty. Reads are defensive copies and instances
are isolated. Project lists sort newest first with ascending ID ties; chapter
lists retain insertion order. Missing projects/chapters return 404.

Project updates require name and both default voice IDs. Omitted optional
metadata is preserved; explicit null clears title, author or ISBN. Voice IDs
are inert configuration references and also serve as local project voice refs;
changing/deleting canonical voices does not rewrite saved projects. Names must
be nonblank. New chapters start empty with IDs `sim-chapter-created-N` and cannot
be downloaded. Non-null `from_url` returns 400; no remote content is fetched.
Project deletion removes its chapters and muted flags while preserving voices
and dictionaries. Chapter deletion removes its muted flag. The seed chapter is
flagged muted as synthetic metadata; no track or audio is processed.

Chapter update preserves omitted/null name and content. A supplied content object
replaces all blocks atomically; empty blocks clear content. Only TTS text nodes
are supported. Missing block IDs become `<chapter_id>-block-N`; duplicate block
IDs return 400. Input `sub_type` is validated but has no field in the output
schema. Node voice IDs project to the same `project_voice_ref_id`. Statistics
count JavaScript UTF-16 string units and all blocks as unconverted paragraphs,
with zero converted text; edits clear conversion metadata and download readiness.
No speech synthesis, conversion, credit calculation or background jobs occur.

Dictionary attachment validates the whole unique-ID list before replacing it.
Unknown dictionaries/versions return 404 without changing locators or chapters;
an empty list clears attachments. Null version IDs resolve to the canonical
latest version at attachment time, then store explicit IDs and metadata snapshots.
Later dictionary changes do not silently update those snapshots. Metadata uses
the current dictionary name, creator, archive time and creation time, rule count
from the selected stored version, and the version ID as local version name.
`invalidate_affected_text` defaults true: changed locators clear every chapter's
conversion metadata and download readiness. False preserves those flags. This is
a conservative local invalidation convention; no pronunciation processing runs.

These IDs, ordering, errors, projections, counts and mutation rules are local
conventions. Authentication and permissions are not enforced. Multipart project
creation/content import, podcasts and conversion/snapshot/audio operations remain
generated and uncounted. Contracts and request/response validation stay enabled.

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

## Productions order metadata

Ten nonmultipart Productions operations now keep order metadata in memory: create,
list, detail, rename, media metadata, item upsert/removal, submission, deliverables
and language discovery. Startup/reset seed one open order
`prodorder_00000000000000000000000000` with media
`prodmedia_00000000000000000000000000`. Context state starts empty; fixtures and
restoration live in `api/scenarios/productions.ts`.

Create accepts a JSON object (including `{}`) and returns a deterministic contract-shaped
ID. An absent optional body is affected by Counterfact #2614. PATCH and item upsert
use the contract's `{ "request": ... }` wrapper. Items reference media belonging
to that order; missing orders, media or items return 404. Empty orders cannot be
submitted (400), and submitted orders cannot be edited or submitted again (409).
Quotes and totals remain null: no pricing, charging or production is performed.

Listing supports status (single or repeated query values), inclusive creation-date
bounds, page size 1–100 and nonnegative offset. Results sort by creation date
descending, then ID. Invalid filters return 400. Language discovery uses a small
synthetic English-to-Spanish catalog, not the provider's current catalog.

`emptyProductionOrders` clears orders and restores counters/catalog.
`completeProductionOrders` changes submitted records to done and supplies one
synthetic deliverable metadata record. Sandbox orders also progress only through
this explicit scenario, keeping tests deterministic. Media and deliverable URLs
use `simulator.invalid` and do not serve files. Reads return defensive copies;
instances are isolated. Multipart media registration remains generated and is
not counted, pending Counterfact #2607. No media is fetched, uploaded or processed.


## Flows generation records

Nine image, video and text-to-speech Flows operations now persist synthetic local
records: create, list and detail for each media kind. Startup/reset seed one
completed fixture per kind in `api/scenarios/flows.ts`; contexts start empty.
Creation returns `sim-flow-created-N` and `pending`. Request parameters remain
inert metadata: no media, model inference, provider request, billing or background
job runs. Voices and pronunciation dictionaries are stored references without
resolution or canonical-state changes. These records are separate from speech
history and account usage.

Prompt-based models in the snapshot and the three TTS models are supported.
Nonblank prompt/text and TTS voice are required locally. Webhooks, reference
media, masks, and Creatify Aurora lipsync return 400 explicitly; no notifications,
asset resolution or remote fetching occurs. Other schema-valid settings are stored
without affecting synthetic output. Malformed requests leave records and counters
unchanged. The unchanged contracts still validate requests and responses.

Lists filter by status and exact model ID before decimal-offset pagination
(1–100 records, default 30), newest creation first with ID ties. Invalid options
return 400; beyond-end pages are empty. Detail is scoped to its media kind and
missing or wrong-kind IDs return 404. Responses are defensive copies and instances
are isolated. IDs, ordering, errors and blank-input checks are local conventions.

`startFlowGenerations` moves pending records to generating. `completeFlowGenerations`
replaces pending/generating records with synthetic completed metadata, using
`image/png`, `video/mp4` or `audio/mpeg` and fixed `simulator.invalid` URLs that do
not serve files or expire. `failFlowGenerations` instead stores a synthetic
`model_error`. Terminal records are preserved by later transition scenarios.
`emptyFlowGenerations` clears records/counters; reset restores the baseline.
Template and template-run operations remain generated and uncounted.


## Dubbing project and transcript records

Fifteen project, language-target and transcript operations now use local metadata.
Startup/reset seed ready project `sim-dubbing-project`, completed Spanish target
`sim-dubbing-es` and source segment `sim-dubbing-segment` in
`api/scenarios/dubbing-projects.ts`. Contexts initialize empty; instances isolate
changes and all reads return defensive copies. Project deletion removes its
languages/transcripts; target deletion preserves the project and other targets.
Missing records return 404. Authentication and enterprise permissions are not enforced.

Project lists sort by creation time (descending by default, or ASCENDING) with ID
ties; language lists sort newest first with ID ties. Status filtering precedes
decimal-offset cursor pagination. Page sizes are clamped to 1–100 as the contract
describes; malformed cursors/options return 400. Project list rows have empty
language_ids; detail derives IDs from live target state.

Language creation stores a queued record with its inherited model and optional
voice settings. Language tags receive a syntax check only, not a provider catalog
lookup. Optional caller translations must cover every source external ID (or ID)
exactly once. They require a ready source and remain inaccessible until completion.
No dubbing, translation, billing, notifications or media processing occurs.

Source edits require a ready project. Add/edit validates the complete final
timeline: finite nonnegative spans within source duration, 0.1–25 seconds long,
with no overlaps for the same speaker. Different speakers may overlap. Bulk edits
apply atomically, including timing swaps. Playback order is start time then ID.
Every accepted edit request, including unchanged values, increments the project
revision once and every target revision once; affected translations are discarded
and completed targets become stale. Existing outputs and output_revision remain
as historical metadata. Source null fields preserve existing values.

Target transcript reads/edits require a prior output (409 otherwise). Single/bulk
translation edits increment only that target revision, stale a completed target,
and preserve source/other targets. Omitted translation preserves it; null clears
it. Unknown IDs or invalid edits leave state and counters unchanged. These error,
ID, timing-update, ordering and null-source conventions are local behavior.

`completeDubbingLanguages` explicitly completes queued/processing/stale targets of
ready projects. It preserves supplied translations and fills gaps with labeled
synthetic text, then records synthetic simulator.invalid output URLs that serve
no files and do not expire. `pendingDubbingProject` adds a queued fixture for
readiness/list flows; `emptyDubbingProjects` clears records and resets counters.
Reset restores baseline. Multipart project creation and transcript regeneration
remain generated and uncounted. Contracts and validation remain unchanged.


## Dubbing resource metadata

Eight resource operations now share local speaker tracks, segments and per-language
metadata. Startup/reset seed `sim-dubbing-resource`, `sim-dubbing-speaker` and
`sim-dubbing-segment` in `api/scenarios/dubbing-resources.ts`. This resource model
is independent of the newer dubbing-project records. Contexts start empty;
`emptyDubbingResources` clears records and ID counters, and reset restores them.
Responses are defensive copies and simulator instances isolate state.

Adding a language creates empty translated segment records and default track-clone
voice references without translating or cloning. Adding a speaker creates a track
in every language. Segment creation adds one membership and per-target metadata;
deleting a segment removes its membership from every track. Migration validates
all segment IDs and its destination before moving memberships, deduplicating IDs.
Unknown resources, speakers, segments and languages return 404. Invalid requests
return 400 without changing records or allocating IDs.

Segment updates affect only the requested language; source changes stale every
translated audio record, while target changes stale that target only. Edits clear
that language's subtitles and retain historical media references. Timing is finite,
nonnegative, increasing and within the source duration. Null update fields preserve
existing values. Speaker names are shared across languages; voice references and
settings apply only to selected languages. Omitted/null/empty language selections
apply to all languages. Voice settings must be between zero and one, are stored as
inert metadata, and are not exposed by this snapshot's resource response schema.
Voice IDs, including track-clone/clip-clone, are never resolved or processed.

Successful mutation requests increment the resource version once, including no-op
PATCH requests and migrations to the same speaker. Adding an existing/source
language and migrating an empty segment list preserve the version. Source and
new-speaker media references are synthetic fixture metadata; URLs use
`simulator.invalid` and serve no files. These timing, null, version, error and ID
rules are local simulator conventions. Optional speaker bodies should be sent as
`{}` because absent bodies remain affected by Counterfact #2614. Transcription,
translation, dubbing, rendering and similar-voice routes remain generated and
uncounted. No audio, cloning, provider request, billing or network fetch occurs.


## Workspace resource administration and historical records

Five workspace operations now expose deterministic local metadata: resource reads,
share/unshare, audit logs and API-request history. Resource sharing supports live
voices and voice collections; other resource types return 400 explicitly. Resource
names and existence follow their canonical contexts, including deletion and reset.
Sharing does not change voice ownership or enforce authentication/permissions.
The local creator is `sim-member-narrator` and always retains admin access.

Exactly one user email, group ID (including `default`) or service-account key ID
must be supplied. Emails resolve current workspace members. The canonical service
account model has no email; target those accounts by a live key ID. Key targeting
grants the associated account, and its grant survives deletion of every key while
the account exists. Deleted principals disappear from projections. Each direct
grant replaces that principal's previous role; unsharing an ungranted principal
succeeds, while removing/downgrading the creator returns 409. Unknown resources or
principals return 404, and invalid requests leave grants unchanged. Share options
list ungranted live principals once each. Baseline group grants are returned as
metadata without calculating effective group permissions. Reads are defensive copies.

Audit logs and request tables are synthetic historical records, independent of
current request traffic and other domain mutations. Startup/reset populate two
of each in `api/scenarios/workspace-records.ts`. Context containers start empty;
`emptyWorkspaceRecords` clears history and grants, preserving live resource data.
All simulator instances isolate changes; reset restores records and removes grants.

Audit logs filter by actor, class, activity and inclusive millisecond time bounds,
then sort newest first with ascending ID ties. Decimal-offset cursors paginate
1–100 entries (default 50); invalid cursors/bounds return 400. Nullable numeric
query values receive strict normalization for Counterfact #2612.

Request history requires at least one start/end bound (milliseconds from 2020),
uses inclusive bounds, and returns up to 1–1000 rows (default 100). Sorting defaults
to descending with an end bound, otherwise ascending; explicit `asc`/`desc` overrides
it, with request ID ties ascending. The fixed columns are timestamp, request_id,
method, path, status_code and user_id. Case-insensitive substring search checks all
columns. Column filters combine with AND and support in/not_in, eq/neq and ordered
comparisons; values must match the local numeric/string column types. Unsupported
columns and invalid filters return 400. These table, sharing, ordering and error
rules are local simulator conventions. No universal audit capture or provider
request occurs, and contracts/validation remain unchanged.


## Agent widget and shareable-link metadata

`GET /v1/convai/agents/{agent_id}/widget` reads the canonical agent widget settings,
conversation language, first message, text-only mode and file-input configuration.
Language presets combine stored widget text/terms with explicit conversation
first-message overrides; internal translation caches are omitted. No translation
runs. Supported language overrides are sorted conversation-preset keys. Omitted
language/first-message/text-only values use `en`, an empty string and false;
omitted `supports_text_only` uses true, the stored widget configuration default.
Custom avatar paths and language-selector flags have no field in this response
schema and are omitted. Other stored widget metadata is returned as a copied value.

`GET /v1/convai/agents/{agent_id}/link` returns the current agent ID and `token: null`.
The snapshot's link response has no URL field. No signed token, expiring link,
conversation, or provider connection is created. Supplied `conversation_signature`
values on widget reads return 400 explicitly; authentication and allowlist
checks are not enforced. Missing agents return 404. Reads have no state effects,
reflect duplication/deletion/reset, return defensive copies and isolate instances.

Run `agentWidgetConfiguration` to add fictional styling, a Spanish first-message
preset and text-only/file-input metadata to `sim-agent`; reset restores the base
agent configuration. Fixtures and this setup action live in `api/scenarios/agents.ts`.
Agent create/PATCH remain generated due to Counterfact #2613. Contracts and request
and response validation remain unchanged.


## Conversation users

`GET /v1/convai/users` derives distinct nonempty user IDs from current historical
conversation records. Each user contains the filtered conversation count, earliest
and latest start times, and the latest conversation's stored agent ID/name.
Deleting conversations updates these aggregates immediately; deleting agents
preserves historical names. No separate user collection is seeded or maintained.
The users context reads a live conversation accessor wired by the conversation
startup/reset scenarios, so replacing the conversation map is reflected immediately.

Agent ID, branch ID, exact user-ID search, and inclusive before/after start-time
bounds combine before grouping. Empty filters are exact values. Sorting supports
`last_contact_unix_secs` (default) or `conversation_count`, descending by default,
with ascending user-ID ties. Equal latest-contact times choose the ascending
conversation ID. Decimal-offset cursors paginate after sorting, with page size
1–100 (default 30); offsets beyond the end return an empty page. Invalid queries
return 400 without changing records. Nullable integer query text receives strict
normalization for the installed runtime's #2612 limitation.

Conversation records have no sentiment scoring, so required sentiment fields
contain zero scored counts and null averages; frustrated-conversation references
are empty. `sort_by=average_sentiment_score` returns 400 explicitly. Speech-engine
aliases beginning `seng_` also return 400: the simulator has no canonical mapping
between speech engines and historical agent IDs. Other agent IDs match historical
records exactly, including deleted agents. No sentiment analysis or AI work runs.

Run `.scenario conversationUserContacts` after reset to add two repeat contacts
and one anonymous conversation for discovery testing. The setup replaces only
its own records; `reset` removes them and restores baseline contacts.
`emptyConversations` clears users too, and instances isolate their state.
These filter bounds, ties, unscored values and errors are local simulator behavior.


## Legacy dubbing history and transcript exports

Five deprecated operations now share separate historical records: list, detail,
delete, and both transcript export routes. Startup/reset seed completed
`sim-legacy-dub` and pending `sim-legacy-pending`; `emptyLegacyDubbing` clears
these records. Newer dubbing-project and resource records are independent.
Contexts start empty, responses are defensive copies, and instances isolate state.

List filters combine with AND, including the legacy single status and newer
status list. Array values accept repeated parameters or one value (the local
normalization for Counterfact #2615). Model, target language, creation source and
personal/others creator metadata are synthetic fixture fields. List ordering uses
created_at or name, descending by default, with ascending ID ties. Decimal-offset
cursors paginate 1–200 records (default 100); invalid options return 400.

Both export routes use the same stored utterances and support SRT, WebVTT and
JSON. `source` aliases the stored source language. The singular route returns
plain text for subtitles and JSON for transcripts; the plural route returns the
contract's format wrapper. Pending records return 425; missing dubs/languages
return 404. Deleting a dub removes its metadata and transcripts; reset restores
both. No transcription, translation, media processing, billing or network call
runs. These errors, cursor, tie and filter combination rules are local conventions.
Multipart creation and audio retrieval remain generated and uncounted.


## Music finetune metadata

Four operations list, read, update and delete synthetic stored music finetune
metadata. Startup/reset seed self-owned, workspace-created and curated records in
`api/scenarios/music-finetunes.ts`; contexts start empty. No music generation,
training, upload, provider call or billing occurs. Multipart creation remains
generated and uncounted. Authentication is not enforced.

Lists combine visibility and creator filters before sorting and decimal-offset
cursor pagination (1–150 records, default 50). Sorting defaults to creation time
descending, with ascending ID ties; name and ascending order are supported.
Beyond-end pages are empty. Invalid options return 400; missing IDs return 404.
Reads and mutation results are defensive copies. Only records created by `self`
can be updated or deleted; other records return 403. This is a local ownership
convention, without effective workspace permission calculation.

PATCH replaces supplied tags, clears the genre on explicit null and preserves
null/omitted name, tags and visibility. Names must be nonblank. Visibility can be
private or workspace; updates never alter training status/progress. Invalid
updates leave state unchanged. DELETE returns the removed metadata, and later
reads and lists reflect removal. `emptyMusicFinetunes` clears records; reset
restores the baseline, and simulator instances isolate their changes.


## Asset metadata

Three asset operations now list, read and delete scenario-owned local metadata.
Startup/reset seed `sim-asset-audio` and `sim-asset-pending` in
`api/scenarios/assets.ts`. Contexts start empty; `emptyAssets` clears records.
The ready fixture uses a synthetic `simulator.invalid` URL that serves no content;
the pending fixture has a null URL. No upload, processing, signed URL generation,
network request or billing occurs. Multipart upload remains generated and uncounted.

Lists sort newest first with ascending asset-ID ties. Case-insensitive name search
runs before decimal-offset cursor pagination (1–100 records, default 30). Empty or
beyond-end pages return an empty collection and null cursor. Invalid query values
return 400. Missing/deleted asset reads and repeated deletes return 404. Successful
deletion returns an empty 204 response and removes only that asset. Existing Flows
generation records are separate metadata and remain unchanged. Reads return copies,
instances isolate changes and reset restores baseline. Search, cursor, tie ordering
and error conventions are local behavior; contracts and validation remain unchanged.


## Agent branch, version and deployment metadata

Seven operations maintain local lifecycle metadata: branch list/detail/PATCH,
version metadata reads, deployment list/POST and draft deletion. Startup/reset
populate `sim-main-branch` (`main`), `sim-agent-feature`, two immutable version
snapshots and a main-only traffic split in `api/scenarios/agent-lifecycle.ts`.
Contexts start empty; `emptyAgentLifecycle` clears lifecycle records, allocation
counters and configuration selectors while preserving canonical main metadata.
Agent existence is checked live, so deleting an agent hides all its lifecycle
records. Duplicates preserve configuration/references but omit the source agent's
lifecycle selectors; they initially have no lifecycle records.

Main branch identity/name come from canonical `StoredAgent.mainBranch` metadata.
Renaming it updates analysis dependency projections immediately. The
`agentMainBranchPreview` setup rename is also reflected by branch reads. Parent
ancestry is stored explicitly and current parent names are projected live.
`GET /v1/convai/agents/{agent_id}` accepts one branch or version selector. Default
and main-branch reads expose live canonical configuration, including current
analysis, knowledge-base, tool and MCP references. Version and feature reads
expose copied historical snapshots. Reading a snapshot never replaces live state.
Unknown or cross-agent branch/version IDs return 404; supplying both returns 400.

Branch lists exclude archived records by default and sort by creation time then
ID, ascending. `limit` is 2–100 (default 100), matching the snapshot's exclusive
minimum. Commit-DAG comparison requests return 400 explicitly. PATCH supports
name, description, archive and protection metadata, plus disabling auto-rebase;
nulls preserve values and an empty description clears it. Names are unique within
an agent. Main or currently live branches cannot be archived (409). Enabling
automatic rebase returns 400; no version graph or provider job runs.

Deployments store finite percentages from zero to 100, totaling 100 across distinct,
existing, unarchived branches. Invalid splits leave history/counters unchanged.
Each success deactivates prior history and records a synthetic increasing time/ID;
only metadata changes, with no routing, calling, billing or execution. Lists sort
newest first with descending ID ties and use page numbers from 1, page size 1–100
(default 30). Draft deletion clears only the branch's local draft marker and is
idempotent. Recursive branch/draft creation and procedure compilation
remain generated and uncounted. Branch merge/rebase behavior is described below.
All reads return defensive copies, simulator
instances isolate changes, and reset restores the fixtures. Error, ordering,
null-update, snapshot and traffic-split conventions are local simulator behavior.


## Agent merge proposal management

Seven proposal operations now persist local review metadata and merges: collection
create/list, detail read/PATCH, reviews, comments and merge. Startup/reset seed `sim-merge-proposal`
in `api/scenarios/agent-merge-proposals.ts`; contexts start empty.
`emptyAgentMergeProposals` clears records and counters while preserving agents
and branches. Instances isolate state and reads return defensive copies.

Creation validates live source/target branches of the agent, rejects identical or
archived branches and records the source tip version at creation. Later branch
metadata changes do not rewrite that historical version reference. Reviewer IDs
are inert references, deduplicated in first-seen order; no invitations or messages
are sent and membership/permissions are not enforced. Triage-ticket linking
returns 400 explicitly; no ticket changes occur.

Status, exact source/target IDs and case-insensitive title/description search
combine before pagination. Lists sort newest first with ascending ID ties.
Decimal-offset cursors paginate 1–100 records (default 100); invalid queries
return 400 and pages beyond the end are empty. Missing agents/proposals return
404, including proposal reads after deleting their agent.

Open proposals support metadata edits and closing. Omitted/null PATCH fields
preserve values; empty reviewer lists clear requests. The local author closing
a proposal records `withdrawn`; closing another author's fixture records
`rejected`. Closed proposals reject edits/reviews with 409 but accept comments.
A local user's latest review replaces their prior review; comments accumulate
with independent IDs. Blank titles/comments and invalid mutations leave records
and counters unchanged. These ID, time, null, ordering and error conventions are
local simulator behavior.

`POST /v1/convai/agents/{agent_id}/merge-proposals/{merge_proposal_id}/merge`
applies the shared branch merge behavior below, creates a real local version on
the target and records its ID, local user and timestamp in a merged outcome.
It accepts `force` and `archive_source_branch` with the same defaults as direct
branch merges. Review requests and previous reviews remain metadata; the merge
action itself represents local approval and does not require an earlier approval
record. Permissions and protected-branch authorization are not simulated.

Only open proposals may merge. A changed source tip since proposal creation
returns 409 even with `force`; create a new proposal for the new source version.
The current target configuration participates in the merge, including live main
edits. Source-tip checks use committed version IDs; live main changes may postdate
the same source tip and are included. These are local simulator conventions.
Closed/merged proposals, stale source tips and branch precondition failures leave
the proposal, version history, configuration and counters unchanged. A successful
merge archives its source by default and is visible in proposal detail/list and
agent/branch/version reads. Reset restores the open baseline and original versions.
No AI review, deployment, provider request or model processing occurs. Contracts
and request/response validation remain unchanged.


## Branch procedure metadata and drafts

Seven procedure operations now store local content and draft metadata: create/list,
detail read/delete and draft read/PATCH/delete. Startup/reset seed published
`sim-procedure` on `sim-main-branch` in `api/scenarios/agent-procedures.ts`.
The feature snapshot inherits the same published version; its drafts stay branch-local.
Contexts start empty; `emptyAgentProcedures` clears procedure state and published
references, preserving agents and unrelated configuration. Instances isolate state.

Published references remain visible in agent default/main reads and historical
version snapshots. Procedure draft edits and working-set removals do not publish
an agent version or alter those references. Lists overlay unpublished drafts and
omit working-set removals by default; `agent_version_id` selects a published
snapshot of that branch. Procedure detail reads return the published HEAD body
unless the procedure has never been published, in which case its draft is returned
with a null version. Explicit procedure-version reads require branch membership;
combining agent/procedure versions requires matching references. Unknown or
cross-branch records return 404. Reads return defensive copies.

Creation accepts an object or explicit JSON null for defaults; absent optional
bodies remain affected by Counterfact #2614. Draft PATCH requires name, content
and type, matching the unchanged contract. Omitted/null triggers preserve the
previous trigger; an empty trigger clears it. The documented `description` alias
is accepted; conflicting nonnull trigger/description values return 400. All three
types store opaque text.
No compilation, inference, generated workflow, reference extraction or execution
runs. The optional referenced-resource arrays are omitted rather than asserting
that opaque content has no dependencies. Procedure compilation remains generated
and uncounted as unfinished simulator implementation.

Folder parents must be existing folders in the same working set. Removal cascades
to descendants and rejects known outside handoffs with 409. Explicit scenario
handoff metadata describes the baseline; changing content invalidates that metadata.
If any outside procedure has nonempty content without verified reference metadata,
removal returns 409 `procedure_reference_analysis_required`, including single
procedure removal. This conservative local rule avoids claiming reference safety
without compilation. Empty content is known to have no handoffs. The
`procedureFolderReferences` setup adds a folder, child and explicit outside handoff
for testing cascades and conflicts. Invalid operations preserve state and counters.

Deleting one procedure draft restores its published metadata (or removes a new
unpublished procedure). Deleting the branch draft also clears all procedure drafts
and working-set removals through context-owned business logic. Archived branches
reject procedure mutations. IDs, ordering by procedure ID, errors, draft/publication separation
and reference safety rules are local simulator conventions. No provider, network,
credential resolution, billing or tool execution occurs; validation stays enabled.

## Flow template and historical run discovery

Four read operations now expose local template catalogs and saved run metadata:
`GET /v1/flows/templates`, template detail, run list and run detail. Startup/reset
populate `sim-template-text`, an unavailable-model template and a shared template
in `api/scenarios/flow-templates.ts`. Contexts start empty; `emptyFlowTemplates`
clears only this catalog and its historical runs, preserving other flow records.
No template execution, text/media generation, webhook, network request or billing
occurs. Run creation remains generated and uncounted as unfinished implementation.

Workspace-listed templates sort by update time descending with ascending ID ties;
shared templates are omitted from that list but readable by ID. Search matches
name/description without case sensitivity before decimal-offset pagination.
Catalog pages hold 1–25 templates (default 10). Runnable versions sort newest first
with ascending version-ID ties before limiting to 1–10 (default 3 in lists, 10 in
detail). Unavailable versions are omitted, and an unavailable-only template returns
an empty versions array. `has_more_versions` counts further runnable versions.
Availability and shared visibility are explicit synthetic fixture metadata, with
no provider model/permission lookup or authentication enforcement.

Saved runs sort newest first with ascending ID ties; exact version filtering
precedes pagination (1–100 records, default 30). A missing version matches no runs.
Completed/failed fixtures contain synthetic saved text/failure metadata and keep
the concrete template version ID. Missing templates or wrong-template run IDs
return 404. Invalid supported query values return 400. Reads return defensive copies,
instances isolate state and reset restores all records. These cursor, ordering,
availability and error rules are local conventions; contracts and request/response
validation remain unchanged. Finite template/run responses passed a guarded public
Dispatcher validation probe despite recursive schema families in the snapshot.


## Shared voice discovery catalog

`GET /v1/shared-voices` reads three fictional public-library voices, separate from
the canonical owned voice collection. `GET /v1/voices/accents` reads their available
accent catalog. Startup/reset populate both in `api/scenarios/voice-library.ts`;
`emptyVoiceLibrary` clears them without changing owned voices. Context state starts
empty, copies include nested language metadata, and instances isolate changes.
Deleting an owned voice has no effect on public discovery.

Scalar category, gender, age, accent, language, locale and owner filters match
exact, case-sensitive stored fields; search checks name/description case-insensitively.
Use-case and descriptive arrays match any supplied value and combine with other
filters; an empty array matches nothing. Singleton and repeated query values work.
A minimum notice-period filter treats absent notice metadata as zero days.
`featured=true` and `reader_app_enabled=true` restrict results; false/omitted leave
those filters inactive. Custom-rate and live-moderation inclusion switches default
to including both kinds; false excludes the corresponding records. A custom rate
is a nondefault rate multiplier or a nonnull fiat rate. Nullable numeric/boolean
query values receive strict normalization for Counterfact #2612.

The four sorts are descending created date, yearly usage, stored fictional trending
score or clone count, with ascending voice-ID ties. Filters precede zero-based
page pagination (size 1–100, default 30). Total count is the filtered count;
last_sort_id is the final returned voice ID, or null for an empty page.
Invalid query options return 400 without changing state. Accent queries filter by
language and the two fixture model IDs, `eleven_multilingual_v2` and
`eleven_flash_v2_5`; unknown model IDs return 400. Accent rows sort by full code.
These matching, ordering, inclusion and error rules are local simulator conventions.
Rates, usage, reader eligibility and trending values are synthetic metadata,
not provider pricing or analytics. No previews, audio, billing, provider catalog
fetch or voice import occurs. Shared-voice import remains generated.


## Professional voice metadata

`POST /v1/voices/pvc` creates an empty professional voice, and
`POST /v1/voices/pvc/{voice_id}` edits its metadata. Both operate on the canonical
owned-voice map, so V1/V2 lists, filters, detail, settings, collection membership,
subscription slot counts and deletion observe the same record. No samples,
verified languages, trained models, preview or audio are created. Fine-tuning
state is empty and training is disabled locally; this is metadata storage only.

Names and languages must be nonblank strings; language is stored in both
`labels.language` and `fine_tuning.language`. Labels replace the other labels while
retaining the sample language; an explicit conflicting language label returns 400.
An omitted or null labels value preserves labels. Omitted description preserves
it, while null clears it. Other metadata, settings and collection membership
survive edits. Only owned professional voices can be edited; other categories
return 409, nonowned records 403 and missing voices 404. Invalid requests leave
records and ID counters unchanged. These language, null, ID and error conventions
are local behavior, with unchanged contracts and validation enabled.

Contexts start empty. `api/scenarios/pvc-voices.ts` owns the synthetic creation
time, ID counter and canonical accessor. Reset restores the two original voices
and the PVC counter. `emptyPvcVoices` removes professional records only and resets
the counter, preserving other voices. Instances isolate changes and reads return
copies. Sample upload, verification and training routes remain generated and
uncounted as unfinished implementation; no provider or AI request occurs.


## Audio-isolation historical metadata

`GET /v1/audio-isolation/history` lists two synthetic saved records, and
`DELETE /v1/audio-isolation/history/{history_item_id}` removes one record.
Missing or already removed IDs return 404; successful deletion returns empty 204.
Speech history, voices and other media records remain separate. No media files
are stored or deleted, and no isolation, video or audio processing runs. Download
URLs use simulator.invalid and do not serve files; processing flags are inert
historical metadata. Creation and streaming remain generated and uncounted.

Search matches title and separately stored historical text without case sensitivity.
Filtering precedes newest-first ordering with ascending ID ties. Page size is
1–1000 (default 100); the 1-based page is used only when search is supplied,
including an empty search string. Without search, page is validated but has no
effect, as described by the contract. Empty pages return has_more false. Invalid
query values return 400 without changing records. These search, ordering and
error choices are local simulator conventions; contracts and validation stay unchanged.

Contexts start empty. Startup/reset populate `api/scenarios/isolation-history.ts`;
`emptyIsolationHistory` clears only these records. Reads return defensive copies,
instances isolate state and reset restores deleted records.


## Stored speech transcripts

`GET /v1/speech-to-text/transcripts/{transcription_id}` reads saved single-channel
or multichannel transcript metadata. `DELETE` removes the whole saved transcript,
including every channel. The two baseline records, `sim-transcript-single` and
`sim-transcript-multichannel`, contain fictional text and timing data; the single
record includes character timings and a saved plain-text additional format. Reads
return nested defensive copies. No speech recognition, transcript editing,
audio download, format conversion, model inference or provider request runs.
Creation remains generated and uncounted as unfinished implementation.

Contexts initialize empty. Startup/reset populate `api/scenarios/stored-transcripts.ts`;
`emptyStoredTranscripts` clears only these saved transcripts. Deletion preserves
voices, speech history and other records. Missing or already deleted IDs return
404 with `detail.status: "transcript_not_found"`; deletion returns 200 with
`{"status":"ok"}`. These response/error choices are local simulator conventions.
The retrieval contract has no job-status field, so only completed saved results
are modeled. Authentication is not enforced. Instances isolate state and reset
restores both records; contracts and request/response validation remain unchanged.


## Historical agent test invocations

Three `/v1/convai/test-invocations` operations now list/read historical invocations
and cancel their pending runs. Startup/reset seed two fictional invocations in
`api/scenarios/test-invocations.ts`; `emptyTestInvocations` clears them. Context
containers start empty. No tests, models, conversations, tools or providers run.

Lists filter exact historical agent, branch, version, creator and test IDs, plus
inclusive unix-second creation bounds. Test filtering retains the complete
invocation and its counts. Case-insensitive search checks invocation titles and
stored test names. Deleted live agents/tests do not remove or rename history.
Results sort newest first with ascending ID ties; decimal-offset cursors paginate
after filtering, with size 1–100/default 30. Bounds must be nonnegative safe integers
and start must not exceed end. Unknown filters yield empty pages; invalid queries
return 400. Nullable time query text is normalized narrowly for Counterfact #2612.

Cancellation changes only pending runs to cancelled and marks the invocation
cancelled. Passed/failed/cancelled runs retain their timestamps and results.
Repeated cancellation and terminal-only invocations are no-ops. Missing IDs
return 404; cancellation returns empty 204. List counts derive from the same runs
as detail reads. Reads return nested defensive copies; instances isolate state.

Baseline cost fields are null because no historical cost data is recorded. The
`testInvocationUsage` setup stores fictional credits and finalized per-run USD
prices and a historical mixed-version run; summary totals sum recorded values,
with null when none are known. Final USD totals are separate historical metadata,
not inferred from partial provider charging components. No billing occurs.
Reset restores baseline. These ordering, matching, cost and cancellation rules are
local simulator conventions.

`PATCH /v1/convai/test-invocations/{test_invocation_id}` persists a user-provided
name; null restores the generated title in list responses. Names must be nonblank
and at most 140 characters, a local convention. Renaming preserves run results,
historical agent/test names, costs, creation time and cancellation state. History
can be renamed after its live agent or test is deleted. Missing invocation IDs
return 404; invalid requests return 400 without changes. Reset restores baseline
names, and instances isolate edits.

Run-tests and resubmit remain generated and uncounted because their recursive
configuration-override request schemas trigger Counterfact #2613 before the
handler runs, even when no override is supplied. A guarded exact-template public
Dispatcher probe confirmed both failures; finite invocation PATCH controls pass
and invalid name bodies return 400. Contracts and validation remain unchanged.

## Local LLM usage estimates

`POST /v1/convai/llm-usage/calculate` and
`POST /v1/convai/agent/{agent_id}/llm-usage/calculate` return deterministic local
estimates for every model currently in the canonical LLM catalog, in catalog order.
These are fictional USD values for UI testing, not ElevenLabs or provider prices.
No tokenizer, inference, retrieval, provider request, billing or usage mutation runs.

The synthetic formula uses `ceil(prompt_length / 4)` input-token units plus 1,000
units per page. RAG caps the page contribution at two pages. Every message adds
128 output units; a minute means three such messages. For each model, message
cost is `(input_units * input_rate + 128 * output_rate) / 1,000,000`; minute cost
uses the same unrounded cost times three. Both round to nine decimal places.
Rates and assumptions are populated in `api/scenarios/llm-usage.ts`; contexts
initialize empty. Baseline input/output rates are 1/2, 2/4, 3/6 and 4/8 for
`gemini-3.5-flash`, `gemini-2.5-flash`, `gpt-4o` and `gpt-4o-mini`, respectively.

The public calculator requires nonnegative safe-integer character/page counts
and a boolean RAG flag. The agent calculator defaults omitted/null fields to the
current canonical prompt's Unicode code-point length, existing agent knowledge-size
projection, RAG setting (false when absent), and service tier (standard when absent).
The knowledge-size projection counts each distinct stored text document as one
local page, including folder descendants; it does not inspect PDF or URL content.
Explicit nonnull overrides, including zero and false, take precedence. No branch
or version selector is accepted by these contracts; agent defaults use canonical
main configuration. Reads of archived agents are allowed. Unknown/deleted agents
return 404. Invalid bodies or unknown options return 400 without changing state.

Fast tier uses the model's synthetic multiplier only when the live catalog lists
that tier; otherwise it falls back to standard as the contract describes. Baseline
models list only standard. Run `llmUsageFastTier` to enable fast on `gpt-4o` with
multiplier two and give `sim-agent` fast/RAG defaults. Other models retain standard
prices. Run `emptyLlmUsage` to clear rate metadata (live models then return 400
`llm_rate_unavailable`); `reset` restores rates, catalog and agent configuration.
An empty canonical model catalog returns an empty price list. Responses are fresh
copies, and instances isolate all scenario changes. These formula, rounding,
page-count and error conventions are local simulator behavior.

## Audio-effects catalog

`GET /v1/audio-effects/catalog` returns fictional filter-preset, reverb-environment
and background-noise metadata. Each collection sorts by its ID, a local simulator
convention; descriptions may be null. These identifiers support local picker UI
testing and are not claims about current ElevenLabs effects. No audio effects,
speech synthesis, asset loading or provider request runs. Other operations do not
apply these effects as part of this catalog slice.

Contexts initialize empty. Startup/reset populate `api/scenarios/audio-effects.ts`;
`emptyAudioEffects` clears only these three catalogs. Reads return defensive copies,
instances isolate state, and reset restores baseline metadata. The contract has
no query options. Request/response validation and the contracts remain unchanged.


## Agent branch merges and rebases

Four branch operations now preview and apply local configuration merges under
`/v1/convai/agents/{agent_id}/branches`: `GET /{source_branch_id}/merge-preview`,
`POST /{source_branch_id}/merge`, `GET /{branch_id}/rebase-preview` and
`POST /{branch_id}/rebase`. Merge requires `target_branch_id`;
rebase accepts `source_branch_id` and defaults it to the canonical main branch.

The lifecycle context finds a shared version ancestor, then merges
`conversation_config`, `platform_settings`, `workflow` and `procedures` recursively.
Arrays, procedure-version references and objects with different discriminator
values are atomic. Deletions are retained. Other agent envelope fields, including
name, tags, access information and creation metadata, stay with the destination.
The main branch contributes its current canonical configuration, including live
analysis, knowledge-base and MCP references that may postdate its tip snapshot.
Preview conflicts report the ancestor, source and destination values and dot paths.
Merge conflicts use the greater of commit and configuration-update timestamps;
the source wins only when newer, or with `force: true`. Ties retain the destination.
Rebase always retains the destination's conflicting changes. The common ancestor
is the nearest by combined parent distance, with version ID breaking ties.
These merge and ordering choices are deterministic simulator conventions.

Previews do not mutate state. Applying a merge or rebase creates a new immutable
version on the destination with both parent links, advances its branch tip and
updates canonical agent reads when the destination is main. Published procedure
references remain readable across branches; working drafts stay on their original
branch and are neither published nor discarded. Rebase rejects an unchanged result
with 409. Merge can record an unchanged result as a new version. The preview's
`source_identical_to_target` reports that unchanged destination result.

Merge archives its source by default; `archive_source_branch: false` preserves it.
Archiving main or a branch receiving live traffic fails with 409 before any version,
ID counter or configuration changes. Archived branches, absent shared ancestry and
incomplete ancestry also fail with 409; missing agents/branches return 404. Invalid
options return 400. Procedure-generated workflow elements are unsupported and
explicit `include_procedure_generated_workflow_elements: true` returns 400.
No workflow, procedure, provider request or model executes. Contracts and validation
remain unchanged. Proposal merges reuse this same engine.

Contexts start empty; startup/reset seed ancestry and reset the version counter in
`api/scenarios/agent-lifecycle.ts`. `branchMergeConflicts` adds divergent live-main
settings; `branchMergeReferences` adds a published feature procedure version and
atomic list conflicts. Reset removes created versions and restores main, feature,
procedure references and branch-local drafts. Simulator instances remain isolated.


## Synthetic knowledge sources and agent retrieval

Eight source/retrieval operations now share canonical knowledge-base records:
URL creation, crawl create/list/detail/cancel, URL refresh, file-source URL reads,
and agent RAG queries. The simulator never fetches a web page, follows a link,
extracts a file, embeds text, rewrites a query or calls a provider.
All source content and retrieval rankings are explicit scenario fixtures.

Startup/reset configure `https://simulator.invalid/guide` and its `/faq` child
as synthetic source pages while preserving the original two-document baseline.
URL creation accepts only configured HTTP(S) URLs with no credentials or fragment;
unknown sources return 400 before allocation. Custom names and existing parent
folders are supported. URL and scenario-file records participate in existing
list/detail/summary/content/search/move/delete/index operations; text-only PATCH
content and synthetic page-size estimates retain their existing rules.

Crawl creation validates options before creating a queued job and root folder.
Discovery uses configured pages at the seed URL and beneath its path, seed first
then URL order, limited by `max_pages` (1–10,000, default 1000). Explicit
`sitemap_urls` select configured fixture pages instead, with duplicate URLs
removed. `max_depth` is validated but is a deprecated no-op in the contract.
Nonempty pattern/exclusion settings, auto-discovery and automatic synchronization
return 400 explicitly. Run `completeKnowledgeCrawls` to populate URL children
from the current fixtures and finish queued jobs; missing sources/root folders
produce failed status. Repeating completion leaves terminal jobs unchanged.

Crawl lists show all stored local-user jobs newest first with ID ties and
1–100-item decimal-offset pagination. `include_job_ids` accepts singleton/repeated
values; all stored jobs are already included, so it introduces no duplicates.
Cancellation retains cancelled job metadata, deletes its root subtree and any
associated documents moved elsewhere, clears their indexes/source links and
canonical agent references, and is idempotent. Missing jobs return 404.

`knowledgeSourceRevision` replaces the guide's fixture content. Refreshing a URL
then updates escaped HTML, UTF-8 size and timestamp and invalidates its indexes.
Unchanged refreshes preserve timestamps/indexes; non-URL refreshes return 400.
`knowledgeSourceFiles` adds `sim-kb-file` and its fixed synthetic download URL.
`source-file-url` accepts file records only; its `simulator.invalid` URL is an
opaque fixture and does not provide an actual signed download service. Multipart
file creation/update remain generated under Counterfact #2607.

`knowledgeSourceRetrieval` assigns the text fixture to the canonical main agent,
enables its RAG settings and provides exact query `guide` with two fictional
chunk distances (0.1 and 0.4). Unconfigured queries return no chunks. Retrieval
uses the selected branch (live canonical main by default), current KB membership,
folder descendants, auto-usage records and completed indexes. Historical branch
configuration stays separate. Stale/missing chunks cannot consume result limits.
Rankings sort by distance then document/chunk ID; model, distance, chunk-count
and aggregate character limits filter results. Oversized next chunks stop the
result. The query is echoed unchanged and no conversation/state is created.

Agent defaults apply unless `use_agent_defaults=false`, which enables neutral
scenario defaults (distance 0.6, 20 chunks, 50,000 characters) while retaining the
agent embedding model. Explicit nonnegative integer length/count overrides,
including zero, take precedence. Agent RAG disabled returns no chunks with agent
defaults; prompt-only references are excluded. Configured query rewriting returns
400 because no rewriting occurs. Unknown agents/branches return 404 and invalid
requests return 400. Responses are copies; reset clears jobs, added documents,
rankings, file URLs and counters, restores source fixtures, and isolates instances.
These matching, ranking, fixture URL and lifecycle rules are local conventions;
request/response validation and contracts remain unchanged.


## Conversation search and synthetic analysis

Five operations now search saved transcript messages, apply local analysis fixtures,
and report live conversation counts. Text search uses a case-insensitive substring
of plain message text. Each hit returns its canonical transcript index and three
matched/unmatched highlight segments; the score is query length divided by message
length. Smart search returns only explicit exact-query rankings configured by
`conversationInsights`, with no semantic model, embedding or provider request.
A ranked message is omitted if its conversation is deleted, transcript index changes,
or current text differs from the fixture. Context-update and empty turns are excluded.

Supported conversation filters apply before message ranking and pagination. Search
sorts by descending score (default) or descending creation time, then conversation ID
and transcript index. Decimal-offset cursors paginate 1–50 messages (default 20).
Advanced evaluation/data/tool/procedure/topic filters and summary inclusion return
400 explicitly. Smart search accepts agent and branch filters only. Empty queries,
invalid sort/page/cursor options return 400. Unknown agent/filter values match no conversations.
These lexical matching, scoring and pagination rules are simulator conventions.

The two analysis POST routes synchronously apply an explicit scenario snapshot;
they do not evaluate a transcript or invoke a model. `conversationInsights` attaches
two current analysis items and stores synthetic success and collected-topic results.
Full analysis replaces current evaluation/data results using live canonical main
attachments. A single-evaluation rerun updates only the requested result; agent-scope
results preserve unrelated criteria/data and other branch scopes. A previously empty
analysis starts with unknown overall success and an empty summary for a selective run.
Single reruns preserve existing overall success, summary and data results.

Analysis requires a completed or failed conversation and an existing live agent.
Unconfigured outcomes or changed current definition versions return 409 before any
mutation; missing agents, attached definitions or requested evaluations return 404.
Legacy inline analysis definitions are unsupported and return 400. Current definition
versions must match the explicit scenario fixture. Reset restores baseline definitions;
then rerun the setup to configure the fixture again. Historical reads and search remain available after
agent deletion. Reads return copies and failed operations leave analysis unchanged.

Live count derives directly from initiated/in-progress canonical conversations;
processing, done and failed records are excluded. `agent_ids` (singleton/repeated)
takes precedence over `agent_id`; an empty array matches none. The setup adds one
in-progress record, and deleting it changes the count immediately. Context containers
start empty; startup/reset in `api/scenarios/conversations.ts` clear rankings/outcomes
and restore the historical baseline. Instances isolate state. Contracts and request/
response validation remain unchanged; all values are synthetic local conventions.


## Synthetic outbound communication

Ten communication operations now persist WhatsApp account settings and queue local
Twilio, Exotel, SIP and WhatsApp actions. No provider request, phone call, message,
recording, speech synthesis or model execution occurs. Queuing creates an initiated
canonical conversation with empty transcript, no audio and zero synthetic cost;
conversation reads/lists and live count observe the same record. Provider call IDs
are increasing local identifiers. The account and request containers start empty.

Startup/reset in `api/scenarios/synthetic-outbound.ts` populate `sim-whatsapp`,
assigned to `sim-agent`, and wire live canonical accessors. Account lists sort by
phone-number ID; reads return copies and resolve assigned agent names live.
PATCH persists the three enable flags, preserving omitted/null flags; explicit
null assignment detaches the agent. Missing accounts/assigned agents return 404.
Deleting an account preserves historical conversations. Deleted agents project a
null name while retaining historical assignment metadata.

Outbound calls require an existing nonarchived agent, a matching phone provider
and outbound capability; SIP also requires an outbound trunk. The existing Twilio
fixture works at baseline. Run `syntheticOutboundProviders` to add fictional Exotel
metadata and enable the SIP fixture. Destinations use E.164 syntax. Twilio register
checks the local number against inbound/outbound direction and returns contract
`text/html` TwiML containing a synthetic `wss://simulator.invalid` URL. This URL
is an inert fixture, not a WebSocket service. Registration still creates local
conversation state. Phone deletion does not remove already queued history.

Client data supports user ID, existing branch ID and production environment.
Selected branches supply their immutable version ID; canonical main uses live
configuration. Archived branches fail with 409. Other client overrides, dynamic
variables, procedure selection and nonproduction environments return 400 explicitly.
Recording, machine detection and nondefault ringing options are unsupported;
default false recording and 60-second ringing metadata are accepted without
performing telephony. All checks precede ID allocation and state writes.

WhatsApp call/message routes require an unexpired account assigned to the selected
agent. Disabled messaging blocks outbound messages. Template names/languages and
contact IDs are stored as synthetic request metadata; only empty message template
parameter arrays are supported. No template is rendered or sent. Audio-response
and typing flags are persisted configuration only. Outbound message conversations
are text-only; calls are not. These ID, matching, failure and subset rules are
local simulator conventions, with contracts and validation unchanged.

Run `completeSyntheticOutbound` to mark only currently initiated local requests
done, with zero duration and no invented transcript/audio. Repeating completion
leaves terminal records unchanged. `emptySyntheticOutbound` clears accounts and
request metadata without deleting canonical conversation history; `reset` restores
the full baseline and counters. Instances isolate all changes. All six request
contracts passed guarded finite Dispatcher probes against the unchanged V1 spec
before implementation; no additional recursive-schema blocker was observed.


## Synthetic client credentials

Five credential operations issue deterministic local placeholders: both signed-URL
spellings under `/v1/convai/conversation`, its `/token` endpoint,
`POST /v1/convai/realtime/client_secrets`, and
`POST /v1/single-use-token/{token_type}`. The signed-URL alias uses the same issuer
and options. URLs point to `wss://simulator.invalid`; tokens begin with `sim-`.
These values authenticate no service, create no session or conversation, and run
no provider request. Conversation IDs are reserved identifiers only; conversation
reads and live counts stay unchanged. There is no redemption endpoint or simulated
consumption, and no cryptographic signing or authentication enforcement.

Conversation credentials require an existing unarchived agent. Branch selection
uses current canonical main configuration or the selected branch tip; explicit
version selection keeps its immutable snapshot. Branch and version cannot be
combined, and archived selected branches are rejected even through a version ID.
Unknown agents, branches or versions return 404; archived resources return 409.
Only production environment and disabled debug events are supported. Unknown
speech-engine external IDs have no local agent mapping and return 404. Signed URLs
include the selected branch/version IDs and may reserve a conversation ID with
`include_conversation_id=true`. WebRTC tokens always reserve an ID and preserve an
optional nonblank participant name in issuance metadata. Invalid and unsupported
requests return 400 before allocating identifiers.

The shared issuer records copies of selected configurations and session metadata.
Contexts start empty. Startup/reset use `api/scenarios/synthetic-credentials.ts`
to clear issuance records and counters, wire accessors, and set the fixed issuance
time to unix second 1735689600. Signed URLs and single-use tokens expire 900 seconds
later; WebRTC tokens and client secrets default to 600 seconds. Each simulator
instance has its own monotonic shared sequence. All these clocks, IDs and TTLs are
local simulator conventions; time does not advance automatically.

Single-use issuance supports `realtime_scribe`, `batch_scribe`, and `tts_websocket`.
Client secrets accept an optional `expires_after` with anchor `created_at` and
1–3600 whole seconds. Send JSON `{}` for the default client secret; absent optional
bodies remain subject to Counterfact #2614. Supported session fields are type
`realtime`, either current contract model ID, instructions, distinct text/audio
output modalities, temperature 0–2, positive whole output-token limits or `inf`,
and a whole duration of 1–3600 seconds. Explicit null session fields return 400;
null top-level session/expiry preserves defaults. Audio, tools, tracing, prompt,
turn-detection and other session options return 400 rather than claiming to run
them. Issuance does not change realtime groups or their existing conversations.

## Bounded Studio conversion and snapshots

Eleven additional Studio operations queue project/chapter conversion, list/read
immutable snapshots, download buffered snapshot audio/archives, queue a synthetic
bulletin podcast, and clear content using the optional bodyless content operation.
No synthesis, podcast writing, summarization, normalization, fetching or provider
request occurs. A bulletin retains the supplied text verbatim in a new canonical
project/chapter; only one text source and bulletin host are supported. Existing
speech-capable models and voices are required before conversion is queued.

Conversion captures current content and locks project/chapter edits until
`completeStudioConversions` runs. The scenario populates immutable snapshots and
marks live conversion state complete. Repeated completion does nothing. Each
captured chapter receives a copy of the independently decoded 8,340-byte MP3
silence fixture documented above; a project audio response concatenates its
chapter MP3 fixtures. Synthetic character timing divides each chapter's fixed
duration evenly over Unicode code points. Project timings offset each chapter.
Counts use UTF-16 text length, matching the existing Studio metadata convention.
Only standard quality, automatic normalization metadata, disabled volume/quality
processing, at most 100 chapters and 2,000 characters per chapter are
supported. Conversion consumes no fictional character quota or speech history.

Project conversions create project and chapter snapshots. Chapter-only conversion
creates chapter snapshots only. Snapshot metadata and media survive live content
edits, blank resets and chapter deletion; deleting the project removes its jobs
and snapshots. Historical chapter IDs remain usable for snapshot reads/listing.
Archives contain one percent-encoded chapter-ID MP3 per captured chapter, using
STORE, CRC-32 and fixed ZIP timestamps. An independent Python `zipfile` check
verified archive integrity and the extracted fixture hash. Returned bytes and
metadata are copies; startup/reset clear all jobs/snapshots and restore counters.

Both stream paths return complete buffered `audio/mpeg`, with no incremental
framing. Send JSON `{}` for default stream options under Counterfact #2614;
`convert_to_mpeg` false/true both select the fixture's existing MP3 format.
Archive MIME follows the contract's `application/x-zip`. Podcast accepts standard
quality, default duration metadata and auto normalization; nondefault generation
controls, URL/multiple sources, conversation mode, language, callback, intro/outro,
highlights and instructions return 400. It does not generate a podcast script.

`POST /v1/studio/projects/{project_id}/content` with no body and no Content-Type
clears live chapters/muted tracks, following its documented blank initialization
case. Any content type or supplied body returns 400; multipart content imports
remain blocked by Counterfact #2607. Historical snapshots are preserved. Unknown
projects, chapters, snapshots or dependencies return 404; overlapping conversion
or edits during a pending conversion return 409. These are local conventions.


## Bounded synthetic music

Five JSON music operations now share a fixed local plan and silence fixture:
`POST /v1/music/plan`, `/v1/music`, `/v1/music/stream`, `/v1/music/detailed`
and `/v1/music/detailed/stream`. Prompts are retained as input metadata only;
no prompt interpretation, composition, lyrics, model inference, provider request,
quota charge, or music-history insertion occurs. The plan always has one section,
`Synthetic silence`, empty style/lyric lists, and a duration of exactly 3,840 ms.
The audio repeats the independently decoded silent MPEG frame above 147 times:
61,299 bytes, 169,344 sample frames, stereo, 44,100 Hz, nominal 128 kbps.

Only `music_v1` is supported; startup/reset append that synthetic catalog
entry with text-to-speech and voice-conversion capabilities false. Missing catalog
entries return 404. Prompt input must be nonblank and at most 2,000 Unicode code
points. Composition accepts either a prompt or the exact fixed plan returned by
`/plan`; object property order does not matter. Changed plans, source-plan edits,
deprecated music prompts, lyrics, seeds, finetunes and nondefault effects return
400. Omitted/null duration uses 3,840 ms; explicit duration must match exactly
and is allowed with prompt input only. Other durations return 400. Only omitted,
`auto`, or `mp3_44100_128` output is supported. Default false flags, finetune
strength 1, detailed model style `music`, prompt-only generation mode `track`,
and default respect-section-durations true are accepted. Enabling timestamps,
waveform visuals, signing, inpainting, phonetic names or forced instrumentation,
changing section-duration behavior, or selecting other modes/models returns 400
before IDs or retained state change. Optional request bodies still need JSON
input under #2614; send a prompt or plan rather than an absent body.

Binary endpoints return ordinary `audio/mpeg` responses. Detailed responses use
actual `multipart/mixed` boundary framing: a JSON composition plan/song metadata
part followed by the binary MP3 attachment. Detailed stream returns one complete
ordinary `text/event-stream` response with JSON `composition_plan`, `song_metadata`,
`audio_chunk` and `done` events. The single audio event contains `audio_base64`,
empty `words_timestamps` and `waveform_visual` arrays; `done` carries `song_id`.
These event payload keys and metadata are explicit simulator conventions. Both
stream paths buffer the bounded result, without incremental timing simulation.

Accepted compositions return increasing `song-id` headers. Context containers
start empty; `api/scenarios/bounded-music.ts` populates the plan, media, model
accessor and counters during startup/reset. Plans and songs retain immutable
copies of inputs/results unless `enable_logging=false`; zero retention still
allocates the next local ID. Reset clears both maps and counters. Instances
isolate state, and returned plan/media copies cannot modify retained records.

## Bounded dubbing processing

Seven additional dubbing operations use synthetic local outcomes: project target
transcript regeneration; resource transcribe, translate, dub, render and speaker
similar-voice discovery; and legacy dubbed audio retrieval. No transcription,
translation, similarity analysis, synthesis, media fetching, webhook or provider
request runs. Multipart project/dub creation still requires source-file or URL
input and remains generated under Counterfact #2607; an absent body cannot create
a useful source project.

Resource processing accepts explicit segment IDs; an empty segment array selects
all segments. Translate/dub require `languages`, where null or an empty array
selects every target language. Duplicate IDs are collapsed. Unknown members fail
atomically. Transcription replaces selected source text with
`[synthetic transcript] ` plus its captured text (or segment ID when blank), and
marks target audio stale. Translation writes `[synthetic LANGUAGE] SOURCE` without
producing audio. Dub fills missing source/target text using those conventions and
attaches inert synthetic MP3 references, marking selected target audio current.
Each accepted job increases the version once; completion increases it once more.

Run `completeDubbingProcessing` to complete queued resource work and project target
regeneration. Requests retain copied snapshots and resource edits/overlapping jobs
return 409 while pending. Completion is idempotent. Render supports only MP3 with
normalization omitted/null/false; other formats or enabled normalization return
400. Every target segment must have current dubbed audio before rendering;
`original` selects source audio. Renders use IDs `sim-dubbing-render-1` upward,
progress from `processing` to `complete`, and expose inert `simulator.invalid`
URLs in canonical resource metadata. Those URLs do not serve downloadable media.
All generated MP3 references describe the fixed silence duration documented above.

Target regeneration requires stale output with edited segments and nonblank
translations. It captures only edited surviving segments, reports their summed
region duration and changes the target to `processing`. No edits returns 409;
source/target edits during that queue also return 409. Completion publishes the
captured revision and preserves edited text. Charged seconds and remaining free
allowance are always zero: no pricing, quota or allowance policy is simulated.
The older `completeDubbingLanguages` scenario leaves explicit regeneration jobs
for `completeDubbingProcessing` to finish. Deletion cancels target/project jobs.

Similar-voice results are a copied, fixed startup list of the two canonical
fictional voices, with no similarity scores or ranking claim. Missing resources
or speakers return 404. Legacy completed dub `sim-legacy-dub` serves independent
copies of the same 8,340-byte synthetic MP3 for `en`, `es` or source alias
`source`, as complete buffered `audio/mpeg` responses. Pending legacy dubs return
425 and missing languages return 404. Legacy deletion removes its audio. Modern
resource processing leaves legacy automatic-dub audio unchanged.

Contexts initialize empty containers; startup/reset populate candidate/media
fixtures, counters and queues in `api/scenarios/dubbing-processing.ts`. Empty
resource/project/legacy scenarios clear their related state. Reset restores all
baseline fixtures and cancels pending work. Instances isolate every change.
These IDs, markers, version increments, status/error and billing rules are local
simulator conventions.

## Voice samples and synthetic PVC training

Eleven sample/PVC operations now share canonical voice sample metadata. Run
`voiceSampleFixtures` to attach the independently decoded 8,340-byte MP3 silence
fixture above to `sim-narrator` (`sim-regular-sample`) and a professional voice
`sim-pvc-samples` (`sim-sample`). Startup/reset keep the original voices without
samples. No upload, denoising, trimming, diarization, training, identity check,
captcha verification, model execution or provider request occurs.

Ordinary sample audio is a complete buffered `audio/mpeg` response. PVC sample
preview and separated-speaker audio follow their JSON contracts with matching
base64 bytes, `audio/mpeg` media type and 23040/44100-second duration. The visual
waveform has twenty zero amplitudes for decoded silence. Noise removal true and
actual trim changes return 400. Omitted/null trim values leave metadata alone;
zero start and the exact full duration in milliseconds are accepted as no-ops.
Response `trim_start`/`trim_end` metadata uses seconds as a local convention.
Filename edits persist, while null filenames preserve the current name.

Speaker separation moves from `not_started` to `pending`; run
`completeVoiceSampleSeparation` to publish a single synthetic `sim-speaker` with
copied captured silence. This is a fixed fixture, not detected speech. Repeated
completion is inert; pending edits/restarts fail with 409. Completed separation
cannot be restarted. Speaker selection replaces the selected-ID list after every
ID is validated; null preserves selection and an empty list selects none. Training
rejects any sample with an explicitly empty speaker selection. Sample
metadata and audio are shared by regular and PVC endpoints. Sample deletion
removes the canonical sample, its media and separation state through either path.

Captcha GET returns a `text/plain` synthetic read-aloud challenge; the contract
specifies no response content format. It does not mark a voice verified. Required
multipart captcha submission, verification and sample upload remain generated
under Counterfact #2607. Run `verifiedVoiceSampleFixtures` to explicitly allow
local training of the sample fixture and mark the existing synthetic multilingual
model trainable. This scenario preserves current samples and edited metadata.

Training accepts only `eleven_multilingual_v2` (the default), with an existing
trainable catalog entry, owned professional voice, local verification gate and
at least one sample. It captures copied sample metadata/media/language and queues
canonical fine-tuning state. Training has no minimum real-world dataset duration
and consumes no character quota. Pending training blocks metadata/sample edits,
sample deletion, separation and overlapping training. Run
`completeVoiceSampleTraining` to publish `fine_tuned`, captured dataset duration
and the high-quality model ID; repeated completion does nothing. This indicates
only a completed local fixture action, not a trained usable voice or model.

Missing voices/samples/speakers/media return 404; invalid or unsupported options
return 400 before mutation; unmet gates or conflicting work return 409. Captured
training metadata survives later sample edits/deletion. Voice deletion cancels
pending work and removes all its sample media and retained processing captures.
Reset clears processing/media maps and restores the baseline catalog/gates.
Contexts start with empty containers, scenarios own fixtures and completion, reads
copy metadata/media, and simulator instances isolate all state. These fixture IDs,
challenge format, gates, statuses and transitions are local conventions.

## Shared voice import and isolated replicas

`POST /v1/voices/add/{public_user_id}/{voice_id}` imports a fictional catalog
voice under its existing ID and the requested nonblank name. Owner and voice IDs
must match the shared catalog. `bookmarked` defaults to true; both true and false
persist on canonical voice reads and shared-library projections. Imported voices
are nonowned, occupy one slot under the existing simulator convention, and share
V1/V2 discovery, settings and deletion behavior. Import uses copied catalog
metadata and default settings, with no samples, audio or provider request.
Duplicate IDs and exhausted slots return 409 without changing state. Deletion
clears shared-library added/bookmark projections; catalog records remain intact.

`POST /v1/voices/{voice_id}/replicate-to-isolated-environment` captures copied
canonical voice metadata/settings into a separate target-workspace map. It does
not create a real workspace or transfer media. Startup/reset define the synthetic
`sim-isolated-workspace`, billing group, distinct residency and write permission;
source policy permits owned generated/cloned voices from the central environment.
Human callers require target write permission; the synthetic service-account
policy exempts that target check. Missing targets/voices return 404, forbidden
permissions/billing groups return 403, and unsupported categories or same-residency
targets return 400. Queued training and target ID collisions return 409 atomically.

Omitted/true `preserve_voice_id` retains the source ID; false allocates
`sim-replicated-voice-N` IDs while skipping collisions. Replicas are independent
snapshots: source edits/deletion do not change them, and they do not consume source
voice slots. No target HTTP API or authentication is simulated. Unknown options
and invalid values return 400. Empty context containers, scenario-owned policies,
reset and separate instances keep all state local and isolated. These ID, slot,
permission and status conventions describe this bounded simulation.


## Local AudioNative article publication

Two AudioNative operations read player settings and update content from a URL.
Startup/reset configure `sim-project` with an exact local article mapping at
`https://simulator.invalid/articles/local`. The scenario supplies the article
text; no URL fetching, HTML extraction, model or provider request occurs. Unknown
URLs return 400, and missing canonical Studio projects return 404. Other existing
Studio projects return disabled player settings until explicitly configured.
Multipart player creation and file imports remain generated under #2607.

URL updates replace live Studio chapters with one article chapter containing the
title, author and fixture text, separated by newlines. Omitted/null title and
author use scenario defaults; empty strings are accepted metadata. Updates also
work after a Studio blank-content reset. Canonical Studio dependency, quality,
2,000-character and pending-conversion checks apply before mutation. Concurrent
updates and Studio edits return 409. These rules are local simulator conventions.

`completeAudioNative` completes only the Native publication queue, using Studio's
bounded silence conversion and immutable snapshots. Unrelated Studio conversions
remain pending. Published snapshots stay readable while replacement content is
processing, and repeated completion is inert. Settings retain null audio paths
and URLs; the simulator does not host player assets. Studio snapshot routes serve
the copied media. Deleting the canonical project removes its conversions and
snapshots; Native completion discards its missing project's publication.

`emptyAudioNative` removes player configuration, article mappings and Native
publication work. Existing canonical Studio conversion jobs remain pending and
can finish through `completeStudioConversions`; no disabled player is republished.
Full `reset` clears both groups and restores the baseline. Context containers
start empty, scenarios own all fixtures, and separate instances isolate state.


## Historical agent topic discovery results

`GET /v1/convai/agents/{agent_id}/topics` reads immutable synthetic completed
runs for the canonical agent. Startup/reset seed two daily runs for `sim-agent`;
the default returns only the latest (2025-01-02 UTC). The labels and metrics are
scenario fixtures, with no discovery, conversation analysis, model or provider
request. Live agent edits leave historical runs and stored agent versions alone.
Missing/deleted agents return 404 even when historical runs remain stored.
Existing agents without runs return an empty list and zero window bounds.

Listing supports `page_size` (1–100, default 30), integer-offset `cursor`, all
four `sort_by` values and `asc`/`desc` direction (default conversations/desc).
Sentiment and frustration sort by stored sum/count; missing scores always sort
last, and topic IDs break ties. Fixtures are independent top-level groups without
inferred hierarchy. `include_evaluation_criteria=false` removes only the criteria
breakdown, preserving the stored weighted `success_rate`.

Both date bounds must be provided together. Start is floored to its UTC day;
only complete daily runs within the resulting start-inclusive/end-exclusive
window qualify. One matching run is returned with `aggregated_run_count: 1`;
no matches return empty topics with the requested window and count zero.
Windows matching multiple runs return 400 `unsupported_topic_aggregation`;
combining topic identities or metric distributions across runs is not simulated.
Invalid/unknown query options return 400 before changing state. Numeric query
text is strictly normalized for runtime #2612. Cursors are local offsets, scoped
by the caller's unchanged query. Offsets past the end return an empty final page.

Context containers start empty; `api/scenarios/agent-topics.ts` owns all fixtures.
`emptyAgentTopics` clears completed runs, and reset restores the baseline.
Reads return defensive copies and separate instances isolate state. IDs, windows,
ordering and error rules above are local simulator conventions.


## Agent custom hold-audio removal

`DELETE /v1/convai/agents/{agent_id}/hold-audio` removes only the live canonical
agent's `platform_settings.queueing_config.hold_audio` metadata and returns its
`agent_id`. Canonical and main-branch reads immediately reflect removal; stored
versions and feature-branch snapshots remain unchanged. Queue enablement, timeout,
default-tone URL and all other agent fields are preserved. Repeated removal and
agents without custom audio succeed without adding queue configuration. Missing
or deleted agents return 404. These idempotency and status rules are local
simulator conventions; no audio playback, call or provider request occurs.

Run `agentHoldAudioFixture` to populate inert custom metadata on live and historical
fixtures, including a live timeout that differs from its stored main version.
Reset removes this optional setup and restores the baseline. Contexts start empty,
scenarios own fixtures, and separate instances isolate changes. The multipart
upload operation remains generated under Counterfact #2607.
