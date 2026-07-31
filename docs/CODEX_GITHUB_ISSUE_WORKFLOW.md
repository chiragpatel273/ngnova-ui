# Codex GitHub Issue Workflow

Use this workflow when Codex web, Codex cloud, or another agent is asked to work from GitHub Issues for NgNova UI.

## Purpose

GitHub Issues are the source of truth for release-audit tasks. Each issue should describe one focused unit of work that can become one reviewable pull request.

This workflow is designed for Codex cloud tasks, where the agent can work without the maintainer's laptop running.

## Required Labels

Use these labels to make issue selection predictable:

- `codex-ready`: the issue is ready for Codex to pick up.
- `release-audit`: the issue is part of first-release hardening.
- `priority:p1`: the issue should be handled before lower-priority work.
- `component:<name>`: component-specific work, such as `component:input`.

Optional labels:

- `codex-working`: Codex has started work.
- `codex-blocked`: Codex could not complete the issue without maintainer input.
- `codex-pr-opened`: Codex opened a pull request for the issue.

## Issue Selection

When the prompt asks Codex to continue from GitHub Issues:

1. Find open issues labeled `codex-ready`.
2. Prefer issues with `priority:p1`.
3. Prefer the oldest open issue within the highest priority group.
4. Work on exactly one issue unless the prompt explicitly says to continue through multiple issues.
5. Do not work on issues labeled `codex-blocked`.
6. Do not mix unrelated components or release concerns in one pull request.

## Default One-Issue Mode

Use this mode for normal Codex web tasks.

Prompt:

```text
Pick the oldest open GitHub issue labeled codex-ready for this repository.
Work on only that issue.
Follow AGENTS.md, docs/ANGULAR_22_LIBRARY_STANDARDS.md, docs/NGNOVA_WORLD_CLASS_AGENT.md, and docs/CODEX_GITHUB_ISSUE_WORKFLOW.md.
Create a focused branch, complete the issue, run the required checks, commit, push, and open a PR linked to the issue.
Stop after opening the PR.
```

## Batch Mode

Use this mode only when the maintainer explicitly wants Codex to keep going.

Prompt:

```text
Continue through open GitHub issues labeled codex-ready, one issue at a time.
For each issue, create a focused branch, complete the work, run checks, commit, push, and open a PR linked to that issue.
After each PR, move to the next eligible issue.
Stop if checks fail, a task is blocked, no codex-ready issues remain, or three PRs have been opened in this run.
```

The three-PR limit keeps each cloud task reviewable and prevents runaway changes.

## Branch Naming

Use short, descriptive branches:

```text
audit/input-release-ready
audit/textarea-release-ready
release/package-metadata-audit
docs/theming-release-ready
```

If an issue provides a branch name, use the issue's branch name.

## Pull Request Requirements

Each PR must:

- Link the GitHub issue.
- Explain the implementation, docs, and test changes.
- Include verification command results.
- Keep the diff limited to the issue scope.
- Update `docs/FIRST_RELEASE_TRACKER.md` when release status changes.

PR description template:

```md
## Summary

-

## Verification

- [ ] `npm.cmd run format:check`
- [ ] `npm.cmd run lint`
- [ ] `npm.cmd run test:lib`
- [ ] `npm.cmd run test:docs`
- [ ] `npm.cmd run build:lib`
- [ ] `npm.cmd run build:docs`
- [ ] `npm.cmd pack --dry-run`

Closes #<issue-number>
```

## Required Checks

Run these before opening a PR for component or release work:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run test:docs
npm.cmd run build:lib
npm.cmd run build:docs
npm.cmd pack --dry-run
```

If `npm.cmd pack --dry-run` fails because of the known Windows npm cache permission issue, document the environment-specific failure and rerun with approved elevated access when available.

## Auto Code Review

Codex automatic code review is enabled for this repository. After opening a PR:

1. Wait for the automatic Codex review.
2. Address P0/P1 findings before merge.
3. If a follow-up fix is needed in the same PR, ask Codex to fix the review finding in that PR context.

## Blocking Rules

Mark or report an issue as blocked when:

- The implementation contradicts the requested public API.
- Required behavior is unclear and cannot be inferred from standards or existing code.
- Required checks fail for reasons unrelated to the issue and cannot be safely fixed in scope.
- GitHub permissions prevent pushing a branch or opening a PR.

When blocked, leave a concise issue comment explaining the blocker, evidence, and recommended next decision.
