import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTNotEqualsOperatorNode_Input = {
  /**
   * @default "neq_operator"
   */
  type?: "neq_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
