import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTGreaterThanOrEqualsOperatorNode_Output = {
  /**
   * @default "gte_operator"
   */
  type: "gte_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
