import type { RuleClause } from "./RuleClause.js";

export type ParameterDefault = {
  /**
   * The default value for the given parameter
   */
  value?: unknown;
  /**
   * Variation value for boolean flags. Not applicable for non-boolean flags.
   */
  booleanVariationValue?: boolean;
  /**
   * Metadata related to add rule instructions
   */
  ruleClause?: RuleClause;
};
