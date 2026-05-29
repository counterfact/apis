export type search_result_text_matches = Array<{
  object_url?: string;
  object_type?: string;
  property?: string;
  fragment?: string;
  matches?: Array<{ text?: string; indices?: Array<number> }>;
}>;
