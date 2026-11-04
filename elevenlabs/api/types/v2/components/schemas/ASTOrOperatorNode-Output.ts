import type { ASTNode_Output } from "./ASTNode-Output.js";
export type ASTOrOperatorNode_Output = {
  /**
   * @default "or_operator"
   */
  type: "or_operator";
  /**
   * Child nodes of the logical operator.
   */
  children: Array<ASTNode_Output>;
};
