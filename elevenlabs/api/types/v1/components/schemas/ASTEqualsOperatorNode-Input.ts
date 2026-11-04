import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTEqualsOperatorNode_Input = {
  /**
   * @default "eq_operator"
   */
  type?: "eq_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
