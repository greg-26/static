# Ohana Web App Redesign

## Vision

Ohana helps people confidently choose what to watch.

Most streaming services optimize for popularity or personalization. Ohana adds something equally important: **appropriateness**. It helps people discover movies and TV shows that match their interests **and** their personal sensibilities, while making it effortless to find where they can watch them.

The product revolves around three core capabilities:

- **Discover** movies and TV shows that fit your preferences.
- **Understand** whether a title is appropriate for you or the people you're watching with.
- **Know where to watch** it with the streaming services you already have.

Lists remain an important part of the experience, but they support discovery rather than becoming a separate product.

The redesign aims to make Ohana feel simple, calm, and highly focused.

---

# Design principles

## Discovery first

The application exists primarily to answer one question:

> **What should we watch tonight?**

Everything else should support that decision.

## Separate exploration from search

Browsing and searching are different user intentions.

Discovery helps users who don't know what they want yet.

Search helps users who already have something in mind.

The experience should optimize independently for both.

## Configure once, use everywhere

Permanent preferences belong in Settings.

Temporary viewing choices belong in Discover.

Users should rarely need to leave Discover once their account has been configured.

## Simplicity over flexibility

Wherever possible:

- Single-select over multi-select
- Fewer controls
- Better defaults
- Fewer decisions

Power features can come later.

---

# Information Architecture

The application has three primary tabs.

## Discover

Find something to watch.

## Search

Find a specific title, collection or person.

## Settings

Configure your Ohana experience.

---

# Discover

## Purpose

Discover is the heart of Ohana.

It combines personal preferences, streaming availability and maturity filtering to recommend appropriate content.

Unlike Search, Discover is intentionally curated.

## Layout

The page is organized into three sections:

1. Discovery controls
2. From your lists
3. Discovery rows

---

## Discovery controls

Discovery filters are temporary.

They affect only the current browsing session.

Permanent preferences live under Settings.

### Availability

Single-select dropdown.

Options:

- Included with my services
- Free with ads
- Rent
- Buy

Initially only "Included with my services" may be supported until backend capabilities expand.

### Maturity profile

Single-select dropdown.

Examples:

- Me
- Family
- With kids
- Adults

The selected profile becomes the active viewing context for the application.

Compatibility shown throughout the app uses this profile.

### Content type

Two chips:

- Movie
- TV Show

Behavior:

- One selected = filter
- None selected = both
- Both cannot be selected simultaneously

### Genre

Single-select dropdown.

Examples:

- Comedy
- Drama
- Adventure
- Animation

No multi-select.

### Rating

Minimum rating slider.

Examples:

- Any
- 6+
- 7+
- 8+
- 9+

A thin mobile-friendly slider is preferred.

---

## From your lists

Lists are integrated into discovery rather than having their own navigation tab.

This section appears near the top of Discover.

Header:

**From your lists**

Dropdown:

- All lists
- Watchlist
- Family
- Christmas
- Shared...

Action:

**Manage lists**

Selecting a list filters this section only.

Users can quickly continue browsing recommendations below without changing screens.

This allows users to first revisit things they already intended to watch before exploring something new.

---

## Discovery sections

The remainder of the page consists of curated horizontal rows.

Examples:

- Recommended for this profile
- Included with your services
- Popular now
- Hidden gems
- Because you like Comedy
- Family favourites

Each row uses large posters.

Opening a movie always goes to the same movie detail page.

---

## Movie cards

Cards should remain visually simple.

Display:

- Poster
- Title
- Year
- Rating
- Primary availability
- Compatibility indicator

Optional metadata:

- Already watched
- Saved in list

Primary action:

Open details.

Secondary action:

Add to list.

---

## Movie details

Movie details combine Ohana's three differentiators.

### Overview

- Poster
- Title
- Synopsis
- Year
- Runtime
- Genres

### Suitability

The active maturity profile is clearly displayed.

Example:

> Compatible with: **With kids**

Each maturity category shows:

- Movie intensity
- Allowed level
- Compatible or exceeds

Categories may include:

- Violence
- Sex & nudity
- Language
- Frightening scenes
- Drugs
- Alcohol

Users understand *why* a title matches instead of seeing only a single score.

### Availability

Providers grouped by:

- Included
- Free with ads
- Rent
- Buy

Providers already configured by the user appear first.

### Actions

- Add to list
- Mark watched
- Share

---

# Search

## Purpose

Search is for intentional retrieval.

Unlike Discover, Search does **not** attempt to recommend.

It helps users quickly find what they already have in mind.

## Search behavior

Search ignores discovery filters.

Searching for "The Godfather" should always return The Godfather.

Instead of filtering results, Search annotates them.

Each result can show:

- Compatibility with active maturity profile
- Availability
- List membership

Search answers:

> "What is this?"

Discover answers:

> "What should I watch?"

## Search landing page

Before typing:

- Recent searches
- Recently viewed titles

Future versions may include:

- Suggested searches

## Results

Unlike Discover's carousels, Search uses a vertical list.

Each result shows:

- Poster
- Title
- Year
- Movie or TV show
- Short synopsis
- Rating
- Compatibility
- Availability

This provides enough information to distinguish similar titles.

## Structured results

Search returns different entity types.

### Collections

Examples:

- James Bond Collection
- Harry Potter Collection
- Marvel Cinematic Universe

### Movies & TV Shows

Standard title results.

### People

- Actors
- Directors
- Writers

Future versions may also return:

- Lists
- Studios
- Genres

Searching for "James Bond" should prioritize the collection rather than listing twenty-five movies individually.

---

# Settings

## Purpose

Settings contains permanent user configuration.

Instead of one long scrolling page, Settings acts as an index.

Every item opens its own dedicated screen.

This improves navigation while allowing deep links from elsewhere in the application.

---

## Settings home

The Settings index should summarize the current state.

### Watching

**Streaming services**

Netflix • Disney+ • Prime Video

**Maturity profiles**

Me • Family • Kids

**My Lists**

5 lists • 2 shared

### Account

**Profile**

Alex

**Recovery token**

Configured

### General

- About
- Privacy
- Language

Each row opens its own page.

---

## Profile

Contains:

- Display name
- Recovery token
- Copy token
- Restore profile
- Create new profile

The recovery token is explained as a backup mechanism rather than a login.

---

## Streaming services

Users select the services they subscribe to.

Examples:

- Netflix
- Disney+
- Prime Video
- Apple TV+
- Max
- Filmin

These services influence:

- Discover
- Availability
- Ranking

---

## Maturity profiles

Users may define multiple profiles.

Examples:

- Me
- Family
- With kids
- Adults

Each profile contains limits for every maturity category.

Users can:

- Create
- Edit
- Duplicate
- Rename
- Delete

One profile can be marked as default.

The active profile is selected from Discover.

---

## Profile editor

Each category exposes a simple maximum intensity.

Example:

### Violence

- None
- Mild
- Moderate
- Strong
- Any

The same applies to every supported maturity category.

---

## My Lists

This page manages user lists.

Capabilities:

- Create
- Rename
- Share
- Import
- Delete
- Leave shared list

Opening a list shows its contents.

Unlike the original proposal, this page is **not** a primary navigation destination.

Lists are managed here but primarily consumed from Discover.

---

# Deep linking

One benefit of Settings acting as an index is direct navigation.

Examples:

**No streaming services configured**

→ Settings → Streaming services

**Movie exceeds current profile**

→ Settings → Maturity profiles → Family

**Manage lists**

→ Settings → My Lists

Deep links should be used throughout the application whenever users need to change permanent preferences.

---

# Navigation summary

## Discover

- Discovery filters
- From your lists
- Recommendation rows
- Movie details

## Search

- Recent searches
- Search results
- Collections
- Movie details

## Settings

- Profile
- Recovery token
- Streaming services
- Maturity profiles
- My Lists
- About

---

# Future opportunities

The architecture intentionally leaves room for future expansion.

Potential additions include:

- Mood-based discovery
- "Watching with..." recommendations
- Public curated lists
- Collaborative lists
- Friends
- Notifications
- AI-powered recommendations
- Better availability filters
- Watch history
- Recommendation explanations

None of these require changes to the primary navigation.

---

# Product summary

The redesigned Ohana experience revolves around three simple user intentions.

## Discover

> Help me decide what to watch.

Preference-aware recommendations powered by streaming availability and maturity profiles.

## Search

> Help me find something specific.

Fast, comprehensive search that always returns relevant titles while still showing compatibility and availability.

## Settings

> Help me configure Ohana.

A clean settings hub that summarizes the user's configuration and links to dedicated pages for streaming services, maturity profiles, lists and account settings.

---

The biggest conceptual change in this redesign is treating **lists as part of discovery rather than as a separate destination**.

Instead of maintaining two parallel browsing experiences, users first see content they've already saved through **From your lists**, then naturally continue exploring new recommendations.

The navigation is now organized around user intent:

- **Discover** → *I don't know what to watch yet.*
- **Search** → *I know what I'm looking for.*
- **Settings** → *I want to configure Ohana.*

Every design decision should support a single guiding principle:

> **Help people confidently choose the right movie or TV show for the moment, while respecting who they're watching with.**
