import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/test-invocations"]["/{test_invocation_id}"]["/resubmit"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
