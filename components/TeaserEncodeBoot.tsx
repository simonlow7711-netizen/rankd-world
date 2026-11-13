"use client"

import {
  useEffect
} from "react"

import {
  encodeRankingTeaser
} from "@/components/AnimatedRankPreview"

import {
  publishRankingTeaser
} from "@/utils/teaser"


type RankdEncodeWindow = Window & {
  __rankdEncode?: typeof encodeRankingTeaser
  __rankdPublishTeaser?: typeof publishRankingTeaser
}


if (typeof window !== "undefined") {
  const runtime =
    window as RankdEncodeWindow

  runtime.__rankdEncode =
    encodeRankingTeaser
  runtime.__rankdPublishTeaser =
    publishRankingTeaser
}


export default function TeaserEncodeBoot() {
  useEffect(
    () => {
      const runtime =
        window as RankdEncodeWindow

      runtime.__rankdEncode =
        encodeRankingTeaser
      runtime.__rankdPublishTeaser =
        publishRankingTeaser
    },
    []
  )

  return null
}
