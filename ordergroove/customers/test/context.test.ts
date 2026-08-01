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

test("seeds, lists, and retrieves customers without exposing mutable state", () => {
  const context = createContext();
  context.seedCustomers([
    {
      id: "customer-internal-001",
      public_id: "customer-001",
      merchant_id: "merchant-001",
      merchant_user_id: "user-001",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
    },
  ]);

  const listed = context.listCustomers();
  assert.equal(listed.length, 1);
  assert.equal(context.getCustomer("customer-001")?.email, "ada@example.com");

  listed[0]!.email = "changed@example.com";
  assert.equal(context.getCustomer("customer-001")?.email, "ada@example.com");
});

test("creates customers with deterministic identifiers and persists them", () => {
  const context = createContext();
  context.seedCustomers([]);

  const first = context.createCustomer({
    merchant_user_id: "user-new",
    email: "new@example.com",
  });
  const second = context.createCustomer({ email: "second@example.com" });

  assert.equal(first.id, "customer-internal-001");
  assert.equal(first.public_id, "customer-001");
  assert.equal(second.id, "customer-internal-002");
  assert.equal(second.public_id, "customer-002");
  assert.deepEqual(context.getCustomer("customer-001"), first);
});

test("replacement updates preserve identifiers and remove omitted fields", () => {
  const context = createContext();
  context.seedCustomers([
    {
      id: "customer-internal-007",
      public_id: "customer-007",
      first_name: "Old",
      last_name: "Name",
      email: "old@example.com",
    },
  ]);

  const updated = context.replaceCustomer("customer-007", {
    first_name: "New",
    email: "new@example.com",
    id: "ignored-id",
    public_id: "ignored-public-id",
  });

  assert.deepEqual(updated, {
    id: "customer-internal-007",
    public_id: "customer-007",
    first_name: "New",
    email: "new@example.com",
  });
  assert.equal(
    context.replaceCustomer("missing", { first_name: "Nobody" }),
    undefined,
  );
});
