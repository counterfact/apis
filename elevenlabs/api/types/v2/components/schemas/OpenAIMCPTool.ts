export type OpenAIMCPTool = {
  /**
   * @default "mcp"
   */
  type?: "mcp";
  server_label: string;
  server_url: string;
  authorization?: string | null;
  allowed_tools?: Array<string> | null;
  /**
   * @default "never"
   */
  require_approval?: "never" | "always";
};
