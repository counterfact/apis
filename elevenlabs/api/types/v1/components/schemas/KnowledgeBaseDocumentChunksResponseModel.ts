import type { KnowledgeBaseDocumentChunkResponseModel } from "./KnowledgeBaseDocumentChunkResponseModel.js";
export type KnowledgeBaseDocumentChunksResponseModel = {
  chunks: Array<KnowledgeBaseDocumentChunkResponseModel>;
  next_cursor?: string | null;
};
