import type { TelephonyProvider } from "./TelephonyProvider.js";
export type DependentPhoneNumberIdentifier = {
  phone_number_id: string;
  phone_number: string;
  label: string;
  provider: TelephonyProvider;
};
