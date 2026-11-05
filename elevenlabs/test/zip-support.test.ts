import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { crc32 } from "node:zlib";
import { storedZip } from "../api/support/zip.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";

test("stored ZIP supports deterministic empty and binary archives without changing source bytes", () => {
  assert.deepEqual(
    storedZip([]),
    new Uint8Array([80, 75, 5, 6, ...new Array(18).fill(0)]),
  );
  const data = new Uint8Array([0, 255, 128, 1]),
    source = data.slice();
  const result = storedZip([{ name: "payload.bin", data }]);
  assert.deepEqual(result, storedZip([{ name: "payload.bin", data }]));
  assert.deepEqual(data, source);
  const buffer = Buffer.from(result),
    start = 30 + Buffer.byteLength("payload.bin");
  assert.deepEqual(
    buffer.subarray(start, start + data.length),
    Buffer.from(data),
  );
  assert.equal(buffer.readUInt32LE(14), crc32(data));
  const end = result.length - 22,
    central = buffer.readUInt32LE(end + 16);
  assert.equal(buffer.readUInt32LE(central), 0x02014b50);
  assert.equal(buffer.readUInt32LE(central + 16), crc32(data));
  assert.equal(buffer.readUInt32LE(central + 42), 0);
  data.fill(7);
  assert.deepEqual(
    buffer.subarray(start, start + source.length),
    Buffer.from(source),
  );
});

test("history archive bytes match pre-extraction single and ordered duplicate-member goldens", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/history");
  for (const [ids, size, sha256] of [
    [
      ["sim-history-1"],
      8472,
      "1565b63dd70566a24cd7281164fbd8f7c6ed9a030c913f1330ed1d620fe8c933",
    ],
    [
      ["sim-history-2", "sim-history-1", "sim-history-2"],
      16922,
      "88830812f3c9b108d9268b1a1991c8daed52a41913a9a057faa3ec776fb37be1",
    ],
  ] as const) {
    const archive = context.download({ history_item_ids: [...ids] });
    assert.equal(archive.length, size);
    assert.equal(createHash("sha256").update(archive).digest("hex"), sha256);
  }
});
