import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTLessThanOrEqualsOperatorNode_Input = {
  /**
   * @default "lte_operator"
   */
  type?: "lte_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
