import type { EvaluationSettings_Input } from "./EvaluationSettings-Input.js";
import type { WidgetConfig_Input } from "./WidgetConfig-Input.js";
import type { AnalysisProperty } from "./AnalysisProperty.js";
import type { AnalysisScope } from "./AnalysisScope.js";
import type { AgentAnalysisItems_Input } from "./AgentAnalysisItems-Input.js";
import type { ConversationInitiationClientDataConfig_Input } from "./ConversationInitiationClientDataConfig-Input.js";
import type { AgentWorkspaceOverrides_Input } from "./AgentWorkspaceOverrides-Input.js";
import type { AgentTestingSettings } from "./AgentTestingSettings.js";
import type { GuardrailsV1_Input } from "./GuardrailsV1-Input.js";
import type { AuthSettings } from "./AuthSettings.js";
import type { AgentCallLimits } from "./AgentCallLimits.js";
import type { AgentQueueingConfig } from "./AgentQueueingConfig.js";
import type { PrivacyConfig_Input } from "./PrivacyConfig-Input.js";
import type { AgentTrustContext } from "./AgentTrustContext.js";
import type { LLM } from "./LLM.js";
import type { TopicDiscoverySettings } from "./TopicDiscoverySettings.js";
import type { SentimentAnalysisSettings } from "./SentimentAnalysisSettings.js";
import type { AlertingSettings } from "./AlertingSettings.js";
export type AgentPlatformSettingsRequestModel = {
  /**
   * Settings for evaluation
   */
  evaluation?: EvaluationSettings_Input;
  /**
   * Configuration for the widget
   */
  widget?: WidgetConfig_Input;
  /**
   * Data collection fields, keyed by ID. Each field is stored as an analysis item attached to the agent (see analysis_items).
   */
  data_collection?: { [key: string]: AnalysisProperty };
  /**
   * Scope per data collection item ID. Missing keys default to conversation scope.
   */
  data_collection_scopes?: { [key: string]: AnalysisScope };
  /**
   * Analysis items (evaluation criteria and data collection fields) attached to the agent by reference. They are the source of truth for the agent's analysis. Writing evaluation.criteria or data_collection inline is still supported: a new entry creates an item, and changing an entry publishes a new version of its attached item, which every agent using that item picks up. To attach or detach an existing item, use the analysis item attachments endpoint. None means the agent has no attached items yet, and its inline fields are used as they are.
   */
  analysis_items?: AgentAnalysisItems_Input | null;
  /**
   * Additional overrides for the agent during conversation initiation
   */
  overrides?: ConversationInitiationClientDataConfig_Input;
  /**
   * Workspace overrides for the agent
   */
  workspace_overrides?: AgentWorkspaceOverrides_Input;
  /**
   * Testing configuration for the agent
   */
  testing?: AgentTestingSettings;
  /**
   * Whether the agent is archived
   * @default false
   */
  archived?: boolean;
  /**
   * Guardrails configuration for the agent
   */
  guardrails?: GuardrailsV1_Input;
  /**
   * Language for all conversation analysis outputs (summaries, titles, evaluation rationales, data collection rationales). If not set, the language will be inferred from the conversation. Must be one of the supported conversation languages.
   */
  summary_language?: string | null;
  /**
   * When enabled, a conversation transcript is automatically translated to the viewer's application language when they open the transcript page. If not set or false, transcripts are shown in their original language unless the viewer manually selects a translation.
   */
  auto_translate_transcript_to_app_language?: boolean | null;
  /**
   * Settings for authentication
   */
  auth?: AuthSettings;
  /**
   * Call limits for the agent
   */
  call_limits?: AgentCallLimits;
  /**
   * Concurrency wait-queue config for the agent
   */
  queueing_config?: AgentQueueingConfig;
  /**
   * Privacy settings for the agent
   */
  privacy?: PrivacyConfig_Input;
  /**
   * The trust context in which the agent operates.
   * @default "unknown"
   */
  trust_context?: AgentTrustContext;
  /**
   * Default LLM model for post-call analysis (evaluation and data collection)
   * @default "gemini-2.5-flash"
   */
  analysis_llm?: LLM;
  /**
   * Per-agent topic discovery configuration
   */
  topic_discovery?: TopicDiscoverySettings;
  /**
   * Per-agent post-call sentiment analysis configuration
   */
  sentiment_analysis?: SentimentAnalysisSettings;
  /**
   * Agent-level alerting configuration overriding workspace settings.
   */
  alerting?: AlertingSettings | null;
};
