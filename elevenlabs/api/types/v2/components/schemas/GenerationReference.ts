/**
 * The output of a prior generation on this API.
 */
export type GenerationReference = {
  type: "generation";
  /**
   * The ID of the generation whose output to use, as returned when the generation was created.
   */
  generation_id: string;
};
