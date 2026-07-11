# Codex One-Issue Prompt

Pick the oldest open GitHub issue labeled `codex-ready` for this repository.

Work on only that issue.

Follow:

- `AGENTS.md`
- `docs/ANGULAR_22_LIBRARY_STANDARDS.md`
- `docs/NGNOVA_WORLD_CLASS_AGENT.md`
- `docs/CODEX_GITHUB_ISSUE_WORKFLOW.md`

Selection rules:

1. Ignore issues labeled `codex-blocked`.
2. Prefer issues with `priority:p1`.
3. Pick the oldest issue within the highest-priority group.
4. Do not mix unrelated components or release concerns in one pull request.

For the selected issue:

1. Create a focused branch.
2. Implement only the issue scope.
3. Update docs and `docs/FIRST_RELEASE_TRACKER.md` if release status changes.
4. Run the required release checks.
5. Commit, push, and open a pull request linked to the issue.
6. Stop after opening the pull request.

Required checks:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:demo
npm.cmd pack --dry-run
```

If `npm.cmd pack --dry-run` fails because of the known Windows npm cache permission issue, document the environment-specific failure and rerun with approved elevated access when available.
