export type NumericUniformScoring = {
  /**
   * @default "numeric_uniform"
   */
  mode?: "numeric_uniform";
  max_score: number;
  instructions?: string | null;
};
