/**
 * Private registry configuration for an organization
 */
export type org_private_registry_configuration = {
  /**
   * The name of the private registry configuration.
   * @example "MAVEN_REPOSITORY_SECRET"
   */
  name: string;
  /**
   * The registry type.
   */
  registry_type:
    | "maven_repository"
    | "nuget_feed"
    | "goproxy_server"
    | "npm_registry"
    | "rubygems_server"
    | "cargo_registry"
    | "composer_repository"
    | "docker_registry"
    | "git_source"
    | "helm_registry"
    | "hex_organization"
    | "hex_repository"
    | "pub_repository"
    | "python_index"
    | "terraform_registry";
  /**
   * The authentication type for the private registry.
   */
  auth_type?:
    | "token"
    | "username_password"
    | "oidc_azure"
    | "oidc_aws"
    | "oidc_jfrog"
    | "oidc_cloudsmith"
    | "oidc_gcp";
  /**
   * The URL of the private registry.
   * @format uri
   */
  url?: string;
  /**
   * The username to use when authenticating with the private registry.
   * @example "monalisa"
   */
  username?: string;
  /**
   * Whether this private registry replaces the base registry (e.g., npmjs.org for npm, rubygems.org for rubygems). When `true`, Dependabot will only use this registry and will not fall back to the public registry. When `false` (default), Dependabot will use this registry for scoped packages but may fall back to the public registry for other packages.
   * @default false
   */
  replaces_base?: boolean;
  /**
   * Which type of organization repositories have access to the private registry.
   */
  visibility: "all" | "private" | "selected";
  /**
   * The tenant ID of the Azure AD application.
   */
  tenant_id?: string;
  /**
   * The client ID of the Azure AD application.
   */
  client_id?: string;
  /**
   * The AWS region.
   */
  aws_region?: string;
  /**
   * The AWS account ID.
   */
  account_id?: string;
  /**
   * The AWS IAM role name.
   */
  role_name?: string;
  /**
   * The CodeArtifact domain.
   */
  domain?: string;
  /**
   * The CodeArtifact domain owner.
   */
  domain_owner?: string;
  /**
   * The JFrog OIDC provider name.
   */
  jfrog_oidc_provider_name?: string;
  /**
   * The OIDC audience.
   */
  audience?: string;
  /**
   * The JFrog identity mapping name.
   */
  identity_mapping_name?: string;
  /**
   * The Cloudsmith organization namespace.
   */
  namespace?: string;
  /**
   * The Cloudsmith service account slug.
   */
  service_slug?: string;
  /**
   * The Cloudsmith API host.
   */
  api_host?: string;
  /**
   * The full resource name of the GCP Workload Identity Provider (e.g. `projects/<NUM>/locations/global/workloadIdentityPools/<POOL>/providers/<PROVIDER>`).
   */
  workload_identity_provider?: string;
  /**
   * The GCP service account email to impersonate. If omitted, the federated token is used directly (direct WIF).
   */
  service_account?: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
};
