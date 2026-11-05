import type { ConversationDeletionSettings } from "./ConversationDeletionSettings.js";
import type { ConversationHistoryFeedbackCommonModel } from "./ConversationHistoryFeedbackCommonModel.js";
import type { AuthorizationMethod } from "./AuthorizationMethod.js";
import type { ConversationChargingCommonModel } from "./ConversationChargingCommonModel.js";
import type { ConversationHistoryTwilioPhoneCallModel } from "./ConversationHistoryTwilioPhoneCallModel.js";
import type { ConversationHistoryExotelPhoneCallModel } from "./ConversationHistoryExotelPhoneCallModel.js";
import type { ConversationHistorySIPTrunkingPhoneCallModel } from "./ConversationHistorySIPTrunkingPhoneCallModel.js";
import type { ConversationHistoryBatchCallModel } from "./ConversationHistoryBatchCallModel.js";
import type { ConversationHistoryErrorCommonModel } from "./ConversationHistoryErrorCommonModel.js";
import type { ConversationHistoryRagUsageCommonModel } from "./ConversationHistoryRagUsageCommonModel.js";
import type { FeaturesUsageCommonModel } from "./FeaturesUsageCommonModel.js";
import type { ConversationHistoryElevenAssistantCommonModel } from "./ConversationHistoryElevenAssistantCommonModel.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { AsyncConversationMetadata } from "./AsyncConversationMetadata.js";
import type { WhatsAppConversationInfo } from "./WhatsAppConversationInfo.js";
import type { SMSConversationInfo } from "./SMSConversationInfo.js";
import type { AgentDefinitionSource } from "./AgentDefinitionSource.js";
import type { ConversationVoiceRewardModel } from "./ConversationVoiceRewardModel.js";
export type ConversationHistoryMetadataCommonModel = {
  start_time_unix_secs: number;
  accepted_time_unix_secs?: number | null;
  call_duration_secs: number;
  /**
   * Seconds the caller was held in the concurrency wait queue. Excluded from call_duration_secs and from billed time. None when the conversation was never queued.
   */
  queue_wait_secs?: number | null;
  cost?: number | null;
  deletion_settings?: ConversationDeletionSettings;
  feedback?: ConversationHistoryFeedbackCommonModel;
  /**
   * @default "public"
   */
  authorization_method?: AuthorizationMethod;
  charging?: ConversationChargingCommonModel;
  phone_call?:
    | (
        | (ConversationHistoryTwilioPhoneCallModel & { type: "twilio" })
        | (ConversationHistoryExotelPhoneCallModel & { type: "exotel" })
        | (ConversationHistorySIPTrunkingPhoneCallModel & {
            type: "sip_trunking";
          })
      )
    | null;
  batch_call?: ConversationHistoryBatchCallModel | null;
  /**
   * @default ""
   */
  termination_reason?: string;
  error?: ConversationHistoryErrorCommonModel | null;
  warnings?: Array<string>;
  main_language?: string | null;
  rag_usage?: ConversationHistoryRagUsageCommonModel | null;
  /**
   * @default false
   */
  text_only?: boolean;
  features_usage?: FeaturesUsageCommonModel;
  eleven_assistant?: ConversationHistoryElevenAssistantCommonModel;
  initiator_id?: string | null;
  /**
   * @default "unknown"
   */
  conversation_initiation_source?: ConversationInitiationSource;
  conversation_initiation_source_version?: string | null;
  timezone?: string | null;
  async_metadata?: AsyncConversationMetadata | null;
  whatsapp?: WhatsAppConversationInfo | null;
  sms?: SMSConversationInfo | null;
  /**
   * @default "unknown"
   */
  agent_created_from?: AgentDefinitionSource;
  /**
   * @default "unknown"
   */
  agent_last_updated_from?: AgentDefinitionSource;
  voice_rewards?: Array<ConversationVoiceRewardModel>;
  /**
   * Total fiat cost of the conversation in USD, i.e. the sum of the LLM price and the non-LLM platform price (the fiat analogue of ``cost``). ``None`` when neither is set (e.g. conversations that predate fiat cost tracking).
   */
  cost_fiat: number | null;
};
