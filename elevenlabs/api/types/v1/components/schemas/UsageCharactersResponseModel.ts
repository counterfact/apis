/**
 * @example {"time":[1738252091000,1739404800000],"usage":{"All":[49,1053]}}
 */
export type UsageCharactersResponseModel = {
  /**
   * The time axis with unix timestamps for each day.
   */
  time: Array<number>;
  /**
   * The usage of each breakdown type along the time axis.
   */
  usage: { [key: string]: Array<number> };
};
