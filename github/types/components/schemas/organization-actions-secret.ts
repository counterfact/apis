/**
 * Secrets for GitHub Actions for an organization.
 */
export type organization_actions_secret = {
  /**
   * The name of the secret.
   * @example "SECRET_TOKEN"
   */
  name: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * Visibility of a secret
   */
  visibility: "all" | "private" | "selected";
  /**
   * @format uri
   * @example "https://api.github.com/organizations/org/secrets/my_secret/repositories"
   */
  selected_repositories_url?: string;
};
