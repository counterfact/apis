/**
 * A hosted compute network configuration.
 */
export type network_configuration = {
  /**
   * The unique identifier of the network configuration.
   * @example "123ABC456DEF789"
   */
  id: string;
  /**
   * The name of the network configuration.
   * @example "my-network-configuration"
   */
  name: string;
  /**
   * The hosted compute service the network configuration supports.
   */
  compute_service?: "none" | "actions" | "codespaces";
  /**
   * The unique identifier of each network settings in the configuration.
   * @example "123ABC456DEF789"
   */
  network_settings_ids?: Array<string>;
  /**
   * The unique identifier of each failover network settings in the configuration.
   * @example "123ABC456DEF789"
   */
  failover_network_settings_ids?: Array<string>;
  /**
   * Indicates whether the failover network resource is enabled.
   * @example true
   */
  failover_network_enabled?: boolean;
  /**
   * The time at which the network configuration was created, in ISO 8601 format.
   * @format date-time
   * @example "2024-04-26T11:31:07Z"
   */
  created_on: string;
};
