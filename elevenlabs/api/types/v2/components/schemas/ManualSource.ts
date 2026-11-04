export type ManualSource = {
  /**
   * @default "manual"
   */
  type?: "manual";
  created_by_user_id: string;
  notes?: string | null;
};
