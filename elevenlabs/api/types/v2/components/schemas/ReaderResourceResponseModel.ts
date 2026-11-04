/**
 * @example {"resource_id":"FCwhRBWXzGAHq8TQ4Fs18","resource_type":"read"}
 */
export type ReaderResourceResponseModel = {
  /**
   * The type of resource.
   */
  resource_type: "read" | "collection";
  /**
   * The ID of the resource.
   */
  resource_id: string;
};
