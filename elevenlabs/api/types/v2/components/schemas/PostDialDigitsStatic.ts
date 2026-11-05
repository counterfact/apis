export type PostDialDigitsStatic = {
  /**
   * @default "static"
   */
  type?: "static";
  /**
   * DTMF digits to send after call connects (e.g., 'ww1234' for extension)
   */
  value: string;
};
