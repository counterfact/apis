import assert from "node:assert/strict";
import test from "node:test";
import { happyPathState } from "../domain/fixtures.js";
import { Context } from "../routes/_.context.js";
import {
  crossCustomerReferences,
  emptyAccount,
  happyPath,
  inactivePayment,
  monthEndSubscription,
  multipleSubscriptions,
  placedOrder,
  prepaidSubscription,
} from "../scenarios/index.js";
import type { Scenario$ } from "../types/_.context.js";

const scenarioArgument = (context: Context): Scenario$ =>
  ({
    context,
    loadContext: (path: string) => (path === "/" ? context : {}),
    route: () => ({}),
    routes: {},
  }) as unknown as Scenario$;

test("reset installs an independent and deterministic state", () => {
  const context = new Context({} as never);
  const fixture = happyPathState();

  context.reset(fixture);
  context.state.customers[0].first_name = "Changed in context";

  assert.equal(fixture.customers[0].first_name, "Ada");
  context.reset(happyPathState());
  assert.equal(context.state.customers[0].first_name, "Ada");
  assert.equal(context.state.items[0].subscription, "subscription_demo");
});

test("named scenarios replace the complete world", () => {
  const context = new Context({} as never);
  const $ = scenarioArgument(context);

  happyPath($);
  assert.equal(context.state.subscriptions.length, 1);
  assert.equal(context.state.orders.length, 1);

  emptyAccount($);
  assert.equal(context.state.customers.length, 1);
  assert.equal(context.state.subscriptions.length, 0);
  assert.equal(context.state.orders.length, 0);

  happyPath($);
  assert.equal(context.state.orders[0].public_id, "order_upcoming");

  for (const scenario of [
    multipleSubscriptions,
    inactivePayment,
    crossCustomerReferences,
    prepaidSubscription,
    placedOrder,
    monthEndSubscription,
  ]) {
    scenario($);
    assert.ok(context.state.customers.length > 0);
    assert.ok(context.state.orders.length > 0);
  }
});

test("only the documented fake credential is authorized", () => {
  const context = new Context({} as never);
  assert.equal(context.isAuthorized("ordergroove-simulator-key"), true);
  assert.equal(context.isAuthorized("real-looking-secret"), false);
  assert.equal(context.isAuthorized(undefined), false);
});
