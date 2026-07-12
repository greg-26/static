export const MATURITY_PROFILES = [
  { id: "adults", label: "Adults", description: "No maturity limits", values: [-1, -1, -1, -1] },
  { id: "me", label: "Me", description: "Use your saved limits", values: null },
  { id: "family", label: "Family", description: "Balanced shared viewing", values: [2, 3, 2, 2] },
  { id: "kids", label: "With kids", description: "Stricter family-safe browsing", values: [1, 2, 1, 1] },
];

export function activeMaturityProfileId(maxMaturityCat = []) {
  const current = maxMaturityCat.join(",");
  const preset = MATURITY_PROFILES.find(profile => profile.values?.join(",") === current);
  if (preset) return preset.id;
  return maxMaturityCat.some(v => v >= 0) ? "me" : "adults";
}

export function activeMaturityProfileLabel(maxMaturityCat = []) {
  const id = activeMaturityProfileId(maxMaturityCat);
  return MATURITY_PROFILES.find(profile => profile.id === id)?.label ?? "Maturity profile";
}
