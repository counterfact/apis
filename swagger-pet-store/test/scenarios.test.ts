import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { Context } from "../routes/_.context.ts";

const require = createRequire(import.meta.url);
const {
  orders,
  petStore,
  pets,
  startup,
  users,
} = require("../scenarios/index.ts");

const createScenario$ = () => {
  const context = new Context({} as never);
  return {
    context,
    loadContext: (path: string) => (path === "/" ? context : {}),
    routes: {},
    route: () => ({}),
  };
};

test("petStore seeds reusable pet store data", () => {
  const $ = createScenario$();

  petStore($);

  assert.deepEqual(
    $.context.listPets().map((pet) => ({
      id: pet.id,
      name: pet.name,
      status: pet.status,
    })),
    [
      { id: 1, name: "Sparky", status: "available" },
      { id: 2, name: "Mittens", status: "pending" },
      { id: 3, name: "Sunny", status: "sold" },
    ],
  );
  assert.equal($.context.getUser("jane.doe")?.password, "pass123");
  assert.equal($.context.getOrder(1)?.petId, 1);
  assert.equal($.context.getOrder(2)?.status, "approved");
});

test("startup remains idempotent for repeated scenario loading", () => {
  const $ = createScenario$();

  startup($);
  startup($);

  assert.equal($.context.listPets().length, 3);
  assert.equal($.context.savePet({ name: "Nibbles", photoUrls: [] }).id, 4);
  assert.equal($.context.saveUser({ firstName: "Casey" }).id, 3);
  assert.equal(
    $.context.saveOrder({ petId: 3, quantity: 1, complete: false }).id,
    3,
  );
});

test("individual scenarios can seed pets, users, and orders separately", () => {
  const $ = createScenario$();

  pets($);
  users($);
  orders($);

  assert.equal($.context.getPet(2)?.name, "Mittens");
  assert.equal($.context.getUser("john.smith")?.firstName, "John");
  assert.equal($.context.getOrder(2)?.petId, 2);
});
