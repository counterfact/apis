import type { AgentDeploymentSource } from "./AgentDeploymentSource.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type AgentDeploymentHistoryItem = {
  /**
   * ID of the deployment
   */
  id: string;
  /**
   * Map of branch IDs to traffic percentages
   */
  traffic_percentage_branch_id_map?: { [key: string]: number };
  /**
   * Unix timestamp of when the traffic split was applied
   */
  deployed_at_unix_secs: number;
  /**
   * Whether this is the live traffic split
   */
  is_active: boolean;
  /**
   * What caused this traffic split change. Null for deployments created before this was recorded.
   */
  source?: AgentDeploymentSource | null;
  /**
   * Access information for the deployment, including who created it
   */
  access_info?: ResourceAccessInfo | null;
};
