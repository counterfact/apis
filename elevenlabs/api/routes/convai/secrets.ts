import type { Context } from "./secrets/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/secrets"];
const integerQuery = (value: unknown) => value == null ? undefined :
  typeof value === "number" ? value : typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value) ? Number(value) : NaN;
export const POST: Route["POST"] = async ($) => {
  // Collection typing uses the parent while runtime resolves the nested context.
  const result = ($.x.context as Context).createSecret($.body);
  if (result.error) return $.x.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
export const GET: Route["GET"] = async ($) => {
  const result = ($.x.context as Context).listSecrets({ ...$.query,
    // Installed Dispatcher leaves nullable integers as text (upstream #2612).
    page_size: integerQuery($.query.page_size),
    dependency_limit: integerQuery($.query.dependency_limit),
  });
  if (result.error) return $.x.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
