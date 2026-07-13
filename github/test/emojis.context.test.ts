import assert from "node:assert/strict";
import test from "node:test";
import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/emojis/_.context.ts";

const createContext = () =>
  new Context({
    loadContext: (() => {
      throw new Error("No nested contexts are expected");
    }) as Context$["loadContext"],
    readJson: async () => ({}),
  });

test("Context stores and returns emoji URLs", () => {
  const context = createContext();

  context.saveEmoji("smile", "https://example.test/smile.png");
  context.saveEmoji("heart", "https://example.test/heart.png");

  assert.deepEqual(context.listEmojis(), {
    smile: "https://example.test/smile.png",
    heart: "https://example.test/heart.png",
  });
});

test("Context updates an existing emoji", () => {
  const context = createContext();

  context.saveEmoji("smile", "https://example.test/old.png");
  context.saveEmoji("smile", "https://example.test/new.png");

  assert.deepEqual(context.listEmojis(), {
    smile: "https://example.test/new.png",
  });
});
