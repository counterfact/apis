export type Body_Create_agent_test_folder_v1_convai_agent_testing_folders_post =
  {
    /**
     * The name of the folder to create
     */
    name: string;
    /**
     * The ID of the parent folder. If not provided, the folder will be created at the root level.
     */
    parent_folder_id?: string | null;
  };
