import type { DynamicVariableUpdateCommonModel } from "./DynamicVariableUpdateCommonModel.js";
import type { EndCallToolResultModel } from "./EndCallToolResultModel.js";
import type { LanguageDetectionToolResultModel } from "./LanguageDetectionToolResultModel.js";
import type { TransferToAgentToolResultSuccessModel_Output } from "./TransferToAgentToolResultSuccessModel-Output.js";
import type { TransferToAgentToolResultErrorModel } from "./TransferToAgentToolResultErrorModel.js";
import type { TransferToNumberResultTwilioSuccessModel } from "./TransferToNumberResultTwilioSuccessModel.js";
import type { TransferToNumberResultSipSuccessModel } from "./TransferToNumberResultSipSuccessModel.js";
import type { TransferToNumberResultExotelSuccessModel } from "./TransferToNumberResultExotelSuccessModel.js";
import type { TransferToNumberResultAmazonConnectSuccessModel } from "./TransferToNumberResultAmazonConnectSuccessModel.js";
import type { TransferToNumberResultErrorModel } from "./TransferToNumberResultErrorModel.js";
import type { SkipTurnToolResponseModel } from "./SkipTurnToolResponseModel.js";
import type { PlayDTMFResultSuccessModel } from "./PlayDTMFResultSuccessModel.js";
import type { PlayDTMFResultErrorModel } from "./PlayDTMFResultErrorModel.js";
import type { VoiceMailDetectionResultSuccessModel } from "./VoiceMailDetectionResultSuccessModel.js";
import type { TestToolResultModel } from "./TestToolResultModel.js";
import type { KnowledgeBaseRagToolResultModel } from "./KnowledgeBaseRagToolResultModel.js";
import type { KnowledgeBaseToolResultModel } from "./KnowledgeBaseToolResultModel.js";
import type { StartProcedureToolResultSuccessModel } from "./StartProcedureToolResultSuccessModel.js";
import type { StartProcedureToolResultErrorModel } from "./StartProcedureToolResultErrorModel.js";
import type { EndProcedureToolResultSuccessModel } from "./EndProcedureToolResultSuccessModel.js";
import type { EndProcedureToolResultErrorModel } from "./EndProcedureToolResultErrorModel.js";
import type { DummyToolResultModel } from "./DummyToolResultModel.js";
export type ConversationHistoryTranscriptSystemToolResultCommonModel_Output = {
  request_id: string;
  tool_name: string;
  result_value: string;
  is_error: boolean;
  /**
   * @default false
   */
  is_blocked?: boolean;
  tool_has_been_called: boolean;
  /**
   * @default 0
   */
  tool_latency_secs?: number;
  /**
   * @default ""
   */
  error_type?: string;
  /**
   * @default ""
   */
  raw_error_message?: string;
  dynamic_variable_updates?: Array<DynamicVariableUpdateCommonModel>;
  type: "system";
  result?:
    | (
        | (EndCallToolResultModel & { result_type: "end_call_success" })
        | (LanguageDetectionToolResultModel & {
            result_type: "language_detection_success";
          })
        | (TransferToAgentToolResultSuccessModel_Output & {
            result_type: "transfer_to_agent_success";
          })
        | (TransferToAgentToolResultErrorModel & {
            result_type: "transfer_to_agent_error";
          })
        | (TransferToNumberResultTwilioSuccessModel & {
            result_type: "transfer_to_number_twilio_success";
          })
        | (TransferToNumberResultSipSuccessModel & {
            result_type: "transfer_to_number_sip_success";
          })
        | (TransferToNumberResultExotelSuccessModel & {
            result_type: "transfer_to_number_exotel_success";
          })
        | (TransferToNumberResultAmazonConnectSuccessModel & {
            result_type: "transfer_to_number_amazon_connect_success";
          })
        | (TransferToNumberResultErrorModel & {
            result_type: "transfer_to_number_error";
          })
        | (SkipTurnToolResponseModel & { result_type: "skip_turn_success" })
        | (PlayDTMFResultSuccessModel & { result_type: "play_dtmf_success" })
        | (PlayDTMFResultErrorModel & { result_type: "play_dtmf_error" })
        | (VoiceMailDetectionResultSuccessModel & {
            result_type: "voicemail_detection_success";
          })
        | (TestToolResultModel & { result_type: "testing_tool_result" })
        | (KnowledgeBaseRagToolResultModel & {
            result_type: "knowledge_base_rag_success";
          })
        | (KnowledgeBaseToolResultModel & {
            result_type: "knowledge_base_success";
          })
        | (StartProcedureToolResultSuccessModel & {
            result_type: "start_procedure_success";
          })
        | (StartProcedureToolResultErrorModel & {
            result_type: "start_procedure_error";
          })
        | (EndProcedureToolResultSuccessModel & {
            result_type: "end_procedure_success";
          })
        | (EndProcedureToolResultErrorModel & {
            result_type: "end_procedure_error";
          })
        | (DummyToolResultModel & { result_type: "dummy" })
      )
    | null;
};
