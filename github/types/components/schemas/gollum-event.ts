export type gollum_event = {
  pages: Array<{
    page_name?: string;
    title?: string;
    summary?: string;
    action?: string;
    sha?: string;
    html_url?: string;
  }>;
};
