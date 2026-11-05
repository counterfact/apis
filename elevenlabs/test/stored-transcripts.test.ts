import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { Context } from "../api/routes/speech-to-text/transcripts/_.context.js";
import * as scenarios from "../api/scenarios/index.js";

test("stored transcript context returns nested copies and deletes atomically", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/speech-to-text/transcripts");
  const empty = new Context();
  assert.equal(empty.records.size, 0);
  assert.throws(() => empty.get("missing"), { code: "transcript_not_found" });
  const single = context.get("sim-transcript-single");
  assert.ok("words" in single);
  assert.equal(single.text, "Local transcript.");
  single.words[0].characters![0].text = "changed";
  single.additional_formats![0]!.content = "changed";
  const reread = context.get("sim-transcript-single");
  assert.ok("words" in reread);
  assert.equal(reread.words[0].characters![0].text, "L");
  assert.equal(reread.additional_formats![0]!.content, "Local transcript.");
  const multi = context.get("sim-transcript-multichannel");
  assert.ok("transcripts" in multi);
  assert.equal(multi.transcripts.length, 2);
  multi.transcripts[0].words[0].text = "changed";
  const multiCopy = context.get("sim-transcript-multichannel");
  assert.ok("transcripts" in multiCopy);
  assert.equal(multiCopy.transcripts[0].words[0].text, "Left");
  assert.throws(() => context.get("missing"), { code: "transcript_not_found" });
  assert.throws(() => context.delete("missing"), {
    code: "transcript_not_found",
  });
  assert.equal(context.records.size, 2);
  assert.deepEqual(context.delete("sim-transcript-single"), { status: "ok" });
  assert.throws(() => context.get("sim-transcript-single"), {
    code: "transcript_not_found",
  });
  assert.throws(() => context.delete("sim-transcript-single"), {
    code: "transcript_not_found",
  });
  assert.equal(context.records.size, 1);
  await runner.run(scenarios.reset);
  assert.equal(context.records.size, 2);
});

test("validated Dispatcher reads both transcript shapes and observes deletion/reset/isolation", async () => {
  const harness = await createDispatcherHarness();
  const path = "/v1/speech-to-text/transcripts/";
  const single = await harness.request(path + "sim-transcript-single");
  assert.equal(single.status, 200);
  assert.match(single.headers.get("content-type")!, /application\/json/);
  const body = await single.json();
  assert.equal(body.text, "Local transcript.");
  assert.equal(body.words[0].characters[0].text, "L");
  assert.equal(body.additional_formats[0].content_type, "text/plain");
  const multi = await harness.request(path + "sim-transcript-multichannel");
  assert.equal(multi.status, 200);
  assert.deepEqual(
    (await multi.json()).transcripts.map(
      (t: { channel_index: number }) => t.channel_index,
    ),
    [0, 1],
  );
  assert.equal((await harness.request(path + "missing")).status, 404);
  const deletion = await harness.request(path + "sim-transcript-single", {
    method: "DELETE",
  });
  assert.equal(deletion.status, 200);
  assert.deepEqual(await deletion.json(), { status: "ok" });
  assert.equal(
    (await harness.request(path + "sim-transcript-single")).status,
    404,
  );
  assert.equal(
    (
      await harness.request(path + "sim-transcript-single", {
        method: "DELETE",
      })
    ).status,
    404,
  );
  assert.equal(
    (await harness.request(path + "sim-transcript-multichannel")).status,
    200,
  );
  assert.equal(
    (
      await harness.request(path + "sim-transcript-multichannel", {
        method: "DELETE",
      })
    ).status,
    200,
  );
  const missing = await harness.request(path + "sim-transcript-multichannel");
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "transcript_not_found");
  assert.equal((await harness.request("/v1/voices/sim-narrator")).status, 200);
  assert.equal(
    (await (await harness.request("/v1/history")).json()).history.length,
    2,
  );
  const other = await createDispatcherHarness();
  assert.equal(
    (await other.request(path + "sim-transcript-single")).status,
    200,
  );
  await harness.scenario("reset");
  assert.equal(
    (await harness.request(path + "sim-transcript-single")).status,
    200,
  );
  await harness.scenario("emptyStoredTranscripts");
  assert.equal(
    (await harness.request(path + "sim-transcript-single")).status,
    404,
  );
  assert.equal(
    (await harness.request(path + "sim-transcript-multichannel")).status,
    404,
  );
});
