import type { Clause } from "./Clause.js";

export type UserSegmentRule = {
  _id?: string;
  clauses: Array<Clause>;
  weight?: number;
  rolloutContextKind?: string;
  bucketBy?: string;
  description?: string;
};
