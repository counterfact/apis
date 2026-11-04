# TypeSafe / Jev development checks

Optional development tooling for this repository. It uses Node.js 22.22 or
newer and built-in `fetch`; no SDK or npm install is required. Simulator
runtime, package builds, and normal simulator tests do not call TypeSafe.

The helper is adapted from the main Counterfact repository's development
workflow. It sends a prepared request containing only `model`, `state`, and
1–8 named text Noul questions, with a maximum request size of 8 KiB.
The model is pinned to `jev-1.14.0`.

## Credentials

The default key file is `.env.typesafe.local` beside the common Git directory,
so linked worktrees reuse the original checkout's configuration. The current
local setup links to Patrick's existing credential file without copying the key.
The link is ignored by Git.

For a new checkout, create an owner-only file containing `TYPESAFE_API_KEY`:

```sh
cp .env.example .env.typesafe.local
chmod 600 .env.typesafe.local
```

Fill in the key using a local editor. Alternatively pass
`--credential-file /absolute/path/to/credentials` to use an existing file.
POSIX files must have owner-only permissions; restrict ACLs on Windows.
The helper parses the file without executing shell code and does not read an
ambient exported key.

## Use

Validate a prepared request without accessing credentials or the network:

```sh
node scripts/typesafe/development.mjs --request scripts/typesafe/synthetic.json
```

Send that request explicitly:

```sh
node scripts/typesafe/development.mjs --request scripts/typesafe/synthetic.json --send
```

Run offline helper tests with fake credentials and transport:

```sh
node --test scripts/typesafe/development.test.mjs
```

Questions and criteria belong together in the request file. Send only public
Counterfact source or invented examples within the standing development
authorization. Do not send unpublished changes, ignored/private files, personal
data, or credentials as state. The helper reads only the supplied request and
credential file; it does not collect repository content automatically.

Success prints validated answers, model ID, and token usage. Interpret Noul
values above 0.7 as supporting evidence, below 0.3 as contrary evidence, and
the middle as unresolved; inspect the evidence yourself. Failures remain errors,
with no automatic retry or sensitive diagnostics. Spending is managed through
provider-side controls.

Official references: [System One API](https://docs.typesafe.ai/api/system-one),
[models](https://docs.typesafe.ai/models), and
[question design](https://docs.typesafe.ai/primitives/noul).
