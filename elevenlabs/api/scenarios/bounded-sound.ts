import type { Scenario } from "../types/index.js";
export const resetBoundedSound: Scenario = ($) => {
  const c = $.loadContext("/sound-generation"), speech = $.loadContext("/text-to-speech");
  c.requests = new Map(); c.audio = new Uint8Array(speech.audio); c.nextRequest = 0;
  c.root = () => $.context;
  c.defaults = { time: 1735690000, duration: speech.defaults!.duration, model: "eleven_text_to_sound_v2", format: "mp3_44100_128", maxCharacters: 2000 };
};
