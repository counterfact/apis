/**
 * An SSH key granting access to a single repository.
 */
export type deploy_key = {
  id: number;
  key: string;
  url: string;
  title: string;
  verified: boolean;
  created_at: string;
  read_only: boolean;
  added_by?: string;
  /**
   * @format date-time
   */
  last_used?: string;
  enabled?: boolean;
};
