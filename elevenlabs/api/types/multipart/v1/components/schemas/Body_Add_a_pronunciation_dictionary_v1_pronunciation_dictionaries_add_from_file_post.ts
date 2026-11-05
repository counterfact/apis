import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_file_post =
  {
    /**
     * The name of the pronunciation dictionary, used for identification only.
     */
    name: string;
    /**
     * A lexicon .pls file which we will use to initialize the project with.
     */
    file?: MultipartFile | null;
    /**
     * A description of the pronunciation dictionary, used for identification only.
     */
    description?: string | null;
    /**
     * Should be one of 'admin', 'editor' or 'viewer'. If not provided, defaults to no access.
     */
    workspace_access?: ("admin" | "editor" | "commenter" | "viewer") | null;
  };
