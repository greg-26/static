const IMDB_TITLE_ID_PATTERN = /^tt\d+$/;

export function isValidImdbTitleId(value: string): boolean {
  return IMDB_TITLE_ID_PATTERN.test(value);
}
