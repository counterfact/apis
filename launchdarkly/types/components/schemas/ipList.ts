export type ipList = {
  /**
   * A list of the IP addresses LaunchDarkly's service uses
   * @example ["104.156.80.0/20","151.101.0.0/16"]
   */
  addresses: Array<string>;
  /**
   * A list of the IP addresses outgoing webhook notifications use
   * @example ["52.21.152.96/32"]
   */
  outboundAddresses: Array<string>;
};
