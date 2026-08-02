"use client"

import Link from "next/link"

import RankingCard from "@/components/RankingCard"

import { rankings } from "@/data/rankings"

import {
  useEffect,
  useState
} from "react"

import {
  getAllSupabaseRankings
} from "@/utils/supabaseRankings"







export default function RANKDFeed(){



  const [communityRankings,setCommunityRankings] =
    useState<any[]>([])



  const [loading,setLoading] =
    useState(true)









  useEffect(()=>{



    async function loadRankings(){



      const data =

        await getAllSupabaseRankings()





      setCommunityRankings(

        data ?? []

      )





      setLoading(false)



    }





    loadRankings()



  },[])









  const allRankings = [

    ...communityRankings,

    ...rankings

  ]

  .filter(

    (ranking,index,self)=>

      index === self.findIndex(

        item =>

          item.id === ranking.id

      )

  )

  .slice(0,6)









  if(loading){


    return (

      <section className="
        py-20
      ">


        <div className="
          max-w-6xl
          mx-auto
        ">


          <div className="
            rankd-card
            p-8
            text-center
            font-black
          ">

            Loading opinions...

          </div>


        </div>


      </section>

    )


  }









  return (

    <section className="
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">





        <div className="
          flex
          justify-between
          items-end
          mb-10
        ">



          <div>


            <p className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            ">

              Community opinions

            </p>





            <h2 className="
              text-4xl
              md:text-5xl
              font-black
              mt-3
            ">

              Latest RANKDs

            </h2>



            <p className="
              mt-4
              text-gray-500
              max-w-xl
            ">

              Real people. Real choices.
              Discover what the world is ranking.

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

            Explore all →

          </Link>




        </div>









        {allRankings.length === 0 ? (


          <div className="
            rankd-card
            p-10
            text-center
          ">


            <h3 className="
              text-2xl
              font-black
            ">

              No RANKDs yet

            </h3>



            <p className="
              mt-3
              text-gray-500
            ">

              Be the first person to decide the Top 7.

            </p>



            <Link

              href="/create"

              className="
                inline-block
                mt-6
                rankd-button
              "

            >

              Create a RANKD →

            </Link>


          </div>


        ) : (


          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {allRankings.map(ranking=>(


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