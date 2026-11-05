import type { Verbosity } from "./Verbosity.js";
import type { OutputFormat } from "./OutputFormat.js";
import type { InteractionBudget } from "./InteractionBudget.js";
export type BehaviorOverride = {
  /**
   * Verbosity override. Underlying default applies when unset.
   */
  verbosity?: Verbosity | null;
  /**
   * Output format override. Underlying default applies when unset.
   */
  output_format?: OutputFormat | null;
  /**
   * Interaction budget override. Underlying default applies when unset.
   */
  interaction_budget?: InteractionBudget | null;
};
