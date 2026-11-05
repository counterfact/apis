import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTAdditionOperatorNode_Input = {
  /**
   * @default "add_operator"
   */
  type?: "add_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
