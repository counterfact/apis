import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTAndOperatorNode_Input = {
  /**
   * @default "and_operator"
   */
  type?: "and_operator";
  /**
   * Child nodes of the logical operator.
   */
  children: Array<ASTNode_Input>;
};
