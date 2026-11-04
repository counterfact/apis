import type { TwilioRegionId } from "./TwilioRegionId.js";
import type { TwilioEdgeLocation } from "./TwilioEdgeLocation.js";
export type RegionConfigRequest = {
  /**
   * Region ID
   */
  region_id: TwilioRegionId;
  /**
   * Auth Token for this region
   */
  token: string;
  /**
   * Edge location for this region
   */
  edge_location: TwilioEdgeLocation;
};
