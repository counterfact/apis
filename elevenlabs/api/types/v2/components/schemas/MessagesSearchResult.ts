import type { SearchHighlightSegment } from "./SearchHighlightSegment.js";
/**
 * transcript_index: index of the message in the conversation transcript
 * chunk_text: text of the transcript; transcript messages if very long could have several chunks.
 * chunk_highlights: chunk_text split into matched/unmatched segments for highlighting.
 *     Only populated for keyword/text search, not semantic search.
 * score: similarity score of the message to the search query
 */
export type MessagesSearchResult = {
  conversation_id: string;
  agent_id: string;
  agent_name?: string | null;
  transcript_index: number;
  chunk_text: string;
  chunk_highlights?: Array<SearchHighlightSegment> | null;
  score: number;
  conversation_start_time_unix_secs: number;
};
