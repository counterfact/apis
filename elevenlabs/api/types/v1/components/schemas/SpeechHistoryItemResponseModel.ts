import type { HistoryAlignmentsResponseModel } from "./HistoryAlignmentsResponseModel.js";
import type { DialogueInputResponseModel } from "./DialogueInputResponseModel.js";
/**
 * @example {"character_count_change_from":17189,"character_count_change_to":17231,"content_type":"audio/mpeg","date_unix":1714650306,"history_item_id":"ja9xsmfGhxYcymxGcOGB","model_id":"eleven_multilingual_v2","request_id":"BF0BZg4IwLGBlaVjv9Im","settings":{"similarity_boost":0.5,"stability":0.71,"style":0,"use_speaker_boost":true},"source":"TTS","state":"created","text":"Hello, world!","voice_category":"premade","voice_id":"21m00Tcm4TlvDq8ikWAM","voice_name":"Rachel"}
 */
export type SpeechHistoryItemResponseModel = {
  /**
   * The ID of the history item.
   */
  history_item_id: string;
  /**
   * The ID of the request.
   */
  request_id?: string | null;
  /**
   * The ID of the voice used.
   */
  voice_id?: string | null;
  /**
   * The ID of the model.
   */
  model_id?: string | null;
  /**
   * The name of the voice.
   */
  voice_name?: string | null;
  /**
   * The category of the voice. Either 'premade', 'cloned', 'generated' or 'professional'.
   */
  voice_category?: ("premade" | "cloned" | "generated" | "professional") | null;
  /**
   * The text used to generate the audio item.
   */
  text?: string | null;
  /**
   * Unix timestamp of when the item was created.
   */
  date_unix: number;
  /**
   * The character count change from.
   */
  character_count_change_from: number;
  /**
   * The character count change to.
   */
  character_count_change_to: number;
  /**
   * The content type of the generated item.
   */
  content_type: string;
  /**
   * The state of the history item.
   */
  state: "created" | "deleted" | "processing";
  /**
   * The settings of the history item.
   */
  settings?: { [key: string]: unknown } | null;
  /**
   * The ID of the share link.
   */
  share_link_id?: string | null;
  /**
   * The source of the history item. Either TTS (text to speech), STS (speech to text), AN (audio native), Projects, Dubbing, PlayAPI, PD (pronunciation dictionary) or ConvAI (Agents Platform).
   */
  source?:
    | (
        | "TTS"
        | "STS"
        | "Projects"
        | "PD"
        | "AN"
        | "Dubbing"
        | "PlayAPI"
        | "ConvAI"
        | "VoiceGeneration"
        | "InVPC"
        | "Flows"
        | "VoicePreview"
      )
    | null;
  /**
   * The alignments of the history item.
   */
  alignments?: HistoryAlignmentsResponseModel | null;
  /**
   * The dialogue (voice and text pairs) used to generate the audio item. If this is set then the top level `text` and `voice_id` fields will be empty.
   */
  dialogue?: Array<DialogueInputResponseModel> | null;
  /**
   * The output format the audio was originally generated in.
   */
  output_format?: string | null;
};
