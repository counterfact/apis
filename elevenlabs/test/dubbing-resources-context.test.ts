import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/dubbing/resource/_.context.js";
test("Dubbing resource context starts empty and preserves atomic invalid changes", () => {
  const c = new Context();
  assert.equal(c.resources.size, 0);
  assert.throws(() => c.get("missing"));
  const media = {
    src: "local",
    content_type: "audio/mpeg",
    bucket_name: "synthetic",
    random_path_slug: "fixture",
    duration_secs: 10,
    is_audio: true,
    url: "https://simulator.invalid/source",
  };
  c.resources.set("r", {
    id: "r",
    version: 1,
    source_language: "en",
    target_languages: ["es"],
    input: media,
    background: null,
    foreground: null,
    speaker_tracks: {
      s: {
        id: "s",
        media_ref: media,
        speaker_name: "Speaker",
        voices: { en: "track-clone", es: "track-clone" },
        segments: [],
      },
    },
    speaker_segments: {},
    renders: {},
  });
  const created = c.createSegment("r", "s", {
    start_time: 1,
    end_time: 2,
    text: "Original",
    translations: { es: "Hola" },
  });
  const id = created.new_segment;
  assert.equal(c.get("r").speaker_segments[id].dubs.es.text, "Hola");
  const copy = c.get("r");
  copy.speaker_segments[id].text = "Mutated";
  assert.equal(c.get("r").speaker_segments[id].text, "Original");
  const before = c.get("r"),
    counter = c.nextSegmentId;
  assert.throws(() =>
    c.createSegment("r", "s", { start_time: 5, end_time: 2 }),
  );
  assert.throws(() =>
    c.migrate("r", { speaker_id: "s", segment_ids: [id, "missing"] }),
  );
  assert.deepEqual(c.get("r"), before);
  assert.equal(c.nextSegmentId, counter);
  c.updateSegment("r", id, "en", { text: "Source changed" });
  assert.equal(c.get("r").speaker_segments[id].text, "Source changed");
  assert.equal(c.get("r").speaker_segments[id].dubs.es.audio_stale, true);
  c.addLanguage("r", { language: "fr" });
  const resource = c.resources.get("r")!;
  resource.speaker_segments[id].dubs.es.audio_stale = false;
  resource.speaker_segments[id].dubs.fr.audio_stale = false;
  c.updateSegment("r", id, "es", { text: "Only Spanish" });
  assert.equal(c.get("r").speaker_segments[id].dubs.fr.audio_stale, false);
  assert.equal(c.get("r").speaker_segments[id].text, "Source changed");
  c.updateSegment("r", id, "en", { text: "All stale" });
  assert.equal(c.get("r").speaker_segments[id].dubs.fr.audio_stale, true);
  c.updateSpeaker("r", "s", {
    voice_id: "other",
    voice_stability: 0.3,
    languages: ["es"],
  });
  assert.equal(c.get("r").speaker_tracks.s.voices.es, "other");
  assert.equal(c.get("r").speaker_tracks.s.voices.en, "track-clone");
  assert.equal(c.speakerSettings.get("r/s")!.es.voice_stability, 0.3);
  assert.throws(() => c.updateSpeaker("r", "__proto__", {}));
  assert.throws(() => c.removeSegment("r", "__proto__"));
  c.removeSegment("r", id);
  assert.deepEqual(c.get("r").speaker_tracks.s.segments, []);
  assert.equal(c.get("r").speaker_segments[id], undefined);
});
