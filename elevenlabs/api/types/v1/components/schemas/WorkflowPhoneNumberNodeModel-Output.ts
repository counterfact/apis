import type { CustomSIPHeader } from "./CustomSIPHeader.js";
import type { CustomSIPHeaderWithDynamicVariable } from "./CustomSIPHeaderWithDynamicVariable.js";
import type { PhoneNumberTransferDestination } from "./PhoneNumberTransferDestination.js";
import type { SIPUriTransferDestination } from "./SIPUriTransferDestination.js";
import type { PhoneNumberDynamicVariableTransferDestination } from "./PhoneNumberDynamicVariableTransferDestination.js";
import type { SIPUriDynamicVariableTransferDestination } from "./SIPUriDynamicVariableTransferDestination.js";
import type { TransferTypeEnum } from "./TransferTypeEnum.js";
import type { UUITransferConfig } from "./UUITransferConfig.js";
import type { PostDialDigitsStatic } from "./PostDialDigitsStatic.js";
import type { PostDialDigitsDynamicVariable } from "./PostDialDigitsDynamicVariable.js";
import type { Position_Output } from "./Position-Output.js";
export type WorkflowPhoneNumberNodeModel_Output = {
  /**
   * Custom SIP headers to include when transferring the call. Each header can be either a static value or a dynamic variable reference.
   */
  custom_sip_headers: Array<
    | (CustomSIPHeader & { type: "static" })
    | (CustomSIPHeaderWithDynamicVariable & { type: "dynamic" })
  >;
  transfer_destination:
    | (PhoneNumberTransferDestination & { type: "phone" })
    | (SIPUriTransferDestination & { type: "sip_uri" })
    | (PhoneNumberDynamicVariableTransferDestination & {
        type: "phone_dynamic_variable";
      })
    | (SIPUriDynamicVariableTransferDestination & {
        type: "sip_uri_dynamic_variable";
      });
  /**
   * @default "conference"
   */
  transfer_type: TransferTypeEnum;
  /**
   * When True, a ringing tone is played on the original call leg while a SIP REFER transfer completes. The tone is carried over RTP to the SIP peer executing the REFER, so disable this if the receiving system (e.g. an SBC or contact center) should not hear it. When disabled the caller hears silence until the transfer completes. SIP REFER transfers only.
   * @default true
   */
  sip_refer_play_dialtone: boolean;
  /**
   * User-to-User Information (RFC 7433) to attach to SIP REFER transfers. Carries call context such as CRM identifiers or escalation reason across the transfer boundary.
   */
  uui: UUITransferConfig | null;
  /**
   * DTMF digits to send after call connects (e.g., 'ww1234' for extension). Can be either a static value or a dynamic variable reference. Use 'w' for 0.5s pause. Only supported for Twilio transfers.
   */
  post_dial_digits:
    | (
        | (PostDialDigitsStatic & { type: "static" })
        | (PostDialDigitsDynamicVariable & { type: "dynamic" })
      )
    | null;
  /**
   * @default "phone_number"
   */
  type: "phone_number";
  /**
   * Position of the node in the workflow.
   */
  position: Position_Output;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order: Array<string>;
};
