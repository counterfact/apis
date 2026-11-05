export type Body_Bulk_move_tests_to_folder_v1_convai_agent_testing_bulk_move_post =
  {
    /**
     * The IDs of tests or folders to move.
     */
    entity_ids: Array<string>;
    /**
     * The folder to move the entities to. If not set, the entities will be moved to the root folder.
     */
    move_to?: string | null;
  };
