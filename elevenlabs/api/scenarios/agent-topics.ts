import type { Scenario } from "../types/index.js";

/** Historical completed local runs; no discovery, conversation analysis or model call. */
export const emptyAgentTopics: Scenario = ($) => {
  $.loadContext("/convai/agents").topicRuns = new Map();
};
export const resetAgentTopics: Scenario = ($) => {
  emptyAgentTopics($);
  const context = $.loadContext("/convai/agents");
  for (const [id, start, counts] of [
    ["sim-topic-run-old", 1735689600, [4, 2, 0]],
    ["sim-topic-run-latest", 1735776000, [8, 4, 1]],
  ] as const) {
    context.topicRuns.set(id, {
      agentId: "sim-agent",
      result: {
        window_start_unix_secs: start,
        window_end_unix_secs: start + 86400,
        topics: [
          {
            topic_id: "sim-topic-support",
            label: "Local support",
            description: "Synthetic support group",
            conversation_count: counts[0],
            success_rate: 0.75,
            metrics: {
              conversation_count: counts[0],
              sentiment: {
                sentiment: { count: counts[0], sum: counts[0] * 0.5 },
                frustration: { count: counts[0], sum: counts[0] * 0.1 },
              },
              evaluation_criteria: [
                {
                  criteria_id: "sim-topic-resolution",
                  success_count: counts[0] * 0.75,
                  failure_count: counts[0] * 0.25,
                  unknown_count: 0,
                },
              ],
            },
          },
          {
            topic_id: "sim-topic-sales",
            label: "Local sales",
            description: "Synthetic sales group",
            conversation_count: counts[1],
            success_rate: 0.5,
            metrics: {
              conversation_count: counts[1],
              sentiment: {
                sentiment: { count: counts[1], sum: counts[1] * -0.5 },
                frustration: { count: counts[1], sum: counts[1] * 0.8 },
              },
              evaluation_criteria: [
                {
                  criteria_id: "sim-topic-resolution",
                  success_count: counts[1] * 0.5,
                  failure_count: counts[1] * 0.5,
                  unknown_count: 0,
                },
              ],
            },
          },
          {
            topic_id: "sim-topic-unscored",
            label: "Unscored local topic",
            description: "Synthetic group without scored metrics",
            conversation_count: counts[2],
            success_rate: null,
            metrics: null,
          },
        ],
      },
    });
  }
};
