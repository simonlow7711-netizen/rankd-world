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
