"use client"

import Link from "next/link"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"





export default function ChallengeCard({

  ranking

}:{

  ranking:any

}) {



  if(!ranking){

    return null

  }





  return (

    <Link

      href={`/rank/${ranking.id}`}

    >

      <div className="
        rankd-card
        p-6
        hover:-translate-y-1
        transition
      ">



        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-xs
          font-black
        ">

          Challenge

        </p>





        <h3 className="
          text-2xl
          font-black
          mt-4
        ">

          {formatRankingTitle(

            ranking.title

          )}

        </h3>





        <p className="
          mt-3
          rankd-muted
        ">

          Would you rank this differently?

        </p>


      </div>


    </Link>

  )

}