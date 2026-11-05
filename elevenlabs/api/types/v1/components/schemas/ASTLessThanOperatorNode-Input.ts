import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTLessThanOperatorNode_Input = {
  /**
   * @default "lt_operator"
   */
  type?: "lt_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
