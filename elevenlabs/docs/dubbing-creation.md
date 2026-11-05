# Bounded Dubbing creation

`POST /v1/dubbing` and `POST /v1/dubbing/project` require exactly one
source: a parsed file upload or a declared URL fixture. The ordinary file-only
request succeeds. Startup/reset declares
`https://simulator.invalid/dubbing-source.mp3`; other URLs fail without fetching.
Inputs are copied and checked as PCM WAV or complete MPEG Layer III streams,
at most 8 MiB and 0.1–60 seconds. Video and other media are rejected.

Legacy creation returns an ID and source duration. The record starts in
`dubbing`, with transcript/audio reads gated until `completeDubbingCreation`.
The scenario writes synthetic source/target transcripts and bounded MP3 output
into the existing legacy owners. Without a target, source transcript/audio are
still available after completion. `dubbing_studio=true` creates an editable
resource on completion. Its mutable resource state is independent of the
completed legacy transcript/audio snapshot. Deleting the created legacy record
also removes its resource, queued resource jobs, settings, and audio.

Project creation starts in `queued`, with no source media metadata or transcript.
It defaults to `dubbing_v2`, preserves `reference`, and supports `dubbing_v1`.
An optional target creates a normal queued language target. Source language
subtags are ignored; omitted source language resolves to the scenario's synthetic
English fixture. `completeDubbingCreation` supplies source metadata/transcript
and marks the project ready. Then `completeDubbingLanguages` completes targets
using the existing synthetic translations and opaque output URL references.
Neither scenario calls a provider or hosts additional media. Completion is
idempotent and never resurrects deleted records. Reset clears created sources,
outputs, pending work, and IDs while restoring the original fixtures.

Legacy CSV/manual mode, crops, accents, multiple explicit speakers, and advanced
processing flags are outside this bounded workflow. Default false flags and
zero/one speaker are accepted. New-project supplied transcripts, nonempty
keyterms, and webhook configuration are rejected explicitly. Empty keyterm and
webhook arrays are accepted. No real fetching, transcription, translation,
voice cloning, or webhook delivery occurs.
