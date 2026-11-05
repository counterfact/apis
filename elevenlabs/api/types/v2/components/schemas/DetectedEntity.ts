export type DetectedEntity = {
  /**
   * The text that was identified as an entity.
   */
  text: string;
  /**
   * The type of entity detected (e.g., 'credit_card', 'email_address', 'person_name').
   */
  entity_type: string;
  /**
   * Start character position in the transcript text.
   */
  start_char: number;
  /**
   * End character position in the transcript text.
   */
  end_char: number;
};
