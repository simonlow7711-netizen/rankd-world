export type AppleEmbed = {
  embedUrl: string
  type: string
  service: "music" | "podcasts"
}


const MUSIC_HOSTS =
  new Set([
    "music.apple.com",
    "geo.music.apple.com",
    "embed.music.apple.com"
  ])


const PODCAST_HOSTS =
  new Set([
    "podcasts.apple.com",
    "embed.podcasts.apple.com"
  ])


const MUSIC_TYPES =
  new Set([
    "album",
    "song",
    "playlist",
    "artist",
    "station",
    "music-video"
  ])


function hostnameOf(
  url: URL
) {

  return url.hostname
    .toLowerCase()
    .replace(
      /^www\./,
      ""
    )

}


function splitCountry(
  segments: string[]
) {

  if (
    segments[0] &&
    /^[a-z]{2}$/i.test(
      segments[0]
    )
  ) {

    return {
      country:
        segments[0].toLowerCase(),
      rest:
        segments.slice(
          1
        )
    }

  }

  return {
    country:
      "us",
    rest:
      segments
  }

}


function pathSegments(
  url: URL
) {

  return url.pathname
    .split(
      "/"
    )
    .filter(
      Boolean
    )

}


function withTrackQuery(
  embedUrl: string,
  trackId: string | null
) {

  if (
    !trackId
  ) {

    return embedUrl

  }

  const embed =
    new URL(
      embedUrl
    )

  embed.searchParams.set(
    "i",
    trackId
  )

  return embed.toString()

}


function getAppleMusicEmbed(
  url: URL
): AppleEmbed | null {

  const {
    country,
    rest
  } =
    splitCountry(
      pathSegments(
        url
      )
    )


  const type =
    rest[0]

  const appleIdRaw =
    rest[
      rest.length - 1
    ]


  const appleId =
    appleIdRaw?.replace(
      /^id(\d+)$/i,
      "$1"
    )


  if (
    !type ||
    !MUSIC_TYPES.has(
      type
    ) ||
    !appleId ||
    rest.length < 2
  ) {

    return null

  }


  const slugParts =
    rest
      .slice(
        1,
        -1
      )


  const slugAndId =
    [
      ...slugParts,
      appleId
    ].join(
      "/"
    )


  const trackId =
    url.searchParams.get(
      "i"
    )


  const embedUrl =
    withTrackQuery(
      `https://embed.music.apple.com/${country}/${type}/${slugAndId}`,
      trackId
    )


  return {
    embedUrl,
    type:
      trackId
        ? "song"
        : type,
    service:
      "music"
  }

}


function getApplePodcastEmbed(
  url: URL
): AppleEmbed | null {

  const {
    country,
    rest
  } =
    splitCountry(
      pathSegments(
        url
      )
    )


  if (
    rest[0] !==
    "podcast"
  ) {

    return null

  }


  const podcastId =
    rest[
      rest.length - 1
    ]


  if (
    !podcastId ||
    !/^id\d+$/i.test(
      podcastId
    )
  ) {

    return null

  }


  const slugAndId =
    rest
      .slice(
        1
      )
      .join(
        "/"
      ) ||
    podcastId


  const episodeId =
    url.searchParams.get(
      "i"
    )


  const embedUrl =
    withTrackQuery(
      `https://embed.podcasts.apple.com/${country}/podcast/${slugAndId}`,
      episodeId
    )


  return {
    embedUrl,
    type:
      episodeId
        ? "episode"
        : "show",
    service:
      "podcasts"
  }

}


export function getAppleEmbed(
  url?: string | null
): AppleEmbed | null {

  if (
    !url
  ) {

    return null

  }

  try {

    const parsed =
      new URL(
        url
      )

    const hostname =
      hostnameOf(
        parsed
      )

    if (
      MUSIC_HOSTS.has(
        hostname
      )
    ) {

      return getAppleMusicEmbed(
        parsed
      )

    }

    if (
      PODCAST_HOSTS.has(
        hostname
      )
    ) {

      return getApplePodcastEmbed(
        parsed
      )

    }

    if (
      hostname ===
      "itunes.apple.com" ||
      hostname ===
        "geo.itunes.apple.com"
    ) {

      return getApplePodcastEmbed(
        parsed
      ) ??
      getAppleMusicEmbed(
        parsed
      )

    }

    return null

  } catch {

    return null

  }

}
