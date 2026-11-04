/**
 * A media generation that has not finished yet.
 * @example {"id":"JWr5N6X9ZTqf8jD2LmQb","status":"generating"}
 */
export type MediaGenerationInProgressResponse = {
  /**
   * The unique identifier of the generation.
   */
  id: string;
  /**
   * The lifecycle status of the generation. It ends at `completed` or `failed`.
   */
  status: "pending" | "generating";
};
