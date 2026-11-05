import type { Routes } from "../../types/index.js";
type Route = Routes["/usage"]["/character-stats"];
export const GET: Route["GET"] = async ($) => {
  const query: Record<string, unknown> = { ...$.query };
  // Nullable integer query text is not converted by runtime #2612.
  const size = query.aggregation_bucket_size;
  if (typeof size === "string" && /^\d+$/.test(size)) query.aggregation_bucket_size = Number(size);
  try {
    return $.response.status(200).json($.context.legacyUsage(query));
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && error.name === "LegacyUsageError") {
      return $.x.response.status(400).json({ detail: { status: "invalid_legacy_usage_query", message: "Invalid or unsupported local legacy usage query" } });
    }
    throw error;
  }
};
