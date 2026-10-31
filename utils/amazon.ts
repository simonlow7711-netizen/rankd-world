const AMAZON_HOST =
  /^(www\.)?(amazon\.[a-z.]+|amzn\.to|a\.co)$/i

export function getAmazonUrl(
  url?: string | null
): string | null {

  if (!url) {
    return null
  }

  try {
    const parsed = new URL(url)

    if (!AMAZON_HOST.test(parsed.hostname)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }

}


export function getAmazonSearchQuery(
  url: string,
  fallbackName: string
): string {

  try {
    const parsed = new URL(url)
    const fromQuery =
      parsed.searchParams.get("k") ||
      parsed.searchParams.get("keywords")

    if (fromQuery) {
      return fromQuery.replace(/\+/g, " ").trim()
    }
  } catch {
    // Use the ranking entry name.
  }

  return fallbackName
    .replace(/\bbook\b/gi, "")
    .trim() || fallbackName

}
