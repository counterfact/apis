import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTMultiplicationOperatorNode_Output = {
  /**
   * @default "mul_operator"
   */
  type: "mul_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
