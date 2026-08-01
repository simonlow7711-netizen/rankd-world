"use client"

import Link from "next/link"


interface PerspectiveGapCardProps {

  rankingId: string

  remixCount: number

}



export default function PerspectiveGapCard({

  rankingId,

  remixCount

}: PerspectiveGapCardProps) {


  return (

    <div className="
      bg-zinc-900
      rounded-3xl
      p-6
    ">


      <p className="
        text-xl
        font-black
      ">

        🔥 Perspective Gap

      </p>





      <p className="
        mt-3
        text-gray-400
      ">

        Everyone has their own Top 7.

      </p>






      <p className="
        mt-4
        text-3xl
        font-black
      ">

        {remixCount}

      </p>





      <p className="
        text-gray-400
      ">

        {remixCount === 1
          ? "different perspective created"
          : "different perspectives created"
        }

      </p>







      {remixCount > 0 && (

        <Link

          href={`/rank/${rankingId}/debate`}

          className="
            block
            mt-6
            bg-white
            text-black
            text-center
            rounded-full
            py-3
            font-black
          "

        >

          See Different Opinions →

        </Link>

      )}







      {remixCount === 0 && (

        <p className="
          mt-6
          text-sm
          text-gray-500
        ">

          Be the first person to create a different perspective.

        </p>

      )}



    </div>

  )

}