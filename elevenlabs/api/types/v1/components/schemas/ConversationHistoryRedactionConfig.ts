import type { ConfigEntityType } from "./ConfigEntityType.js";
export type ConversationHistoryRedactionConfig = {
  /**
   * Whether conversation history redaction is enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * The entities to redact from the conversation transcript, audio and analysis. Use top-level types like 'name', 'email_address', or dot notation for specific subtypes like 'name.full_name'.
   */
  entities?: Array<ConfigEntityType>;
  /**
   * Data collection item IDs whose extracted values are not redacted. Their rationales are still redacted.
   */
  excluded_data_collection_ids?: Array<string>;
};
