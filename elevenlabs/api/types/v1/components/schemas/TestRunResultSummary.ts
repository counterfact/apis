import type { TestRunResultBucket } from "./TestRunResultBucket.js";
export type TestRunResultSummary = {
  test_id: string;
  test_name: string;
  workflow_node_id?: string | null;
  buckets: Array<TestRunResultBucket>;
};
