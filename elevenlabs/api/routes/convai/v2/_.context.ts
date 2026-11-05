import type { Context as PhoneNumbers } from "../phone-numbers/_.context.js";
/** The V1 contract's /convai/v2 list shares the canonical phone collection. */
export class Context {
  phoneNumbers?: PhoneNumbers;
  listPhoneNumbers(query: Parameters<PhoneNumbers["listPhonePage"]>[0]) {
    if (!this.phoneNumbers) throw new Error("Phone contexts are not initialized; run startup");
    return this.phoneNumbers.listPhonePage(query);
  }
}
