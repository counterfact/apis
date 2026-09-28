import assert from "node:assert/strict";
import test from "node:test";

import { Context, type FlagEnvironmentConfig } from "../routes/_.context.js";
import {
  archivedFlag,
  canaryRollout,
  earlyAccessSegment,
  productionFlagOff,
  removeEarlyAccessSegment,
  reset,
} from "../scenarios/index.js";

function world() {
  const context = new Context({} as never);
  return {
    context,
    $: {
      context,
      loadContext: () => context,
      routes: {},
      route: () => ({}),
    } as never,
  };
}

test("compatible scenarios compose without replacing unrelated state", async () => {
  const { context, $ } = world();
  await reset($);
  const projectCount = context.listProjects().length;

  await canaryRollout($);
  await productionFlagOff($);
  await earlyAccessSegment($);
  await archivedFlag($);

  const checkout = context.getFlag("commerce-platform", "checkout-redesign");
  const checkoutProduction = checkout.environments
    .production as FlagEnvironmentConfig;
  assert.equal(checkoutProduction.on, false);
  assert.deepEqual(
    (checkoutProduction.fallthrough.rollout as { variations: unknown })
      .variations,
    [
      { variation: 0, weight: 10_000 },
      { variation: 1, weight: 90_000 },
    ],
  );
  assert.equal(
    context.getFlag("commerce-platform", "legacy-billing-page").archived,
    true,
  );
  assert.equal(
    context.getSegment("commerce-platform", "production", "early-access")
      .unbounded,
    false,
  );
  assert.equal(context.listProjects().length, projectCount);
});

test("the named contraction removes only early-access records", async () => {
  const { context, $ } = world();
  await reset($);
  await earlyAccessSegment($);
  await archivedFlag($);
  const segmentsBefore = context.listSegments(
    "commerce-platform",
    "production",
  );

  await removeEarlyAccessSegment($);

  assert.equal(
    context
      .listSegments("commerce-platform", "production")
      .some((segment) => segment.key === "early-access"),
    false,
  );
  assert.equal(
    context.listSegments("commerce-platform", "production").length,
    segmentsBefore.length - 1,
  );
  assert.equal(
    context.getFlag("commerce-platform", "legacy-billing-page").archived,
    true,
  );
  const recommendation = context.getFlag(
    "commerce-platform",
    "recommendation-model",
  );
  assert.equal(
    (
      recommendation.environments.production as FlagEnvironmentConfig
    ).rules.some((rule) => rule._id === "rule-early-access"),
    false,
  );
});

test("additive scenarios fail with reset guidance when prerequisites are absent", async () => {
  const { $ } = world();

  await assert.rejects(async () => canaryRollout($), /scenario reset/);
  await assert.rejects(async () => earlyAccessSegment($), /scenario reset/);
  await assert.rejects(async () => archivedFlag($), /scenario reset/);
});
