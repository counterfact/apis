import type { GetPhoneNumberTwilioResponseModel } from "./GetPhoneNumberTwilioResponseModel.js";
import type { GetPhoneNumberExotelResponseModel } from "./GetPhoneNumberExotelResponseModel.js";
import type { GetPhoneNumberSIPTrunkResponseModel } from "./GetPhoneNumberSIPTrunkResponseModel.js";
export type GetPhoneNumbersPageResponseModel = {
  /**
   * The phone numbers on this page
   */
  phone_numbers: Array<
    | (GetPhoneNumberTwilioResponseModel & { provider: "twilio" })
    | (GetPhoneNumberExotelResponseModel & { provider: "exotel" })
    | (GetPhoneNumberSIPTrunkResponseModel & { provider: "sip_trunk" })
  >;
  /**
   * Pass this value as `cursor` to fetch the next page. Null when there are no more results.
   */
  next_cursor?: string | null;
  /**
   * Whether there are more results available
   * @default false
   */
  has_more?: boolean;
};
