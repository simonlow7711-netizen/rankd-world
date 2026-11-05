
export const RANKD_PREFIX =
  "Top 7"


const US_COUNTRY_FOLLOWERS =
  new Set([
    "cities",
    "city",
    "states",
    "state",
    "census",
    "army",
    "navy",
    "marines",
    "dollar",
    "dollars",
    "presidents",
    "elections",
    "senate",
    "congress",
    "constitution",
    "citizens",
    "population",
    "government"
  ])


function restoreOriginalAcronyms(
  original: string,
  titled: string
) {

  const acronyms =
    original.match(
      /\b[A-Z]{2,}\b/g
    ) ??
    []

  return acronyms.reduce(
    (title, acronym) =>
      title.replace(
        new RegExp(
          `\\b${acronym[0]}${acronym.slice(1).toLowerCase()}\\b`,
          "g"
        ),
        acronym
      ),
    titled
  )

}


function restoreCountryUs(
  titled: string
) {

  return titled
    .replace(
      /\bThe Us\b/g,
      "The US"
    )
    .replace(
      /\bUs\b(?=\s+[A-Z][a-z]+)/g,
      (
        match,
        offset: number,
        source: string
      ) => {

        const follower =
          source
            .slice(
              offset + match.length
            )
            .trimStart()
            .split(
              /\s+/
            )[0]
            ?.toLowerCase()

        return follower &&
          US_COUNTRY_FOLLOWERS.has(
            follower
          )
          ? "US"
          : match

      }
    )

}


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

  const original =
    cleanTitle

  cleanTitle =
    cleanTitle
      .toLowerCase()
      .replace(
        /\b[a-z]/g,
        character =>
          character.toUpperCase()
      )
      .replace(
        /(['’])([A-Z])/g,
        (
          _,
          apostrophe: string,
          character: string
        ) =>
          apostrophe + character.toLowerCase()
      )
      .replace(
        /\bUk\b/g,
        "UK"
      )
      .replace(
        /\bTv\b/g,
        "TV"
      )
      .replace(
        /\bUsa\b/g,
        "USA"
      )

  cleanTitle =
    restoreOriginalAcronyms(
      original,
      cleanTitle
    )

  cleanTitle =
    restoreCountryUs(
      cleanTitle
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
