"use client"

import Link from "next/link"





export default function ChallengeCard({

  person,

  ranking,

  challenge

}:{

  person:any

  ranking:any

  challenge:any

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



        <div className="
          text-3xl
          mb-4
        ">

          🆚

        </div>





        <p className="
          text-gray-400
          font-bold
        ">

          Challenge My Taste

        </p>





        <h3 className="
          text-2xl
          font-black
          mt-4
        ">

          {ranking.title}

        </h3>





        <p className="
          mt-5
          text-gray-400
        ">

          You and {person.username} rank this differently.

        </p>





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

            ⚡

          </span>


          <span className="
            text-sm
            font-black
          ">

            Difference Score {challenge.difference}

          </span>


        </div>





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