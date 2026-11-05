import type { ASTNode_Output } from "./ASTNode-Output.js";
export type WorkflowExpressionConditionModel_Output = {
  /**
   * Optional human-readable label for the condition used throughout the UI.
   */
  label: string | null;
  /**
   * @default "expression"
   */
  type: "expression";
  /**
   * Expression to evaluate.
   */
  expression: ASTNode_Output;
};
