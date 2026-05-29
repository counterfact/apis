/**
 * Secrets for a GitHub Codespace.
 */
export type codespaces_org_secret = {
  /**
   * The name of the secret
   * @example "SECRET_NAME"
   */
  name: string;
  /**
   * The date and time at which the secret was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  created_at: string;
  /**
   * The date and time at which the secret was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  updated_at: string;
  /**
   * The type of repositories in the organization that the secret is visible to
   */
  visibility: "all" | "private" | "selected";
  /**
   * The API URL at which the list of repositories this secret is visible to can be retrieved
   * @format uri
   * @example "https://api.github.com/orgs/ORGANIZATION/codespaces/secrets/SECRET_NAME/repositories"
   */
  selected_repositories_url?: string;
};
