export type Distribution = {
  /**
   * The type of distribution.
   * @example "normal"
   */
  kind?: "normal" | "beta";
  /**
   * The parameters of the distribution. The parameters are different for each distribution type. When <code>kind</code> is <code>normal</code>, the parameters of the distribution are 'mu' and 'sigma'. When <code>kind</code> is <code>beta</code>, the parameters of the distribution are 'alpha' and 'beta.'
   */
  parameters?: { [key: string]: unknown };
};
