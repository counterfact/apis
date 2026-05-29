/**
 * A hosted compute network settings resource.
 */
export type network_settings = {
  /**
   * The unique identifier of the network settings resource.
   * @example "220F78DACB92BBFBC5E6F22DE1CCF52309D"
   */
  id: string;
  /**
   * The identifier of the network configuration that is using this settings resource.
   * @example "934E208B3EE0BD60CF5F752C426BFB53562"
   */
  network_configuration_id?: string;
  /**
   * The name of the network settings resource.
   * @example "my-network-settings"
   */
  name: string;
  /**
   * The subnet this network settings resource is configured for.
   * @example "/subscriptions/14839728-3ad9-43ab-bd2b-fa6ad0f75e2a/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/my-vnet/subnets/my-subnet"
   */
  subnet_id: string;
  /**
   * The location of the subnet this network settings resource is configured for.
   * @example "eastus"
   */
  region: string;
};
