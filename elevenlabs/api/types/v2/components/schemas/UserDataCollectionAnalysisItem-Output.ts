import type { LLM } from "./LLM.js";
import type { DataCollectionValueSchema } from "./DataCollectionValueSchema.js";
export type UserDataCollectionAnalysisItem_Output = {
  name: string;
  /**
   * @default "user"
   */
  source?: "user";
  /**
   * LLM to use for this item. If unset, the attaching agent's analysis_llm default is used.
   */
  llm?: LLM | null;
  /**
   * @default "data_collection"
   */
  kind?: "data_collection";
  /**
   * Type/description/enum describing the value to extract.
   */
  value_schema: DataCollectionValueSchema;
};
