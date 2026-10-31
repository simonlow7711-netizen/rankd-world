export function getSpotifyEmbed(
  url?: string | null
): {
  embedUrl: string
  type: string
} | null {

  if (!url) {
    return null
  }

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace(/^www\./, "")

    if (hostname !== "open.spotify.com") {
      return null
    }

    const segments = parsedUrl.pathname
      .split("/")
      .filter(Boolean)

    if (
      segments[0] &&
      /^intl-[a-z]{2}$/i.test(segments[0])
    ) {
      segments.shift()
    }

    if (segments[0] === "embed") {
      segments.shift()
    }

    const type = segments[0]
    const spotifyId = segments[1]?.split("?")[0]

    const supportedTypes = [
      "track",
      "album",
      "playlist",
      "episode",
      "show",
      "artist"
    ]

    if (
      !type ||
      !supportedTypes.includes(type) ||
      !spotifyId ||
      !/^[a-zA-Z0-9]+$/.test(spotifyId)
    ) {
      return null
    }

    return {
      embedUrl:
        `https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`,
      type
    }
  } catch {
    return null
  }

}
