const AMAZON_HOST =
  /^(?:www\.|m\.|smile\.)?(?:amazon\.[a-z.]+|amzn\.to|amzn\.eu|a\.co)$/i

const ASIN_PATH =
  /\/(?:dp|gp\/product|gp\/aw\/d|gp\/offer-listing|exec\/obidos\/(?:ASIN|asin)|product|d)\/([A-Z0-9]{10})(?:[/?]|$)/i

const ASIN_VALUE =
  /^[A-Z0-9]{10}$/


export type AmazonPreview = {
  url: string
  asin: string | null
  title: string | null
  image: string | null
}


export function isAmazonHost(
  hostname: string
) {

  return AMAZON_HOST.test(
    hostname.toLowerCase()
  )

}


export function getAmazonUrl(
  url?: string | null
): string | null {

  if (!url) {
    return null
  }

  try {
    const parsed =
      new URL(url)

    if (!isAmazonHost(parsed.hostname)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }

}


export function getAmazonAsin(
  url?: string | null
): string | null {

  const amazonUrl =
    getAmazonUrl(url)

  if (!amazonUrl) {
    return null
  }

  try {
    const parsed =
      new URL(amazonUrl)

    const fromQuery =
      parsed.searchParams.get("asin") ||
      parsed.searchParams.get("ASIN")

    if (
      fromQuery &&
      ASIN_VALUE.test(fromQuery)
    ) {
      return fromQuery.toUpperCase()
    }

    const fromPath =
      amazonUrl.match(ASIN_PATH)?.[1]

    if (fromPath) {
      return fromPath.toUpperCase()
    }
  } catch {
    return null
  }

  return null

}


export function getAmazonImageUrl(
  asin: string
) {

  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`

}


export function getAmazonImageFallbacks(
  asin: string
) {

  return [
    getAmazonImageUrl(asin),
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`,
    `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`
  ]

}
