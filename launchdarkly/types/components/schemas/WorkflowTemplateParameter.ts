import type { ObjectId } from "./ObjectId.js";
import type { ParameterDefault } from "./ParameterDefault.js";

export type WorkflowTemplateParameter = {
  /**
   * The ID of the condition or instruction referenced by this parameter
   */
  _id?: ObjectId;
  /**
   * The path of the property to parameterize, relative to its parent condition or instruction
   */
  path?: string;
  /**
   * The default value of the parameter and other relevant metadata
   */
  default?: ParameterDefault;
  /**
   * Whether the default value is valid for the target flag and environment
   */
  valid?: boolean;
};
