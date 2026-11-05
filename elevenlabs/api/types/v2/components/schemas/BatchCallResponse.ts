import type { TelephonyProvider } from "./TelephonyProvider.js";
import type { BatchCallWhatsAppParams } from "./BatchCallWhatsAppParams.js";
import type { BatchCallStatus } from "./BatchCallStatus.js";
import type { TelephonyCallConfig_Output } from "./TelephonyCallConfig-Output.js";
export type BatchCallResponse = {
  id: string;
  phone_number_id: string | null;
  phone_provider: TelephonyProvider | null;
  whatsapp_params: BatchCallWhatsAppParams | null;
  name: string;
  agent_id: string;
  branch_id: string | null;
  environment: string | null;
  created_at_unix: number;
  scheduled_time_unix: number;
  timezone: string | null;
  /**
   * @default 0
   */
  total_calls_dispatched: number;
  /**
   * @default 0
   */
  total_calls_scheduled: number;
  /**
   * @default 0
   */
  total_calls_finished: number;
  last_updated_at_unix: number;
  status: BatchCallStatus;
  /**
   * @default 0
   */
  retry_count: number;
  telephony_call_config: TelephonyCallConfig_Output;
  /**
   * Maximum number of simultaneous calls for this batch. When set, dispatch is governed by this limit rather than workspace/agent capacity percentages.
   */
  target_concurrency_limit: number | null;
  agent_name: string;
  branch_name: string | null;
};
