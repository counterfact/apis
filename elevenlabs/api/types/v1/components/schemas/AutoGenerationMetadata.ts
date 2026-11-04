/**
 * Metadata for an automatically generated simulation test.
 *
 * Tracks the origin and context of tests that were auto-generated from
 * conversations, including the source conversation, topic, and evaluation
 * criteria the test covers.
 */
export type AutoGenerationMetadata = {
  /**
   * Agent whose simulation library this test belongs to.
   */
  agent_id: string;
  /**
   * Stable topic id (from topic discovery) this test covers.
   */
  stable_topic_id: string;
  /**
   * Evaluation criterion id this test targets.
   */
  criteria_id: string;
  /**
   * Human-readable topic label at generation time.
   */
  topic_label: string;
  /**
   * Conversation the test was generated from.
   */
  source_conversation_id: string;
  /**
   * Unix timestamp (seconds) when the test was generated.
   */
  generated_at_unix: number;
};
