import type { Operator } from "./Operator.js";

export type Clause = {
  _id?: string;
  attribute: string;
  op: Operator;
  values: Array<unknown>;
  contextKind?: string;
  negate: boolean;
};
