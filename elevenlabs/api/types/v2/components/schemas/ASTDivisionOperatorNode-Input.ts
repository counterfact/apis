import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTDivisionOperatorNode_Input = {
  /**
   * @default "div_operator"
   */
  type?: "div_operator";
  /**
   * Left operand of the binary operator.
   */
  left: ASTNode_Input;
  /**
   * Right operand of the binary operator.
   */
  right: ASTNode_Input;
};
