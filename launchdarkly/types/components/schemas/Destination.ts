import type { Access } from "./Access.js";

export type Destination = {
  /**
   * The ID of this Data Export destination
   * @example "610addeadbeefaa86ec9a7d4"
   */
  _id?: string;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/destinations","type":"application/json"},"self":{"href":"/api/v2/destinations/my-project/my-environment/610addeadbeefaa86ec9a7d4","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
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
   * @example 1
   */
  version?: number;
  /**
   * An object with the configuration parameters required for the destination type
   * @example "{\"project\":\"test-prod\",\"topic\":\"ld-pubsub-test-192301\"}"
   */
  config?: unknown;
  /**
   * Whether the export is on, that is, the status of the integration
   * @example true
   */
  on?: boolean;
  /**
   * Details on the allowed and denied actions for this Data Export destination
   */
  _access?: Access;
};
