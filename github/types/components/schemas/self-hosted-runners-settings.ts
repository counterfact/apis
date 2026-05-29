export type self_hosted_runners_settings = {
  /**
   * The policy that controls whether self-hosted runners can be used by repositories in the organization
   */
  enabled_repositories: "all" | "selected" | "none";
  /**
   * The URL to the endpoint for managing selected repositories for self-hosted runners in the organization
   */
  selected_repositories_url?: string;
};
