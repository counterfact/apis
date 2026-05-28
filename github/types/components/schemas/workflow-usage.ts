/**
 * Workflow Usage
 */
export type workflow_usage = {
  billable: {
    UBUNTU?: { total_ms?: number };
    MACOS?: { total_ms?: number };
    WINDOWS?: { total_ms?: number };
  };
};
