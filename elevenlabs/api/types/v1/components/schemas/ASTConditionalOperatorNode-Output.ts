import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTConditionalOperatorNode_Output = {
  /**
   * @default "conditional_operator"
   */
  type: "conditional_operator";
  /**
   * Condition deciding which expression should be selected.
   */
  condition: ASTNode_Output;
  /**
   * Expression selected if the condition is true.
   */
  trueExpression: ASTNode_Output;
  /**
   * Expression selected if the condition is false.
   */
  falseExpression: ASTNode_Output;
};
