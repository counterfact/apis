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

test("seeds, lists, and retrieves products without exposing mutable state", () => {
  const context = createContext();
  context.seedProducts([
    {
      id: "product-001",
      price: "19.99",
      external_product_id: "sku-coffee",
      autoship_enabled: true,
    },
  ]);

  const listed = context.listProducts();
  assert.equal(listed.length, 1);
  assert.equal(context.getProduct("product-001")?.price, "19.99");

  listed[0]!.price = "0.00";
  assert.equal(context.getProduct("product-001")?.price, "19.99");
});

test("replacement persists, preserves the path identifier, and removes omitted fields", () => {
  const context = createContext();
  context.seedProducts([
    {
      id: "product-001",
      price: "19.99",
      external_product_id: "sku-coffee",
      autoship_enabled: true,
    },
  ]);

  const updated = context.replaceProduct("product-001", {
    id: "ignored-id",
    price: "21.50",
    autoship_enabled: false,
  });

  assert.deepEqual(updated, {
    id: "product-001",
    price: "21.50",
    autoship_enabled: false,
  });
  assert.deepEqual(context.getProduct("product-001"), updated);
  assert.equal(context.replaceProduct("missing", { price: "1.00" }), undefined);
});
