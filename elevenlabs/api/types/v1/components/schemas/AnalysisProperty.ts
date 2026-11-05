import type { AllowedValues } from "./AllowedValues.js";
import type { LLM } from "./LLM.js";
/**
 * Data collection property with optional per-item LLM override for post-call analysis.
 *
 * TODO: migrate to composition (value_schema: LiteralJsonSchemaProperty + llm) instead of
 * inheritance, so this generalizes cleanly to object/array schemas in the future.
 * @example {"constant_value":"","description":"My property","dynamic_variable":"","is_system_provided":false,"type":"string"}
 */
export type AnalysisProperty = {
  type: "boolean" | "string" | "integer" | "number";
  /**
   * The description of the property. When set, the LLM will provide the value based on this description. Mutually exclusive with dynamic_variable, is_system_provided, constant_value, and is_omitted.
   * @default ""
   */
  description?: string;
  /**
   * List of allowed string values for string type parameters
   */
  enum?: Array<string> | null;
  /**
   * If true, the value will be populated by the system at runtime. Used by API Integration Webhook tools for templating. Mutually exclusive with description, dynamic_variable, constant_value, and is_omitted.
   * @default false
   */
  is_system_provided?: boolean;
  /**
   * The name of the dynamic variable to use for this property's value. Mutually exclusive with description, is_system_provided, constant_value, and is_omitted.
   * @default ""
   */
  dynamic_variable?: string;
  /**
   * Server-side rejection guard for an LLM-provided value: the runtime rejects any value outside the permitted set this object names, and the set is not advertised to the LLM as an enum. Only supported when the value source is `description`; combining it with dynamic_variable, is_system_provided, constant_value, or is_omitted is rejected.
   */
  allowed_values?: AllowedValues | null;
  /**
   * DEPRECATED: use `allowed_values` instead. When set, the LLM provides the value but the runtime rejects any value not present in the list held by this dynamic variable (must be a JSON array such as ["ws_alpha", "ws_beta"]). Use to let the LLM pick from a server-verified set (e.g. the IDs the current user is allowed to access). Requires description; mutually exclusive with dynamic_variable, is_system_provided, constant_value, and is_omitted.
   * @default ""
   * @deprecated
   */
  allowed_values_dynamic_variable?: string;
  /**
   * A constant value to use for this property. Mutually exclusive with description, dynamic_variable, is_system_provided, and is_omitted.
   * @default ""
   */
  constant_value?: string | number | number | boolean | null;
  /**
   * If true, this parameter will be completely omitted from the request. Only valid for optional parameters. Mutually exclusive with description, dynamic_variable, is_system_provided, and constant_value.
   * @default false
   */
  is_omitted?: boolean;
  /**
   * The name of this data collection item.
   */
  name?: string | null;
  /**
   * LLM model to use for this analysis item. If not set, uses agent's analysis_llm default.
   */
  llm?: LLM | null;
};
