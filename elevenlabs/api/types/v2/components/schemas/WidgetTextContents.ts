export type WidgetTextContents = {
  /**
   * Call to action displayed inside the compact and full variants.
   */
  main_label?: string | null;
  /**
   * Text and ARIA label for the start call button.
   */
  start_call?: string | null;
  /**
   * Text and ARIA label for the start chat button (text only)
   */
  start_chat?: string | null;
  /**
   * Text and ARIA label for the new call button. Displayed when the caller already finished at least one call in order ot start the next one.
   */
  new_call?: string | null;
  /**
   * Text and ARIA label for the end call button.
   */
  end_call?: string | null;
  /**
   * ARIA label for the mute microphone button.
   */
  mute_microphone?: string | null;
  /**
   * ARIA label for the change language dropdown.
   */
  change_language?: string | null;
  /**
   * ARIA label for the collapse button.
   */
  collapse?: string | null;
  /**
   * ARIA label for the expand button.
   */
  expand?: string | null;
  /**
   * Text displayed when the user copies a value using the copy button.
   */
  copied?: string | null;
  /**
   * Text and ARIA label for the accept terms button.
   */
  accept_terms?: string | null;
  /**
   * Text and ARIA label for the cancel terms button.
   */
  dismiss_terms?: string | null;
  /**
   * Status displayed when the agent is listening.
   */
  listening_status?: string | null;
  /**
   * Status displayed when the agent is speaking.
   */
  speaking_status?: string | null;
  /**
   * Status displayed when the agent is connecting.
   */
  connecting_status?: string | null;
  /**
   * Status displayed when the agent is chatting (text only)
   */
  chatting_status?: string | null;
  /**
   * Status displayed while waiting in the queue for an available agent.
   */
  queue_waiting_status?: string | null;
  /**
   * Short status displayed while waiting for an available agent.
   */
  queue_waiting_status_short?: string | null;
  /**
   * ARIA label for the text message input.
   */
  input_label?: string | null;
  /**
   * Placeholder text for the text message input.
   */
  input_placeholder?: string | null;
  /**
   * Placeholder text for the text message input (text only)
   */
  input_placeholder_text_only?: string | null;
  /**
   * Placeholder text for the text message input when starting a new conversation (text only)
   */
  input_placeholder_new_conversation?: string | null;
  /**
   * Information message displayed when the user ends the conversation.
   */
  user_ended_conversation?: string | null;
  /**
   * Information message displayed when the agent ends the conversation.
   */
  agent_ended_conversation?: string | null;
  /**
   * Text label used next to the conversation ID.
   */
  conversation_id?: string | null;
  /**
   * Text label used when an error occurs.
   */
  error_occurred?: string | null;
  /**
   * Error message displayed when the queue wait times out.
   */
  queue_timed_out?: string | null;
  /**
   * Text and ARIA label used for the copy ID button.
   */
  copy_id?: string | null;
  /**
   * Text displayed to prompt the user for feedback.
   */
  initiate_feedback?: string | null;
  /**
   * Text displayed to request additional feedback details.
   */
  request_follow_up_feedback?: string | null;
  /**
   * Text displayed to thank the user for providing feedback.
   */
  thanks_for_feedback?: string | null;
  /**
   * Additional text displayed explaining the value of user feedback.
   */
  thanks_for_feedback_details?: string | null;
  /**
   * Placeholder text for the follow-up feedback input field.
   */
  follow_up_feedback_placeholder?: string | null;
  /**
   * Text and ARIA label for the submit button.
   */
  submit?: string | null;
  /**
   * Text and ARIA label for the go back button.
   */
  go_back?: string | null;
  /**
   * Text and ARIA label for the send message button.
   */
  send_message?: string | null;
  /**
   * Text and ARIA label for the switch to text mode button.
   */
  text_mode?: string | null;
  /**
   * Text and ARIA label for the switch to voice mode button.
   */
  voice_mode?: string | null;
  /**
   * Toast notification displayed when switching to text mode.
   */
  switched_to_text_mode?: string | null;
  /**
   * Toast notification displayed when switching to voice mode.
   */
  switched_to_voice_mode?: string | null;
  /**
   * Text and ARIA label for the copy button.
   */
  copy?: string | null;
  /**
   * Text and ARIA label for the download button.
   */
  download?: string | null;
  /**
   * Text and ARIA label for the wrap toggle button.
   */
  wrap?: string | null;
  /**
   * Status text displayed when the agent is processing a tool call.
   */
  agent_working?: string | null;
  /**
   * Status text displayed when the agent finishes processing a tool call.
   */
  agent_done?: string | null;
  /**
   * Status text displayed when the agent encounters an error during a tool call.
   */
  agent_error?: string | null;
  /**
   * Text and ARIA label for the attach file button.
   */
  attach_file?: string | null;
  /**
   * ARIA label for the remove file button.
   */
  remove_file?: string | null;
  /**
   * Error message displayed when a file fails to upload.
   */
  file_upload_error?: string | null;
  /**
   * Error message displayed when an unsupported file type is selected. Followed by the list of accepted types.
   */
  file_type_unsupported?: string | null;
  /**
   * Error message displayed when a file exceeds the maximum size limit.
   */
  file_too_large?: string | null;
  /**
   * Error message displayed when the maximum number of files for a conversation is reached.
   */
  file_limit_reached?: string | null;
  /**
   * Status text displayed while the agent is typing.
   */
  typing_indicator?: string | null;
  /**
   * Fallback message displayed when rich content cannot be rendered.
   */
  rich_content_unavailable?: string | null;
};
