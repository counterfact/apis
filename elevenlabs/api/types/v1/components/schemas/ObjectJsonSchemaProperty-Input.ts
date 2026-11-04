import type { LiteralJsonSchemaProperty } from "./LiteralJsonSchemaProperty.js";
import type { ArrayJsonSchemaProperty_Input } from "./ArrayJsonSchemaProperty-Input.js";
import type { RequiredConstraints } from "./RequiredConstraints.js";
export type ObjectJsonSchemaProperty_Input = {
  /**
   * @default "object"
   */
  property_kind?: "array" | "object";
  /**
   * @default ""
   */
  description?: string;
  /**
   * When set, the entire parameter is populated from this dynamic variable at runtime. Mutually exclusive with description (LLM-provided value), constant_value, and is_omitted.
   * @default ""
   */
  dynamic_variable?: string;
  /**
   * When set, the entire object uses this constant JSON value at runtime. Mutually exclusive with description (LLM-provided object), dynamic_variable, and is_omitted.
   */
  constant_value?: { [key: string]: unknown } | null;
  /**
   * If true, this parameter will be completely omitted from the request. Only valid for optional parameters. Mutually exclusive with description, dynamic_variable, and constant_value.
   * @default false
   */
  is_omitted?: boolean;
  /**
   * @default "object"
   */
  type?: "object";
  required?: Array<string>;
  properties?: {
    [key: string]:
      | LiteralJsonSchemaProperty
      | ObjectJsonSchemaProperty_Input
      | ArrayJsonSchemaProperty_Input;
  };
  required_constraints?: RequiredConstraints | null;
};
