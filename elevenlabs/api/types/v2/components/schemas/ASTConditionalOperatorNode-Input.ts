import type { ASTNode_Input } from "./ASTNode-Input.js";
export type ASTConditionalOperatorNode_Input = {
  /**
   * @default "conditional_operator"
   */
  type?: "conditional_operator";
  /**
   * Condition deciding which expression should be selected.
   */
  condition: ASTNode_Input;
  /**
   * Expression selected if the condition is true.
   */
  trueExpression: ASTNode_Input;
  /**
   * Expression selected if the condition is false.
   */
  falseExpression: ASTNode_Input;
};
