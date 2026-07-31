# Codex Issue Sweep Prompt

Continue through open GitHub issues labeled `codex-ready`, one issue at a time.

Follow:

- `AGENTS.md`
- `docs/ANGULAR_22_LIBRARY_STANDARDS.md`
- `docs/NGNOVA_WORLD_CLASS_AGENT.md`
- `docs/CODEX_GITHUB_ISSUE_WORKFLOW.md`

Selection rules:

1. Ignore issues labeled `codex-blocked`.
2. Prefer issues with `priority:p1`.
3. Pick the oldest issue within the highest-priority group.
4. Work on exactly one issue per pull request.
5. Do not mix unrelated components or release concerns in one pull request.

For each issue:

1. Create a focused branch.
2. Implement only the issue scope.
3. Update docs and `docs/FIRST_RELEASE_TRACKER.md` if release status changes.
4. Run the required release checks.
5. Commit, push, and open a pull request linked to the issue.
6. Move to the next eligible issue only after the pull request is open.

Stop if checks fail, a task is blocked, no `codex-ready` issues remain, GitHub permissions prevent pushing or opening a pull request, or three pull requests have been opened in this run.

Required checks:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:docs
npm.cmd pack --dry-run
```

If `npm.cmd pack --dry-run` fails because of the known Windows npm cache permission issue, document the environment-specific failure and rerun with approved elevated access when available.
