import type { ColumnUnit } from "./ColumnUnit.js";
export type WorkspaceAnalyticsQueryResponseModel = {
  columns: Array<string>;
  column_types: Array<
    "String" | "Float" | "DateTime" | "Int" | "Bool" | "JSON" | "Map" | "Array"
  >;
  rows: Array<Array<string | number | number | boolean | string | null>>;
  column_units: Array<ColumnUnit | null>;
};
