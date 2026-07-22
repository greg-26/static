export const DISCOVER_VISIBLE_DEDUPE_SLOTS = 2;

export function stableDiscoverMovieKey(movie) {
  if (movie?.id) return String(movie.id);

  const title = String(movie?.t || movie?.title || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const year = movie?.y || movie?.year || "";
  return `${title}-${year}`;
}

export function diversifyDiscoverRowStarts(rows, visibleSlots = DISCOVER_VISIBLE_DEDUPE_SLOTS) {
  const slotCount = Math.max(1, Number(visibleSlots) || DISCOVER_VISIBLE_DEDUPE_SLOTS);
  const visibleStartKeys = new Set();

  return rows.map((row) => {
    const visibleStart = [];
    const deferred = [];
    const rowStartKeys = new Set();

    for (const movie of row.movies || []) {
      const key = stableDiscoverMovieKey(movie);
      const canFillVisibleSlot = visibleStart.length < slotCount
        && key
        && !visibleStartKeys.has(key)
        && !rowStartKeys.has(key);

      if (canFillVisibleSlot) {
        visibleStart.push(movie);
        rowStartKeys.add(key);
      } else {
        deferred.push(movie);
      }
    }

    // Discover rows are source-deduped only for the poster slots a user sees
    // first. Duplicates from earlier visible starts are pushed deeper whenever
    // enough fresh titles exist; if a row has no fresh alternatives, the
    // duplicate is removed from the visible start rather than pretending we have
    // viewport-level fully-visible tracking. A later MovieRow/IntersectionObserver
    // pass can reuse DISCOVER_VISIBLE_DEDUPE_SLOTS as its default threshold and
    // replace this source-level approximation with measured fully visible cards.
    const movies = visibleStart.length >= slotCount
      ? [...visibleStart, ...deferred]
      : visibleStart;

    for (const movie of movies.slice(0, slotCount)) {
      const key = stableDiscoverMovieKey(movie);
      if (key) visibleStartKeys.add(key);
    }

    return { ...row, movies };
  }).filter((row) => row.movies.length > 0);
}
