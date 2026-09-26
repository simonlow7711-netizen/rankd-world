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

  accentColor?:string

  textColor?:string

  mutedColor?:string

  borderColor?:string

  cardColor?:string

}


export default function RankingEngagement({

  views,

  rankd,

  rerankd,

  accentColor = "#FF6B35",

  textColor = "#000000",

  mutedColor = "#66615B",

  borderColor = "#000000",

  cardColor = "#F7F4EE"

}: RankingEngagementProps) {


  const iconStyle = {
    color: accentColor
  }


  const itemStyle = {

    backgroundColor:
      `${accentColor}12`,

    color:
      textColor

  }


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
          px-3
          py-3
          md:px-4
        "
        style={{
          ...itemStyle,
          borderColor:
            `${borderColor}12`
        }}
      >

        <Eye
          size={19}
          strokeWidth={2.5}
          className="
            shrink-0
          "
          style={iconStyle}
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
          style={{
            color:textColor
          }}
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
          px-3
          py-3
          md:px-4
        "
        style={{
          ...itemStyle,
          borderColor:
            `${borderColor}12`
        }}
      >

        <ThumbsUp
          size={19}
          strokeWidth={2.5}
          className="
            shrink-0
          "
          style={iconStyle}
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
          style={{
            color:textColor
          }}
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
          px-3
          py-3
          md:px-4
        "
        style={{
          ...itemStyle,
          borderColor:
            `${borderColor}12`
        }}
      >

        <RefreshCw
          size={19}
          strokeWidth={2.5}
          className="
            shrink-0
          "
          style={iconStyle}
        />

        <span
          className="
            min-w-0
            truncate
            text-xl
            font-black
            leading-none
          "
          style={{
            color:textColor
          }}
        >

          {rerankd}

        </span>

      </div>

    </div>

  )

}