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
and combined route types. All 437 operations initially use generated random
responses. This baseline does not synthesize speech or model service behavior.

Swagger UI is at http://localhost:3100/counterfact/swagger/api/?version=v1
and http://localhost:3100/counterfact/swagger/api/?version=v2.

## Development

```sh
npm run generate
npm run typecheck
npm test
```

Generation reads both local contracts and preserves authored handlers.
Tests verify spec provenance, version routing, and version-specific response
shapes over real HTTP. HTTP tests require permission to listen on localhost.

Some upstream paths have sibling wildcard parameters with different names
(agent branches, knowledge-base documents, pronunciation dictionaries, and
voice generation). Counterfact may report routing ambiguities in those areas.
