import type { ResponseUnitTestModel } from "./ResponseUnitTestModel.js";
import type { ToolCallUnitTestModel } from "./ToolCallUnitTestModel.js";
import type { SimulationTestModel } from "./SimulationTestModel.js";
import type { TestRunStatus } from "./TestRunStatus.js";
import type { ConversationHistoryTranscriptCommonModel_Output } from "./ConversationHistoryTranscriptCommonModel-Output.js";
import type { TestConditionResultCommonModel } from "./TestConditionResultCommonModel.js";
import type { TestRunMetadata } from "./TestRunMetadata.js";
import type { ConversationChargingCommonModel } from "./ConversationChargingCommonModel.js";
export type UnitTestRunResponseModel = {
  test_run_id: string;
  test_info?:
    | (
        | (ResponseUnitTestModel & { type: "llm" })
        | (ToolCallUnitTestModel & { type: "tool" })
        | (SimulationTestModel & { type: "simulation" })
      )
    | null;
  test_invocation_id: string;
  agent_id: string;
  branch_id?: string | null;
  version_id?: string | null;
  /**
   * @default false
   */
  ran_against_draft?: boolean;
  workflow_node_id?: string | null;
  status: TestRunStatus;
  agent_responses?: Array<ConversationHistoryTranscriptCommonModel_Output> | null;
  test_id: string;
  /**
   * @default "Unknown Test"
   */
  test_name?: string;
  condition_result?: TestConditionResultCommonModel | null;
  last_updated_at_unix?: number;
  metadata?: TestRunMetadata | null;
  root_folder_id?: string | null;
  root_folder_name?: string | null;
  environment?: string | null;
  /**
   * Credits billed for this test run. None for runs created before cost tracking.
   */
  credits_used?: number | null;
  /**
   * Finalized billing and provider-usage breakdown for this test run.
   */
  charging?: ConversationChargingCommonModel | null;
};
