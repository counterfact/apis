export type forbidden_gist = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: {
        block?: { reason?: string; created_at?: string; html_url?: string };
        message?: string;
        documentation_url?: string;
      };
    };
  };
  examples: {};
};
