import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/test-invocations"]["/{test_invocation_id}"]["/resubmit"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.resubmit($.path.test_invocation_id, $.body));
  } catch (error) {
    if (
      error instanceof Error &&
      ["InvocationError", "LifecycleError"].includes(error.name)
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
