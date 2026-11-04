export type AgentKnowledgeBaseRagQueryRequestModel = {
  /**
   * Query to run against the agent's knowledge base RAG index.
   */
  query: string;
  /**
   * When true (the default), retrieval uses the agent's own RAG settings, reproducing exactly what the agent would retrieve. Set to false to retrieve with neutral default RAG settings instead (the agent's embedding model is always kept, since it determines which vector index exists). Useful for auditing the knowledge base independently of how a particular agent is tuned.
   * @default true
   */
  use_agent_defaults?: boolean;
  /**
   * Optional maximum total character length of document chunks returned. Overrides the selected RAG settings for this query only.
   */
  max_documents_length?: number | null;
  /**
   * Optional maximum number of document chunks retrieved. Overrides the selected RAG settings for this query only.
   */
  max_retrieved_rag_chunks_count?: number | null;
};
