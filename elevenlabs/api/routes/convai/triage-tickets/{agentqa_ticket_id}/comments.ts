import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/triage-tickets"]["/{agentqa_ticket_id}"]["/comments"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
