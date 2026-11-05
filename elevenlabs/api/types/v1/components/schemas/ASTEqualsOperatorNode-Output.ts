import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTEqualsOperatorNode_Output = {
  /**
   * @default "eq_operator"
   */
  type: "eq_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
