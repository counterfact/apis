export type MergedOutcome = {
  /**
   * @default "merged"
   */
  status?: "merged";
  version_id: string;
  at: number;
  by_user_id: string | null;
};
