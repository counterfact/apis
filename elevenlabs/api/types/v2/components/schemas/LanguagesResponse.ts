import type { PairedLanguagesResponse } from "./PairedLanguagesResponse.js";
import type { SingleLanguagesResponse } from "./SingleLanguagesResponse.js";
export type LanguagesResponse =
  | (PairedLanguagesResponse & { kind: "pair" })
  | (SingleLanguagesResponse & { kind: "single" });
