import type { ASTNode_Input } from "./ASTNode-Input.js";
export type WorkflowExpressionConditionModel_Input = {
  /**
   * Optional human-readable label for the condition used throughout the UI.
   */
  label?: string | null;
  /**
   * @default "expression"
   */
  type?: "expression";
  /**
   * Expression to evaluate.
   */
  expression: ASTNode_Input;
};
