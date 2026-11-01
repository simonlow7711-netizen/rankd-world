export type TextPart = {
  type: "text" | "url"
  value: string
}


const URL_PATTERN =
  /https?:\/\/[^\s<]+/gi


export function splitTextLinks(
  text: string
): TextPart[] {

  const parts: TextPart[] =
    []

  let cursor =
    0

  const matches =
    text.matchAll(URL_PATTERN)

  for (const match of matches) {

    const raw =
      match[0]

    const index =
      match.index ??
      0

    let url =
      raw.replace(
        /[.,!?;:)\]}'"]+$/g,
        ""
      )

    if (index > cursor) {
      parts.push({
        type: "text",
        value:
          text.slice(
            cursor,
            index
          )
      })
    }

    if (url) {
      parts.push({
        type: "url",
        value: url
      })
    }

    cursor =
      index +
      url.length

  }

  if (cursor < text.length) {
    parts.push({
      type: "text",
      value:
        text.slice(cursor)
    })
  }

  return parts.length
    ? parts
    : [
        {
          type: "text",
          value: text
        }
      ]

}


export function isHttpUrl(
  value: string
) {

  try {
    const parsed =
      new URL(value.trim())

    return (
      parsed.protocol ===
        "http:" ||
      parsed.protocol ===
        "https:"
    )
  } catch {
    return false
  }

}
