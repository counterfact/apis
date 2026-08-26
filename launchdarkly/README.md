# LaunchDarkly REST API simulator

This private package will simulate LaunchDarkly's **management REST API** for
local client development and tests. It does not evaluate feature flags for an
application; LaunchDarkly SDKs serve that purpose.

## Contract status

LaunchDarkly publishes the complete API contract at
`https://app.launchdarkly.com/api/v2/openapi.json`. The endpoint requires a
LaunchDarkly API access token. This repository deliberately does **not** commit
an invented subset, a synthetic replacement, an empty specification, or token
material.

As a result, `openapi.json`, `openapi.provenance.json`, and Counterfact's
generated scaffolding are intentionally absent until an authorized maintainer
downloads the official snapshot. The package cannot start or generate routes
until that one-time bootstrap has happened.

## Bootstrap or refresh the official snapshot

Use an access token available only in your shell; do not place it in a command
history, source file, or provenance record:

```sh
LD_API_KEY='your LaunchDarkly API access token' npm run refresh:openapi
npm run validate:openapi
npm run generate
```

`refresh:openapi` requests exactly the official endpoint, checks that it is
valid JSON using OpenAPI 3.0.3, and writes both the byte-for-byte response and
its provenance only after those checks pass. The provenance record contains the
source URL, retrieval time, OpenAPI version, and SHA-256 hash. It never stores
the access token.

The refresh command is explicit: simulator startup, serving, tests, and code
generation do not contact LaunchDarkly.

## Local commands after bootstrap

```sh
npm run generate  # Generate Counterfact route/type scaffolding from openapi.json
npm run start     # Start Counterfact in its interactive mode
npm run serve     # Serve the local simulator over HTTP
```

Handwritten stateful behavior will live beside the generated artifacts. The
specification remains the complete advertised contract; generated routes are
not a promise that every endpoint behaves as a stateful LaunchDarkly backend.
