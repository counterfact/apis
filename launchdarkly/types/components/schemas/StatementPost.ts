import type { ActionSpecifier } from "./ActionSpecifier.js";

export type StatementPost = {
  /**
   * Resource specifier strings
   * @example ["proj/*:env/*:flag/*;testing-tag"]
   */
  resources?: Array<string>;
  /**
   * Targeted resources are the resources NOT in this list. The <code>resources</code> field must be empty to use this field.
   */
  notResources?: Array<string>;
  /**
   * Actions to perform on a resource
   * @example ["*"]
   */
  actions?: Array<ActionSpecifier>;
  /**
   * Targeted actions are the actions NOT in this list. The <code>actions</code> field must be empty to use this field.
   */
  notActions?: Array<ActionSpecifier>;
  /**
   * Whether this statement should allow or deny actions on the resources.
   * @example "allow"
   */
  effect: "allow" | "deny";
};
