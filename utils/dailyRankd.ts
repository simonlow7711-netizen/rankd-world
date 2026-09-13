export type DailyRankd = {
  title: string

  category: string
}

export const dailyRankds: DailyRankd[] = [
  {
    title:
      "Top 7 Films Everyone Should Watch",

    category:
      "Film & TV"
  },

  {
    title:
      "Top 7 Foods You Could Eat Forever",

    category:
      "Food & Drink"
  },

  {
    title:
      "Top 7 Cities To Visit",

    category:
      "Travel"
  },

  {
    title:
      "Top 7 Songs Of All Time",

    category:
      "Music"
  },

  {
    title:
      "Top 7 Athletes Ever",

    category:
      "Sport"
  },

  {
    title:
      "Top 7 Inventions That Changed The World",

    category:
      "Technology"
  },

  {
    title:
      "Top 7 Things That Make You Happy",

    category:
      "Lifestyle"
  }
]

export function getDailyRankd(): DailyRankd {
  const now = new Date()

  const londonDate = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/London",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit"
    }
  ).formatToParts(now)

  const year = Number(
    londonDate.find(
      part =>
        part.type === "year"
    )?.value
  )

  const month = Number(
    londonDate.find(
      part =>
        part.type === "month"
    )?.value
  )

  const day = Number(
    londonDate.find(
      part =>
        part.type === "day"
    )?.value
  )

  const londonMidnight = Date.UTC(
    year,
    month - 1,
    day
  )

  const epochDay = Math.floor(
    londonMidnight /
      (
        1000 *
        60 *
        60 *
        24
      )
  )

  return dailyRankds[
    epochDay %
      dailyRankds.length
  ]
}