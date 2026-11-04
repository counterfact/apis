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
the stateful voices implementation. The remaining 430 operations retain their
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
and `next_page_token`. Tokens are local integer offsets. Other V2 filters
return HTTP 400 rather than being silently ignored. `total_count` is always
returned, as required by the snapshot's response schema; `include_total_count`
is accepted. A page beyond the end returns an empty list and a null token.

Settings edits preserve omitted and null values and leave defaults and other
voices unchanged. Missing voices return HTTP 404 with
`detail.status: "voice_not_found"`. Invalid bodies return HTTP 400 through
Counterfact's request validation. These error and partial-update conventions
are local simulator behavior. Authentication and other ElevenLabs business
rules are not implemented.

Restart or run `.scenario reset` to restore the fixtures. In programmatic use,
call `app.scenario("reset", "api")`. All callers share state; it is not persisted.

## Development

```sh
npm run generate
npm run typecheck
npm test
```

Generation reads both local contracts and preserves authored handlers.
Tests verify spec provenance, version routing, and shared voice behavior over
real HTTP, plus context state transitions and listing rules directly.
HTTP tests require permission to listen on localhost.

Some upstream paths have sibling wildcard parameters with different names
(agent branches, knowledge-base documents, pronunciation dictionaries, and
voice generation). Counterfact may report routing ambiguities in those areas.
