export type ColumnFilter = {
  column: string;
  operation: "in" | "not_in" | "le" | "ge" | "lt" | "gt" | "eq" | "neq";
  values: Array<string | number | number | string | boolean | null>;
};
