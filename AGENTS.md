# ETH Mission Control operating contract

## Product direction

- Preserve the one-page, data-driven architecture.
- Optimize the first viewport for phone use: price, target distance, selected probability, overall signal, and target switch.
- Treat `$5K` and `$10K` as distinct thresholds. Never copy a catalyst interpretation between targets without reassessing it.
- Give ETH value capture special weight in the `$10K` model. Ecosystem growth alone is not sufficient evidence.
- Keep routine thesis updates inside `data/thesis.json` whenever possible.

## Delivery constraints

- GitHub is the source of truth; ChatGPT Sites is the only production surface.
- Do not add GitHub Pages or GitHub Actions.
- Favor lightweight validation over extensive automated testing.
- Respect reduced-motion preferences and preserve keyboard-accessible controls and dialogs.

## Review gates

- G0: data/docs/build metadata; lightweight validation.
- G1: bounded behavior or accessibility fix; independent review before merge.
- G2: visible layout, interaction, or device-behavior change; independent review plus exact-source preview before merge and release.
- G3: architecture, public access, secrets, paid data sources, storage, or destructive migration; owner decision first.
