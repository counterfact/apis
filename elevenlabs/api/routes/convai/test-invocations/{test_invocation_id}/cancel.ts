import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/test-invocations"]["/{test_invocation_id}"]["/cancel"];
export const POST: Route["POST"] = async ($) => {
  try {
    $.context.cancel($.path.test_invocation_id);
    return $.response.status(204).empty();
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
