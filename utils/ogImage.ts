import {
  SITE_URL
} from "@/utils/siteUrl"


export function sharePreviewUrl(
  input?: {
    id?: string
    category?: string | null
    title?: string
  }
) {

  const params =
    new URLSearchParams()

  if (input?.id) {
    params.set(
      "id",
      input.id
    )
  }

  if (input?.category) {
    params.set(
      "category",
      input.category
    )
  }

  if (input?.title) {
    params.set(
      "title",
      input.title
    )
  }

  const query =
    params.toString()

  return query
    ? `${SITE_URL}/api/og?${query}`
    : `${SITE_URL}/api/og`

}


export function sharePreviewImage(
  alt: string,
  url = sharePreviewUrl()
) {

  return {
    url,
    width: 1200,
    height: 630,
    type: "image/png" as const,
    alt
  }

}
