import type { ContentFormat } from "./ContentFormat.js";
import type { KnowledgeBaseDocumentType } from "./KnowledgeBaseDocumentType.js";
export type AgentKnowledgeBaseRagChunkResponseModel = {
  /**
   * ID of the source knowledge base document.
   */
  document_id: string;
  /**
   * Name of the source knowledge base document.
   */
  document_name: string;
  /**
   * Tracked source URL for URL documents, or null for other document types.
   */
  source_url: string | null;
  /**
   * ID of the retrieved chunk.
   */
  chunk_id: string;
  /**
   * Text content of the retrieved chunk.
   */
  text: string;
  /**
   * Similarity distance when exposed by the retrieval strategy.
   */
  vector_distance: number | null;
  /**
   * Format of the chunk text. Markdown chunks contain raw markdown; HTML chunks contain HTML.
   */
  content_format: ContentFormat;
  /**
   * Type of the source knowledge base document.
   */
  document_type: KnowledgeBaseDocumentType;
};
