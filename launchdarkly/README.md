# LaunchDarkly REST API simulator

`@counterfact/launchdarkly` is a private, local simulator of the
[LaunchDarkly management REST API](https://app.launchdarkly.com/api/v2/openapi.json).
Use it to develop and test software that administers LaunchDarkly projects,
environments, feature flags, and segments.

It is deliberately **not** an implementation of LaunchDarkly feature-flag
evaluation. Application SDKs, streaming, SDK keys, mobile keys, and
client-side IDs are outside this simulator's scope.

## Quick start

```sh
npm ci
npm run serve
```

The stateful API uses the fixed local credential below. It is a simulator
convenience, not a real LaunchDarkly access token or authorization system.

```http
Authorization: ld-simulator-token
```

For example, after starting the simulator, create and inspect a project:

```sh
curl -X POST http://localhost:3000/api/v2/projects \
  -H 'Authorization: ld-simulator-token' \
  -H 'Content-Type: application/json' \
  -d '{"key":"sample-project","name":"Sample project"}'

curl http://localhost:3000/api/v2/projects/sample-project \
  -H 'Authorization: ld-simulator-token'
```

Create an environment and feature flag in the same way, then use the flag's
documented semantic-patch endpoint to enable it in an environment. The local
state remains available until you reset it or restart the simulator.

## Coverage and fidelity

The package vendors the complete official LaunchDarkly REST API OpenAPI
snapshot and generates Counterfact transport and type scaffolding for every
operation in that contract. That broad route surface is useful for client
wiring, but it is not a promise that every generated endpoint behaves as the
LaunchDarkly service.

The hand-authored, stateful core covers the normal feature lifecycle:

- projects and environments;
- feature flags, their environment configuration, status, archive/restore,
  and supported JSON Patch, JSON Merge Patch, and semantic-patch updates; and
- standard segments used by feature-flag targeting.

The simulator does not model real access tokens or roles, evaluation engines,
SDK or streaming endpoints, scheduled changes, approvals, production clocks,
analytics, exports, integrations, or rate-limit accounting. Its semantic-patch
support is a documented compatibility overlay; LaunchDarkly may have added
instructions after this pinned 2024 contract snapshot.

## Scenarios

Scenarios are composable state transformations. Run `reset` first to install
the deterministic baseline. The additive scenarios require that baseline and
do not silently replace unrelated state.

| Scenario                   | Effect                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `reset`                    | Restores the complete deterministic project, environment, flag, and segment baseline. |
| `productionFlagOff`        | Turns a known production flag off.                                                    |
| `canaryRollout`            | Adds a canary rollout to a known flag without replacing unrelated targeting.          |
| `earlyAccessSegment`       | Adds an early-access segment and links it to a known flag.                            |
| `removeEarlyAccessSegment` | Removes only the segment introduced by `earlyAccessSegment`.                          |
| `archivedFlag`             | Archives one known flag.                                                              |

See the local Counterfact scenario control plane for applying scenarios.

## Official contract provenance and refresh

[`openapi.json`](./openapi.json) is the byte-preserved `16.1.1` release asset
published by LaunchDarkly's official
[`ld-openapi`](https://github.com/launchdarkly/ld-openapi) repository.
[`openapi.provenance.json`](./openapi.provenance.json) records its exact
release URL, release tag, retrieval date, OpenAPI version, and SHA-256 digest.
`npm run verify:spec` checks those properties before generation and in tests.

To intentionally adopt a newer official contract, refresh it, inspect the
diff, regenerate, and update the compatibility behavior deliberately:

```sh
npm run refresh:openapi
npm run verify:spec
npm run generate
npm test
```

The refresh command can use the pinned public release asset. If you explicitly
provide `LD_API_KEY`, it may instead retrieve LaunchDarkly's current official
endpoint. No ordinary runtime command—start, serve, test, generation, or
verification—contacts LaunchDarkly. The simulator always operates from the
vendored snapshot.

## Development checks

```sh
npm run verify:spec      # snapshot hash, provenance, version, and path count
npm run validate:openapi # OpenAPI parsing plus Redocly lint
npm run generate         # regenerate Counterfact artifacts
npm run verify           # all package checks, including generation drift
```
