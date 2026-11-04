import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { TestType } from "./TestType.js";
import type { AgentTestEntityType } from "./AgentTestEntityType.js";
import type { AgentTestFolderPathSegmentResponseModel } from "./AgentTestFolderPathSegmentResponseModel.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
export type UnitTestSummaryResponseModel = {
  /**
   * The ID of the test
   */
  id: string;
  /**
   * Name of the test
   */
  name: string;
  /**
   * The access information of the test
   */
  access_info?: ResourceAccessInfo | null;
  /**
   * Creation time of the test in unix seconds
   */
  created_at_unix_secs: number;
  /**
   * Last update time of the test in unix seconds
   */
  last_updated_at_unix_secs: number;
  /**
   * Type of the test or entity
   */
  type: TestType;
  /**
   * The type of entity (test or folder)
   * @default "test"
   */
  entity_type?: AgentTestEntityType;
  /**
   * The ID of the parent folder
   */
  folder_parent_id?: string | null;
  /**
   * The folder path segments from root to this entity
   */
  folder_path?: Array<AgentTestFolderPathSegmentResponseModel>;
  /**
   * Number of direct children (tests and subfolders) for folders only
   */
  children_count?: number | null;
  /**
   * Channel the test simulates the conversation as. Null for folders or default behavior.
   */
  conversation_initiation_source?: ConversationInitiationSource | null;
};
