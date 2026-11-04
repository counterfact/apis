import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTAndOperatorNode_Output = {
  /**
   * @default "and_operator"
   */
  type: "and_operator";
  /**
   * Child nodes of the logical operator.
   */
  children: Array<ASTNode_Output>;
};
