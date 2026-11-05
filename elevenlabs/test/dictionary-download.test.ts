import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("dictionary downloads render isolated version snapshots as escaped PLS", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const baseline = context.downloadDictionary("sim-dictionary", "sim-dictionary-v1").value!;
  assert.match(baseline, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(baseline, /xmlns="http:\/\/www\.w3\.org\/2005\/01\/pronunciation-lexicon"/);
  assert.match(baseline, /<grapheme>API<\/grapheme><alias>A P I<\/alias>/);
  assert.match(baseline, /<phoneme alphabet="ipa">ˈkaʊntərfækt<\/phoneme>/);
  const rules = [
    { type: "alias" as const, string_to_replace: "<&\"'😀", alias: "A & B < C > D \" '\r\n\t" },
    { type: "phoneme" as const, string_to_replace: "word", phoneme: "<>&\"'", alphabet: "ipa\"<&'\r\n\t" },
  ];
  context.setRules("sim-dictionary", rules);
  const current = context.downloadDictionary("sim-dictionary", "sim-dictionary-v2").value!;
  assert.match(current, /<grapheme>&lt;&amp;&quot;&apos;😀<\/grapheme>/);
  assert.match(current, /<alias>A &amp; B &lt; C &gt; D &quot; &apos;&#13;&#10;&#9;<\/alias>/);
  assert.match(current, /<phoneme alphabet="ipa&quot;&lt;&amp;&apos;&#13;&#10;&#9;">&lt;&gt;&amp;&quot;&apos;<\/phoneme>/);
  assert.equal(context.downloadDictionary("sim-dictionary", "sim-dictionary-v1").value, baseline);
  context.setRules("sim-dictionary", []);
  const empty = context.downloadDictionary("sim-dictionary", "sim-dictionary-v3").value!;
  assert.match(empty, /<lexicon[^>]*>\n<\/lexicon>/);
  assert.doesNotMatch(empty, /<lexeme>/);
  const before = structuredClone(context.dictionaries);
  assert.equal(context.downloadDictionary("missing", "v1").missing, "dictionary");
  assert.equal(context.downloadDictionary("sim-dictionary", "missing").missing, "version");
  assert.deepEqual(context.dictionaries, before);
  for (const invalid of ["\u0000", "\u0001", "\ud800", "\uffff"]) {
    const version = context.setRules("sim-dictionary", [{ type: "alias", string_to_replace: "X", alias: invalid }]).value!.version_id;
    const snapshot = structuredClone(context.dictionaries);
    assert.match(context.downloadDictionary("sim-dictionary", version).error!, /XML 1\.0/);
    assert.deepEqual(context.dictionaries, snapshot);
  }
  await runner.run(scenarios.reset);
  assert.equal(context.downloadDictionary("sim-dictionary", "sim-dictionary-v1").value, baseline);
  assert.equal(context.downloadDictionary("sim-dictionary", "sim-dictionary-v2").missing, "version");
});

test("dictionary download route serves versioned PLS with headers, errors, and reset", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const base = "/v1/pronunciation-dictionaries/sim-dictionary";
  const download = (version: string) => app.request(`${base}/${version}/download`);
  const mutate = (path: string, body: unknown, method = "POST") => app.request(path, {
    method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const response = await download("sim-dictionary-v1");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /^text\/plain/);
  assert.equal(response.headers.get("content-disposition"), 'attachment; filename="pronunciation-dictionary.pls"');
  const original = await response.text();
  assert.match(original, /<alias>A P I<\/alias>/);
  const added = await mutate(`${base}/add-rules`, { rules: [{ type: "alias", string_to_replace: "SDK", alias: "S D K" }] });
  assert.equal(added.status, 200);
  assert.match(await (await download("sim-dictionary-v2")).text(), /<alias>S D K<\/alias>/);
  assert.equal((await mutate(`${base}/remove-rules`, { rule_strings: ["API"] })).status, 200);
  assert.equal((await mutate(`${base}/set-rules`, { rules: [] })).status, 200);
  assert.equal((await mutate(base, { name: 'unsafe\"\r\nname', archived: true }, "PATCH")).status, 200);
  assert.equal(await (await download("sim-dictionary-v1")).text(), original);
  const empty = await download("sim-dictionary-v4");
  assert.equal(empty.status, 200);
  assert.doesNotMatch(await empty.text(), /<lexeme>/);
  for (const [path, status] of [
    ["/v1/pronunciation-dictionaries/missing/v1/download", "pronunciation_dictionary_not_found"],
    [`${base}/missing/download`, "pronunciation_dictionary_version_not_found"],
  ]) {
    const missing = await app.request(path);
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).detail.status, status);
  }
  assert.equal((await mutate(`${base}/set-rules`, { rules: [{ type: "alias", string_to_replace: "X", alias: "\u0001" }] })).status, 200);
  const invalid = await download("sim-dictionary-v5");
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).detail.status, "invalid_request");
  assert.equal(await (await other.request(`${base}/sim-dictionary-v1/download`)).text(), original);
  assert.equal((await other.request(`${base}/sim-dictionary-v2/download`)).status, 404);
  await app.scenario("reset", "api");
  assert.equal(await (await download("sim-dictionary-v1")).text(), original);
  assert.equal((await download("sim-dictionary-v2")).status, 404);
});
