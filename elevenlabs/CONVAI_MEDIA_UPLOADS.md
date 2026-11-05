# ConvAI media uploads

The three v1 POST routes for agent avatar, agent hold audio, and conversation files accept parsed multipart files through Counterfact 3.2.1 / runtime 0.4.1. Scenario-owned defaults bound each upload to 1 MiB and filenames to 255 characters.

Avatar images accept PNG, JPEG, GIF and WebP MIME metadata. Conversation files accept these image types, PDF and plain text. These payloads remain opaque: no image decoding, document extraction, inference or external storage occurs.

Hold audio accepts PCM WAV (one/two channels, 8/16/24/32-bit samples) and complete MPEG Layer III frame streams, with a maximum parsed duration of 180 seconds. Duration is derived from container/frame metadata. Unsupported/malformed audio is rejected atomically. This is metadata parsing, not audio processing or playback. The local upload size bound is narrower than the source contract's 40 MB description.

Agent payloads live in the canonical agent record's internal media map. Immutable paths survive replacement, hold removal and configuration snapshots. Duplicates own independent copies so deleting the source agent does not discard their media. Deleting an agent removes its record and payloads. Public configuration/widget/version JSON contains metadata only. Conversation uploads live on canonical file records and do not alter transcript history. Existing in-use attachment deletion guards and conversation deletion cleanup still apply. Startup/reset replaces canonical records and resets counters/defaults.

Returned simulator.invalid URLs identify inert local metadata; this slice adds no media-fetch route or remote upload. Tests exercise the real public Dispatcher with request/response validation and already-parsed multipart bodies, assuming the runtime's transport parser.
