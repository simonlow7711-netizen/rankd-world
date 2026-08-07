"use client"

import Link from "next/link"

import {
  TasteRecommendation
} from "@/utils/tasteRecommendations"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"







type Props = {

  recommendation:TasteRecommendation

}









export default function TasteRecommendationCard({

  recommendation

}:Props){



  const ranking =

    recommendation.ranking







  return (

    <Link

      href={`/rank/${ranking.id}`}

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

          Recommended through your taste

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







        <div className="
          mt-6
          flex
          items-center
          justify-between
        ">



          <span className="
            bg-black
            text-white
            rounded-full
            px-5
            py-3
            font-black
          ">

            {recommendation.score}%

          </span>





          <span className="
            rankd-muted
            font-bold
          ">

            taste alignment

          </span>



        </div>









        {recommendation.reasons.length > 0 && (


          <div className="
            mt-8
            pt-6
            border-t
            border-black/10
          ">



            <p className="
              font-black
              mb-4
            ">

              Why RANKD picked this

            </p>





            <div className="
              space-y-2
            ">



              {recommendation.reasons

                .slice(0,3)

                .map(reason=>(


                  <p

                    key={reason}

                    className="
                      text-sm
                      font-bold
                    "

                  >

                    ✓ {reason}

                  </p>


                ))}



            </div>



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

            Explore ranking →

          </p>



        </div>






      </article>


    </Link>

  )

}