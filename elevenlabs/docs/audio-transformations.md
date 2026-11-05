# Bounded audio transformations

The four POST operations under `/v1/audio-isolation` and `/v1/voice-changer/{voice_id}`, including their `/stream` variants, return the scenario-owned MPEG silence fixture as one buffered response. They do not perform noise isolation, voice conversion, inference, or incremental transport streaming.

Parsed multipart uploads accept complete MPEG Layer III or PCM WAV, at most 10 MiB and 60 seconds. The ordinary `file_format=other` default works; raw PCM input, voice settings, seeds, noise removal, alternate output formats and latency optimization are outside this bounded implementation. Voice conversion defaults to the discoverable `eleven_english_sts_v2` fixture, which supports voice conversion and does not support text to speech.

Local synthetic usage is one character credit per second of source audio, rounded up. This is a simulator convention, not provider pricing. The fixed MPEG output remains 23040/44100 seconds regardless of source duration. Isolation history records describe this synthetic output and have no downloadable URL. Voice conversion retains independent MPEG bytes and STS metadata in the shared speech history; `enable_logging=false` suppresses retention while still charging local usage. Returned request IDs and retained history IDs identify these synthetic operations.

Startup/reset owns fixture bytes, defaults, counters and live cross-context accessors. Failed requests leave quota, counters and histories unchanged. Reset restores baseline histories and usage.
