import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTAdditionOperatorNode_Output = {
  /**
   * @default "add_operator"
   */
  type: "add_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
