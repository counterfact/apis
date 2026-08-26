# LaunchDarkly REST API simulator

This private package will simulate LaunchDarkly's **management REST API** for
local client development and tests. It does not evaluate feature flags for an
application; LaunchDarkly SDKs serve that purpose.

## Contract status

LaunchDarkly publishes the complete API contract at
`https://app.launchdarkly.com/api/v2/openapi.json`. The live endpoint requires
a LaunchDarkly API access token. LaunchDarkly also publishes immutable,
token-free OpenAPI release assets from its official
[`ld-openapi`](https://github.com/launchdarkly/ld-openapi) repository. This
package vendors the complete `16.1.1` release asset, not an invented subset or
synthetic replacement. Its provenance records the exact asset URL, release tag,
retrieval time, version, and SHA-256.

## Bootstrap or refresh the official snapshot

Refresh the pinned official release asset without a credential:

```sh
npm run refresh:openapi
npm run validate:openapi
npm run generate
```

To deliberately refresh from the current live endpoint instead, provide an
access token only in the invoking shell; never put it in a source file or
provenance record:

```sh
LD_API_KEY='your LaunchDarkly API access token' npm run refresh:openapi
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
