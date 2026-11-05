import type { Scenario } from "../types/index.js";
export const emptyFlowTemplates: Scenario = ($) => {
  const context = $.loadContext("/flows/templates");
  context.templates = new Map();
  context.records = new Map();
  context.nextRunId = 1;
  context.runClock = 1735689900;
};
export const resetFlowTemplates: Scenario = ($) => {
  emptyFlowTemplates($);
  const context = $.loadContext("/flows/templates");
  for (const [id, name, updatedAt, listable] of [
    ["sim-template-text", "Local text", 1735689700, true],
    ["sim-template-unavailable", "Unavailable local model", 1735689700, true],
    ["sim-template-shared", "Shared local text", 1735689800, false],
  ] as const) {
    context.templates.set(id, {
      id,
      name,
      description: "Synthetic saved template metadata",
      updatedAt,
      listable,
      versions: [2, 1].map((number) => ({
        runnable: id !== "sim-template-unavailable",
        completionContent: { result: "Synthetic template result" },
        value: {
          version_id: `${id}-v${number}`,
          published_at_unix: 1735689600 + number,
          is_latest: number === 2,
          inputs: [
            {
              id: "prompt",
              content_schema: { type: "string", title: "Prompt" },
            },
          ],
          outputs: [
            {
              id: "result",
              content_schema: { type: "string", title: "Result" },
            },
          ],
        },
      })),
    });
  }
  context.records.set("sim-template-run", {
    createdAt: 1735689800,
    value: {
      id: "sim-template-run",
      template_id: "sim-template-text",
      version_id: "sim-template-text-v2",
      status: "completed",
      outputs: {
        result: {
          id: "sim-template-output",
          type: "string",
          status: "completed",
          content: "Synthetic saved text",
        },
      },
    },
  });
  context.records.set("sim-template-run-old", {
    createdAt: 1735689800,
    value: {
      id: "sim-template-run-old",
      template_id: "sim-template-text",
      version_id: "sim-template-text-v1",
      status: "failed",
      outputs: {
        result: {
          id: "sim-template-output-old",
          type: "string",
          status: "failed",
          failure_reason: "model_error",
          error_message: "Synthetic historical failure",
        },
      },
    },
  });
};

/** Resolve local queued text runs using the fixture captured when each run began. */
export const completeFlowTemplateRuns: Scenario = ($) => {
  const context = $.loadContext("/flows/templates");
  for (const [id, record] of context.records)
    if (record.execution && record.value.status === "pending")
      context.completeRun(id, record.execution.completionContent);
};
