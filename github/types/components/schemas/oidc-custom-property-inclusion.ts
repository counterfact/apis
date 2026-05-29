/**
 * An OIDC custom property inclusion for repository properties
 */
export type oidc_custom_property_inclusion = {
  /**
   * The name of the custom property that is included in the OIDC token
   */
  custom_property_name: string;
  /**
   * Whether the inclusion was defined at the organization or enterprise level
   * @example "organization"
   */
  inclusion_source: "organization" | "enterprise";
};
