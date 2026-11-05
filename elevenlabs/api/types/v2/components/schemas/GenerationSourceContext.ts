import type { ReferenceVideo } from "./ReferenceVideo.js";
export type GenerationSourceContext = {
  /**
   * @default "generation"
   */
  source_type?: "generation";
  generation_id: string;
  prompt?: string | null;
  model_id: string;
  model_provider?: string | null;
  generation_session_id?: string | null;
  session_iteration_id?: string | null;
  model_parameters?: { [key: string]: unknown } | null;
  extend_video?: ReferenceVideo | null;
};
