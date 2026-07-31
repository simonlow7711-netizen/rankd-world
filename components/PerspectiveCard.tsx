"use client"

import Link from "next/link"





export default function PerspectiveCard({

  ranking,

  gap

}:{

  ranking:any

  gap:number

}) {


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
          mt-6
          inline-flex
          items-center
          gap-2
          bg-black
          rounded-full
          px-4
          py-2
        ">


          <span>

            🌍

          </span>


          <span className="
            text-sm
            font-black
          ">

            Perspective Gap {gap}%

          </span>


        </div>





        <p className="
          mt-5
          text-gray-400
        ">

          Different people rank this differently.

        </p>





        <p className="
          mt-6
          text-orange-400
          font-black
        ">

          Compare opinions →

        </p>




      </div>


    </Link>

  )


}