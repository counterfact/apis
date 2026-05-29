/**
 * Actor
 */
export type actor = {
  id: number;
  login: string;
  display_login?: string;
  gravatar_id: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  avatar_url: string;
};
