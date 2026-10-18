
export const RANKD_PREFIX =
  "Top 7"


export function formatRankingTitle(
  title: string
): string {

  let cleanTitle =
    title
      .trim()
      .replace(
        /^Top\s*7\s*/i,
        ""
      )
      .trim()

  cleanTitle =
    cleanTitle
      .replace(
        /^The\s+7\s+/i,
        ""
      )
      .trim()

  cleanTitle =
    cleanTitle
      .replace(
        /^7\s+/i,
        ""
      )
      .trim()

  cleanTitle =
    cleanTitle
      .toLowerCase()
      .replace(
        /\b[a-z]/g,
        character =>
          character.toUpperCase()
      )
      .replace(
        /'([A-Z])/g,
        (_, character: string) =>
          character.toLowerCase()
      )
      .replace(
        /\bUk\b/g,
        "UK"
      )
      .replace(
        /\bTv\b/g,
        "TV"
      )

  return `${RANKD_PREFIX} ${cleanTitle}`
}


export function stripRankingPrefix(
  title: string
): string {

  return title
    .replace(
      /^Top\s*7\s*/i,
      ""
    )
    .trim()
}
