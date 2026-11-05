import assert from "node:assert/strict";
import test from "node:test";
import { audioDuration } from "../api/support/audio.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";

// One mono, 16-bit PCM sample at 8 kHz, independently readable by Python wave.
const wav = () => {
  const data = new Uint8Array(46),
    view = new DataView(data.buffer);
  for (const [at, text] of [
    [0, "RIFF"],
    [8, "WAVE"],
    [12, "fmt "],
    [36, "data"],
  ] as const)
    data.set(Buffer.from(text), at);
  view.setUint32(4, 38, true);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(40, 2, true);
  return data;
};

test("audio metadata utility reads WAV and complete Layer III bytes without mutating them", async () => {
  const pcm = wav(),
    before = pcm.slice();
  assert.equal(audioDuration(pcm, "audio/wav"), 1 / 8000);
  assert.equal(audioDuration(pcm, "audio/x-wav"), 1 / 8000);
  assert.deepEqual(pcm, before);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const mp3 = runner.loadContext("/text-to-speech").audio,
    copy = mp3.slice();
  assert.ok(
    Math.abs(audioDuration(mp3, "audio/mpeg")! - 23040 / 44100) < 1e-12,
  );
  assert.deepEqual(mp3, copy);
  assert.throws(
    () =>
      runner.loadContext("/convai/agents").uploadHoldAudio("sim-agent", {
        data: new Uint8Array([255, 251, 144, 100]),
        size: 4,
        filename: "truncated.mp3",
        contentType: "audio/mpeg",
      }),
    { name: "MediaError", status: 400, code: "invalid_hold_audio" },
  );
});

test("audio metadata utility returns undefined for unsupported MIME or malformed bytes", () => {
  const malformed = wav();
  new DataView(malformed.buffer).setUint32(28, 1, true);
  for (const [bytes, mime] of [
    [wav(), "application/octet-stream"],
    [wav(), "audio/mpeg"],
    [new Uint8Array(), "audio/wav"],
    [malformed, "audio/wav"],
    [new Uint8Array([255, 251, 144, 100]), "audio/mpeg"],
  ] as const) {
    assert.equal(audioDuration(bytes, mime), undefined);
  }
});
