import type { AgentKnowledgeBaseRagChunkResponseModel } from "./AgentKnowledgeBaseRagChunkResponseModel.js";
/**
 * @example {"chunks":[{"chunk_id":"chunk_498cjVigY5qzO86Huf0OWal","content_format":"html","document_id":"doc_J3Pbu5gP6NNKBscdCdwB","document_name":"Account FAQ","document_type":"url","source_url":"https://example.com/account-faq?utm_medium=agents_citation&utm_source=elevenlabs","text":"To reset your password, open Settings and choose Security...","vector_distance":0.21}],"retrieval_query":"How do I reset my password?"}
 */
export type AgentKnowledgeBaseRagQueryResponseModel = {
  /**
   * Raw query used for retrieval (echoes the request query).
   */
  retrieval_query: string;
  /**
   * Ranked chunks the agent would retrieve, after distance and length filtering.
   */
  chunks: Array<AgentKnowledgeBaseRagChunkResponseModel>;
};
