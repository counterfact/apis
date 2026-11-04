import type { CharacterGender } from "./CharacterGender.js";
import type { CharacterAge } from "./CharacterAge.js";
import type { CharacterRole } from "./CharacterRole.js";
export type CharacterMetadataResponseModel = {
  description?: string | null;
  sample_message?: string | null;
  voice_creation_prompt_suggestion?: string | null;
  gender?: CharacterGender | null;
  age?: CharacterAge | null;
  accent?: string | null;
  role?: CharacterRole | null;
};
