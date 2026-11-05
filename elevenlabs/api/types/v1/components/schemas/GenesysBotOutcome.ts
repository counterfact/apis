/**
 * Exit branch taken when the Genesys Bot Connector session ends.
 *
 * These values are the intent names registered in the Genesys bot list, so they are
 * what the Call Bot Connector node branches on. Adding a value here without also
 * registering the intent in Genesys would produce an exit the flow cannot handle.
 */
export type GenesysBotOutcome = "success" | "escalate";
