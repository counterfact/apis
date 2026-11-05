import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTGreaterThanOrEqualsOperatorNode_Input = {
  /**
   * @default "gte_operator"
   */
  type?: "gte_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
