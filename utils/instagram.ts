
export function getInstagramPostUrl(
  url?: string | null
): string | null {

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
      parsed.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        )

    if (
      hostname !== "instagram.com"
    ) {
      return null
    }

    const match =
      parsed.pathname.match(
        /^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)\/?/
      )

    if (
      !match
    ) {
      return null
    }

    const type =
      match[1] === "reels"
        ? "reel"
        : match[1]

    const id =
      match[2]

    return (
      `https://www.instagram.com/${type}/${id}/`
    )

  }
  catch {

    return null

  }

}
