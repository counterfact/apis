import assert from "node:assert/strict";
import test from "node:test";
import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/rate_limit/_.context.ts";

const createContext = () =>
  new Context({
    loadContext: (() => {
      throw new Error("No nested contexts are expected");
    }) as Context$["loadContext"],
    readJson: async () => ({}),
  });

test("Context returns default rate limits for all resources", () => {
  const context = createContext();
  const overview = context.getRateLimitOverview();

  assert.equal(overview.resources.core.limit, 5000);
  assert.equal(overview.resources.core.remaining, 5000);
  assert.equal(overview.resources.core.used, 0);
  assert.equal(overview.resources.search.limit, 30);
  assert.equal(overview.resources.graphql?.limit, 5000);
  assert.equal(overview.resources.code_search?.limit, 10);
});

test("Context rate field mirrors core resource", () => {
  const context = createContext();
  const overview = context.getRateLimitOverview();

  assert.deepEqual(overview.rate, overview.resources.core);
});

test("Context.setRateLimit overrides limit and remaining", () => {
  const context = createContext();

  context.setRateLimit("core", { limit: 1000 });
  const rl = context.getRateLimit("core");

  assert.equal(rl.limit, 1000);
  assert.equal(rl.remaining, 1000);
  assert.equal(rl.used, 0);
});

test("Context.consumeRequest decrements remaining and increments used", () => {
  const context = createContext();

  context.consumeRequest("core");
  context.consumeRequest("core");

  const rl = context.getRateLimit("core");
  assert.equal(rl.remaining, 4998);
  assert.equal(rl.used, 2);
});

test("Context.consumeRequest defaults to core resource", () => {
  const context = createContext();

  context.consumeRequest();

  const rl = context.getRateLimit("core");
  assert.equal(rl.remaining, 4999);
});

test("Context.consumeRequest does not decrement below zero", () => {
  const context = createContext();

  context.setRateLimit("core", { limit: 2 });
  context.consumeRequest("core");
  context.consumeRequest("core");
  context.consumeRequest("core"); // should not go below 0

  const rl = context.getRateLimit("core");
  assert.equal(rl.remaining, 0);
  assert.equal(rl.used, 2);
});

test("Context.resetRateLimit restores remaining to limit", () => {
  const context = createContext();

  context.consumeRequest("search");
  context.consumeRequest("search");
  context.resetRateLimit("search");

  const rl = context.getRateLimit("search");
  assert.equal(rl.remaining, rl.limit);
  assert.equal(rl.used, 0);
});

test("Context.getRateLimitOverview reflects consumed requests", () => {
  const context = createContext();

  context.consumeRequest("core");
  context.consumeRequest("search");

  const overview = context.getRateLimitOverview();
  assert.equal(overview.resources.core.remaining, 4999);
  assert.equal(overview.resources.search.remaining, 29);
  assert.equal(overview.rate.remaining, 4999);
});
