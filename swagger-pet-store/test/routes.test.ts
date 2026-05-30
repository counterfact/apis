import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import { Context } from "../routes/_.context.ts";
import { petStore } from "../scenarios/index.ts";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.yaml", import.meta.url));

let port: number;
let server: { stop(): Promise<void> } | undefined;
let context: Context;

const request = async (pathname: string, init?: RequestInit) => {
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
  new Promise<number>((resolve, reject) => {
    const tempServer = net.createServer();
    tempServer.listen(0, "127.0.0.1", () => {
      const address = tempServer.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new Error("failed to determine free port"));
      }

      tempServer.close();
    });
    tempServer.on("error", reject);
  });

test.before(async () => {
  port = await getFreePort();
  const config = {
    adminApiToken: "",
    alwaysFakeOptionals: false,
    basePath,
    buildCache: false,
    generate: {
      prune: false,
      routes: false,
      types: false,
    },
    openApiPath,
    port,
    prefix: "",
    proxyPaths: new Map([["", false]]),
    proxyUrl: "",
    startAdminApi: false,
    startRepl: false,
    startServer: true,
    validateRequests: true,
    validateResponses: true,
    watch: {
      routes: false,
      types: false,
    },
  };

  const app = await counterfact(config);
  server = await app.start(config);
  context = app.contextRegistry.find("/") as Context;
  petStore({
    context,
    loadContext: (path: string) => app.contextRegistry.find(path),
    route: () => ({}),
    routes: {},
  });

  try {
    await waitForServer();
  } catch (error) {
    await server.stop();
    throw error;
  }
});

test.after(async () => {
  await server?.stop();
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
  assert.equal(context.getPet(createdPet.id)?.name, "doggie");

  const getPetResponse = await request(`/pet/${createdPet.id}`);
  assert.equal(getPetResponse.status, 200);
  const fetchedPet = await getPetResponse.json();
  assert.equal(fetchedPet.id, createdPet.id);

  const filterByStatusResponse = await request(
    "/pet/findByStatus?status=available",
  );
  assert.equal(filterByStatusResponse.status, 200);
  const availablePets = await filterByStatusResponse.json();
  assert.ok(
    availablePets.some((pet: { id: number }) => pet.id === createdPet.id),
  );

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
  assert.equal(context.getUser("user1")?.firstName, "Jane");

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
  assert.equal(context.getOrder(createdOrder.id)?.petId, createdPet.id);

  const getOrderResponse = await request(`/store/order/${createdOrder.id}`);
  assert.equal(getOrderResponse.status, 200);

  const deleteOrderResponse = await request(`/store/order/${createdOrder.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteOrderResponse.status, 200);
  assert.equal(context.getOrder(createdOrder.id), undefined);

  const missingOrderResponse = await request(`/store/order/${createdOrder.id}`);
  assert.equal(missingOrderResponse.status, 404);
});
