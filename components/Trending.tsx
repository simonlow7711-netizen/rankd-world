"use client"

import Link from "next/link"

import { useEffect, useState } from "react"

import RankingCard from "@/components/RankingCard"

import {
  getAllSupabaseRankings
} from "@/utils/supabaseRankings"





export default function Trending(){


  const [rankings,setRankings] =
    useState<any[]>([])


  const [loading,setLoading] =
    useState(true)





  useEffect(()=>{


    async function loadRankings(){


      const data =
        await getAllSupabaseRankings()



      setRankings(

        data
          .slice(0,3)

      )


      setLoading(false)


    }



    loadRankings()


  },[])








  return (

    <section className="
      bg-[#F7F4EE]
      px-6
      py-24
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">





        <div className="
          flex
          justify-between
          items-end
          mb-12
        ">



          <div>


            <p className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            ">

              Community

            </p>





            <h2 className="
              text-5xl
              font-black
              mt-4
            ">

              🔥 Live Perspectives

            </h2>




          </div>







          <Link

            href="/explore"

            className="
              hidden
              md:block
              font-black
              hover:opacity-60
              transition
            "

          >

            View all →

          </Link>



        </div>








        {loading ? (


          <div className="
            rankd-card
            p-8
            font-black
            text-center
          ">

            Loading perspectives...

          </div>


        ) : (



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">



            {rankings.map(ranking=>(


              <RankingCard

                key={ranking.id}

                ranking={ranking}

              />


            ))}



          </div>


        )}




      </div>


    </section>

  )


}