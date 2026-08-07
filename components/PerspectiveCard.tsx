"use client"

import Link from "next/link"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"





export default function PerspectiveCard({

  perspective

}:{

  perspective:any

}) {



  if(!perspective){

    return null

  }







  const ranking =

    perspective.ranking

    ||

    perspective.originalRanking

    ||

    perspective.rankingA

    ||

    perspective.first

    ||

    perspective







  if(!ranking?.id){

    return null

  }







  const title =

    ranking.title

    ?

    formatRankingTitle(

      ranking.title

    )

    :

    "Different Perspectives"







  const category =

    ranking.category

    ||

    "Community"








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

          {category}

        </p>







        <h3 className="
          text-3xl
          font-black
          mt-5
          leading-tight
        ">

          {title}

        </h3>







        <p className="
          mt-5
          rankd-muted
        ">

          Different people ranked this differently.

          Compare opinions and join the debate.

        </p>







        <div className="
          mt-8
          pt-6
          border-t
          border-black/10
        ">



          <p className="
            rankd-accent
            font-black
          ">

            See the perspective gap →

          </p>



        </div>






      </article>


    </Link>


  )

}