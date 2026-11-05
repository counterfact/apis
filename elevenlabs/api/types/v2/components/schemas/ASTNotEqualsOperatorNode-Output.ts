import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTNotEqualsOperatorNode_Output = {
  /**
   * @default "neq_operator"
   */
  type: "neq_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
