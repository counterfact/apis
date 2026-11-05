import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
/**
 * @example {"access_info":{"creator_email":"john@example.com","creator_name":"John Doe","is_creator":true,"role":"admin"},"agent_id":"J3Pbu5gP6NNKBscdCdwB","archived":false,"created_at_unix_secs":1716153600,"last_call_time_unix_secs":1716240000,"name":"My Agent","tags":["Customer Support","Technical Help","Eleven"],"updated_at_unix_secs":1716240000,"voice_id":"UCaNsl8F6Xh4GALkVMLS"}
 */
export type AgentSummaryResponseModel = {
  /**
   * The ID of the agent
   */
  agent_id: string;
  /**
   * The name of the agent
   */
  name: string;
  /**
   * Voice ID assigned to this agent
   */
  voice_id: string;
  /**
   * Agent tags used to categorize the agent
   */
  tags: Array<string>;
  /**
   * The creation time of the agent in unix seconds
   */
  created_at_unix_secs: number;
  /**
   * The last time the agent's main branch or agent-level settings were updated, in unix seconds
   */
  updated_at_unix_secs: number;
  /**
   * The access information of the agent
   */
  access_info: ResourceAccessInfo;
  /**
   * The time of the most recent call in unix seconds, null if no calls have been made
   */
  last_call_time_unix_secs?: number | null;
  /**
   * Whether the agent is archived
   * @default false
   */
  archived?: boolean;
};
