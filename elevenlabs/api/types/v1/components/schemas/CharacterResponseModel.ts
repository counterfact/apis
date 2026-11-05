import type { CharacterMetadataResponseModel } from "./CharacterMetadataResponseModel.js";
export type CharacterResponseModel = {
  character_id: string;
  name: string;
  metadata: CharacterMetadataResponseModel | null;
  /**
   * @default []
   */
  recommended_voice_ids?: Array<string>;
};
