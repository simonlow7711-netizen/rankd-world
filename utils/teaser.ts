"use client"

import {
  supabase
} from "@/utils/supabase"


export const TEASER_BUCKET =
  "rankd-teasers"

export const TEASER_WIDTH =
  1080

export const TEASER_HEIGHT =
  1920


export function teaserObjectPath(
  rankingId: string
) {
  return `${rankingId}.mp4`
}


export function rankingVideoCaption(
  title: string,
  url?: string
) {
  const lines = [
    "Would you rank it differently?",
    "",
    `${title} | RANKD`
  ]

  if (url) {
    lines.push("", url)
  }

  return lines.join("\n")
}


export function teaserFileName() {
  return "rankd-preview.mp4"
}


export async function fetchTeaserFile(
  teaserUrl: string
) {
  const response =
    await fetch(
      teaserUrl,
      {
        mode: "cors"
      }
    )

  if (!response.ok) {
    throw new Error(
      "The RANKD video could not be loaded."
    )
  }

  const blob =
    await response.blob()

  if (blob.size === 0) {
    throw new Error(
      "The RANKD video was empty."
    )
  }

  return new File(
    [
      blob
    ],
    teaserFileName(),
    {
      type: "video/mp4"
    }
  )
}


export async function shareRankingVideoFile(
  file: File,
  title: string,
  url?: string
) {
  if (
    typeof navigator.share !== "function"
  ) {
    return false
  }

  const text =
    rankingVideoCaption(
      title,
      url
    )

  const attempts: ShareData[] = [
    {
      files: [
        file
      ],
      title:
        `${title} | RANKD`,
      text
    },
    {
      files: [
        file
      ]
    }
  ]

  for (const shareData of attempts) {
    if (
      typeof navigator.canShare === "function" &&
      !navigator.canShare(
        shareData
      )
    ) {
      continue
    }

    try {
      await navigator.share(
        shareData
      )

      return true
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return true
      }
    }
  }

  return false
}


export function downloadTeaserFile(
  file: File
) {
  const objectUrl =
    URL.createObjectURL(
      file
    )

  const link =
    document.createElement(
      "a"
    )

  link.href =
    objectUrl

  link.download =
    file.name

  document.body.appendChild(
    link
  )

  link.click()
  link.remove()

  window.setTimeout(
    () => {
      URL.revokeObjectURL(
        objectUrl
      )
    },
    60000
  )
}


export async function publishRankingTeaser(
  rankingId: string,
  blob: Blob
) {
  const path =
    teaserObjectPath(
      rankingId
    )

  const {
    error: uploadError
  } =
    await supabase
      .storage
      .from(
        TEASER_BUCKET
      )
      .upload(
        path,
        blob,
        {
          upsert: true,
          contentType: "video/mp4",
          cacheControl: "3600"
        }
      )

  if (uploadError) {
    throw uploadError
  }

  const {
    data
  } =
    supabase
      .storage
      .from(
        TEASER_BUCKET
      )
      .getPublicUrl(
        path
      )

  const teaserUrl =
    data.publicUrl

  const {
    error: publishError,
    data: publishedUrl
  } =
    await supabase
      .rpc(
        "publish_ranking_teaser",
        {
          p_ranking_id: rankingId,
          p_teaser_url: teaserUrl
        }
      )

  if (publishError) {
    throw publishError
  }

  return (
    typeof publishedUrl === "string"
      ? publishedUrl
      : teaserUrl
  )
}
