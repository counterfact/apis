import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/test-invocations"]["/{test_invocation_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.get($.path.test_invocation_id));
  } catch (error) {
    if (error instanceof Error && error.name === "InvocationError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
