export type service_unavailable = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: { code?: string; message?: string; documentation_url?: string };
    };
  };
  examples: {};
};
