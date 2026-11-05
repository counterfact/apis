import type { LiteralJsonSchemaProperty } from "./LiteralJsonSchemaProperty.js";
export type DataCollectionResultCommonModel = {
  data_collection_id: string;
  name?: string | null;
  value?: unknown;
  json_schema?: LiteralJsonSchemaProperty | null;
  rationale: string;
};
