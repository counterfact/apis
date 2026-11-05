import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTGreaterThanOperatorNode_Input = {
  /**
   * @default "gt_operator"
   */
  type?: "gt_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
