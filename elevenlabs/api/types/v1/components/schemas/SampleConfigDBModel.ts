export type SampleConfigDBModel = {
  /**
   * @default false
   */
  is_sample?: boolean;
  parent_id?: string | null;
  parent_type?: ("read" | "collection") | null;
  chapter_ids?: Array<string> | null;
};
