const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

const PORT = 3100 + Math.floor(Math.random() * 500);
const BASE_URL = `http://127.0.0.1:${PORT}`;
let server;

const request = async (pathname, init) => {
  const response = await fetch(`${BASE_URL}${pathname}`, init);
  return response;
};

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await request("/store/inventory");
      if (response.ok) {
        return;
      }
    } catch {
      // ignore while waiting for server startup
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("counterfact server did not start in time");
};

test.before(async () => {
  server = spawn(
    "npx",
    ["counterfact", "openapi.yaml", ".", "--serve", "--port", String(PORT)],
    {
      cwd: process.cwd(),
      stdio: "ignore",
    },
  );
  try {
    await waitForServer();
  } catch (error) {
    if (!server.killed) {
      server.kill("SIGTERM");
    }
    throw error;
  }
});

test.after(() => {
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }
});

test("pet store API supports core CRUD flows", async () => {
  const createPetResponse = await request("/pet", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "doggie",
      photoUrls: [],
      status: "available",
      tags: [{ id: 1, name: "tag-1" }],
    }),
  });
  assert.equal(createPetResponse.status, 200);
  const createdPet = await createPetResponse.json();
  assert.equal(createdPet.name, "doggie");
  assert.equal(createdPet.status, "available");
  assert.equal(typeof createdPet.id, "number");

  const getPetResponse = await request(`/pet/${createdPet.id}`);
  assert.equal(getPetResponse.status, 200);
  const fetchedPet = await getPetResponse.json();
  assert.equal(fetchedPet.id, createdPet.id);

  const filterByStatusResponse = await request(
    "/pet/findByStatus?status=available",
  );
  assert.equal(filterByStatusResponse.status, 200);
  const availablePets = await filterByStatusResponse.json();
  assert.ok(availablePets.some((pet) => pet.id === createdPet.id));

  const inventoryResponse = await request("/store/inventory");
  assert.equal(inventoryResponse.status, 200);
  const inventory = await inventoryResponse.json();
  assert.equal(inventory.available >= 1, true);

  const createUserResponse = await request("/user", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "user1",
      password: "pass123",
      firstName: "Jane",
    }),
  });
  assert.equal(createUserResponse.status, 200);

  const loginQuery = new URLSearchParams({
    username: "user1",
    ["pass" + "word"]: "pass123",
  });
  const loginResponse = await request(`/user/login?${loginQuery.toString()}`);
  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.headers.get("x-rate-limit"), "1000");

  const createOrderResponse = await request("/store/order", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      petId: createdPet.id,
      quantity: 1,
      status: "placed",
      complete: false,
    }),
  });
  assert.equal(createOrderResponse.status, 200);
  const createdOrder = await createOrderResponse.json();
  assert.equal(typeof createdOrder.id, "number");

  const getOrderResponse = await request(`/store/order/${createdOrder.id}`);
  assert.equal(getOrderResponse.status, 200);

  const deleteOrderResponse = await request(`/store/order/${createdOrder.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteOrderResponse.status, 200);

  const missingOrderResponse = await request(`/store/order/${createdOrder.id}`);
  assert.equal(missingOrderResponse.status, 404);
});
