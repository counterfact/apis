import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/video-to-music"];
export const POST: Route["POST"] = async ($) => {
  try {
    const song = $.context.videoToMusic($.body, $.query);
    return $.x.response.status(200).header("song-id", song.songId).match("audio/mpeg", Buffer.from(song.audio));
  } catch (error) {
    if (error instanceof Error && error.name === "MusicError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
