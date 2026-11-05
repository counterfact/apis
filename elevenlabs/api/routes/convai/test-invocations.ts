import type { Routes } from "../../types/index.js";
import type { Context } from "./test-invocations/_.context.js";
type Route = Routes["/convai"]["/test-invocations"];
export const GET: Route["GET"] = async ($) => {
  try {
    const query: Record<string, unknown> = { ...$.query };
    for (const key of ["start_time", "end_time"]) {
      const value = query[key];
      if (
        typeof value === "string" &&
        /^(0|[1-9]\d*)$/.test(value) &&
        Number.isSafeInteger(Number(value))
      )
        query[key] = Number(value);
    }
    return $.response
      .status(200)
      .json(($.context as unknown as Context).list(query));
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
