import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/deployments"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.lifecycle!.deploy($.path.agent_id, $.body));
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
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.lifecycle!.deployments($.path.agent_id, $.query));
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
