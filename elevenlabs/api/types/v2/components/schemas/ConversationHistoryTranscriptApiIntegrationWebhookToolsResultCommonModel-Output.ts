import type { DynamicVariableUpdateCommonModel } from "./DynamicVariableUpdateCommonModel.js";
export type ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Output =
  {
    request_id: string;
    tool_name: string;
    result_value: string;
    is_error: boolean;
    /**
     * @default false
     */
    is_blocked: boolean;
    tool_has_been_called: boolean;
    /**
     * @default 0
     */
    tool_latency_secs: number;
    /**
     * @default ""
     */
    error_type: string;
    /**
     * @default ""
     */
    raw_error_message: string;
    dynamic_variable_updates: Array<DynamicVariableUpdateCommonModel>;
    type: "api_integration_webhook";
    /**
     * @default ""
     */
    integration_id: string;
    /**
     * @default ""
     */
    credential_id: string;
    /**
     * @default ""
     */
    integration_connection_id: string;
  };
