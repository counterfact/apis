import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Request_manual_verification_v1_voices_pvc__voice_id__verification_post =
  {
    /**
     * Verification documents
     */
    files: Array<MultipartFile>;
    /**
     * Extra text to be used in the manual verification process.
     */
    extra_text?: string | null;
  };
