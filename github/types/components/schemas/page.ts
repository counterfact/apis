import type { pages_source_hash } from "./pages-source-hash.js";
import type { pages_https_certificate } from "./pages-https-certificate.js";

/**
 * The configuration for GitHub Pages for a repository.
 */
export type page = {
  /**
   * The API address for accessing this Page resource.
   * @format uri
   * @example "https://api.github.com/repos/github/hello-world/pages"
   */
  url: string;
  /**
   * The status of the most recent build of the Page.
   * @example "built"
   */
  status: "built" | "building" | "errored";
  /**
   * The Pages site's custom domain
   * @example "example.com"
   */
  cname: string;
  /**
   * The state if the domain is verified
   * @example "pending"
   */
  protected_domain_state?: "pending" | "verified" | "unverified";
  /**
   * The timestamp when a pending domain becomes unverified.
   * @format date-time
   */
  pending_domain_unverified_at?: string;
  /**
   * Whether the Page has a custom 404 page.
   * @default false
   * @example false
   */
  custom_404: boolean;
  /**
   * The web address the Page can be accessed from.
   * @format uri
   * @example "https://example.com"
   */
  html_url?: string;
  /**
   * The process in which the Page will be built.
   * @example "legacy"
   */
  build_type?: "legacy" | "workflow";
  source?: pages_source_hash;
  /**
   * Whether the GitHub Pages site is publicly visible. If set to `true`, the site is accessible to anyone on the internet. If set to `false`, the site will only be accessible to users who have at least `read` access to the repository that published the site.
   * @example true
   */
  public: boolean;
  https_certificate?: pages_https_certificate;
  /**
   * Whether https is enabled on the domain
   * @example true
   */
  https_enforced?: boolean;
};
