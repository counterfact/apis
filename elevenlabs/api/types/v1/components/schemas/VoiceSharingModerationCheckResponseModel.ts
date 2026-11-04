/**
 * @example {"captcha_checks":[0.95,0.98],"captcha_ids":["captcha1","captcha2"],"date_checked_unix":1714204800,"description_check":true,"description_value":"A female voice with a soft and friendly tone.","name_check":true,"name_value":"Rachel","sample_checks":[0.95,0.98],"sample_ids":["sample1","sample2"]}
 */
export type VoiceSharingModerationCheckResponseModel = {
  /**
   * The date the moderation check was made in Unix time.
   */
  date_checked_unix?: number | null;
  /**
   * The name value of the voice.
   */
  name_value?: string | null;
  /**
   * Whether the name check was successful.
   */
  name_check?: boolean | null;
  /**
   * The description value of the voice.
   */
  description_value?: string | null;
  /**
   * Whether the description check was successful.
   */
  description_check?: boolean | null;
  /**
   * A list of sample IDs.
   */
  sample_ids?: Array<string> | null;
  /**
   * A list of sample checks.
   */
  sample_checks?: Array<number> | null;
  /**
   * A list of captcha IDs.
   */
  captcha_ids?: Array<string> | null;
  /**
   * A list of CAPTCHA check values.
   */
  captcha_checks?: Array<number> | null;
};
