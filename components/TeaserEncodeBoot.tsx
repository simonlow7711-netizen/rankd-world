"use client"

import {
  useEffect
} from "react"

import {
  publishRankingTeaser
} from "@/utils/teaser"


type RankdEncodeWindow = Window & {
  __rankdPublishTeaser?: typeof publishRankingTeaser
}


export default function TeaserEncodeBoot() {
  useEffect(
    () => {
      const runtime =
        window as RankdEncodeWindow

      runtime.__rankdPublishTeaser =
        publishRankingTeaser
    },
    []
  )

  return null
}
