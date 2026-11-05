import type { LiteralJsonSchemaProperty } from "./LiteralJsonSchemaProperty.js";
import type { ObjectJsonSchemaProperty_Input } from "./ObjectJsonSchemaProperty-Input.js";
export type ArrayJsonSchemaProperty_Input = {
  /**
   * @default "array"
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
   * When set, the entire array uses this constant value at runtime. Mutually exclusive with description (LLM-provided array), dynamic_variable, and is_omitted.
   */
  constant_value?: Array<unknown> | null;
  /**
   * If true, this parameter will be completely omitted from the request. Only valid for optional parameters. Mutually exclusive with description, dynamic_variable, and constant_value.
   * @default false
   */
  is_omitted?: boolean;
  /**
   * @default "array"
   */
  type?: "array";
  /**
   * Schema for array elements.
   * @default {"type":"string","description":"Array element","is_system_provided":false,"dynamic_variable":"","allowed_values_dynamic_variable":"","constant_value":"","is_omitted":false}
   */
  items?:
    | LiteralJsonSchemaProperty
    | ObjectJsonSchemaProperty_Input
    | ArrayJsonSchemaProperty_Input;
};
