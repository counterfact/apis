/**
 * Pages Health Check Status
 */
export type pages_health_check = {
  domain?: {
    host?: string;
    uri?: string;
    nameservers?: string;
    dns_resolves?: boolean;
    is_proxied?: boolean;
    is_cloudflare_ip?: boolean;
    is_fastly_ip?: boolean;
    is_old_ip_address?: boolean;
    is_a_record?: boolean;
    has_cname_record?: boolean;
    has_mx_records_present?: boolean;
    is_valid_domain?: boolean;
    is_apex_domain?: boolean;
    should_be_a_record?: boolean;
    is_cname_to_github_user_domain?: boolean;
    is_cname_to_pages_dot_github_dot_com?: boolean;
    is_cname_to_fastly?: boolean;
    is_pointed_to_github_pages_ip?: boolean;
    is_non_github_pages_ip_present?: boolean;
    is_pages_domain?: boolean;
    is_served_by_pages?: boolean;
    is_valid?: boolean;
    reason?: string;
    responds_to_https?: boolean;
    enforces_https?: boolean;
    https_error?: string;
    is_https_eligible?: boolean;
    caa_error?: string;
  };
  alt_domain?: {
    host?: string;
    uri?: string;
    nameservers?: string;
    dns_resolves?: boolean;
    is_proxied?: boolean;
    is_cloudflare_ip?: boolean;
    is_fastly_ip?: boolean;
    is_old_ip_address?: boolean;
    is_a_record?: boolean;
    has_cname_record?: boolean;
    has_mx_records_present?: boolean;
    is_valid_domain?: boolean;
    is_apex_domain?: boolean;
    should_be_a_record?: boolean;
    is_cname_to_github_user_domain?: boolean;
    is_cname_to_pages_dot_github_dot_com?: boolean;
    is_cname_to_fastly?: boolean;
    is_pointed_to_github_pages_ip?: boolean;
    is_non_github_pages_ip_present?: boolean;
    is_pages_domain?: boolean;
    is_served_by_pages?: boolean;
    is_valid?: boolean;
    reason?: string;
    responds_to_https?: boolean;
    enforces_https?: boolean;
    https_error?: string;
    is_https_eligible?: boolean;
    caa_error?: string;
  };
};
