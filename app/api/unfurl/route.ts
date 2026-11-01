import {
  NextResponse
} from "next/server"


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


function isPrivateHost(
  hostname: string
) {

  const host =
    hostname.toLowerCase()

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  )

}


export async function GET(
  request: Request
) {

  const requested =
    new URL(
      request.url
    ).searchParams.get("url")

  if (!requested) {
    return NextResponse.json(
      {
        error:
          "Missing URL."
      },
      {
        status: 400
      }
    )
  }

  let parsed: URL

  try {
    parsed =
      new URL(requested)
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid URL."
      },
      {
        status: 400
      }
    )
  }

  if (
    (
      parsed.protocol !==
        "http:" &&
      parsed.protocol !==
        "https:"
    ) ||
    isPrivateHost(parsed.hostname)
  ) {
    return NextResponse.json(
      {
        error:
          "URL is not allowed."
      },
      {
        status: 400
      }
    )
  }

  try {

    const response =
      await fetch(
        parsed.toString(),
        {
          redirect:
            "follow",
          headers: {
            "user-agent":
              BROWSER_UA,
            accept:
              "text/html,application/xhtml+xml"
          },
          signal:
            AbortSignal.timeout(7000)
        }
      )

    const finalUrl =
      new URL(response.url)

    if (
      isPrivateHost(finalUrl.hostname)
    ) {
      throw new Error("Private host")
    }

    const html =
      (await response.text()).slice(
        0,
        200000
      )

    const title =
      readMeta(html, "og:title") ||
      html.match(
        /<title[^>]*>([^<]+)<\/title>/i
      )?.[1] ||
      null

    const image =
      readMeta(html, "og:image")

    return NextResponse.json(
      {
        title:
          title
            ? decodeHtml(title).trim()
            : null,
        image:
          image
            ? decodeHtml(image)
            : null,
        site:
          finalUrl.hostname.replace(
            /^www\./,
            ""
          )
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800"
        }
      }
    )

  } catch {

    return NextResponse.json(
      {
        title: null,
        image: null,
        site:
          parsed.hostname.replace(
            /^www\./,
            ""
          )
      }
    )

  }

}
