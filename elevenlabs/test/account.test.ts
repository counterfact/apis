import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/_.context.js";
import * as scenarios from "../api/scenarios/index.js";
import { runScenario } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("account reads require initialization and return isolated, consistent state", async () => {
  const context = new Context();
  assert.throws(() => context.getUser(), /Account state is not initialized/);
  assert.throws(() => context.getSubscription(), /Account state is not initialized/);
  await runScenario(context, scenarios.startup);
  const user = context.getUser();
  assert.equal(user.user_id, "sim-user");
  assert.equal(user.workspace_id, "sim-workspace");
  assert.equal(user.subscription.character_count, 1000);
  assert.equal(user.subscription.voice_slots_used, 2);
  user.first_name = "Changed externally";
  user.subscription.current_overage.amount = "99";
  const subscription = context.getSubscription();
  subscription.open_invoices.push({
    amount_due_cents: 99, discounts: [], next_payment_attempt_unix: 0,
    payment_intent_status: null, payment_intent_statusses: [],
  });
  subscription.current_overage.amount = "99";
  assert.equal(context.getUser().first_name, "Simulator");
  assert.equal(context.getUser().subscription.current_overage.amount, "0");
  assert.deepEqual(context.getSubscription().open_invoices, []);
  assert.equal(context.deleteVoice("sim-narrator"), true);
  assert.equal(context.getUser().subscription.voice_slots_used, 1);
  assert.equal(context.getSubscription().voice_slots_used, 1);
  await runScenario(context, scenarios.quotaExhausted);
  assert.equal(context.getUser().subscription.character_count, context.getSubscription().character_limit);
  await runScenario(context, scenarios.reset);
  assert.equal(context.getSubscription().character_count, 1000);
  assert.equal(context.getSubscription().voice_slots_used, 2);
});

test("account endpoints share quota state, reset fixtures, and isolate simulator instances", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const read = async (path: string) => {
    const response = await first.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const user = await read("/v1/user");
  const subscription = await read("/v1/user/subscription");
  const initialModels = await read("/v1/models");
  assert.equal(user.user_id, "sim-user");
  assert.equal(user.created_at, 1735689600);
  assert.deepEqual(await read("/v1/user"), user);
  assert.deepEqual(await read("/v1/user/subscription"), subscription);
  for (const [key, value] of Object.entries(user.subscription)) {
    assert.deepEqual(subscription[key], value);
  }
  assert.deepEqual(subscription.open_invoices, []);
  assert.equal(subscription.has_open_invoices, false);
  assert.equal("open_invoices" in user.subscription, false);
  await first.scenario("quotaExhausted", "api");
  const exhausted = await read("/v1/user/subscription");
  assert.equal(exhausted.character_count, exhausted.character_limit);
  assert.equal((await read("/v1/user")).subscription.character_count, exhausted.character_limit);
  assert.equal((await (await second.request("/v1/user/subscription")).json()).character_count, 1000);
  assert.equal((await first.request("/v1/voices/sim-narrator", { method: "DELETE" })).status, 200);
  assert.equal((await read("/v1/user")).subscription.voice_slots_used, 1);
  assert.equal((await read("/v1/user/subscription")).voice_slots_used, 1);
  await first.scenario("emptyModels", "api");
  await first.scenario("reset", "api");
  assert.deepEqual(await read("/v1/user"), user);
  assert.deepEqual(await read("/v1/user/subscription"), subscription);
  assert.equal((await read("/v1/voices")).voices.length, 2);
  assert.deepEqual(await read("/v1/models"), initialModels);
});
