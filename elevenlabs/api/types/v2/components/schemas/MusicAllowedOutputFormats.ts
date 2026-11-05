import type { AllowedOutputFormats } from "./AllowedOutputFormats.js";
import type { MusicOnlyOutputFormats } from "./MusicOnlyOutputFormats.js";
export type MusicAllowedOutputFormats =
  AllowedOutputFormats | MusicOnlyOutputFormats;
