"use client"

import {
  Ranking
} from "@/types/ranking"





type Props = {

  ranking: Ranking

}







export default function RankingDebug({

  ranking

}: Props){


  if(

    process.env.NODE_ENV !== "development"

  ){

    return null

  }





  return (

    <div className="
      mt-6
      p-4
      rounded-xl
      bg-black
      text-white
      text-sm
      space-y-2
    ">


      <p className="
        font-black
      ">

        🧠 RANKD Intelligence

      </p>





      <p>

        Score:
        {" "}

        <strong>

          {ranking.signals?.rankdScore ?? 0}

        </strong>

      </p>





      <p>

        🔥 Debate:
        {" "}

        {ranking.signals?.debateHeat ?? 0}

      </p>





      <p>

        ⚡ Live:
        {" "}

        {ranking.signals?.liveScore ?? 0}

      </p>





      <p>

        👁 Views:
        {" "}

        {ranking.signals?.views ?? 0}

      </p>





      <p>

        🧩 Perspective:
        {" "}

        {ranking.signals?.perspectiveScore ?? 0}

      </p>


    </div>

  )

}