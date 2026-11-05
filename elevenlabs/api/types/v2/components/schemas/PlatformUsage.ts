import type { PlatformCategoryUsage } from "./PlatformCategoryUsage.js";
/**
 * Per-category breakdown of ``platform_charge`` (the analogue of ``llm_usage``).
 */
export type PlatformUsage = {
  category_usage?: { [key: string]: PlatformCategoryUsage };
};
