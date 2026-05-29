import type { Scenario$ } from "../types/_.context";

/**
 * Scenario scripts are plain TypeScript functions that receive the live REPL
 * environment and can read or mutate server state. Run them from the REPL with:
 *   .scenario <functionName>
 */

/**
 * Read or mutate the root context (same object routes see as $.context):
 *   $.context.<property> = <value>;
 *
 * Load a context for a specific path:
 *   const petsCtx = $.loadContext("/pets");
 *
 * Store a pre-configured route builder for later use in the REPL:
 *   $.routes.myRequest = $.route("/pets").method("get");
 */

/**
 * startup() runs automatically when the server initializes, right before the
 * REPL starts. Use it to seed dummy data so the server is ready to use
 * immediately. It receives the same $ argument as all other scenario functions.
 *
 * Tip: delegate to other scenario functions and pass $ along so each function
 * stays focused on a single concern. You can also pass additional arguments to
 * configure them, e.g. addPets($, 20, "dog").
 *
 * If you don't need a startup scenario, delete this function or leave it empty.
 */
const pets = ($: Scenario$) => {
  $.context.savePet({
    id: 1,
    category: { id: 1, name: "dogs" },
    name: "Sparky",
    photoUrls: ["https://example.com/pets/sparky.jpg"],
    tags: [{ id: 1, name: "featured" }],
    status: "available",
  });
  $.context.savePet({
    id: 2,
    category: { id: 2, name: "cats" },
    name: "Mittens",
    photoUrls: ["https://example.com/pets/mittens.jpg"],
    tags: [{ id: 2, name: "new" }],
    status: "pending",
  });
  $.context.savePet({
    id: 3,
    category: { id: 3, name: "birds" },
    name: "Sunny",
    photoUrls: ["https://example.com/pets/sunny.jpg"],
    tags: [{ id: 3, name: "popular" }],
    status: "sold",
  });
};

const users = ($: Scenario$) => {
  $.context.saveUser({
    id: 1,
    username: "jane.doe",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: "pass123",
    phone: "555-0100",
    userStatus: 1,
  });
  $.context.saveUser({
    id: 2,
    username: "john.smith",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    password: "pass456",
    phone: "555-0101",
    userStatus: 1,
  });
};

const orders = ($: Scenario$) => {
  $.context.saveOrder({
    id: 1,
    petId: 1,
    quantity: 1,
    shipDate: "2026-01-15T10:00:00.000Z",
    status: "placed",
    complete: false,
  });
  $.context.saveOrder({
    id: 2,
    petId: 2,
    quantity: 1,
    shipDate: "2026-01-16T10:00:00.000Z",
    status: "approved",
    complete: false,
  });
};

const petStore = ($: Scenario$) => {
  pets($);
  users($);
  orders($);
};

const startup = ($: Scenario$) => {
  petStore($);
};

/**
 * An example scenario. To use it in the REPL, type:
 *   .scenario help
 */
const help = () => {
  console.log(
    [
      "Scenarios are functions that populate the context object",
      "and / or the REPL environment. They are intended to",
      "populate your environment with specific data and",
      "configurations for testing purposes.",
    ].join("\n"),
  );

  console.log(
    "\nScenarios (including this one) are defined in the ./scenarios directory.",
  );
  console.log(
    "\nTry .scenario petStore to load sample pets, users, and orders.",
  );
};

module.exports = {
  startup,
  pets,
  users,
  orders,
  petStore,
  help,
};
