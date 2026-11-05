import type { Context as Analytics } from "../workspace/analytics/_.context.js";
export class Context {
  analytics?: () => Analytics;
  legacyUsage(query: Record<string, unknown>) {
    if (!this.analytics) throw new Error("Run startup or reset");
    return this.analytics().legacyUsage(query);
  }
}
