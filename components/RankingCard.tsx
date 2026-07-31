"use client"

import Link from "next/link"

import {
  calculateDebateScore
} from "@/utils/debateScore"





export default function RankingCard({

  ranking

}:{

  ranking:any

}) {



  const debateScore =

    calculateDebateScore(

      ranking

    )







  return (

    <Link

      href={`/rank/${ranking.id}`}

    >

      <div

        className="
          bg-zinc-900
          rounded-3xl
          p-8
          hover:scale-105
          transition
          cursor-pointer
        "

      >



        <p className="
          text-gray-400
          font-bold
        ">

          {ranking.category}

        </p>





        <h3 className="
          text-2xl
          font-black
          mt-4
        ">

          {ranking.title}

        </h3>





        <div className="
          mt-5
          inline-flex
          items-center
          gap-2
          bg-black
          rounded-full
          px-4
          py-2
        ">


          <span>

            🔥

          </span>


          <span className="
            text-sm
            font-black
          ">

            Debate Heat {debateScore}%

          </span>


        </div>





        <p className="
          mt-6
          text-orange-400
          font-black
        ">

          Decide your #1 →

        </p>




      </div>


    </Link>

  )

}