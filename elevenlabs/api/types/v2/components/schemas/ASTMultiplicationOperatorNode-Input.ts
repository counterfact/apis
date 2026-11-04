import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTMultiplicationOperatorNode_Input = {
  /**
   * @default "mul_operator"
   */
  type?: "mul_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
