import {
  Ranking
} from "@/types/ranking"

import {
  getRankdExplanation
} from "@/utils/rankdExplanation"


type Props = {

  ranking: Ranking

}


export default function RankdExplanation({

  ranking

}: Props) {


  const reasons =

    getRankdExplanation(

      ranking

    )


  return (

    <div className="
      mt-6
      pt-6
      border-t
      border-black/10
    ">


      <p className="
        text-xs
        uppercase
        tracking-widest
        font-black
        rankd-accent
      ">

        Why it's trending

      </p>


      <div className="
        mt-3
        space-y-2
      ">


        {reasons.map(

          reason => (

            <p

              key={reason}

              className="
                text-sm
                font-bold
              "

            >

              {reason}

            </p>

          )

        )}


      </div>


    </div>

  )

}