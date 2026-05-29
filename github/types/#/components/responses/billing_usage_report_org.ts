import type { billing_usage_report } from "../../../components/schemas/billing-usage-report.js";

export type billing_usage_report_org = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: billing_usage_report;
    };
  };
  examples: {
    default: unknown;
  };
};
