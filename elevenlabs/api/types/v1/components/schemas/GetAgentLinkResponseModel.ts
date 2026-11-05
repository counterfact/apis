import type { ConversationTokenResponseModel } from "./ConversationTokenResponseModel.js";
/**
 * @example {"agent_id":"J3Pbu5gP6NNKBscdCdwB"}
 */
export type GetAgentLinkResponseModel = {
  /**
   * The ID of the agent
   */
  agent_id: string;
  /**
   * The token data for the agent
   */
  token?: ConversationTokenResponseModel | null;
};
