export type DestinationPost = {
  /**
   * A human-readable name for your Data Export destination
   * @example "example-destination"
   */
  name?: string;
  /**
   * The type of Data Export destination
   * @example "google-pubsub"
   */
  kind?:
    | "google-pubsub"
    | "kinesis"
    | "mparticle"
    | "segment"
    | "azure-event-hubs";
  /**
   * An object with the configuration parameters required for the destination type
   * @example "{\"project\":\"test-prod\",\"topic\":\"ld-pubsub-test-192301\"}"
   */
  config?: unknown;
  /**
   * Whether the export is on. Displayed as the integration status in the LaunchDarkly UI.
   * @example true
   */
  on?: boolean;
};
