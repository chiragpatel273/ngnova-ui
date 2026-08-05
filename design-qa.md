# Homepage Design QA

- Source visual truth: `.tmp/homepage-audit/source-final.png`
- Implementation screenshot: `.tmp/homepage-audit/03-home-implementation-desktop.png`
- Responsive screenshot: `.tmp/homepage-audit/04-home-implementation-mobile.png`
- Combined comparison: `.tmp/homepage-audit/05-source-vs-implementation.png`
- State: root documentation route, light theme, default navigation state
- Desktop viewport: 1487 × 1056 CSS px at device scale factor 1
- Source pixels: 1487 × 1058
- Implementation pixels: 1487 × 1056
- Mobile viewport: 390 × 844 CSS px at device scale factor 1; full-page capture
- Density normalization: both desktop images are 1×. The two-pixel source-height difference was retained and aligned at the top in the combined comparison.

## Full-view comparison evidence

The combined comparison confirms the implementation preserves the selected design's documentation shell, asymmetric hero, two-step quick start, three-part assurance row, split benefits section, and task-oriented closing band. The desktop hero and assurance row terminate at the same visual landmarks as the source. The task band begins within the same viewport and the mobile layout reflows without horizontal page overflow.

## Focused region comparison evidence

The hero and quick-start controls were readable at full-view scale, so a separate crop was not required. The implementation uses the repository's existing button, badge, and Heroicons integrations. Both copy controls retain readable code, visible focus targets, and working copied state.

## Required fidelity surfaces

- Fonts and typography: the existing documentation font stack is preserved. Heading weight, two-line desktop wrapping, compact labels, body scale, and line height match the visual hierarchy of the source.
- Spacing and layout rhythm: hero height, assurance-row height, section boundaries, column proportions, and closing-band placement match the source closely after one iteration.
- Colors and visual tokens: existing NgNova blue, slate, white, dark-mode, border, and focus-ring tokens replace generated-image approximations while preserving the source balance.
- Image quality and asset fidelity: the selected design contains no raster imagery. Icons use the repository's installed Heroicons library; no CSS drawings, emoji, handcrafted SVGs, or placeholder assets were introduced.
- Copy and content: component-count metrics and release-report language were removed. The approved developer-outcome copy and task-oriented navigation are present.

## Interaction and accessibility checks

- Install copy action: passed.
- Get started navigation to `#/guide`: passed.
- Desktop and mobile page errors: none.
- Desktop and mobile console errors: none.
- Headings, landmarks, labelled copy controls, live copied-state announcement, keyboard focus styles, and dark-mode classes are present.

## Comparison history

### Iteration 1

- P2: the desktop hero headline wrapped to three lines instead of two.
- P2: excessive desktop vertical spacing pushed the task-entry band below the reference viewport.
- Fixes: widened the hero text track, reduced the desktop display size slightly, tightened hero padding, compacted benefit rows, and reduced the task-card height.
- Post-fix evidence: `.tmp/homepage-audit/03-home-implementation-desktop.png` and `.tmp/homepage-audit/05-source-vs-implementation.png` show the two-line headline and task band within the target viewport.

## Findings

No actionable P0, P1, or P2 differences remain.

## Follow-up polish

- P3: the implementation intentionally uses fewer decorative icons than the generated source so the homepage stays aligned with the existing documentation system and avoids visual noise.

final result: passed
