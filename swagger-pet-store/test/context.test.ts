import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/_.context.ts";

test("Context.savePet assigns ids and defaults status", () => {
  const context = new Context({} as never);

  const firstPet = context.savePet({
    name: "doggie",
    photoUrls: [],
  });
  assert.equal(firstPet.id, 1);
  assert.equal(firstPet.status, "available");

  const secondPet = context.savePet({
    id: 5,
    name: "kitten",
    photoUrls: [],
    status: "pending",
  });
  assert.equal(secondPet.id, 5);
  assert.equal(secondPet.status, "pending");

  const thirdPet = context.savePet({
    name: "bird",
    photoUrls: [],
  });
  assert.equal(thirdPet.id, 6);
  assert.equal(context.petsById.get(6)?.name, "bird");
});

test("Context.saveOrder assigns ids and stores orders", () => {
  const context = new Context({} as never);

  const firstOrder = context.saveOrder({
    petId: 1,
    quantity: 2,
    complete: false,
  });
  assert.equal(firstOrder.id, 1);

  const secondOrder = context.saveOrder({
    id: 10,
    petId: 2,
    quantity: 1,
    complete: true,
  });
  assert.equal(secondOrder.id, 10);

  const thirdOrder = context.saveOrder({
    petId: 3,
    quantity: 1,
    complete: false,
  });
  assert.equal(thirdOrder.id, 11);
});

test("Context.saveUser assigns username and updates id sequence", () => {
  const context = new Context({} as never);

  const firstUser = context.saveUser({
    firstName: "Jane",
  });
  assert.equal(firstUser.id, 1);
  assert.equal(firstUser.username, "user-1");

  const secondUser = context.saveUser({
    id: 7,
    username: "alice",
    firstName: "Alice",
  });
  assert.equal(secondUser.id, 7);
  assert.equal(secondUser.username, "alice");
  assert.equal(context.usersByUsername.get("alice")?.firstName, "Alice");

  const thirdUser = context.saveUser({
    firstName: "Bob",
  });
  assert.equal(thirdUser.id, 8);
  assert.equal(thirdUser.username, "user-8");
});
