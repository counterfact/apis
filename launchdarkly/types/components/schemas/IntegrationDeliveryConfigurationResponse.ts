import type { UnixMillis } from "./UnixMillis.js";

export type IntegrationDeliveryConfigurationResponse = {
  /**
   * The status code returned by the validation
   * @example 200
   */
  statusCode?: number;
  error?: string;
  /**
   * Timestamp of when the validation was performed
   * @example "1654104600000"
   */
  timestamp?: UnixMillis;
  /**
   * JSON response to the validation request
   */
  responseBody?: string;
};
