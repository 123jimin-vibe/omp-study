+++
id = "t0019"
title = "Keep context input visible before generation playback"
modifies = ["s0005"]
status = "done"
+++

# Keep context input visible before generation playback

## Scope and acceptance

- Show the entire selected input immediately and keep it fixed during generation.
- Remove input-loading animation, its timing, and its phase label from the shared contract and locale.
- Replay resets only generated tokens; scenario changes immediately display their input and reset generation.
- Preserve the existing reasoning and answer durations, pause, reduced-motion stepping, print completion/restoration, and single-window limits.
- Verify initial, running, paused, replayed, switched-scenario, reduced-motion, and printed states in the browser; run the production build.

The user's explicit instruction authorizes this refinement to s0005.

## Verification and reconciliation

- Input is painted only when selecting a scenario. Removed the input phase and its locale/type field; reasoning and answer still take 1,100 ms each.
- Browser initial state: 4,000 input tokens at 50% width, zero reasoning and answer. Every observed playback frame retained that input count and width.
- Replay immediately restored 4,000/0/0; pausing retained usage. Switching scenarios during playback immediately displayed 6,000/0/0 and a 75% input width without autoplay.
- Reduced-motion stepping covered all three scenarios: the first step completes reasoning, the second completes the answer, and replay keeps input fixed. At 320 pixels, all sampled states retained the same figure height without page overflow.
- Print completed the selected 6,000/1,500/500 scenario while preserving the input width; leaving print restored 6,000/0/0.
- `npm run build` passed. Browser verification used disposable runtime probes; no permanent tests were added for this visual change.
- s0005 reflects the requested fixed-input behavior. No unresolved approval or implementation markers remain.
