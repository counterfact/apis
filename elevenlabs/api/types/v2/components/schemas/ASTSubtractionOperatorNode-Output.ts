import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTSubtractionOperatorNode_Output = {
  /**
   * @default "sub_operator"
   */
  type: "sub_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Output;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Output;
};
