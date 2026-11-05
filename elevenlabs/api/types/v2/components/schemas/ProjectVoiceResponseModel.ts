export type ProjectVoiceResponseModel = {
  project_voice_ref_id: string;
  voice_id: string;
  alias: string;
  stability: number;
  similarity_boost: number;
  style: number;
  is_pinned: boolean;
  use_speaker_boost: boolean;
  volume_gain: number;
  speed: number;
};
