# apis

This repository hosts API simulation packages built with [`counterfact`](https://www.npmjs.com/package/counterfact).

## Packages

- [`@counterfact/swagger-pet-store`](./swagger-pet-store): simulator package generated from the Swagger Petstore OpenAPI spec.
- [`@counterfact/github`](./github): simulator package generated from GitHub's OpenAPI spec.

## Development tools

Optional [TypeSafe / Jev checks](./scripts/typesafe/README.md) support bounded
semantic judgments during development. The helper validates requests locally
by default and uses the existing local credential configuration for explicit
live calls. Simulator runtime and normal tests stay offline.
