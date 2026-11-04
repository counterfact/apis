export type RAGIndexStatus =
  | "new"
  | "created"
  | "processing"
  | "failed"
  | "succeeded"
  | "rag_limit_exceeded"
  | "document_too_small"
  | "cannot_index_folder";
