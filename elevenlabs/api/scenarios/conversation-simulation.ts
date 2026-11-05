import type { Scenario } from "../types/index.js";

export const resetConversationSimulation: Scenario = ($) => {
  $.loadContext("/convai/agents").simulationDefaults = {
    maxNewTurns: 6,
    maxHistoryTurns: 100,
    userMessage: "This is a synthetic user request.",
    agentReply: "This is a synthetic agent response.",
    analysis: {
      call_successful: "unknown",
      call_success_score: null,
      transcript_summary:
        "Bounded synthetic conversation; no model or tools were executed.",
      call_summary_title: "Synthetic conversation",
      data_collection_results: {},
      data_collection_results_list: [],
    },
    rationale:
      "Not evaluated: this local simulator does not run an evaluation model.",
  };
};
