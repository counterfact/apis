/**
 * A newly queued media generation; fetch the GET endpoint for the output.
 * @example {"id":"JWr5N6X9ZTqf8jD2LmQb","status":"pending"}
 */
export type MediaGenerationCreateResponse = {
  /**
   * The unique identifier of the generation. Pass it to the corresponding GET endpoint to retrieve the output.
   */
  id: string;
  /**
   * A newly created generation is always `pending`.
   */
  status: "pending";
};
