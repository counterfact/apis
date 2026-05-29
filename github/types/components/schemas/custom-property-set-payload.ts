/**
 * Custom property set payload
 */
export type custom_property_set_payload = {
  /**
   * The type of the value for the property
   * @example "single_select"
   */
  value_type:
    | "string"
    | "single_select"
    | "multi_select"
    | "true_false"
    | "url";
  /**
   * Whether the property is required.
   */
  required?: boolean;
  /**
   * Default value of the property
   */
  default_value?: string | Array<string>;
  /**
   * Short description of the property
   */
  description?: string;
  /**
   * An ordered list of the allowed values of the property.
   * The property can have up to 200 allowed values.
   */
  allowed_values?: Array<string>;
  /**
   * Who can edit the values of the property
   * @example "org_actors"
   */
  values_editable_by?: "org_actors" | "org_and_repo_actors";
  /**
   * Whether setting properties values is mandatory
   */
  require_explicit_values?: boolean;
};
