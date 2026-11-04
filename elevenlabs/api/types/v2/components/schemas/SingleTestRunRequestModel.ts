export type SingleTestRunRequestModel = {
  /**
   * ID of the test to run
   */
  test_id: string;
  /**
   * ID of the workflow node to run the test on. If not provided, the test will be run on the agent's default workflow node.
   */
  workflow_node_id?: string | null;
  /**
   * ID of the root folder to run the test on. If not provided, the test will be run on the agent's default folder.
   */
  root_folder_id?: string | null;
  /**
   * Name of the root folder to run the test on. If not provided, the test will be run on the agent's default folder.
   */
  root_folder_name?: string | null;
};
