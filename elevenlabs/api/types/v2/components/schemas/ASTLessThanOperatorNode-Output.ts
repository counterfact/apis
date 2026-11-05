import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTLessThanOperatorNode_Output = {
  /**
   * @default "lt_operator"
   */
  type: "lt_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
