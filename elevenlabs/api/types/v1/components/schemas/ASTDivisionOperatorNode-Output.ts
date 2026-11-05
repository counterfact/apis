import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTDivisionOperatorNode_Output = {
  /**
   * @default "div_operator"
   */
  type: "div_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
