import {
  NextResponse
} from "next/server"

import {
  getAmazonAsin,
  getAmazonImageUrl,
  getAmazonUrl,
  isAmazonHost
} from "@/utils/amazon"


export const runtime =
  "nodejs"


const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"


function readMeta(
  html: string,
  property: string
) {

  const pattern =
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    )

  const flipped =
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    )

  return (
    html.match(pattern)?.[1] ||
    html.match(flipped)?.[1] ||
    null
  )

}


function decodeHtml(
  value: string
) {

  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}


async function resolveAmazonUrl(
  url: string
) {

  const response =
    await fetch(
      url,
      {
        method:
          "GET",
        redirect:
          "follow",
        headers: {
          "user-agent":
            BROWSER_UA,
          accept:
            "text/html,application/xhtml+xml"
        },
        signal:
          AbortSignal.timeout(8000)
      }
    )

  const finalUrl =
    getAmazonUrl(response.url) ||
    url

  if (
    !isAmazonHost(
      new URL(finalUrl).hostname
    )
  ) {
    return {
      url,
      html: null as string | null
    }
  }

  const contentType =
    response.headers.get("content-type") ||
    ""

  const html =
    response.ok &&
    contentType.includes("text/html")
      ? await response.text()
      : null

  return {
    url: finalUrl,
    html
  }

}


export async function GET(
  request: Request
) {

  const requested =
    getAmazonUrl(
      new URL(request.url).searchParams.get("url")
    )

  if (!requested) {
    return NextResponse.json(
      {
        error:
          "Not an Amazon URL."
      },
      {
        status: 400
      }
    )
  }

  try {

    let destination =
      requested

    let html: string | null =
      null

    const needsResolve =
      /amzn\.to|amzn\.eu|^https?:\/\/a\.co\//i.test(
        requested
      ) ||
      !getAmazonAsin(requested)

    if (needsResolve) {
      const resolved =
        await resolveAmazonUrl(
          requested
        )

      destination =
        resolved.url

      html =
        resolved.html
    }

    const asin =
      getAmazonAsin(destination)

    let title: string | null =
      null

    let image: string | null =
      asin
        ? getAmazonImageUrl(asin)
        : null

    if (html) {
      const ogTitle =
        readMeta(html, "og:title")

      const ogImage =
        readMeta(html, "og:image")

      if (ogTitle) {
        title =
          decodeHtml(ogTitle)
            .replace(
              /\s*[|:]\s*Amazon.*$/i,
              ""
            )
            .trim() ||
          null
      }

      if (ogImage) {
        image =
          decodeHtml(ogImage)
      }
    }

    return NextResponse.json(
      {
        url: destination,
        asin,
        title,
        image
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800"
        }
      }
    )

  } catch (error) {

    console.error(
      "RANKD AMAZON PREVIEW ERROR",
      error
    )

    const asin =
      getAmazonAsin(requested)

    return NextResponse.json(
      {
        url: requested,
        asin,
        title: null,
        image:
          asin
            ? getAmazonImageUrl(asin)
            : null
      }
    )

  }

}
