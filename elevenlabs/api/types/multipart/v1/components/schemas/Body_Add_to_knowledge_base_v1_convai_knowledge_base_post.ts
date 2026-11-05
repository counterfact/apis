import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Add_to_knowledge_base_v1_convai_knowledge_base_post = {
  /**
   * A custom, human-readable name for the document.
   */
  name?: string | null;
  /**
   * URL to a page of documentation that the agent will have access to in order to interact with users.
   */
  url?: string;
  /**
   * Documentation that the agent will have access to in order to interact with users.
   * @format binary
   */
  file?: MultipartFile;
};
