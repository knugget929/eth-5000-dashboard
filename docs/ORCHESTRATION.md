# Automated thesis refresh

This repository uses a lightweight two-stage workflow.

## 1. Research run

- Refresh ETH price and 24-hour move.
- Check ETF/institutional demand, staking, U.S. regulation, tokenization/DeFi, Ethereum execution, Fed/liquidity, market structure, ETH value capture, and the debasement trade.
- Prefer primary or authoritative sources and record URLs plus access dates.
- Update `data/research/latest.json` and optionally save `data/research/archive/YYYY-MM-DD.json`.
- Do not change probabilities during this stage.

## 2. Thesis evaluation and publish

- Read the policy, latest research, current evaluation, and render payload.
- Update only the catalyst states, scores, explanations, and probabilities justified by new evidence.
- Keep weights aligned with `data/thesis-policy.json`.
- Update both `data/evaluation/current.json` and `data/thesis.json`.
- Append history and a sourced “What changed?” entry when the thesis changes.
- Run `npm run check && npm run build`.
- Commit directly to `main`; GitHub Pages publishes the update.
- Notify the owner only for a color change, a probability move of at least three points, or a thesis-breaking event.

The workflow has no PR, reviewer, staging, or manual approval gate. Git history is the audit and rollback mechanism.

## Current schedule

- `Ethereum News & Research`: runs at 08:00 and 19:00, Europe/Athens time. It updates the evidence file and alerts only for major ETH news, a 5% daily move, or a thesis-breaking event.
- `ETH Thesis Publish`: daily afternoon run, Europe/Athens time.

The older `ETH Daily Research` and hourly `ETH Thesis Watch` automations are paused to avoid duplicate research and alert streams.
