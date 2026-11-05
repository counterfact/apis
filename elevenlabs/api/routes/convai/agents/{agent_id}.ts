import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"];
export const GET: Route["GET"] = async ($) => {
  if ($.query.include_procedure_generated_workflow_elements === true)
    return $.x.response
      .status(400)
      .json({
        detail: {
          status: "unsupported_agent_selector",
          message: "Generated workflows are not simulated",
        },
      });
  try {
    const agent = $.context.lifecycle
      ? $.context.lifecycle.select($.path.agent_id, $.query)
      : $.context.getAgent($.path.agent_id);
    if (!agent)
      return $.x.response
        .status(404)
        .json({
          detail: { status: "agent_not_found", message: "Agent not found" },
        });
    return $.response.status(200).json(agent);
  } catch (error) {
    if (error instanceof Error && error.name === "LifecycleError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  if ($.query.include_procedure_generated_workflow_elements === true)
    return $.x.response
      .status(400)
      .json({
        detail: {
          status: "unsupported_agent_selector",
          message: "Generated workflows are not simulated",
        },
      });
  try {
    const result = $.context.updateAgent(
      $.path.agent_id,
      $.body,
      $.query.branch_id,
    );
    if (result.error)
      return $.x.response
        .status(result.error === "agent_not_found" ? 404 : 400)
        .json({ detail: { status: result.error, message: result.error } });
    return $.response.status(200).json(result.value);
  } catch (error) {
    if (
      error instanceof Error &&
      ["LifecycleError", "ProcedureError"].includes(error.name)
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  if ($.query.force)
    return $.x.response
      .status(400)
      .json({
        detail: {
          status: "unsupported_agent_selector",
          message: "Subagent dependency cleanup is not simulated",
        },
      });
  if (!$.context.deleteAgent($.path.agent_id))
    return $.x.response
      .status(404)
      .json({
        detail: { status: "agent_not_found", message: "Agent not found" },
      });
  return $.response.status(204).empty();
};
