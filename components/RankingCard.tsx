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

          {ranking.category || "General"}

        </p>







        <h3 className="
          text-3xl
          font-black
          mt-5
          leading-tight
        ">

          {ranking.title}

        </h3>







        <div className="
          mt-8
          flex
          items-center
          justify-between
        ">




          <div className="
            bg-[#F7F4EE]
            rounded-full
            px-5
            py-3
          ">


            <span className="
              font-black
            ">

              🔥 {debateScore}%

            </span>


          </div>







          <span className="
            rankd-muted
            font-bold
          ">

            Debate heat

          </span>



        </div>







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

            View RANKD →

          </p>



        </div>





      </article>


    </Link>


  )

}