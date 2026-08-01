import assert from "node:assert/strict";
import test from "node:test";
import { Store } from "../../_.store.ts";
import { Context } from "../routes/_.context.ts";
import type { Context$ } from "../types/_.context.ts";

const createContext = () => new Context({ store: new Store() } as Context$);

test("authorizes only the configured API key", () => {
  const context = createContext();

  assert.equal(context.isAuthorized(context.apiKey), true);
  assert.equal(context.isAuthorized("wrong"), false);
  assert.equal(context.isAuthorized(undefined), false);
});

test("seeds and lists offer profiles without exposing mutable state", () => {
  const context = createContext();
  context.seedOfferProfiles([
    {
      id: "offer-profile-001",
      name: "Subscribe and save",
      description: "Save 10% on recurring deliveries",
    },
  ]);

  const profiles = context.listOfferProfiles();
  profiles[0]!.name = "Changed";

  assert.equal(context.listOfferProfiles()[0]?.name, "Subscribe and save");
});

test("creates deterministic one-time discounts and persists them", () => {
  const context = createContext();
  context.seedOneTimeDiscounts([
    {
      id: "discount-001",
      customer_id: "customer-001",
      amount: "5.00",
      type: "fixed",
    },
  ]);

  const created = context.createOneTimeDiscount({
    customer_id: "customer-002",
    amount: "15.00",
    type: "fixed",
  });

  assert.deepEqual(created, {
    id: "discount-002",
    customer_id: "customer-002",
    amount: "15.00",
    type: "fixed",
  });
  assert.deepEqual(context.listOneTimeDiscounts(), [
    {
      id: "discount-001",
      customer_id: "customer-001",
      amount: "5.00",
      type: "fixed",
    },
    created,
  ]);
});

test("lists all entitlements or filters them by customer", () => {
  const context = createContext();
  context.seedEntitlements([
    {
      id: "entitlement-001",
      customer_id: "customer-001",
      status: "active",
    },
    {
      id: "entitlement-002",
      customer_id: "customer-002",
      status: "expired",
    },
  ]);

  assert.equal(context.listEntitlements().length, 2);
  assert.deepEqual(context.listEntitlements("customer-002"), [
    {
      id: "entitlement-002",
      customer_id: "customer-002",
      status: "expired",
    },
  ]);
  assert.deepEqual(context.listEntitlements("unknown"), []);
});
