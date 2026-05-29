/**
 * A public SSH key used to sign Git commits
 */
export type ssh_signing_key = {
  key: string;
  id: number;
  title: string;
  /**
   * @format date-time
   */
  created_at: string;
};
