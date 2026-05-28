/**
 * Issue Event Project Card
 */
export type issue_event_project_card = {
  /**
   * @format uri
   */
  url: string;
  id: number;
  /**
   * @format uri
   */
  project_url: string;
  project_id: number;
  column_name: string;
  previous_column_name?: string;
};
