import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/create"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createAgent($.body);
  if (result.error)
    return $.x.response
      .status(400)
      .json({ detail: { status: result.error, message: result.error } });
  return $.response.status(200).json(result.value);
};
