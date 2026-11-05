import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTSubtractionOperatorNode_Input = {
  /**
   * @default "sub_operator"
   */
  type?: "sub_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
