# ElevenLabs implementation status

Counterfact 3.2.2 / runtime 0.4.2. 437 canonical operations: 431 authored, six generated. The pinned contracts and
provenance hashes are unchanged. No request validation bypass or manual generated
schema edits were introduced. V2 voice discovery shares the existing V1 voice
store; all 37 newly authored operations below are V1 operations.

| Coherent slice | New operations | Details |
| --- | ---: | --- |
| Voice creation, metadata editing, similarity | 3 | [Voice uploads](README.md#voice-uploads-after-the-321-upgrade) |
| PVC samples, captcha and verification submissions | 3 | [PVC uploads](PVC_UPLOADS.md) |
| Tool creation and configuration replacement | 2 | [Tool configuration](TOOL_CONFIGURATION.md) |
| Agent-test definition creation and replacement | 2 | Canonical test/folder state; no model execution |
| Conversation simulation and buffered events | 2 | [Simulation](CONVERSATION_SIMULATION.md) |
| Asset uploads and production-order media | 2 | [Assets](UPLOADED_ASSETS.md) |
| Agent avatars, hold audio and conversation files | 3 | [ConvAI media](CONVAI_MEDIA_UPLOADS.md) |
| PLS dictionaries and knowledge-base file ingestion | 4 | [Document ingestion](docs/slices/document-ingestion.md) |
| Audio isolation and voice conversion variants | 4 | [Audio transformation](docs/audio-transformations.md) |
| Speech transcription and forced alignment | 2 | Scenario transcript, proportional timing and loss; no ASR |
| Music training/upload/stems/video inputs | 4 | [Music](docs/music-inputs.md) |
| Studio and AudioNative project/content ingestion | 3 | [Projects](PROJECT_INGESTION.md) |
| Legacy and current Dubbing creation | 2 | [Dubbing](docs/dubbing-creation.md) |
| Flows template run creation | 1 | Canonical queued runs, version snapshots and scenario completion |
| Total | 37 | Each slice committed after focused checks |

## Compatibility and existing behavior

Generated context bindings and multipart types were refreshed. Obsolete
collection-context casts and nullable/array query coercions were removed; cursor,
date and form decoding remain domain behavior. Optional-body operations now use
existing empty-object defaults when omitted while retaining invalid explicit
input checks. Studio content imports and bodyless snapshot streams work; immutable
snapshots and pending-job guards remain intact.

Pure audio-duration and ZIP utilities were extracted to avoid domain coupling.
History archives retain exact prior bytes and independent CRC/directory checks.
Known media fixtures have matching bytes and MIME types. Music aggregate inputs
are capped at 8 MiB, below Counterfact's separate 10 MiB total multipart-body cap.

Speech-to-text supports scribe_v1 with the configured English fixture and word,
character or no timestamps, plus single-speaker diarization. Logging retains a
copy in the existing transcript store; zero retention omits its ID and record.
Forced alignment preserves supplied Unicode text with proportional synthetic
positions and a fixture loss. Current bounds: 10 MiB, .1–60 seconds of supported
WAV/MPEG, and 2,000 code points for alignment. No inference or character charge.

All state is local and scenario initialized. Reset restores fixtures/counters;
completion scenarios produce synthetic terminal outcomes. No external provider,
network source retrieval or real charging is performed. Format and advanced-option
limits are explicit per slice rather than silently pretending to execute them.

## Remaining runtime issues and verification

[Six generated operations](BLOCKED_OPERATIONS.md) are now unblocked by 0.4.2 and
await implementation. #2626 and #2627 have published fixes. The remaining observations (#2631, #2632)
are recorded in [the issue index](COUNTERFACT_ISSUES.md). Error tags and explicit
optional-body defaults keep supported simulator behavior usable without altering
contracts or disabling validators.

Run `npm test`, `npm run typecheck`, `npm run test:tools` and
`npm run audit:operations -- --check-blockers` from this directory. Authored audit
classification is structural; direct context and real Dispatcher tests establish
behavior. Integration tests intentionally assume Counterfact transport parsing
works and supply public MultipartFile objects for uploads.
