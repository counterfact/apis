# Counterfact issues encountered while building this simulator

Observed with Counterfact 3.1.0 and `@counterfact/runtime` 0.3.2.
New reports were filed using `pmcelhaney-codex`; existing reports were reused.
The simulator targets its installed runtime without compatibility paths for older versions.

| Issue | Evidence and effect | Current simulator approach |
| --- | --- | --- |
| [#2607: Multipart request parsing](https://github.com/counterfact/api-simulator/issues/2607) | Existing report. Multipart-dependent voice editing cannot be simulated faithfully with the installed body parser. | Leave multipart-dependent operations generated; do not fake successful parsing. |
| [#2608: Generated collection context type differs from runtime](https://github.com/counterfact/api-simulator/issues/2608) | Existing report. A sibling collection handler is typed against its parent context while Dispatcher supplies the nested context. | Use one explicit context assertion at collection boundaries; regenerate descendant and scenario bindings normally. |
| [#2609: Version-specific route availability](https://github.com/counterfact/api-simulator/issues/2609) | New report. A synthetic shared-registry reproduction executes a V1-only operation through a V2 Dispatcher even when it is absent from the V2 contract. | Use documented versioned paths; the README records this runtime limitation. |
| [#2610: Invalid boolean text becomes false](https://github.com/counterfact/api-simulator/issues/2610) | New report. A required boolean query accepts `not-a-boolean` as `false`, while a missing value correctly fails. This concerns lossy coercion; current docs do not promise comprehensive parameter-schema validation. | Report parsing behavior upstream rather than duplicate transport conversion in simulator tests. |
| [#2611: ModuleLoader class identity](https://github.com/counterfact/api-simulator/issues/2611) | New report. On initial ESM load, a context instance and its custom error fail `instanceof` checks against the same constructors imported by the route. No hot reload is needed. | Prefer explicit result discriminants or stable application error tags. |
| [#2612: Nullable primitive query conversion](https://github.com/counterfact/api-simulator/issues/2612) | New report. A synthetic Dispatcher reproduction returns integer query text as a string for `anyOf(integer, null)`, while plain integer queries become numbers; nullable booleans behave similarly. | Strictly normalize affected secrets collection numeric query values at the thin route boundary before context range validation. |

The new issues contain self-contained synthetic reproductions using public
Dispatcher and ModuleLoader APIs. They require no API account, credentials,
network listener, or simulator-specific test harness.

Existing wildcard-ambiguity and date-format diagnostics are observed during
tests. They are not treated as additional confirmed bugs without a concrete
incorrect routing or validation result.
