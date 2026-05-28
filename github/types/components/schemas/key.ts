/**
 * Key
 */
export type key = {
  key: string;
  /**
   * @format int64
   */
  id: number;
  url: string;
  title: string;
  /**
   * @format date-time
   */
  created_at: string;
  verified: boolean;
  read_only: boolean;
  /**
   * @format date-time
   */
  last_used?: string;
};
