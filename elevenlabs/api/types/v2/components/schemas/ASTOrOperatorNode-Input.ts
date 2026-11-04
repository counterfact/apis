import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTOrOperatorNode_Input = {
  /**
   * @default "or_operator"
   */
  type?: "or_operator";
  /**
   * Child nodes of the logical operator.
   */
  children: Array<ASTNode_Input>;
};
