import type { ConversationSource } from "./ConversationSource.js";
import type { ManualSource } from "./ManualSource.js";
export type MemoryEntrySearchResult = {
  entry_id: string;
  version: number;
  summary?: string | null;
  text?: string | null;
  source?: ConversationSource | ManualSource | null;
};
