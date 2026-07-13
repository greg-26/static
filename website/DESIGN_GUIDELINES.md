# Ohana TV Design Guidelines

Durable design guidance for Ohana TV. Use this file to make product and UX decisions before choosing components or styling.

## Product north star

Help people confidently choose the right movie or TV show for the moment, while respecting who they're watching with.

## Core screen questions

Every screen should answer one primary user question.

- **Discover:** What should we watch?
- **Search:** Help me find something specific.
- **Settings:** How does Ohana work for me?

If a component does not directly help answer the screen's question, challenge its existence.

## Design principles

### Discovery first

Ohana primarily helps people decide what to watch. Everything else should support that decision.

### Separate exploration from search

Discovery helps users who do not know what they want yet. Search helps users who already have something in mind. Optimize the experiences independently.

### Configure once, use everywhere

Permanent preferences belong in Settings. Temporary viewing choices belong in Discover. Users should rarely need to leave Discover once their account is configured.

### Simplicity over flexibility

Prefer single-select controls, fewer visible decisions, better defaults, and progressive disclosure. Power features can come later.

### Prioritize hierarchy over features

Design from this order:

1. User intent
2. Information hierarchy
3. Layout
4. Components
5. Visual styling

Never start by placing controls.

### One hero per screen

Every screen needs one clear focal point.

- Discover: recommendations.
- Search: search field and results.
- Movie details: the movie itself.
- Settings: current configuration.

Everything else should visually support that hero.

### Progressive disclosure

Ask whether the user needs each decision right now. If not, move it behind a dropdown, bottom sheet, Settings route, detail surface, or remove it entirely.

### Design for scanning

Assume users scan rather than read. Create hierarchy through spacing, typography, contrast, and grouping — not through borders and nested boxes. Whitespace is preferable to separators.

### Components are expensive

Every visible component adds cognitive load. Before adding one, ask whether an existing component can solve the problem. Fewer controls almost always produce a better experience.

### Consistency beats creativity

The same interaction should always look identical. Do not invent new component variations unless necessary.

### Ruthlessly reduce noise

Start by subtracting. Ask:

- Can this disappear?
- Can this move?
- Can this become implicit?
- Can two components become one?
- Is this a real user decision, or just us explaining ourselves?

If a setting, card, label, or paragraph does not change what the user can do, remove it rather than polishing it.

## Interaction and visual standards

### States must be obvious

Every interactive component needs clear default, hover, pressed, focused, selected, and disabled states. Selected must never be confused with pressed. Color alone should never communicate state.

### Color has meaning

Reserve accent colors for intentional meaning:

- Green: current maturity/profile fit.
- Blue: interactive controls.
- Yellow: availability or premium information.
- Red: destructive actions only.

Never use red simply because something is selected.

### Typography is the hierarchy

Do not create hierarchy by making everything large. Use consistent type roles: one H1, one H2, body, caption. Avoid large all-caps blocks except for small section labels.

### Respect platform conventions

Users already know how iOS and Android behave. Avoid custom interactions unless they are significantly better. Native feeling beats originality.

## Screen-specific guidance

### Discover

Discover answers: **What should we watch?**

- Recommendations are the hero.
- Discovery controls are temporary and should stay lightweight.
- Lists support discovery; they should not compete visually with recommendations.
- The list selector should be lightweight, for example: `Lists · All ▼`.
- Avoid promotional list banners or explanatory copy when a normal row title is enough.

### Search

Search answers: **Help me find something specific.**

- Search is retrieval, not recommendation.
- Search should feel different from Discover.
- Start with the search field and show vertical, scannable results.
- Do not reuse carousel layouts inside Search.
- Annotate results with compatibility and availability, but do not hide expected matches because of Discover filters.

### Settings

Settings answers: **How does Ohana work for me?**

- Settings is an index, not a form dump.
- Summarize current configuration.
- Each setting should open its own dedicated route or screen.
- Avoid long scrolling settings pages.
- Avoid generic product-note or marketing sections unless explicitly requested.

### Lists

Lists are not a primary destination. They support discovery.

- Show saved titles near the top of Discover as a normal content row.
- Use a dedicated list route for complete list browsing.
- Prefer poster grids for full-list views and horizontal rows for discovery previews.

### Movie details

Movie details should combine Ohana's differentiators:

- What is this title?
- Is it appropriate for the active maturity profile?
- Where can I watch it?
- Is it saved or watched?

Provider/platform names belong in detail surfaces, not poster cards.

## Component standards

Implementation rules live in [`CODING_STANDARDS.md`](./CODING_STANDARDS.md). Product intent for common components:

- **Bottom navigation:** icon-only, consistent weight, consistent tap targets.
- **Chips:** short, one line, reusable, never wrapping.
- **Settings rows:** compact label, short summary, clear affordance.
- **Section headers:** quiet structure, not marketing copy.
- **Poster cards:** recognition and quick choice, not full metadata.
- **Metadata badges:** few, meaningful, consistent.

Cards may show abstract availability status if useful, but not streaming provider/platform names. Provider choices belong in movie details.

## Pre-ship UX critique checklist

Before presenting or shipping a design, review it for:

- Inconsistent spacing.
- Inconsistent icon sizes.
- Inconsistent radii.
- Inconsistent typography.
- Inconsistent button heights.
- Unnecessary borders.
- Unnecessary cards.
- Nested boxes.
- Duplicated functionality.
- Poor visual hierarchy.
- Unclear selected states.
- Accessibility issues.
- Excessive cognitive load.

Improve the design before presenting it. Never assume the first version is good enough.
