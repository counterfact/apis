import {resetFlowGenerations} from "./flows.js";
export {emptyFlowGenerations,startFlowGenerations,completeFlowGenerations,failFlowGenerations} from "./flows.js";
import {resetProductionOrders} from "./productions.js";
export {emptyProductionOrders,completeProductionOrders} from "./productions.js";
import { resetStudioProjects } from "./studio-projects.js";
export { emptyStudioProjects } from "./studio-projects.js";
import { resetAgentTests } from "./agent-tests.js";
export { emptyAgentTests } from "./agent-tests.js";
import { resetSpeechEngines } from "./speech-engines.js";
export { emptySpeechEngines } from "./speech-engines.js";
import { resetMcpServers } from "./mcp-servers.js";
export { emptyMcpServers, mcpDefinitionChanged, mcpAgentReference } from "./mcp-servers.js";
import {resetTriageTickets} from './triage-tickets.js';
export {emptyTriageTickets} from './triage-tickets.js';
import { resetBatchCalls } from "./batch-calling.js";
import { resetLlmCatalog } from "./llm-catalog.js";
export { emptyLlmCatalog } from "./llm-catalog.js";
import { resetWorkspaceKeyPolicy } from "./workspace-key-policy.js";
export { emptyWorkspaceKeyPolicy } from "./workspace-key-policy.js";
export { emptyBatchCalls, completeBatchCalls } from "./batch-calling.js";
import { resetKnowledgeBase } from "./knowledge-base.js";
export { emptyKnowledgeBase, knowledgeBaseReferences } from "./knowledge-base.js";
import { resetAnalysisItems } from "./analysis-items.js";
export { emptyAnalysisItems } from "./analysis-items.js";
import { resetWorkspaceMembers } from "./workspace-members.js";
export { emptyWorkspaceMembers } from "./workspace-members.js";
import { resetRealtimeGroups } from "./realtime-groups.js";
export { emptyRealtimeGroups } from "./realtime-groups.js";
import { resetConversations } from "./conversations.js";
export { emptyConversations } from "./conversations.js";
import { resetPhoneNumbers } from "./phone-numbers.js";
export { emptyPhoneNumbers } from "./phone-numbers.js";
import { resetServiceAccounts } from "./service-accounts.js";
export { emptyServiceAccounts } from "./service-accounts.js";
import { resetGroups } from "./groups.js";
export { emptyGroups } from "./groups.js";
import type { Scenario } from "../types/index.js";
import { defaultSettings } from "../routes/_.context.js";
import { resetCollections } from "./collections.js";
export { emptyCollections } from "./collections.js";
import { resetDictionaries } from "./dictionaries.js";
export { emptyDictionaries } from "./dictionaries.js";
import { resetHistory } from "./history.js";
export { emptyHistory } from "./history.js";
import { resetModels } from "./models.js";
import { resetAccount } from "./account.js";
import { resetAuthConnections } from "./auth-connections.js";
export { emptyAuthConnections } from "./auth-connections.js";
import { resetWebhooks } from "./webhooks.js";
export { emptyWebhooks } from "./webhooks.js";
import { resetTools } from "./tools.js";
export { emptyTools, toolDiscovery } from "./tools.js";
import { resetAgents } from "./agents.js";
export { emptyAgents, agentAnalysisReferences } from "./agents.js";
import { resetSecrets } from "./secrets.js";
export { emptySecrets } from "./secrets.js";
import { resetEnvironments } from "./environments.js";
export { productionEnvironmentOnly } from "./environments.js";
import { resetEnvironmentVariables } from "./environment-variables.js";
export { emptyEnvironmentVariables } from "./environment-variables.js";
import { resetSettings } from "./settings.js";
export { alternateSettings } from "./settings.js";
import { resetTags } from "./tags.js";
export { emptyTags } from "./tags.js";
import { resetUsage } from "./usage.js";
export { emptyUsage } from "./usage.js";
export { emptyModels } from "./models.js";
export { quotaExhausted } from "./account.js";

export const reset: Scenario = ($) => {
  resetFlowGenerations($);
  resetProductionOrders($);
  resetStudioProjects($);
  resetAgentTests($);
  resetSpeechEngines($);
  resetMcpServers($);
  resetTriageTickets($);
  resetLlmCatalog($);
  resetRealtimeGroups($);
  resetGroups($);
  resetWorkspaceMembers($);
  resetServiceAccounts($);
  resetWorkspaceKeyPolicy($);
  resetAgents($);
  resetAnalysisItems($);
  resetKnowledgeBase($);
  resetPhoneNumbers($);
  resetBatchCalls($);
  resetTools($);
  resetSecrets($);
  resetEnvironments($);
  resetEnvironmentVariables($);
  resetTags($);
  resetConversations($);
  resetSettings($);
  resetAuthConnections($);
  resetWebhooks($);
  resetUsage($);
  resetDictionaries($);
  resetModels($);
  resetHistory($);
  resetAccount($);
  $.context.voices = new Map(
    ["sim-narrator", "sim-assistant"].map((voice_id, index) => [
      voice_id,
      {
        voice_id,
        name: index === 0 ? "Simulator Narrator" : "Simulator Assistant",
        category: "generated",
        labels: {
          language: "en",
          use_case: index === 0 ? "narration" : "conversational",
          gender: index === 0 ? "female" : "male",
          age: index === 0 ? "middle_aged" : "young",
          accent: index === 0 ? "american" : "british",
        },
        description: "Local simulator fixture; no audio is synthesized.",
        available_for_tiers: [],
        high_quality_base_model_ids: ["eleven_multilingual_v2"],
        settings: defaultSettings(),
        is_owner: true,
        is_legacy: false,
        created_at_unix: 1_735_689_600 + index,
      },
    ]),
  );
  resetCollections($);
};
export const startup: Scenario = reset;

/** Add discovery examples to the current state; reset removes them. */
export const voiceDiscovery: Scenario = ($) => {
  $.context.voices.set("sim-spanish-narrator", {
    voice_id: "sim-spanish-narrator",
    name: "Simulator Spanish Narrator",
    category: "generated",
    labels: {
      language: "es",
      use_case: "narration",
      gender: "female",
      age: "middle_aged",
      accent: "spanish",
    },
    description:
      "Local Spanish-language discovery fixture; no audio is synthesized.",
    available_for_tiers: [],
    high_quality_base_model_ids: ["eleven_multilingual_v2"],
    settings: defaultSettings(),
    is_owner: true,
    is_legacy: false,
    created_at_unix: 1_735_689_602,
  });
  $.context.voices.set("sim-unlabeled", {
    voice_id: "sim-unlabeled",
    name: "Simulator Unlabeled Voice",
    category: "generated",
    labels: {},
    verified_languages: [
      { language: "en", model_id: "eleven_multilingual_v2" },
    ],
    description:
      "Local fixture without discovery labels; no audio is synthesized.",
    available_for_tiers: [],
    high_quality_base_model_ids: ["eleven_multilingual_v2"],
    settings: defaultSettings(),
    is_owner: true,
    is_legacy: false,
    created_at_unix: 1_735_689_603,
  });
};

export {completeKnowledgeIndexes} from "./knowledge-base.js";
