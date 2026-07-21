export const AVAILABILITY_COUNTRY = Object.freeze({
  code: "ES",
  label: "Spain",
  status: "Fixed",
});

export const AVAILABILITY_SOURCE_COPY = "Data from JustWatch via TMDB";
export const AVAILABILITY_CONTEXT_COPY = `Availability in ${AVAILABILITY_COUNTRY.label} · ${AVAILABILITY_SOURCE_COPY}`;
export const AVAILABILITY_SETTINGS_COPY = `${AVAILABILITY_COUNTRY.label} only for now — provider data in movies.json is Spain-only.`;
