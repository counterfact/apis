const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");

let port;
let server;

const request = async (pathname, init) => {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, init);
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

const getFreePort = async () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new Error("failed to determine free port"));
      }
      server.close();
    });
    server.on("error", reject);
  });

test.before(async () => {
  port = await getFreePort();
  server = spawn(
    "npx",
    ["counterfact", "openapi.yaml", ".", "--serve", "--port", String(port)],
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
  const seededInventoryResponse = await request("/store/inventory");
  assert.equal(seededInventoryResponse.status, 200);
  const seededInventory = await seededInventoryResponse.json();
  assert.deepEqual(seededInventory, {
    available: 1,
    pending: 1,
    sold: 1,
  });

  const seededUserResponse = await request("/user/jane.doe");
  assert.equal(seededUserResponse.status, 200);
  const seededUser = await seededUserResponse.json();
  assert.equal(seededUser.username, "jane.doe");

  const seededLoginQuery = new URLSearchParams({
    username: "jane.doe",
    password: "pass123",
  });
  const seededLoginResponse = await request(
    `/user/login?${seededLoginQuery.toString()}`,
  );
  assert.equal(seededLoginResponse.status, 200);

  const seededOrderResponse = await request("/store/order/1");
  assert.equal(seededOrderResponse.status, 200);
  const seededOrder = await seededOrderResponse.json();
  assert.equal(seededOrder.petId, 1);

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
  assert.ok(inventory.available >= 1);

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
    password: "pass123",
  });
  const loginResponse = await request(`/user/login?${loginQuery.toString()}`);
  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.headers.get("X-Rate-Limit"), "1000");

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
