# Bounded music inputs

The four multipart input operations run locally with Counterfact 3.2.1 / runtime
0.4.1. They use the existing music song store and music finetune metadata store.
Startup/reset scenarios own output fixtures, stem names, synthetic completion
metadata, timestamps and counters.

- Music upload retains copied WAV/MP3 bytes in the canonical song store and returns
  a shared song ID. It validates bounded PCM WAV / complete Layer III streams,
  matching MIME, filename, declared size and measured duration. Composition-plan
  extraction, transcription and waveform inference are unsupported.
- Finetune creation requires 1–20 validated audio files, a 5–200 character name
  and nonblank genre. Defaults are music_v1, private visibility and empty tags.
  It creates a self-owned, immediately synthetically completed metadata record
  accessible through existing list/get/edit/delete operations. No training runs
  and training files are not retained. The canonical model must exist.
- Stem separation accepts the ordinary six_stems_v1 default or two_stems_v1 and
  returns a valid stored ZIP containing six or two named copies of the existing
  3.84-second MPEG silence fixture. No actual source separation takes place.
- Video-to-music accepts 1–10 opaque video/mp4 uploads with valid filenames and
  matching sizes. It returns that same fixed MPEG fixture and a shared song ID.
  Video bytes are not decoded or analyzed, and input duration is not measured.
  Descriptions and tags are retained as request metadata; they do not change the
  output. enable_logging=false suppresses song retention. The music_v1 model must
  exist. SFX, separate tracks, audio-reference analysis and C2PA are unsupported.

Audio uploads are bounded to 8 MiB and 600 measured seconds per file; finetune
input totals are limited to 8 MiB. Videos have an 8 MiB per-file and 8 MiB total
limit. These combined limits leave room for multipart headers and fields within
the runtime’s 10 MiB wire-body limit. Processing output supports mp3_44100_128; no codec conversion or streaming
is performed. Failed requests leave records and counters unchanged. Reset clears
new songs/finetunes and restores counters and baseline metadata.

The test MP4 is a synthetic 16×16 black, four-frame, four-second Motion-JPEG ISO
BMFF file. avmediainfo independently reported four samples, one video track and
zero structural errors; Pillow decoded all JPEG samples and checked black pixels.
Native AVFoundation encoding/decoding was unavailable in the sandbox. Tests do
not invoke any platform codec. ZIP output was independently read with Python's
zipfile module; member bytes match the existing bounded MPEG fixture.
