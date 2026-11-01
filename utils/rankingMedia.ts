import {
  isHttpUrl
} from "@/utils/linkText"


const MEDIA_TOKEN =
  /(?:\n{1,2})?\[\[media:(https?:\/\/[^\s\]]+)\]\]\s*$/i


export function parseRankingDescription(
  stored?: string | null
) {

  const raw =
    stored?.trim() ??
    ""

  if (!raw) {
    return {
      text: "",
      mediaUrl: null as string | null
    }
  }

  const token =
    raw.match(MEDIA_TOKEN)

  if (token?.[1]) {
    return {
      text:
        raw
          .slice(
            0,
            token.index
          )
          .trim(),
      mediaUrl:
        token[1]
    }
  }

  return {
    text: raw,
    mediaUrl: null as string | null
  }

}


export function serializeRankingDescription(
  text: string,
  mediaUrl?: string | null
) {

  const body =
    text.trim()

  const media =
    mediaUrl?.trim() ??
    ""

  if (
    media &&
    isHttpUrl(media)
  ) {
    return body
      ? `${body}\n\n[[media:${media}]]`
      : `[[media:${media}]]`
  }

  return body

}
