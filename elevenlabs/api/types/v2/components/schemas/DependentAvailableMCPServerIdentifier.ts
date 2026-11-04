export type DependentAvailableMCPServerIdentifier = {
  id: string;
  name: string;
  /**
   * @default "available"
   */
  type?: "available";
  created_at_unix_secs: number;
  access_level: "admin" | "editor" | "commenter" | "viewer";
};
