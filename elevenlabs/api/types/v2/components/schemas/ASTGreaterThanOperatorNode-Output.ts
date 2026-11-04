import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTGreaterThanOperatorNode_Output = {
  /**
   * @default "gt_operator"
   */
  type: "gt_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
