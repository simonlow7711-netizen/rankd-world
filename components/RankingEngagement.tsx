"use client"


import {
  Eye,
  ThumbsUp,
  RefreshCw
} from "lucide-react"


type RankingEngagementProps = {

  views:number

  rankd:number

  rerankd:number

}


export default function RankingEngagement({

  views,

  rankd,

  rerankd

}: RankingEngagementProps) {


  return (

    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
        md:gap-4
      "
    >

      <div
        className="
          flex
          min-w-0
          shrink
          items-center
          gap-2
          rounded-2xl
          bg-black/[0.04]
          px-3
          py-3
          md:px-4
        "
      >

        <Eye
          size={19}
          strokeWidth={2.5}
          className="
            rankd-accent
            shrink-0
          "
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
        >

          {views}

        </span>

      </div>


      <div
        className="
          flex
          min-w-0
          shrink
          items-center
          gap-2
          rounded-2xl
          bg-black/[0.04]
          px-3
          py-3
          md:px-4
        "
      >

        <ThumbsUp
          size={19}
          strokeWidth={2.5}
          className="
            rankd-accent
            shrink-0
          "
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
        >

          {rankd}

        </span>

      </div>


      <div
        className="
          flex
          min-w-0
          shrink
          items-center
          gap-2
          rounded-2xl
          bg-black/[0.04]
          px-3
          py-3
          md:px-4
        "
      >

        <RefreshCw
          size={19}
          strokeWidth={2.5}
          className="
            rankd-accent
            shrink-0
          "
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
        >

          {rerankd}

        </span>

      </div>

    </div>

  )

}