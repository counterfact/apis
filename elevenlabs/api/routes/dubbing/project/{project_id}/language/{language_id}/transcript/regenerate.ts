import type { Routes } from "../../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/language"]["/{language_id}"]["/transcript"]["/regenerate"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(202).random();
};
