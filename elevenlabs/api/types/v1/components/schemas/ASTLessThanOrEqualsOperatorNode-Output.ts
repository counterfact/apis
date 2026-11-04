import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTLessThanOrEqualsOperatorNode_Output = {
  /**
   * @default "lte_operator"
   */
  type: "lte_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
