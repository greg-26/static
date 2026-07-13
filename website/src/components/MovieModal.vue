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

          <div class="watch-summary">
            <div class="watch-summary-item" :class="suitabilitySummary.className">
              <span>Suitability</span>
              <strong>{{ suitabilitySummary.label }}</strong>
              <RouterLink v-if="suitabilitySummary.action" to="/settings/maturity">Adjust profile</RouterLink>
            </div>
            <div class="watch-summary-item" :class="availabilitySummary.className">
              <span>Availability</span>
              <strong>{{ availabilitySummary.label }}</strong>
              <RouterLink v-if="availabilitySummary.action" to="/settings/streaming">Set services</RouterLink>
            </div>
            <div v-if="listSummary" class="watch-summary-item watch-summary-item--list">
              <span>Lists</span>
              <strong>{{ listSummary }}</strong>
            </div>
          </div>

          <div v-if="compatibilityRows.length" class="compatibility-summary">
            <div class="compatibility-summary-head">
              <p class="modal-section-label">Compatible with: <strong>{{ activeProfileName }}</strong></p>
              <span class="compatibility-pill" :class="compatibilityOk ? 'compatibility-pill--ok' : 'compatibility-pill--warn'">
                {{ compatibilityOk ? 'Fits current limits' : 'Review before watching' }}
              </span>
            </div>
            <div class="compatibility-grid">
              <div v-for="row in compatibilityRows" :key="row.key" class="compatibility-row" :class="{ exceeded: row.exceeded }">
                <div class="compatibility-row-main">
                  <span>{{ row.label }}</span>
                  <strong>{{ row.exceeded ? 'Exceeds profile' : 'Fits profile' }}</strong>
                </div>
                <div class="compatibility-row-detail">
                  <small>{{ row.movieLabel }} ({{ row.movieScore }}/5) · allowed {{ row.allowedLabel }}</small>
                  <div v-if="row.supportTags.length" class="compatibility-tags" :aria-label="`${row.label} details`">
                    <span v-for="tag in row.supportTags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Synopsis -->
          <div class="modal-synopsis" v-if="synopsis || genreLabels.length">
            <p class="synopsis-text">
              <span v-if="synopsis">{{ synopsis }}</span>
              <span v-if="genreLabels.length" class="synopsis-genres">{{ genreLabels.map(g => '#' + g.toLowerCase().replace(/\s+/g, '')).join(' ') }}</span>
            </p>
          </div>

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

          <!-- Supporting parental-guide detail: secondary to the suitability summary above. -->
          <details class="modal-maturity" v-if="movie.mat !== undefined || matReviews">
            <summary class="mat-header">
              <p class="modal-section-label">Parental-guide details</p>
              <div class="mat-links">
                <UiBadge v-if="movie.mpa" tone="gold">{{ movie.mpa }}</UiBadge>
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
                  class="mat-ext-link mat-ext-link--csm genre-chip--alt"
                  title="Common Sense Media review"
                >CSM</a>
              </div>
            </summary>

            <!-- Score grid from stored bitmask, with per-category detail tags -->
            <div v-if="movie.mat !== undefined" class="mat-score-grid">
              <div
                v-for="cat in MATURITY_CATEGORIES"
                :key="cat.key"
                class="mat-score-row"
              >
                <div class="mat-score-line">
                  <span class="mat-score-name">{{ cat.label }}</span>

                  <div class="mat-score-bar-wrap">
                    <div
                      class="mat-score-bar"
                      :class="scoreCssClass(Math.round(getScore(movie.mat, cat.shift)))"
                      :style="{ width: `${getScore(movie.mat, cat.shift) / 5 * 95+5}%` }"
                    ></div>

                  </div>
                  <span style="font-size: 12px; color: var(--muted); min-width: 20px; flex-shrink: 0;">{{ formatScore(getScore(movie.mat, cat.shift)) }}</span>
                  <!--<span class="mat-score-label">
                    {{ SEVERITY_LABELS[Math.round(getScore(movie.mat, cat.shift))] }}
                  </span>-->
                </div>

                <div class="mat-score-tags" v-if="extraDetails?.tags?.[TAG_KEYS[cat.key]]?.length">
                  <span  class="mat-tag"> &#8627; </span>
                  <span
                    v-for="g in extraDetails.tags[TAG_KEYS[cat.key]]"
                    :key="g"
                    class="mat-tag"
                  >&nbsp;{{ g.replaceAll('_', ' ').toLowerCase() }}</span>
                </div>
              </div>
            </div>

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
            <p class="modal-section-label">Included</p>
            <div class="provider-list">
              <a v-for="p in providerNames" target="_blank" rel="noopener" :key="p" :href="extraDetails?.tmdbUrl+'/watch'" class="provider-chip">{{ p }}</a>

              <!-- Custom provider chips -->
              <span
                v-for="cp in resolvedCustomProviders"
                :key="cp.urlTemplate"
                class="provider-chip-wrap"
              >
                <a
                :href="cp.url"
                target="_blank"
                rel="noopener"
                class="provider-chip provider-chip--custom"
                :title="cp.urlTemplate"
              >
                {{ cp.domain }}
                </a>
                <button
                  class="provider-chip-remove"
                  @click.prevent.stop="userStore.removeCustomProvider(cp.urlTemplate)"
                  :aria-label="`Remove ${cp.domain} provider`"
                >×</button>
              </span>

              <!-- Add custom provider button -->
              <div v-if="userStore.isLoggedIn" class="custom-provider-add">
                <button
                  v-if="!showProviderForm"
                  class="provider-chip provider-chip--add"
                  @click="showProviderForm = true"
                  aria-label="Add custom search provider"
                >+ Add</button>

                <div v-else class="provider-form">
                  <input
                    ref="providerInputRef"
                    v-model="providerInput"
                    class="provider-input"
                    placeholder="e.g. netflix.com/search?q={title}&y={year}"
                    @keydown.enter="commitProvider"
                    @keydown.escape.stop="showProviderForm = false; providerInput = ''"
                  />
                  <button class="provider-form-btn provider-form-btn--ok" @click="commitProvider" aria-label="Add provider">✓</button>
                  <button class="provider-form-btn provider-form-btn--cancel" @click="showProviderForm = false; providerInput = ''" aria-label="Cancel adding provider">×</button>
                </div>
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
import { profileLabel } from "@/lib/maturityProfiles.js";
import UiBadge from "@/components/UiBadge.vue";
import UiChip from "@/components/UiChip.vue";

const userStore = useUserStore();
const movieStore = useMovieStore();

const props = defineProps({ movie: { type: Object, default: null } });
const emit = defineEmits(["close"]);

const dialogRef = ref(null);
const previouslyFocused = ref(null);
let bodyLocked = false;

const titleId = computed(() => props.movie?.id ? `movie-dialog-title-${props.movie.id}` : "movie-dialog-title");
const activeProfileName = computed(() => profileLabel(movieStore.maturityProfiles, movieStore.activeMaturityProfileId));
const compatibilityRows = computed(() => {
  if (props.movie?.mat === undefined || !movieStore.maxMaturityCat.some(v => v >= 0)) return [];
  return MATURITY_CATEGORIES
    .map((cat, i) => {
      const allowed = movieStore.maxMaturityCat[i];
      if (allowed < 0) return null;
      const rawScore = getScore(props.movie.mat, cat.shift);
      const movieScore = Number.isFinite(rawScore) ? Math.round(rawScore) : 6;
      const supportTags = (extraDetails.value?.tags?.[TAG_KEYS[cat.key]] || [])
        .slice(0, 4)
        .map(tag => tag.replaceAll('_', ' ').toLowerCase());
      return {
        key: cat.key,
        label: cat.label,
        movieScore,
        movieLabel: SEVERITY_LABELS[movieScore] || "Unknown",
        allowedLabel: SEVERITY_LABELS[allowed] || "Any",
        supportTags,
        exceeded: movieScore > allowed,
      };
    })
    .filter(Boolean);
});
const compatibilityOk = computed(() => compatibilityRows.value.length > 0 && compatibilityRows.value.every(row => !row.exceeded));
const suitabilitySummary = computed(() => {
  if (!movieStore.maxMaturityCat.some(v => v >= 0)) return { label: "Adults / no limits", className: "" };
  if (props.movie?.mat === undefined) return { label: "Unknown", className: "watch-summary-item--warn", action: true };
  return compatibilityOk.value
    ? { label: `Fits ${activeProfileName.value}`, className: "watch-summary-item--ok" }
    : { label: `Review for ${activeProfileName.value}`, className: "watch-summary-item--warn", action: true };
});
const availabilitySummary = computed(() => {
  if (!props.movie?.prov) return { label: "Availability unknown", className: "", action: true };
  if (!movieStore.selectedProviders) return { label: providerNames.value.slice(0, 2).join(" · ") || "Set your services", className: "", action: true };
  const configured = providerNames.value.filter(name => selectedProviderNames.value.includes(name));
  if (configured.length) return { label: configured.slice(0, 2).join(" · ") + (configured.length > 2 ? ` +${configured.length - 2}` : ""), className: "watch-summary-item--ok" };
  return { label: "Not in your services", className: "watch-summary-item--warn", action: true };
});
const listSummary = computed(() => {
  if (!props.movie || !userStore.isLoggedIn) return "";
  const labels = userStore.lists.filter(list => list.movies.includes(props.movie.id)).map(list => list.name);
  if (userStore.isWatched(props.movie.id)) labels.unshift("Watched");
  return labels.slice(0, 2).join(" · ");
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
    // Assuming extra.json is placed inside your public directory alongside movies.json
    const res = await fetch("/extra.json");
    if (res.ok) {
      const data = await res.json();
      extraTable.value = data || {};
      extraLoaded.value = true;
    }
  } catch (error) {
    console.error("Failed to preload extra.json table:", error);
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
  // 1. Check if the active movie element already contains an overview variant
  if (props.movie.overviewEs || props.movie.overviewEn) {
    return props.movie.overviewEs || props.movie.overviewEn;
  }
  // 2. Return the pre-scraped English synopsis retrieved from our table
  return extraDetails.value?.synopsisEn || null;
});

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

const selectedProviderNames = computed(() => PROVIDERS
  .filter(p => movieStore.selectedProviders & p.bit)
  .map(p => p.name)
);

const providerNames = computed(() => {
  if (!props.movie) return [];
  return PROVIDERS
    .filter(p => props.movie.prov & p.bit)
    .sort((a, b) => Number(Boolean(movieStore.selectedProviders & b.bit)) - Number(Boolean(movieStore.selectedProviders & a.bit)))
    .map(p => p.name);
});

// ─── Custom providers ─────────────────────────────────────────────────────────
const showProviderForm = ref(false);
const providerInput    = ref("");
const providerInputRef = ref(null);

watch(showProviderForm, async (val) => {
  if (val) {
    await nextTick();
    providerInputRef.value?.focus();
  }
});

// Known brand overrides: hostname fragment → display name
const DOMAIN_BRANDS = {
  netflix: "Netflix", disney: "Disney+", hbo: "HBO", max: "Max",
  prime: "Prime Video", amazon: "Prime Video", apple: "Apple TV+",
  hulu: "Hulu", paramount: "Paramount+", peacock: "Peacock",
  mubi: "MUBI", criterion: "Criterion", vudu: "Vudu",
  googleplay: "Google Play", youtube: "YouTube", rakuten: "Rakuten",
  skyshowtime: "SkyShowtime", filmin: "Filmin", movistar: "Movistar+",
  atresplayer: "Atresplayer", mitele: "Mitele", rtve: "RTVE Play",
};

function extractDomain(urlTemplate) {
  try {
    const clean = urlTemplate.replace(/\{[^}]+\}/g, "X").trim();
    const prefixed = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    const hostname = new URL(prefixed).hostname.toLowerCase();
    // Strip TLD(s) and split by dots
    const parts = hostname.replace(/\.(com|net|org|io|tv|es|co|uk|de|fr|it|jp|au|ca|mx|br|ar|nl|be|pl|se|no|dk|fi|pt|ru|cn|in|app|me|co\.uk|com\.mx|com\.br|com\.ar)$/, "").split(".");
    // Check each part against brand map (longest first)
    for (const part of [...parts].reverse()) {
      const key = part.replace(/[^a-z]/g, "");
      if (DOMAIN_BRANDS[key]) return DOMAIN_BRANDS[key];
    }
    // Fallback: last meaningful part, capitalized
    const name = parts[parts.length - 1] || parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return urlTemplate.split("/")[0].replace(/^www\./, "");
  }
}

function fillProviderUrl(urlTemplate, movie) {
  if (!movie) return "#";
  const prefixed = /^https?:\/\//i.test(urlTemplate) ? urlTemplate : `https://${urlTemplate}`;
  return prefixed
    .replace(/\{title\}/gi, encodeURIComponent((movie.t || movie.ts || "").replace(/[^a-zA-Z0-9.]/g, " ").trim()))
    .replace(/\{year\}/gi,  encodeURIComponent(movie.y || ""))
    .replace(/\{imdb\}/gi,  encodeURIComponent(movie.id || ""));
}

const resolvedCustomProviders = computed(() => {
  const templates = userStore.userData?.customProviders ?? [];
  return templates.map(urlTemplate => ({
    urlTemplate,
    domain: extractDomain(urlTemplate),
    url: fillProviderUrl(urlTemplate, props.movie),
  }));
});

function commitProvider() {
  const raw = providerInput.value.trim();
  if (!raw) return;
  userStore.addCustomProvider(raw);
  providerInput.value = "";
  showProviderForm.value = false;
}

// ─── Watch for movie changes ──────────────────────────────────────────────────
watch(() => props.movie, (movie) => {
  if (movie) {
    if (!bodyLocked) {
      previouslyFocused.value = document.activeElement;
      lockBodyScroll();
      bodyLocked = true;
    }
    //loadSynopsis(movie);
    loadExtraJsonData()
    //loadReviews(movie.id);
    nextTick(focusDialog);
  } else {
    //synopsis.value = null;
    matReviews.value = null;
    matReviewsError.value = null;
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
.imdb-link { display: inline-flex; align-items: center; text-decoration: none; }
.imdb-logo { height: 12px; width: auto; border-radius: 2px; }

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

.modal-section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0;
}

/* ── Providers ── */
.modal-providers { margin-bottom: 18px; }
.provider-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.provider-chip {
  padding: 4px 12px;
  background: rgba(45,212,191,0.12);
  border: 1px solid rgba(45,212,191,0.25);
  border-radius: 6px;
  font-size: 12px;
  text-decoration: none;
  color: var(--teal);
}

/* ── Custom providers ── */
.provider-chip-wrap {
  position: relative;
  display: inline-flex;
}
.provider-chip--custom {
  padding-right: 22px;
}
.provider-chip-remove {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  border-radius: 99px;
  transition: color 0.12s;
}
.provider-chip-remove:hover { color: #f87171; }

.provider-chip--add {
  background: transparent;
  border-style: dashed;
  color: var(--muted);
  cursor: pointer;
  font-family: var(--font-body);
  transition: color 0.15s, border-color 0.15s;
}
.provider-chip--add:hover { color: var(--teal); border-color: rgba(45,212,191,0.4); }

.custom-provider-add { display: flex; align-items: center; }

.provider-form {
  display: flex;
  align-items: center;
  gap: 4px;
}
.provider-input {
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 12px;
  padding: 4px 8px;
  width: 220px;
  outline: none;
  transition: border-color 0.15s;
}
.provider-input:focus { border-color: rgba(45,212,191,0.5); }
.provider-input::placeholder { color: var(--muted); opacity: 0.6; }

.provider-form-btn {
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px 7px;
  transition: color 0.12s, border-color 0.12s;
}
.provider-form-btn--ok:hover   { color: var(--teal);  border-color: rgba(45,212,191,0.4); }
.provider-form-btn--cancel:hover { color: #f87171; border-color: rgba(248,113,113,0.35); }

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
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  padding: 2px 8px;
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
  flex: 1;
  height: 4px;
  background: var(--surface3);
  border-radius: 99px;
  overflow: hidden;
}

.mat-score-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
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

/* ── Watch summary ── */
.watch-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 12px 0 18px;
}
.watch-summary-item {
  min-width: 0;
  display: grid;
  gap: 3px;
  padding: 11px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 13px;
  background: rgba(255,255,255,0.035);
}
.watch-summary-item span {
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.watch-summary-item strong {
  color: var(--white);
  font-size: 12px;
  line-height: 1.25;
}
.watch-summary-item a {
  color: var(--teal);
  font-size: 11px;
  text-decoration: none;
}
.watch-summary-item--ok { border-color: rgba(45,212,191,0.24); background: rgba(45,212,191,0.08); }
.watch-summary-item--warn { border-color: rgba(248,113,113,0.22); background: rgba(248,113,113,0.08); }
.watch-summary-item--list { border-color: rgba(245,200,66,0.22); background: rgba(245,200,66,0.08); }

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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.compatibility-summary strong { color: var(--white); }
.compatibility-pill {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}
.compatibility-pill--ok { background: rgba(45,212,191,0.12); color: var(--teal); }
.compatibility-pill--warn { background: rgba(248,113,113,0.13); color: #fca5a5; }
.compatibility-grid { display: grid; gap: 7px; }
.compatibility-row {
  display: grid;
  grid-template-columns: minmax(116px, 0.7fr) minmax(0, 1.3fr);
  gap: 12px;
  color: rgba(240,238,232,0.82);
  font-size: 12px;
}
.compatibility-row-main,
.compatibility-row-detail {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.compatibility-row-main span { color: var(--white); font-weight: 650; }
.compatibility-row-main strong { color: var(--teal); font-size: 11px; }
.compatibility-row.exceeded .compatibility-row-main strong { color: #fca5a5; }
.compatibility-row small { color: var(--teal); }
.compatibility-row.exceeded small { color: #fca5a5; }
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
    width: 38px;
    height: 38px;
    background: rgba(8,8,16,0.82);
    box-shadow: 0 8px 24px rgba(0,0,0,0.32);
  }
  .modal-close--mobile svg { width: 18px; height: 18px; }
  .watch-summary { grid-template-columns: 1fr; }
  .compatibility-row { grid-template-columns: 1fr; gap: 5px; }
}
</style>
