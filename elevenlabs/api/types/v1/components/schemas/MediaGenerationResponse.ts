import type { MediaGenerationInProgressResponse } from "./MediaGenerationInProgressResponse.js";
import type { MediaGenerationCompletedResponse } from "./MediaGenerationCompletedResponse.js";
import type { MediaGenerationFailedResponse } from "./MediaGenerationFailedResponse.js";
export type MediaGenerationResponse =
  | (
      | (MediaGenerationInProgressResponse & { status: "generating" })
      | (MediaGenerationInProgressResponse & { status: "pending" })
    )
  | (MediaGenerationCompletedResponse & { status: "completed" })
  | (MediaGenerationFailedResponse & { status: "failed" });
