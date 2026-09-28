import type { ActionSpecifier } from "./ActionSpecifier.js";

export type Statement = {
  /**
   * Resource specifier strings
   * @example ["proj/*:env/*;qa_*:/flag/*"]
   */
  resources?: Array<string>;
  /**
   * Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.
   */
  notResources?: Array<string>;
  /**
   * Actions to perform on a resource
   * @example ["*"]
   */
  actions?: Array<ActionSpecifier>;
  /**
   * Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.
   */
  notActions?: Array<ActionSpecifier>;
  /**
   * Whether this statement should allow or deny actions on the resources.
   * @example "allow"
   */
  effect: "allow" | "deny";
};
