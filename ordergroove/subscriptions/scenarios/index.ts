import type { Scenario } from "../types/_.context.js";
import type { Context } from "../routes/_.context.js";

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
export const startup: Scenario = ($) => {
  const context = $.context as Context;
  context.seedSubscriptions([
    {
      subscription: {
        id: "subscription-internal-001",
        public_id: "subscription-001",
        customer_id: "customer-001",
        product_id: "product-001",
        quantity: 1,
        payment_id: "payment-001",
        shipping_address_id: "address-001",
        offer_id: "offer-profile-001",
        every: 1,
        every_period: "month",
        live: true,
      },
      createdAt: "2026-01-15",
    },
    {
      subscription: {
        id: "subscription-internal-002",
        public_id: "subscription-002",
        customer_id: "customer-002",
        product_id: "product-002",
        quantity: 2,
        payment_id: "payment-002",
        shipping_address_id: "address-002",
        offer_id: "offer-profile-002",
        every: 2,
        every_period: "week",
        live: false,
      },
      createdAt: "2026-02-20",
    },
  ]);
};

/**
 * An example scenario. To use it in the REPL, type:
 *   .scenario help
 */
export const help: Scenario = ($) => {
  void $;

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
};
