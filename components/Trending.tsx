"use client"

import Link from "next/link"

import {
  useEffect,
  useState
} from "react"

import RankingCard from "@/components/RankingCard"

import {
  getAllRankings
} from "@/utils/supabaseRankings"





export default function Trending(){


  const [rankings,setRankings] =

    useState<any[]>([])



  const [loading,setLoading] =

    useState(true)








  useEffect(()=>{


    async function loadRankings(){


      const data =

        await getAllRankings()





      const trendingRankings =

        (data ?? [])

        .sort(

          (a,b)=>

            (b.signals?.rankdScore ?? 0)

            -

            (a.signals?.rankdScore ?? 0)

        )

        .slice(0,3)





      setRankings(

        trendingRankings

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

              🔥 Trending RANKDs

            </h2>





            <p className="
              mt-4
              text-gray-500
              max-w-xl
            ">

              The rankings generating the most interesting opinions.

            </p>



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
            text-center
            font-black
          ">

            Loading perspectives...

          </div>


        ) : rankings.length === 0 ? (


          <div className="
            rankd-card
            p-8
            text-center
          ">

            No trending RANKDs yet.

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