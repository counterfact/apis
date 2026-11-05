import type { ConversationSimulationSpecification } from "./ConversationSimulationSpecification.js";
import type { PromptEvaluationCriteria } from "./PromptEvaluationCriteria.js";
export type Body_Simulates_a_conversation__Stream__v1_convai_agents__agent_id__simulate_conversation_stream_post =
  {
    /**
     * A specification detailing how the conversation should be simulated
     */
    simulation_specification: ConversationSimulationSpecification;
    /**
     * A list of evaluation criteria to test
     */
    extra_evaluation_criteria?: Array<PromptEvaluationCriteria> | null;
    /**
     * Maximum number of new turns to generate in the conversation simulation
     * @default 100
     */
    new_turns_limit?: number;
  };
