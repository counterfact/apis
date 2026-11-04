import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { DynamicVariableAssignment } from "./DynamicVariableAssignment.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolErrorHandlingMode } from "./ToolErrorHandlingMode.js";
import type { SearchClientsParams } from "./SearchClientsParams.js";
import type { SendCustomEmailParams } from "./SendCustomEmailParams.js";
import type { ListClientsParams } from "./ListClientsParams.js";
import type { GetClientByPhoneParams } from "./GetClientByPhoneParams.js";
import type { CreateClientParams } from "./CreateClientParams.js";
import type { UpdateClientParams } from "./UpdateClientParams.js";
import type { DeleteClientParams } from "./DeleteClientParams.js";
import type { ListStaffParams } from "./ListStaffParams.js";
import type { CreateStaffParams } from "./CreateStaffParams.js";
import type { UpdateStaffParams } from "./UpdateStaffParams.js";
import type { DeleteStaffParams } from "./DeleteStaffParams.js";
import type { ListAssetsParams } from "./ListAssetsParams.js";
import type { CreateAssetParams } from "./CreateAssetParams.js";
import type { UpdateAssetParams } from "./UpdateAssetParams.js";
import type { DeleteAssetParams } from "./DeleteAssetParams.js";
import type { ListServicesParams } from "./ListServicesParams.js";
import type { CreateServiceParams } from "./CreateServiceParams.js";
import type { UpdateServiceParams } from "./UpdateServiceParams.js";
import type { DeleteServiceParams } from "./DeleteServiceParams.js";
import type { ListProductsParams } from "./ListProductsParams.js";
import type { CreateProductParams } from "./CreateProductParams.js";
import type { UpdateProductParams } from "./UpdateProductParams.js";
import type { DeleteProductParams } from "./DeleteProductParams.js";
import type { CheckServiceAvailabilityParams } from "./CheckServiceAvailabilityParams.js";
import type { CreateClientAppointmentParams } from "./CreateClientAppointmentParams.js";
import type { GetClientAppointmentsParams } from "./GetClientAppointmentsParams.js";
import type { GetAppointmentByConfirmationNumberParams } from "./GetAppointmentByConfirmationNumberParams.js";
import type { CreateOrderParams } from "./CreateOrderParams.js";
import type { GetOrderByConfirmationNumberParams } from "./GetOrderByConfirmationNumberParams.js";
import type { GetClientOrdersParams } from "./GetClientOrdersParams.js";
import type { UpdateOrderParams } from "./UpdateOrderParams.js";
import type { CancelOrderParams } from "./CancelOrderParams.js";
import type { ListGroupSessionsParams } from "./ListGroupSessionsParams.js";
import type { ScheduleGroupSessionParams } from "./ScheduleGroupSessionParams.js";
import type { RegisterForGroupSessionParams } from "./RegisterForGroupSessionParams.js";
import type { CancelGroupSessionRegistrationParams } from "./CancelGroupSessionRegistrationParams.js";
import type { UpdateGroupSessionSeatsParams } from "./UpdateGroupSessionSeatsParams.js";
import type { CancelGroupSessionForAllParams } from "./CancelGroupSessionForAllParams.js";
import type { DeleteGroupSessionParams } from "./DeleteGroupSessionParams.js";
import type { ListCalendarEventsParams } from "./ListCalendarEventsParams.js";
import type { UpdateCalendarEventParams } from "./UpdateCalendarEventParams.js";
import type { CancelCalendarEventParams } from "./CancelCalendarEventParams.js";
import type { RestoreCalendarEventParams } from "./RestoreCalendarEventParams.js";
import type { DeleteCalendarEventParams } from "./DeleteCalendarEventParams.js";
import type { ListCustomerFacingAgentsParams } from "./ListCustomerFacingAgentsParams.js";
import type { GetAgentConfigParams } from "./GetAgentConfigParams.js";
import type { ListAgentRulesParams } from "./ListAgentRulesParams.js";
import type { CreateAgentRuleParams } from "./CreateAgentRuleParams.js";
import type { UpdateAgentRuleParams } from "./UpdateAgentRuleParams.js";
import type { DeleteAgentRuleParams } from "./DeleteAgentRuleParams.js";
import type { ListTransferRulesParams } from "./ListTransferRulesParams.js";
import type { CreateTransferRuleParams } from "./CreateTransferRuleParams.js";
import type { UpdateTransferRuleParams } from "./UpdateTransferRuleParams.js";
import type { DeleteTransferRuleParams } from "./DeleteTransferRuleParams.js";
import type { ListAgentProceduresParams } from "./ListAgentProceduresParams.js";
import type { ListAgentReferencesParams } from "./ListAgentReferencesParams.js";
import type { CreateAgentProcedureParams } from "./CreateAgentProcedureParams.js";
import type { UpdateAgentProcedureParams } from "./UpdateAgentProcedureParams.js";
import type { DeleteAgentProcedureParams } from "./DeleteAgentProcedureParams.js";
import type { ListHolidaysParams } from "./ListHolidaysParams.js";
import type { CreateHolidayParams } from "./CreateHolidayParams.js";
import type { UpdateHolidayParams } from "./UpdateHolidayParams.js";
import type { DeleteHolidayParams } from "./DeleteHolidayParams.js";
import type { GetScheduleParams } from "./GetScheduleParams.js";
import type { SubmitBusinessInfoParams } from "./SubmitBusinessInfoParams.js";
import type { UpdateBusinessInfoParams } from "./UpdateBusinessInfoParams.js";
import type { UpdateAgentConfigParams } from "./UpdateAgentConfigParams.js";
import type { GetAnalyticsSummaryParams } from "./GetAnalyticsSummaryParams.js";
import type { GetWorkspacePlanParams } from "./GetWorkspacePlanParams.js";
import type { GetBookingPageSettingsParams } from "./GetBookingPageSettingsParams.js";
import type { UpdateBookingPageSettingsParams } from "./UpdateBookingPageSettingsParams.js";
import type { UpdateBookingPageAppearanceParams } from "./UpdateBookingPageAppearanceParams.js";
import type { GetBookingSlugStatusParams } from "./GetBookingSlugStatusParams.js";
import type { SetBookingSlugParams } from "./SetBookingSlugParams.js";
import type { ListClientInteractionsParams } from "./ListClientInteractionsParams.js";
import type { CreateClientInteractionParams } from "./CreateClientInteractionParams.js";
import type { DeleteClientInteractionParams } from "./DeleteClientInteractionParams.js";
import type { ListLocationsParams } from "./ListLocationsParams.js";
import type { CreateLocationParams } from "./CreateLocationParams.js";
import type { UpdateLocationParams } from "./UpdateLocationParams.js";
import type { DeleteLocationParams } from "./DeleteLocationParams.js";
import type { LeaveMessageParams } from "./LeaveMessageParams.js";
import type { CreateServiceQuoteRequestParams } from "./CreateServiceQuoteRequestParams.js";
import type { CreateProductQuoteRequestParams } from "./CreateProductQuoteRequestParams.js";
import type { ReportKnowledgeGapParams } from "./ReportKnowledgeGapParams.js";
import type { OptInSmsReminderParams } from "./OptInSmsReminderParams.js";
import type { OptOutSmsReminderParams } from "./OptOutSmsReminderParams.js";
import type { TriggerUserVerificationParams } from "./TriggerUserVerificationParams.js";
import type { ValidateUserVerificationCodeParams } from "./ValidateUserVerificationCodeParams.js";
import type { OwnerListStaffParams } from "./OwnerListStaffParams.js";
import type { OwnerListAssetsParams } from "./OwnerListAssetsParams.js";
import type { OwnerListLocationsParams } from "./OwnerListLocationsParams.js";
import type { OwnerListServicesParams } from "./OwnerListServicesParams.js";
import type { OwnerListProductsParams } from "./OwnerListProductsParams.js";
import type { OwnerGetClientAppointmentsParams } from "./OwnerGetClientAppointmentsParams.js";
/**
 * SMB tool configuration that wraps SMB tool parameters.
 */
export type SMBToolConfig = {
  /**
   * Tool type identifier
   * @default "smb"
   */
  type?: "smb";
  name: string;
  /**
   * Description of when the tool should be used and what it does.
   * @default ""
   */
  description?: string;
  /**
   * The maximum time in seconds to wait for the tool call to complete.
   * @default 20
   */
  response_timeout_secs?: number;
  /**
   * DEPRECATED: use `interruption_mode` instead. If true, the user will not be able to interrupt the agent while this tool is running.
   * @default false
   * @deprecated
   */
  disable_interruptions?: boolean;
  /**
   * Controls whether the user can interrupt the agent around this tool call. 'allow' (default) lets the user interrupt at any time, 'disable_during_tool' suppresses interruptions only while the tool is running, 'disable_during_tool_and_turn' suppresses interruptions while the tool runs and for the agent response that follows it.
   * @default "allow"
   */
  interruption_mode?: ToolInterruptionMode;
  /**
   * DEPRECATED: use `pre_tool_speech` instead. If true, the agent will speak before the tool call.
   * @default false
   * @deprecated
   */
  force_pre_tool_speech?: boolean;
  /**
   * Controls whether the agent speaks before this tool is called. 'auto' (default) decides based on recent tool latency, 'force' always asks the agent to speak, 'off' fully opts out regardless of latency.
   * @default "auto"
   */
  pre_tool_speech?: PreToolSpeechMode;
  /**
   * Configuration for extracting values from tool responses and assigning them to dynamic variables
   */
  assignments?: Array<DynamicVariableAssignment>;
  /**
   * Predefined tool call sound type to play during tool execution. If not specified, no tool call sound will be played.
   */
  tool_call_sound?: ToolCallSoundType | null;
  /**
   * Determines when the tool call sound should play. 'auto' only plays when there's pre-tool speech, 'always' plays for every tool call.
   * @default "auto"
   */
  tool_call_sound_behavior?: ToolCallSoundBehavior;
  /**
   * Controls how tool errors are processed before being shared with the agent. 'auto' determines handling based on tool type (summarized for native integrations, hide for others), 'summarized' sends an LLM-generated summary, 'passthrough' sends the raw error, 'hide' does not share the error with the agent.
   * @default "auto"
   */
  tool_error_handling_mode?: ToolErrorHandlingMode;
  /**
   * User-facing tooltip for the procedure reference picker. Not sent to the LLM.
   * @default ""
   */
  human_description?: string;
  /**
   * Whether this tool is enabled for the agent
   * @default true
   */
  enabled?: boolean;
  params:
    | (SearchClientsParams & { smb_tool_type: "search_clients" })
    | (SendCustomEmailParams & { smb_tool_type: "send_custom_email" })
    | (ListClientsParams & { smb_tool_type: "list_clients" })
    | (GetClientByPhoneParams & { smb_tool_type: "get_client_by_phone" })
    | (CreateClientParams & { smb_tool_type: "create_client" })
    | (UpdateClientParams & { smb_tool_type: "update_client" })
    | (DeleteClientParams & { smb_tool_type: "delete_client" })
    | (ListStaffParams & { smb_tool_type: "list_staff" })
    | (CreateStaffParams & { smb_tool_type: "create_staff" })
    | (UpdateStaffParams & { smb_tool_type: "update_staff" })
    | (DeleteStaffParams & { smb_tool_type: "delete_staff" })
    | (ListAssetsParams & { smb_tool_type: "list_assets" })
    | (CreateAssetParams & { smb_tool_type: "create_asset" })
    | (UpdateAssetParams & { smb_tool_type: "update_asset" })
    | (DeleteAssetParams & { smb_tool_type: "delete_asset" })
    | (ListServicesParams & { smb_tool_type: "list_services" })
    | (CreateServiceParams & { smb_tool_type: "create_service" })
    | (UpdateServiceParams & { smb_tool_type: "update_service" })
    | (DeleteServiceParams & { smb_tool_type: "delete_service" })
    | (ListProductsParams & { smb_tool_type: "list_products" })
    | (CreateProductParams & { smb_tool_type: "create_product" })
    | (UpdateProductParams & { smb_tool_type: "update_product" })
    | (DeleteProductParams & { smb_tool_type: "delete_product" })
    | (CheckServiceAvailabilityParams & {
        smb_tool_type: "check_service_availability";
      })
    | (CreateClientAppointmentParams & {
        smb_tool_type: "create_client_appointment";
      })
    | (GetClientAppointmentsParams & {
        smb_tool_type: "get_client_appointments";
      })
    | (GetAppointmentByConfirmationNumberParams & {
        smb_tool_type: "get_appointment_by_confirmation_number";
      })
    | (CreateOrderParams & { smb_tool_type: "create_order" })
    | (GetOrderByConfirmationNumberParams & {
        smb_tool_type: "get_order_by_confirmation_number";
      })
    | (GetClientOrdersParams & { smb_tool_type: "get_client_orders" })
    | (UpdateOrderParams & { smb_tool_type: "update_order" })
    | (CancelOrderParams & { smb_tool_type: "cancel_order" })
    | (ListGroupSessionsParams & { smb_tool_type: "list_group_sessions" })
    | (ScheduleGroupSessionParams & { smb_tool_type: "schedule_group_session" })
    | (RegisterForGroupSessionParams & {
        smb_tool_type: "register_for_group_session";
      })
    | (CancelGroupSessionRegistrationParams & {
        smb_tool_type: "cancel_group_session_registration";
      })
    | (UpdateGroupSessionSeatsParams & {
        smb_tool_type: "update_group_session_seats";
      })
    | (CancelGroupSessionForAllParams & {
        smb_tool_type: "cancel_group_session_for_all";
      })
    | (DeleteGroupSessionParams & { smb_tool_type: "delete_group_session" })
    | (ListCalendarEventsParams & { smb_tool_type: "list_calendar_events" })
    | (UpdateCalendarEventParams & { smb_tool_type: "update_calendar_event" })
    | (CancelCalendarEventParams & { smb_tool_type: "cancel_calendar_event" })
    | (RestoreCalendarEventParams & { smb_tool_type: "restore_calendar_event" })
    | (DeleteCalendarEventParams & { smb_tool_type: "delete_calendar_event" })
    | (ListCustomerFacingAgentsParams & {
        smb_tool_type: "list_customer_facing_agents";
      })
    | (GetAgentConfigParams & { smb_tool_type: "get_agent_config" })
    | (ListAgentRulesParams & { smb_tool_type: "list_agent_rules" })
    | (CreateAgentRuleParams & { smb_tool_type: "create_agent_rule" })
    | (UpdateAgentRuleParams & { smb_tool_type: "update_agent_rule" })
    | (DeleteAgentRuleParams & { smb_tool_type: "delete_agent_rule" })
    | (ListTransferRulesParams & { smb_tool_type: "list_transfer_rules" })
    | (CreateTransferRuleParams & { smb_tool_type: "create_transfer_rule" })
    | (UpdateTransferRuleParams & { smb_tool_type: "update_transfer_rule" })
    | (DeleteTransferRuleParams & { smb_tool_type: "delete_transfer_rule" })
    | (ListAgentProceduresParams & { smb_tool_type: "list_agent_procedures" })
    | (ListAgentReferencesParams & { smb_tool_type: "list_agent_references" })
    | (CreateAgentProcedureParams & { smb_tool_type: "create_agent_procedure" })
    | (UpdateAgentProcedureParams & { smb_tool_type: "update_agent_procedure" })
    | (DeleteAgentProcedureParams & { smb_tool_type: "delete_agent_procedure" })
    | (ListHolidaysParams & { smb_tool_type: "list_holidays" })
    | (CreateHolidayParams & { smb_tool_type: "create_holiday" })
    | (UpdateHolidayParams & { smb_tool_type: "update_holiday" })
    | (DeleteHolidayParams & { smb_tool_type: "delete_holiday" })
    | (GetScheduleParams & { smb_tool_type: "get_schedule" })
    | (SubmitBusinessInfoParams & { smb_tool_type: "submit_business_info" })
    | (UpdateBusinessInfoParams & { smb_tool_type: "update_business_info" })
    | (UpdateAgentConfigParams & { smb_tool_type: "update_agent_config" })
    | (GetAnalyticsSummaryParams & { smb_tool_type: "get_analytics_summary" })
    | (GetWorkspacePlanParams & { smb_tool_type: "get_workspace_plan" })
    | (GetBookingPageSettingsParams & {
        smb_tool_type: "get_booking_page_settings";
      })
    | (UpdateBookingPageSettingsParams & {
        smb_tool_type: "update_booking_page_settings";
      })
    | (UpdateBookingPageAppearanceParams & {
        smb_tool_type: "update_booking_page_appearance";
      })
    | (GetBookingSlugStatusParams & {
        smb_tool_type: "get_booking_slug_status";
      })
    | (SetBookingSlugParams & { smb_tool_type: "set_booking_slug" })
    | (ListClientInteractionsParams & {
        smb_tool_type: "list_client_interactions";
      })
    | (CreateClientInteractionParams & {
        smb_tool_type: "create_client_interaction";
      })
    | (DeleteClientInteractionParams & {
        smb_tool_type: "delete_client_interaction";
      })
    | (ListLocationsParams & { smb_tool_type: "list_locations" })
    | (CreateLocationParams & { smb_tool_type: "create_location" })
    | (UpdateLocationParams & { smb_tool_type: "update_location" })
    | (DeleteLocationParams & { smb_tool_type: "delete_location" })
    | (LeaveMessageParams & { smb_tool_type: "leave_message" })
    | (CreateServiceQuoteRequestParams & {
        smb_tool_type: "create_service_quote_request";
      })
    | (CreateProductQuoteRequestParams & {
        smb_tool_type: "create_product_quote_request";
      })
    | (ReportKnowledgeGapParams & { smb_tool_type: "report_knowledge_gap" })
    | (OptInSmsReminderParams & { smb_tool_type: "opt_in_sms_reminder" })
    | (OptOutSmsReminderParams & { smb_tool_type: "opt_out_sms_reminder" })
    | (TriggerUserVerificationParams & {
        smb_tool_type: "trigger_user_verification";
      })
    | (ValidateUserVerificationCodeParams & {
        smb_tool_type: "validate_user_verification_code";
      })
    | (OwnerListStaffParams & { smb_tool_type: "owner_list_staff" })
    | (OwnerListAssetsParams & { smb_tool_type: "owner_list_assets" })
    | (OwnerListLocationsParams & { smb_tool_type: "owner_list_locations" })
    | (OwnerListServicesParams & { smb_tool_type: "owner_list_services" })
    | (OwnerListProductsParams & { smb_tool_type: "owner_list_products" })
    | (OwnerGetClientAppointmentsParams & {
        smb_tool_type: "owner_get_client_appointments";
      });
};
