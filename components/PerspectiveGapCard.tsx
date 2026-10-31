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
      rankd-edition
      rounded-[28px]
      border
      border-black
      bg-[#F7F4EE]
      p-6
      text-center
      text-black
    ">


      <p className="
        text-[11px]
        font-black
        uppercase
        tracking-[0.22em]
        text-[#FF6B35]
      ">

        Perspective Gap

      </p>





      <p className="
        mt-3
        text-black/50
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
        text-black/50
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
            mt-6
            block
            rounded-full
            border
            border-black
            bg-black
            py-3
            text-center
            font-black
            text-white
            transition
            hover:bg-[#FF6B35]
            hover:text-black
          "

        >

          See Different Opinions →

        </Link>

      )}






      {remixCount === 0 && (

        <p className="
          mt-6
          text-sm
          text-black/40
        ">

          Be the first person to create a different perspective.

        </p>

      )}



    </div>

  )

}
