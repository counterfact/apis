/**
 * @example {"agent_id":"F3Pbu5gP6NNKBscdCdwB","agent_name":"My Agent"}
 */
export type PhoneNumberAgentInfo = {
  /**
   * The ID of the agent
   */
  agent_id: string;
  /**
   * The name of the agent
   */
  agent_name: string;
  /**
   * Environment to use for resolving environment variables on calls to this number.
   */
  environment?: string | null;
  /**
   * Agent branch to use for calls to this number.
   */
  branch_id?: string | null;
};
