export const RANKD_PREFIX = "Top 7"

export function formatRankingTitle(title: string): string {
  const cleanTitle = title
    .replace(/^Top\s*7\s*/i, "")
    .trim()

  return `${RANKD_PREFIX} ${cleanTitle}`
}

export function stripRankingPrefix(title: string): string {
  return title
    .replace(/^Top\s*7\s*/i, "")
    .trim()
}