# Lexicon And Audio Notes

- Use existing `phrases`, `lessons`, `splash_cards`, and progress tables as the first Bahasa Buddy knowledge base.
- Add a separate normalized lexicon table only after the curriculum needs cross-unit dictionary search, part-of-speech filters, or morphology.
- Prefer curated lesson vocabulary over bulk importing an external dictionary into learner-facing content.
- Store production-quality Indonesian recordings on cards and phrases with `audio_url`.
- Fall back to browser `id-ID` speech synthesis when an approved recording is not available.
- Use short Web Audio tones for correct/incorrect feedback so exercises work before a full audio asset pipeline exists.
- Keep download/export audio as a later pipeline: generate or upload reviewed audio, save it to storage, then expose the stored file.
