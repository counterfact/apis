import type { RequiredConstraint } from "./RequiredConstraint.js";
/**
 * Wrapper for anyOf/allOf composition constraints scoped to required fields.
 */
export type RequiredConstraints = {
  any_of?: Array<RequiredConstraint>;
  all_of?: Array<RequiredConstraint>;
};
