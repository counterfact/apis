import type { MediaGenerationResponse } from "./MediaGenerationResponse.js";
/**
 * One page of the caller's generations, newest first.
 * @example {"generations":[{"content_mime_type":"video/mp4","content_url":"https://storage.googleapis.com/generations/JWr5N6X9ZTqf8jD2LmQb","id":"JWr5N6X9ZTqf8jD2LmQb","status":"completed"},{"id":"Kx2mP7Y4WVrg9kE3NnRc","status":"generating"}],"has_more":true,"next_cursor":"MjAyNi0wNy0xN1QxMjowMDowMHxLeDJtUDdZNFdWcmc5a0UzTm5SYw"}
 */
export type MediaGenerationListResponse = {
  /**
   * The generations on this page, newest first. Each item has the same shape as the corresponding GET endpoint's response.
   */
  generations: Array<MediaGenerationResponse>;
  /**
   * Pass as `cursor` to fetch the next page. `null` when there is no further page.
   */
  next_cursor: string | null;
  /**
   * Whether more generations exist beyond this page.
   */
  has_more: boolean;
};
