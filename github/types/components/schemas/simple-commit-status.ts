export type simple_commit_status = {
  description: string;
  id: number;
  node_id: string;
  state: string;
  context: string;
  /**
   * @format uri
   */
  target_url: string;
  required?: boolean;
  /**
   * @format uri
   */
  avatar_url: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
};
