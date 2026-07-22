<template>
  <Teleport to="body">
    <Transition name="modal-pop">
      <div class="modal-backdrop" @click.self="emit('close')" v-if="movie">
        <div
          ref="dialogRef"
          class="modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          @keydown="handleDialogKeydown"
        >
        <!-- Desktop: button sits to the left of the poster, outside it -->
        <button class="modal-close modal-close--desktop" @click="emit('close')" aria-label="Close movie details">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div class="modal-poster">
          <img v-if="movie.p" :src="movie.p.replace('w342', 'w500')" :alt="movie.t" />
          <div v-else class="modal-poster-placeholder" :style="{ background: movie._mockColor || '#16161f' }">
            <span>{{ movie.t }}</span>
          </div>
          <!-- Mobile: button overlaps the poster -->
          <button class="modal-close modal-close--mobile" @click="emit('close')" aria-label="Close movie details">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-meta">
            <span class="modal-year">{{ movie.y }}</span>
            <span class="modal-rating">★ {{ movie.r?.toFixed(1) }}</span>
            <a
              v-if="movie.id"
              :href="`https://www.imdb.com/title/${movie.id}/`"
              target="_blank"
              rel="noopener"
              class="imdb-link"
              title="View on IMDb"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" class="imdb-logo" />
            </a>

            <a
              v-if="extraDetails?.tmdbUrl"
              :href="extraDetails.tmdbUrl"
              target="_blank"
              rel="noopener"
              class="ext-site-link"
              title="View on TMDB"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Tmdb.new.logo.svg" alt="TMDB" class="imdb-logo" />
            </a>

            <a v-if="movie.ts || movie.t"
              :href="`https://www.filmaffinity.com/es/search.php?stype=title&stext=${encodeURIComponent(movie.ts || movie.t)}`"
              target="_blank"
              rel="noopener"
              class="ext-site-link"
              title="Ver en FilmAffinity"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/FilmAffinity_logo.svg" alt="FilmAffinity" class="imdb-logo" />
            </a>
            <UiBadge v-if="movie.s" tone="success">TV Season</UiBadge>
          </div>
          <h2 :id="titleId" class="modal-title">{{ movie.t }}</h2>

          <div class="modal-genres">
            <UiBadge v-for="g in genreLabels" :key="g">{{ g }}</UiBadge>
          </div>

          <div v-if="profileCompatibilityGlance.length" class="profile-glance" aria-label="Suitability across profiles">
            <button
              v-for="profile in profileCompatibilityGlance"
              :key="profile.id"
              type="button"
              class="profile-glance-pill"
              :class="[
                profile.fits ? 'profile-glance-pill--ok' : 'profile-glance-pill--warn',
                { 'is-selected': profile.id === selectedDetailProfileId },
              ]"
              :aria-pressed="profile.id === selectedDetailProfileId ? 'true' : 'false'"
              @click="selectedDetailProfileId = profile.id"
            >
              {{ profile.label }} {{ profile.fits ? '✓' : '!' }}
            </button>
          </div>

          <section v-if="compatibilityRows.length" class="compatibility-summary" aria-labelledby="maturity-section-label">
            <div class="compatibility-summary-head">
              <div>
                <p id="maturity-section-label" class="modal-section-label">Compatible with: <strong>{{ selectedDetailProfileName }}</strong></p>
                <p class="compatibility-subcopy">Movie score vs. this profile’s allowed level.</p>
              </div>
              <div class="compatibility-actions">
                <UiBadge v-if="movie.mpa" tone="gold">{{ movie.mpa }}</UiBadge>
                <span class="compatibility-pill" :class="compatibilityOk ? 'compatibility-pill--ok' : 'compatibility-pill--warn'">
                  {{ hasSelectedMaturityLimits ? (compatibilityOk ? 'Fits selected profile' : 'Review before watching') : 'No limit set' }}
                </span>
                <a
                  v-if="movie.id"
                  :href="`https://www.imdb.com/title/${movie.id}/parentalguide`"
                  target="_blank" rel="noopener"
                  class="mat-ext-link"
                  title="IMDb Parents Guide"
                >IMDb guide</a>
                <a
                  v-if="extraDetails?.csm"
                  :href="'https://www.commonsensemedia.org'+extraDetails.csm"
                  target="_blank" rel="noopener"
                  class="mat-ext-link mat-ext-link--csm"
                  title="Common Sense Media review"
                >CSM</a>
                <a
                  v-else
                  :href="'https://www.commonsensemedia.org/search/category/movie/sort/score-desc/'+movie.t"
                  target="_blank" rel="noopener"
                  class="mat-ext-link mat-ext-link--csm"
                  title="Common Sense Media review"
                >CSM</a>
              </div>
            </div>
            <div class="compatibility-grid">
              <div
                v-for="row in compatibilityRows"
                :key="row.key"
                class="compatibility-row"
                :class="{ exceeded: row.exceeded, unknown: row.unknown }"
              >
                <div class="compatibility-row-title">
                  <span>{{ row.label }}</span>
                  <strong v-if="row.hasMovieScore" class="score-fraction" :aria-label="`${row.scoreCurrent} out of 5`">
                    <span class="score-current">{{ row.scoreCurrent }}</span><span class="score-slash">/</span><span class="score-max">5</span>
                  </strong>
                  <strong v-else>Unknown</strong>
                </div>
                <div class="compatibility-row-meter" aria-hidden="true">
                  <div class="mat-score-bar-wrap">
                    <div
                      v-if="row.hasMovieScore"
                      class="mat-score-bar"
                      :class="row.scoreClass"
                      :style="{ width: row.scoreWidth }"
                    ></div>
                    <div
                      v-if="row.hasLimit"
                      class="mat-limit-marker"
                      :style="{ left: row.limitPosition }"
                      :title="row.limitLabel"
                    ></div>
                  </div>
                </div>
                <div class="compatibility-row-detail">
                  <strong>{{ row.statusLabel }}</strong>
                  <small>{{ row.allowedDetail }}</small>
                  <div v-if="row.supportTags.length" class="compatibility-tags" :aria-label="`${row.label} details`">
                    <span v-for="tag in row.supportTags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section v-else-if="profileCompatibilityGlance.length" class="compatibility-summary compatibility-summary--empty" aria-labelledby="maturity-section-label">
            <div class="compatibility-summary-head">
              <p id="maturity-section-label" class="modal-section-label">Compatible with: <strong>{{ selectedDetailProfileName }}</strong></p>
              <div class="compatibility-actions">
                <UiBadge v-if="movie.mpa" tone="gold">{{ movie.mpa }}</UiBadge>
                <span class="compatibility-pill compatibility-pill--warn">Unknown</span>
                <a
                  v-if="movie.id"
                  :href="`https://www.imdb.com/title/${movie.id}/parentalguide`"
                  target="_blank" rel="noopener"
                  class="mat-ext-link"
                  title="IMDb Parents Guide"
                >IMDb guide</a>
                <a
                  :href="extraDetails?.csm ? 'https://www.commonsensemedia.org'+extraDetails.csm : 'https://www.commonsensemedia.org/search/category/movie/sort/score-desc/'+movie.t"
                  target="_blank" rel="noopener"
                  class="mat-ext-link mat-ext-link--csm"
                  title="Common Sense Media review"
                >CSM</a>
              </div>
            </div>
            <p class="compatibility-empty-copy">Suitability scores are not available for this title. Use the parental-guide links if you need more confidence.</p>
          </section>

          <!-- Synopsis -->
          <div class="modal-synopsis" v-if="synopsis || genreLabels.length">
            <p class="synopsis-text">
              <span v-if="synopsis">{{ synopsis }}</span>
              <span v-if="genreLabels.length" class="synopsis-genres">{{ genreLabels.map(g => '#' + g.toLowerCase().replace(/\s+/g, '')).join(' ') }}</span>
            </p>
          </div>

          <div v-if="apiDetailLoading" class="api-detail-status">Loading Ohana detail…</div>
          <div v-else-if="apiDetailError" class="api-detail-status api-detail-status--error">{{ apiDetailError }}</div>

          <section v-if="apiCastPreview.length" class="api-detail-section" aria-labelledby="api-cast-label">
            <p id="api-cast-label" class="modal-section-label">Cast</p>
            <div class="api-cast-list">
              <div v-for="person in apiCastPreview" :key="person.id" class="api-cast-person">
                <strong>{{ person.name }}</strong>
                <span v-if="person.roles.length">{{ person.roles.join(', ') }}</span>
              </div>
            </div>
          </section>

          <section v-if="apiCollectionItems.length" class="api-detail-section" aria-labelledby="api-collection-label">
            <p id="api-collection-label" class="modal-section-label">{{ apiDetail.collection.name }}</p>
            <div class="api-collection-list">
              <a
                v-for="item in apiCollectionItems"
                :key="item.id"
                class="api-collection-item"
                :href="item.imdbId ? `https://www.imdb.com/title/${item.imdbId}/` : undefined"
                :target="item.imdbId ? '_blank' : undefined"
                :rel="item.imdbId ? 'noopener' : undefined"
              >
                <img v-if="item.posterUrl" :src="item.posterUrl" :alt="`${item.title} poster`" loading="lazy" />
                <span v-else class="api-collection-poster-fallback" aria-hidden="true"></span>
                <span class="api-collection-copy">
                  <strong>{{ item.title }}</strong>
                  <small v-if="item.year">{{ item.year }}</small>
                </span>
              </a>
            </div>
          </section>

          <section v-if="apiSeasonSummary" class="api-detail-section api-season-section" aria-labelledby="api-seasons-label">
            <div class="api-season-head">
              <div>
                <p id="api-seasons-label" class="modal-section-label">Seasons</p>
                <p class="api-season-summary">{{ apiSeasonSummary }}</p>
              </div>
              <button
                v-if="hasHiddenApiSeasons"
                type="button"
                class="api-season-toggle"
                @click="showAllApiSeasons = !showAllApiSeasons"
              >
                {{ showAllApiSeasons ? 'Show fewer' : `Show all ${apiSeasons.length}` }}
              </button>
            </div>
            <div v-if="visibleApiSeasons.length" class="api-season-list">
              <article
                v-for="season in visibleApiSeasons"
                :key="season.id"
                class="api-season-card"
                :class="{ 'api-season-card--specials': season.isSpecials }"
              >
                <img v-if="season.posterUrl" :src="season.posterUrl" :alt="`${season.title} poster`" loading="lazy" />
                <span v-else class="api-season-poster-fallback" aria-hidden="true"></span>
                <div class="api-season-copy">
                  <div class="api-season-title-row">
                    <strong>{{ seasonDisplayTitle(season) }}</strong>
                    <small v-if="season.year || season.airDate">{{ season.year || season.airDate }}</small>
                  </div>
                  <p class="api-season-meta">{{ seasonMeta(season) }}</p>
                  <p v-if="season.overview" class="api-season-overview">{{ season.overview }}</p>
                </div>
              </article>
            </div>
          </section>

          <!-- User actions (watched + lists) -->
          <div v-if="userStore.isLoggedIn" class="modal-user-actions">
            <div class="user-actions-row">
              <UiChip
                size="sm"
                tone="safe"
                :active="userStore.isWatched(movie.id)"
                @click="userStore.toggleWatched(movie.id)"
              >
                {{ userStore.isWatched(movie.id) ? "✓ Watched" : "Mark watched" }}
              </UiChip>

              <UiChip
                v-for="list in userStore.lists"
                :key="list.token"
                size="sm"
                tone="safe"
                :active="userStore.isInList(list.token, movie.id)"
                :label="list.name"
                @click="userStore.toggleMovieInList(list.token, movie.id)"
              />

              <span v-if="!userStore.lists.length" class="no-lists-hint">No lists yet — create one in Settings</span>
            </div>
          </div>

          <!-- Community review excerpts from IMDb, when fetched. Score/evidence rows live in the main maturity section above. -->
          <details class="modal-maturity" v-if="matReviewsLoading || matReviewsError || matReviewCategories.length">
            <summary class="mat-header">
              <p class="modal-section-label">Community parental reviews</p>
              <div class="mat-links">
                <UiBadge v-if="movie.mpa" tone="gold">{{ movie.mpa }}</UiBadge>
              </div>
            </summary>

            <!-- Community review excerpts from IMDb (collapsed per category) -->
            <div v-if="matReviewsLoading" class="mat-loading"><!--Loading community reviews…--></div>
            <div v-else-if="matReviewsError" class="mat-loading mat-error">{{ matReviewsError }}</div>
            <div v-else-if="matReviewCategories.length" class="mat-items-list">
              <details
                v-for="cat in matReviewCategories"
                :key="cat.key"
                class="mat-cat-block"
              >
                <summary class="mat-cat-title">
                  {{ cat.label }}
                  <span v-if="cat.items.length" class="mat-count">{{ cat.items.length }} reviews</span>
                </summary>
                <ul v-if="cat.items.length" class="mat-items">
                  <li v-for="(item, i) in cat.items.slice(0, 5)" :key="i">{{ item }}</li>
                </ul>
                <p v-else class="mat-no-reviews">No community reviews for this category</p>
              </details>
            </div>
          </details>

          <div class="modal-providers" v-if="providerNames.length || userStore.isLoggedIn">
            <div class="providers-head">
              <div>
                <p class="modal-section-label">Where to watch</p>
                <p class="availability-source">{{ availabilityContextCopy }}</p>
              </div>
              <RouterLink v-if="availabilityDetail.action" to="/settings/streaming">Set services</RouterLink>
            </div>
            <div v-if="providerNames.length" class="provider-list" aria-label="Streaming availability">
              <a v-for="p in providerNames" target="_blank" rel="noopener" :key="p" :href="providerWatchUrl" class="provider-chip">{{ p }}</a>
            </div>
            <div v-if="resolvedCustomProviders.length" class="provider-custom-row" aria-label="Custom provider searches">
              <span class="provider-custom-row__label">Custom searches</span>
              <div class="provider-list provider-list--custom">
                <a
                  v-for="cp in resolvedCustomProviders"
                  :key="cp.urlTemplate"
                  :href="cp.url"
                  target="_blank"
                  rel="noopener"
                  class="provider-chip provider-chip--custom"
                  :title="cp.urlTemplate"
                >{{ cp.domain }}</a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import { GENRES, PROVIDERS, useMovieStore } from "@/stores/movies.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS, getScore, scoreCssClass } from "@/maturity.js";
import { useUserStore } from "@/stores/user.js";
import { lockBodyScroll, unlockBodyScroll, trapTabKey } from "@/composables/modalGuards.js";
import { profileById, profileLabel } from "@/lib/maturityProfiles.js";
import { AVAILABILITY_CONTEXT_COPY } from "@/lib/availabilityContext.js";
import { resolveCustomProviders } from "@/lib/customProviders.js";
import { fetchOhanaTitleDetail, getOhanaApiConfig } from "@/lib/ohanaApi.js";
import UiBadge from "@/components/UiBadge.vue";
import UiChip from "@/components/UiChip.vue";

const userStore = useUserStore();
const movieStore = useMovieStore();

const props = defineProps({ movie: { type: Object, default: null } });
const emit = defineEmits(["close"]);

const dialogRef = ref(null);
const previouslyFocused = ref(null);
const selectedDetailProfileId = ref(movieStore.activeMaturityProfileId);
const availabilityContextCopy = AVAILABILITY_CONTEXT_COPY;
let bodyLocked = false;
let apiLoadToken = 0;

const titleId = computed(() => props.movie?.id ? `movie-dialog-title-${props.movie.id}` : "movie-dialog-title");
const selectedDetailProfile = computed(() => profileById(movieStore.maturityProfiles, selectedDetailProfileId.value));
const selectedDetailProfileName = computed(() => profileLabel(movieStore.maturityProfiles, selectedDetailProfileId.value));
const selectedMaturityValues = computed(() => selectedDetailProfile.value?.values ?? movieStore.maxMaturityCat);
const hasSelectedMaturityLimits = computed(() => selectedMaturityValues.value.some(v => v >= 0));
const compatibilityRows = computed(() => {
  if (props.movie?.mat === undefined) return [];
  return MATURITY_CATEGORIES.map((cat, i) => {
    const allowed = selectedMaturityValues.value[i];
    const noLimit = allowed < 0;
    const rawScore = getScore(props.movie.mat, cat.shift);
    const hasMovieScore = Number.isFinite(rawScore);
    const movieScore = hasMovieScore ? rawScore : null;
    const roundedScore = hasMovieScore ? Math.round(rawScore) : null;
    const movieLabel = hasMovieScore ? SEVERITY_LABELS[roundedScore] || "Unknown" : "Unknown";
    const supportTags = (extraDetails.value?.tags?.[TAG_KEYS[cat.key]] || [])
      .slice(0, 4)
      .map(tag => tag.replaceAll('_', ' ').toLowerCase());
    const unknown = !hasMovieScore;
    const exceeded = !noLimit && hasMovieScore && roundedScore > allowed;
    const allowedLabel = noLimit ? "No limit set" : `Allowed ${allowed} (${(SEVERITY_LABELS[allowed] || "Any").toLowerCase()})`;
    const limitPosition = noLimit ? null : `${Math.max(0, Math.min(100, (allowed / 5) * 100))}%`;
    return {
      key: cat.key,
      label: cat.label,
      hasMovieScore,
      movieScore,
      scoreCurrent: hasMovieScore ? formatScore(rawScore) : null,
      scoreWidth: hasMovieScore ? `${Math.max(5, Math.min(100, (rawScore / 5) * 95 + 5))}%` : "0%",
      scoreClass: hasMovieScore ? scoreCssClass(roundedScore) : "sev-nan",
      movieLabel,
      allowedLabel,
      allowedDetail: noLimit ? `${movieLabel} · No limit set` : `${movieLabel} · ${allowedLabel}`,
      limitLabel: noLimit ? "No limit set" : `Profile limit: ${allowed}/5`,
      limitPosition,
      hasLimit: !noLimit,
      statusLabel: unknown ? "Unknown" : noLimit ? "No limit set" : exceeded ? "Exceeds profile" : "Fits profile",
      supportTags,
      unknown,
      exceeded,
    };
  });
});
const compatibilityOk = computed(() => compatibilityRows.value.length > 0 && compatibilityRows.value.every(row => !row.exceeded && !row.unknown));
function profileFitsMovie(profile) {
  if (!profile?.values?.some(v => v >= 0)) return true;
  if (props.movie?.mat === undefined) return false;
  return profile.values.every((allowed, i) => {
    if (allowed < 0) return true;
    const rawScore = getScore(props.movie.mat, MATURITY_CATEGORIES[i].shift);
    const movieScore = Number.isFinite(rawScore) ? Math.round(rawScore) : 6;
    return movieScore <= allowed;
  });
}

const profileCompatibilityGlance = computed(() => {
  return movieStore.maturityProfiles
    .slice(0, 5)
    .map(profile => ({
      id: profile.id,
      label: profile.label,
      fits: profileFitsMovie(profile),
    }));
});

function focusDialog() {
  dialogRef.value?.focus({ preventScroll: true });
}

function handleDialogKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }
  trapTabKey(event, dialogRef.value);
}

function restoreFocus() {
  previouslyFocused.value?.focus?.({ preventScroll: true });
  previouslyFocused.value = null;
}

// ─── Extra Data Lookup Management ───────────────────────────────────────────
// Holds the parsed key-value dictionary from extra.json
const extraTable = ref({}); 
const extraLoaded = ref(false);

async function loadExtraJsonData() {
  if (extraLoaded.value) return; // Prevent multiple global fetches
  try {
    // extra.json is optional enrichment. Static hosts may serve index.html for
    // missing files, so verify the response before attempting JSON parsing.
    const res = await fetch("/extra.json", { headers: { Accept: "application/json" } });
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      extraTable.value = {};
      extraLoaded.value = true;
      return;
    }

    const data = await res.json();
    extraTable.value = data && typeof data === "object" ? data : {};
  } catch {
    extraTable.value = {};
  } finally {
    extraLoaded.value = true;
  }
}

// Automatically resolve details matching the current active movie ID
const extraDetails = computed(() => {
  if (!props.movie?.id || !extraLoaded.value) return null;
  return extraTable.value[props.movie.id] || null;
});

// Fallback cascade logic for handling overview
const synopsis = computed(() => {
  if (!props.movie) return null;
  if (apiDetail.value?.overview) return apiDetail.value.overview;
  // 1. Check if the active movie element already contains an overview variant
  if (props.movie.overviewEs || props.movie.overviewEn) {
    return props.movie.overviewEs || props.movie.overviewEn;
  }
  // 2. Return the pre-scraped English synopsis retrieved from our table
  return extraDetails.value?.synopsisEn || null;
});

// ─── Ohana API title detail enrichment ───────────────────────────────────────
const apiDetail = ref(null);
const apiDetailLoading = ref(false);
const apiDetailError = ref(null);
const apiConfig = getOhanaApiConfig();
const showAllApiSeasons = ref(false);

const apiCastPreview = computed(() => apiDetail.value?.cast?.slice(0, 6) || []);
const apiCollectionItems = computed(() => apiDetail.value?.collection?.items || []);
const apiSeasons = computed(() => apiDetail.value?.seasons || []);
const regularApiSeasons = computed(() => apiSeasons.value.filter(season => !season.isSpecials));
const apiSeasonSummary = computed(() => {
  const count = apiDetail.value?.seasonCount;
  if (!count && !apiSeasons.value.length) return null;
  const seasonLabel = count === 1 ? "1 season" : `${count || apiSeasons.value.length} seasons`;
  const listState = apiSeasons.value.length
    ? `${apiSeasons.value.length} listed by Ohana API${count && apiSeasons.value.length < count ? " so far" : ""}`
    : "season list unavailable";
  return `${seasonLabel}; ${listState}.`;
});
const visibleApiSeasons = computed(() => {
  if (!apiSeasons.value.length) return [];
  if (showAllApiSeasons.value || apiSeasons.value.length <= 4) return apiSeasons.value;
  const firstRegular = regularApiSeasons.value.slice(0, 4);
  return firstRegular.length ? firstRegular : apiSeasons.value.slice(0, 4);
});
const hasHiddenApiSeasons = computed(() => apiSeasons.value.length > visibleApiSeasons.value.length || (showAllApiSeasons.value && apiSeasons.value.length > 4));

function seasonDisplayTitle(season) {
  if (season.isSpecials) return "Specials";
  return season.title || (season.seasonNumber ? `Season ${season.seasonNumber}` : "Season");
}

function seasonMeta(season) {
  const parts = [];
  if (season.episodeCount) parts.push(`${season.episodeCount} episode${season.episodeCount === 1 ? "" : "s"}`);
  if (season.isSpecials) parts.push("bonus material");
  return parts.join(" · ") || "Season details from Ohana API";
}

async function loadApiDetail(movie) {
  const token = ++apiLoadToken;
  apiDetail.value = null;
  apiDetailError.value = null;
  showAllApiSeasons.value = false;
  if (!movie?.id) return;

  apiDetailLoading.value = true;
  try {
    const detail = await fetchOhanaTitleDetail(movie.id);
    if (token !== apiLoadToken) return;
    apiDetail.value = detail;
  } catch (e) {
    if (token !== apiLoadToken) return;
    apiDetailError.value = "Ohana detail unavailable; showing static info.";
    console.warn(`Ohana API detail fetch failed from ${apiConfig.baseUrl}:`, e.message);
  } finally {
    if (token === apiLoadToken) apiDetailLoading.value = false;
  }
}

// ─── IMDb community reviews (raw text only — no severity computed in browser) ─
const matReviews        = ref(null);
const matReviewsLoading = ref(false);
const matReviewsError   = ref(null);

// Only the 4 CSM categories we track — no FRIGHTENING
const REVIEW_CATS = [
  { key: "SEXUAL_CONTENT", label: "Sex & Nudity" },
  { key: "VIOLENCE",       label: "Violence" },
  { key: "PROFANITY",      label: "Language" },
  { key: "ALCOHOL_DRUGS",  label: "Drugs" },
];

const matReviewCategories = computed(() => {
  if (!matReviews.value) return [];
  const items = matReviews.value.parentsGuide;
  if (!Array.isArray(items)) return [];
  const byCat = Object.fromEntries(items.filter(e => e.category).map(e => [e.category, e]));
  return REVIEW_CATS.map(({ key, label }) => {
    const entry   = byCat[key] ?? null;
    const reviews = (entry?.reviews ?? []).map(r => r.text).filter(Boolean);
    return { key, label, items: reviews };
  }).filter(cat => cat.items.length > 0);
});

// Maps a maturity category key to its corresponding extraDetails.tags key
const TAG_KEYS = {
  sex: "SEXUAL_CONTENT",
  violence: "VIOLENCE",
  language: "PROFANITY",
  drugs: "ALCOHOL_DRUGS",
};

function formatScore(raw) {
  if (raw === null || raw === undefined || Number.isNaN(raw)) return '?';
  return raw.toFixed(1);
}

async function loadReviews(imdbId) {
  matReviews.value = null;
  matReviewsError.value = null;
  if (!imdbId) return;
  matReviewsLoading.value = true;
  try {
    const res = await fetch(`https://api.imdbapi.dev/titles/${imdbId}/parentsGuide`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    matReviews.value = await res.json();
  } catch (e) {
    matReviewsError.value = "Could not load community reviews.";
    console.warn("parentsGuide fetch failed:", e.message);
  } finally {
    matReviewsLoading.value = false;
  }
}

// ─── Derived display data ─────────────────────────────────────────────────────
const genreLabels = computed(() => {
  if (!props.movie) return [];
  return Object.entries(GENRES)
    .filter(([, mask]) => props.movie.g & mask)
    .map(([name]) => name);
});

const providerNames = computed(() => {
  if (!props.movie) return [];
  return PROVIDERS
    .filter(p => props.movie.prov & p.bit)
    .sort((a, b) => Number(Boolean(movieStore.selectedProviders & b.bit)) - Number(Boolean(movieStore.selectedProviders & a.bit)))
    .map(p => p.name);
});
const providerWatchUrl = computed(() => extraDetails.value?.tmdbUrl ? `${extraDetails.value.tmdbUrl}/watch` : `https://www.themoviedb.org/search?query=${encodeURIComponent(props.movie?.t || "")}`);

const availabilityDetail = computed(() => {
  if (!props.movie?.prov && !resolvedCustomProviders.value.length) return { action: true };
  if (!movieStore.selectedProviders) return { action: true };
  const selectedNames = PROVIDERS
    .filter(p => movieStore.selectedProviders & p.bit)
    .map(p => p.name);
  const configured = providerNames.value.filter(name => selectedNames.includes(name));
  return { action: !configured.length };
});

// ─── Custom providers ─────────────────────────────────────────────────────────
const resolvedCustomProviders = computed(() => resolveCustomProviders(userStore.userData?.customProviders ?? [], props.movie));

// ─── Watch for movie changes ──────────────────────────────────────────────────
watch(() => props.movie, (movie) => {
  if (movie) {
    selectedDetailProfileId.value = movieStore.activeMaturityProfileId;
    if (!bodyLocked) {
      previouslyFocused.value = document.activeElement;
      lockBodyScroll();
      bodyLocked = true;
    }
    //loadSynopsis(movie);
    loadExtraJsonData()
    loadApiDetail(movie);
    //loadReviews(movie.id);
    nextTick(focusDialog);
  } else {
    //synopsis.value = null;
    matReviews.value = null;
    matReviewsError.value = null;
    apiLoadToken += 1;
    apiDetail.value = null;
    apiDetailLoading.value = false;
    apiDetailError.value = null;
    if (bodyLocked) {
      unlockBodyScroll();
      bodyLocked = false;
    }
    nextTick(restoreFocus);
  }
}, { immediate: true });

onUnmounted(() => {
  if (bodyLocked) unlockBodyScroll();
});
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--background, #0b0b0e);
  z-index: 100;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.15s ease;
  overflow: hidden;
  overscroll-behavior: contain;
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.24s ease;
}

.modal-pop-enter-active .modal,
.modal-pop-leave-active .modal {
  transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
}

.modal-pop-enter-from .modal,
.modal-pop-leave-to .modal {
  opacity: 0.96;
  transform: translateY(96px);
}

@media (prefers-reduced-motion: reduce) {
  .modal-pop-enter-active,
  .modal-pop-leave-active,
  .modal-pop-enter-active .modal,
  .modal-pop-leave-active .modal {
    transition: none;
  }
}

.modal {
  background: var(--background, #0b0b0e);
  border: none;
  border-radius: 0;
  max-width: 900px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  gap: 24px;
  padding: 32px 24px 56px 24px;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  outline: none;
}

.modal-close {
  background: transparent;
  border: none;
  padding: 0;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, opacity 0.15s, background 0.15s;
}
.modal-close svg { width: 20px; height: 20px; }

/* Desktop: sits to the left of the poster, bare arrow */
.modal-close--desktop {
  position: sticky;
  top: 24px;
  align-self: flex-start;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.modal-close--desktop:hover { opacity: 0.7; transform: translateX(-3px); }

/* Mobile: hidden by default, shown in media query */
.modal-close--mobile {
  display: none;
  position: absolute;
  top: 8px;
  left: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.12) !important;
  z-index: 2;
}
.modal-close--mobile svg { width: 14px; height: 14px; }
.modal-close--mobile:hover { background: rgba(0,0,0,0.8); }

.modal-poster {
  flex-shrink: 0;
  width: 140px;
  height: 210px;
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
  align-self: flex-start;
}
.modal-poster img { width: 100%; height: 100%; object-fit: cover; }
.modal-poster-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: flex-end; padding: 10px;
  font-family: var(--font-display);
  font-size: 14px; color: rgba(255,255,255,0.7);
}

.modal-body { flex: 1; min-width: 0; }

.modal-meta {
  display: flex; gap: 12px; align-items: center;
  margin-bottom: 8px; flex-wrap: wrap;
}
.modal-year { font-size: 13px; color: var(--muted); }
.modal-rating { font-size: 14px; font-weight: 500; color: var(--gold); }
.imdb-link,
.ext-site-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 34px;
  padding: 5px 4px;
  text-decoration: none;
}
.imdb-logo { height: 18px; width: auto; border-radius: 2px; }

.modal-title {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 0.04em;
  line-height: 1.1;
  margin-bottom: 14px;
}

.modal-genres {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 18px;
}
/* The top genre block (above synopsis) is now hidden — genres shown inline as hashtags */
.modal-body > .modal-genres { display: none; }
.genre-chip--alt {
  background: var(--surface);
  border-color: transparent;/**/
}

/* ── Synopsis ── */
.modal-synopsis { margin-bottom: 18px; }
.synopsis-loading { font-size: 13px; color: var(--muted); font-style: italic; }
.synopsis-text {
  font-size: 14px;
  color: rgba(255,255,255,0.78);
  line-height: 1.6;
  margin: 0;
}
.synopsis-genres {
  display: inline;
  margin-left: 6px;
  font-size: 12px;
  color: var(--muted);
  /*opacity: 0.6;*/
  letter-spacing: 0.01em;
}

.api-detail-status {
  margin: -4px 0 18px;
  color: var(--muted);
  font-size: 12px;
}
.api-detail-status--error { color: rgba(248,113,113,0.72); }
.api-detail-section { margin-bottom: 18px; }
.api-cast-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 9px;
}
.api-cast-person {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  background: rgba(255,255,255,0.035);
}
.api-cast-person strong,
.api-cast-person span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.api-cast-person strong { color: var(--white); font-size: 12px; }
.api-cast-person span { margin-top: 3px; color: var(--muted); font-size: 11px; }
.api-collection-list {
  display: flex;
  gap: 8px;
  margin-top: 9px;
  overflow-x: auto;
  scrollbar-width: none;
  overscroll-behavior-inline: contain;
}
.api-collection-list::-webkit-scrollbar { display: none; }
.api-collection-item {
  flex: 0 0 118px;
  color: var(--white);
  text-decoration: none;
}
.api-collection-item img,
.api-collection-poster-fallback {
  display: block;
  width: 64px;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  object-fit: cover;
  background: var(--surface3);
}
.api-collection-copy {
  display: grid;
  gap: 2px;
  margin-top: 6px;
}
.api-collection-copy strong,
.api-collection-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.api-collection-copy strong { font-size: 11px; }
.api-collection-copy small { color: var(--muted); font-size: 10px; }

.api-season-section { margin-top: 2px; }
.api-season-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.api-season-summary {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
}
.api-season-toggle {
  flex: 0 0 auto;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
  background: rgba(255,255,255,0.045);
  color: var(--white);
  padding: 6px 10px;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.api-season-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}
.api-season-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 10px;
  padding: 9px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.035);
}
.api-season-card--specials { opacity: 0.78; }
.api-season-card img,
.api-season-poster-fallback {
  width: 44px;
  aspect-ratio: 2 / 3;
  border-radius: 7px;
  object-fit: cover;
  background: var(--surface3);
}
.api-season-copy { min-width: 0; }
.api-season-title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.api-season-title-row strong,
.api-season-title-row small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.api-season-title-row strong { color: var(--white); font-size: 12px; }
.api-season-title-row small { flex: 0 0 auto; color: var(--muted); font-size: 10px; }
.api-season-meta,
.api-season-overview {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.35;
}
.api-season-overview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: rgba(255,255,255,0.68);
}

.modal-section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0;
}

/* ── Providers ── */
.modal-providers { margin-bottom: 18px; }
.providers-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.providers-head a {
  color: var(--teal);
  font-size: 11px;
  text-decoration: none;
  white-space: nowrap;
}
.availability-note {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}
.availability-note--ok { color: var(--teal); }
.availability-note--warn { color: #fca5a5; }
.availability-source {
  margin: 4px 0 0;
  color: rgba(240,238,232,0.58);
  font-size: 12px;
  line-height: 1.35;
}
.provider-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.provider-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 12px;
  background: rgba(45,212,191,0.12);
  border: 1px solid rgba(45,212,191,0.25);
  border-radius: 6px;
  font-size: 12px;
  text-decoration: none;
  color: var(--teal);
}

/* ── Custom providers ── */
.provider-custom-row {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.provider-custom-row__label {
  color: rgba(240,238,232,0.56);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.provider-list--custom { margin-top: 0; }
.provider-chip--custom {
  background: rgba(255,255,255,0.045);
  border-color: rgba(255,255,255,0.12);
  color: rgba(240,238,232,0.76);
}

/* ── Supporting parental-guide detail ── */
.modal-maturity { margin-bottom: 18px; }
.modal-maturity:not([open]) { margin-bottom: 12px; }

.mat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  list-style: none;
}
.mat-header::-webkit-details-marker { display: none; }
.modal-maturity:not([open]) .mat-header { margin-bottom: 0; }

.mat-links {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.mat-ext-link {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.mat-ext-link:hover { color: var(--white); border-color: rgba(255,255,255,0.3); }
.mat-ext-link--csm:hover { color: #34d399; border-color: rgba(52,211,153,0.4); }

/* Score grid */
.mat-score-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.mat-score-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mat-score-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mat-score-tags {
  display: flex;
  flex-wrap: nowrap;
  /*justify-content: flex-end;*/
  overflow-x: auto;
  scrollbar-width: none;    /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding-left: 15px;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
}
.mat-score-tags::-webkit-scrollbar { display: none; } /* Chrome/Safari */

.mat-tag {
  font-size: 11px;
  color: var(--muted);
  opacity: 0.9;
  white-space: nowrap;
  flex-shrink: 0;
}
.mat-tag:not(:last-child):not(:first-child)::after {
  content: ", ";
}

.mat-score-name {
  font-size: 12px;
  color: var(--muted);
  min-width: 88px;
  flex-shrink: 0;
}

.mat-score-bar-wrap {
  position: relative;
  flex: 1;
  height: 4px;
  background: var(--surface3);
  border-radius: 99px;
  overflow: visible;
}

.mat-score-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}

.mat-limit-marker {
  position: absolute;
  top: 50%;
  width: 9px;
  height: 9px;
  border: 2px solid rgba(8,8,16,0.92);
  border-radius: 999px;
  background: var(--white);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.52), 0 2px 8px rgba(0,0,0,0.42);
  transform: translate(-50%, -50%);
}

/* Score bar & label colours keyed to 0–5 integer */
.sev-nan { background: grey; }
.sev-0 { background: #4ade80; color: #4ade80; }
.sev-1 { background: #a3e635; color: #a3e635; }
.sev-2 { background: #facc15; color: #facc15; }
.sev-3 { background: #fb923c; color: #fb923c; }
.sev-4 { background: #f87171; color: #f87171; }
.sev-5 { background: #dc2626; color: #dc2626; }

.mat-score-label {
  font-size: 10px;
  color: white;
  text-shadow: 1px black;
  min-width: 90px;
  text-align: center;
  flex-shrink: 0;
}

.mat-score-val {
  font-size: 11px;
  color: var(--muted);
  min-width: 8px;
  text-align: right;
  flex-shrink: 0;
}

/* Community review accordions */
.mat-loading {
  font-size: 12px;
  color: var(--muted);
  padding: 4px 0;
}
.mat-error { color: rgba(248,113,113,0.7); }

.mat-items-list { display: flex; flex-direction: column; gap: 4px; }

.mat-cat-block {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.mat-cat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--white);
  cursor: pointer;
  list-style: none;
  user-select: none;
  background: var(--surface3);
}
.mat-cat-title::-webkit-details-marker { display: none; }
.mat-cat-title::after {
  content: "›";
  margin-left: auto;
  font-size: 16px;
  color: var(--muted);
  transition: transform 0.15s;
}
.mat-cat-block[open] .mat-cat-title::after { transform: rotate(90deg); }

.mat-count {
  font-size: 10px;
  color: var(--muted);
  background: var(--surface2);
  padding: 1px 6px;
  border-radius: 99px;
}

.mat-no-reviews {
  font-size: 11px;
  color: var(--muted);
  padding: 6px 10px;
  opacity: 0.6;
}

.mat-items {
  list-style: none;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.mat-items li {
  font-size: 11px;
  color: var(--muted);
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
  line-height: 1.4;
}
.mat-items li:last-child { border-bottom: none; }

.profile-glance {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0 0 14px;
  padding-bottom: 2px;
}
.profile-glance::-webkit-scrollbar { display: none; }
.profile-glance-pill {
  border: 1px solid transparent;
  font-family: var(--font-body);
  cursor: pointer;
  flex: 0 0 auto;
  min-height: 34px;
  max-width: 128px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.profile-glance-pill:hover,
.profile-glance-pill:focus-visible {
  outline: none;
  border-color: rgba(45,212,191,0.42);
}
.profile-glance-pill.is-selected {
  border-color: rgba(45,212,191,0.5);
  box-shadow: 0 0 0 1px rgba(45,212,191,0.12) inset;
}
.profile-glance-pill--ok { color: var(--teal); background: rgba(45,212,191,0.1); }
.profile-glance-pill--warn { color: #f5c842; background: rgba(245,200,66,0.11); }

/* ── Compatibility summary ── */
.compatibility-summary {
  margin: 14px 0 18px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  background: rgba(255,255,255,0.035);
}
.compatibility-summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.compatibility-summary strong { color: var(--white); }
.compatibility-subcopy {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 12px;
}
.compatibility-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px;
}
.compatibility-pill {
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}
.compatibility-pill--ok { background: rgba(45,212,191,0.12); color: var(--teal); }
.compatibility-pill--warn { background: rgba(245,200,66,0.13); color: #f5c842; }
.compatibility-grid { display: grid; gap: 8px; }
.compatibility-row {
  display: grid;
  grid-template-columns: minmax(112px, 0.75fr) minmax(96px, 1fr) minmax(150px, 1.2fr);
  align-items: center;
  gap: 12px;
  color: rgba(240,238,232,0.82);
  font-size: 12px;
}
.compatibility-row-title,
.compatibility-row-detail {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.compatibility-row-title span { color: var(--white); font-weight: 650; }
.compatibility-row-title strong {
  color: var(--white);
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.02em;
}
.score-fraction {
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  justify-self: end;
  line-height: 1;
}
.score-current {
  font-size: 20px;
}
.score-slash,
.score-max {
  color: rgba(255,255,255,0.72);
  font-size: 13px;
}
.compatibility-row-detail strong { color: var(--teal); font-size: 11px; }
.compatibility-row.exceeded .compatibility-row-detail strong { color: #f5c842; }
.compatibility-row.unknown .compatibility-row-detail strong { color: var(--muted); }
.compatibility-row small { color: var(--teal); }
.compatibility-row.exceeded small { color: #f5c842; }
.compatibility-row.unknown small { color: var(--muted); }
.compatibility-row-meter { min-width: 0; }
.compatibility-empty-copy {
  margin: 0;
  color: rgba(240,238,232,0.76);
  font-size: 12px;
  line-height: 1.45;
}
.compatibility-tags {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}
.compatibility-tags::-webkit-scrollbar { display: none; }
.compatibility-tags span {
  flex: 0 0 auto;
  max-width: 148px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 7px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  color: var(--muted);
  font-size: 10px;
}

/* ── User actions ── */
.modal-user-actions { margin-bottom: 18px; }

.user-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.no-lists-hint {
  font-size: 12px;
  color: var(--muted);
  font-style: italic;
}

/* ── Mobile ── */
@media (max-width: 560px) {
  .modal {
    flex-direction: column;
    padding: calc(48px + env(safe-area-inset-top, 0px)) 16px 40px 16px;
    gap: 16px;
    max-width: none;
  }
  .modal-poster { width: 100%; height: 200px; }
  .modal-poster img { object-position: center top; }
  .modal-close--desktop { display: none; }
  .modal-close--mobile  {
    position: fixed;
    top: calc(10px + env(safe-area-inset-top, 0px));
    left: 12px;
    z-index: 120;
    display: flex;
    width: 44px;
    height: 44px;
    background: rgba(8,8,16,0.82);
    box-shadow: 0 8px 24px rgba(0,0,0,0.32);
  }
  .modal-close--mobile svg { width: 18px; height: 18px; }
  .api-cast-list { grid-template-columns: 1fr; }
  .api-collection-item { flex-basis: 104px; }
  .api-season-head { flex-direction: column; gap: 8px; }
  .api-season-toggle { align-self: flex-start; }
  .compatibility-summary-head { flex-direction: column; }
  .compatibility-actions { justify-content: flex-start; }
  .compatibility-row { grid-template-columns: 1fr; gap: 6px; }
  .compatibility-row-title {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
  }
}
</style>
