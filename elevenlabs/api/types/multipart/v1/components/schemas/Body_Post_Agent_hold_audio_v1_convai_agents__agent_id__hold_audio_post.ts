import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Post_Agent_hold_audio_v1_convai_agents__agent_id__hold_audio_post =
  {
    /**
     * An MP3 or WAV file played on loop to callers waiting in the agent's concurrency wait queue. Maximum size 40 MB, maximum duration 180 seconds.
     * @format binary
     */
    hold_audio_file: MultipartFile;
  };
