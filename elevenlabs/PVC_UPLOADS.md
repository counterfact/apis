# Professional voice uploads and verification submissions

The simulator supports POST /v1/voices/pvc/{voice_id}/samples, /captcha,
and /verification through the public multipart request model.
All three require an owned professional voice and reject mutations during
queued training. Samples share canonical voice metadata and the existing
sampleAudio store, so voice lookup, audio retrieval and deletion agree.

Sample uploads accept 1–20 audio/mpeg files, at most 20 samples per voice,
and at most 10 MiB per request. Each upload needs a nonempty filename of
at most 255 characters and consistent nonzero byte size. Bytes are copied,
hashed with SHA-256 and retained without decoding or transcoding. Duration
is unknown; speaker separation rejects these samples with
sample_duration_unavailable. Noise removal is unsupported.

Captcha submissions accept one audio/mpeg recording up to 10 MiB and increment
the canonical verification attempt count. Manual submissions accept 1–20
PDF, JPEG or PNG files totaling at most 10 MiB, plus up to 5,000 characters
of extra text. These are MIME labels, not content validation. Successful
submissions return status ok to acknowledge queued synthetic evidence;
they do not establish identity or grant training permission. Each submission
kind allows one pending request per voice; duplicate requests return 409.

Run completePvcVerification explicitly to complete pending local submissions
and grant simulator fine-tuning permission. It performs no speech matching,
document analysis or external requests. Training still requires a trainable
model, available sample audio and the existing training prerequisites.
The existing verifiedVoiceSampleFixtures scenario remains available.
Reset clears upload counters and verification evidence. Voice deletion
also removes evidence and audio; completion cannot resurrect deleted voices.
