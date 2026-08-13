"use client"


import Link from "next/link"


import {
  TasteRecommendation
} from "@/utils/tasteRecommendations"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


import {
  recordTasteFeedback
} from "@/utils/tasteFeedback"


type Props = {

  recommendation:
    TasteRecommendation

}


export default function TasteRecommendationCard({

  recommendation

}: Props) {

  const ranking =
    recommendation.ranking


  function handleClick() {

    void recordTasteFeedback({

      type:
        "clicked",

      rankingId:
        ranking.id,

      recommendationScore:
        recommendation.score

    })

  }


  const createHref =

    "/create" +

    "?recommendationId=" +

    encodeURIComponent(

      ranking.id

    ) +

    "&recommendationScore=" +

    encodeURIComponent(

      String(

        recommendation.score

      )

    )


  return (

    <Link

      href={createHref}

      onClick={handleClick}

      className="
        block
        h-full
      "

    >

      <article

        className="
          rankd-card
          p-8
          h-full
          hover:-translate-y-2
          transition
          cursor-pointer
        "

      >

        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-xs
          font-black
        ">

          Picked for your taste

        </p>


        <h3 className="
          text-3xl
          font-black
          mt-5
          leading-tight
        ">

          {formatRankingTitle(

            ranking.title

          )}

        </h3>


        {recommendation.reason && (

          <div className="
            mt-6
            pt-6
            border-t
            border-black/10
          ">

            <p className="
              text-sm
              font-bold
              leading-relaxed
            ">

              {recommendation.reason}

            </p>

          </div>

        )}


        <div className="
          mt-8
          pt-6
          border-t
          border-black/10
        ">

          <p className="
            font-black
          ">

            Would you rank it differently?

          </p>


          <p className="
            mt-3
            rankd-accent
            font-black
          ">

            Rank it yourself →

          </p>

        </div>

      </article>

    </Link>

  )

}