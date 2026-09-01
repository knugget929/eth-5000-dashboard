# ETH Mission Control operating contract

## Product direction

- Preserve the one-page, data-driven dashboard.
- Optimize the first phone viewport for price, target distance, selected probability, overall signal, and target switching.
- Evaluate `$5K` and `$10K` independently.
- Treat ETH value capture as a critical hurdle for `$10K`; ecosystem growth alone is not sufficient.
- Keep Fed/liquidity and the debasement trade separate: one is cyclical, the other structural.

## Routine update contract

- Read `data/thesis-policy.json`, `data/research/latest.json`, `data/evaluation/current.json`, and `data/thesis.json` before updating the thesis.
- Put sourced observations in `data/research/latest.json`; use `data/research/archive/` for optional dated snapshots.
- Put current scored judgments in `data/evaluation/current.json`.
- Keep `data/thesis.json` aligned because it is the dashboard's render payload.
- Append history and “What changed?” entries when probabilities or catalyst states change.
- Never commit secrets, API keys, account details, or private research notes; the repository and GitHub Pages site are public.

## Delivery

- GitHub `main` is the source and GitHub Pages publishing branch.
- Direct commits to `main` are allowed for this personal project; no PR/reviewer gate is required.
- Run `npm run check` and `npm run build` before pushing.
- Keep `.openai/hosting.json` intact so ChatGPT Sites remains an option later.
- Favor lightweight validation over an extensive test suite.
