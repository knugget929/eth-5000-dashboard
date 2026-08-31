# Release lifecycle

1. Reconcile `main`, open pull requests, and the current Sites deployment.
2. Update structured thesis data or a bounded product surface.
3. Run `npm run check` and `npm run build`.
4. For G1/G2 work, review the exact current source independently; verify both target modes, dialogs, fallback behavior, and desktop/mobile CSS.
5. Merge only the reviewed head, update the rolling Site, and record the deployed URL in project state.
6. Keep production owner-only unless the owner explicitly changes access.

No GitHub Actions are used. The release steward is the merge guard.
