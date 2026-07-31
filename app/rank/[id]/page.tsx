"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { rankings } from "@/data/rankings"
import { trackEvent } from "@/utils/analytics"

import {
  calculateDebate
} from "@/utils/debateEngine"

import DebateCard from "@/components/DebateCard"



export default function RankPage() {


  const params = useParams()

  const router = useRouter()


  const id = params.id as string



  const [ranking,setRanking] =

    useState<any>(null)



  const [loading,setLoading] =

    useState(true)



  const [debate,setDebate] =

    useState<any>(null)







  useEffect(()=>{


    trackEvent(

      "ranking_viewed",

      {
        rankingId:id
      }

    )





    const existingRanking =

      rankings.find(

        item => item.id === id

      )





    let currentRanking = existingRanking






    if(!currentRanking){


      const createdRankings = JSON.parse(

        localStorage.getItem("createdRankings") || "[]"

      )



      currentRanking = createdRankings.find(

        (item:any)=>

          item.id === id

      )


    }





    setRanking(currentRanking)







    if(currentRanking){


      const createdRankings = JSON.parse(

        localStorage.getItem("createdRankings") || "[]"

      )





      const userRanking =

        createdRankings.find(

          (item:any)=>

            item.originalId === currentRanking.id

        )





      if(userRanking){


        const result =

          calculateDebate(

            currentRanking,

            userRanking

          )



        setDebate(result)


      }


    }





    setLoading(false)



  },[id])









  if(loading){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">

        Loading...

      </main>

    )


  }








  if(!ranking){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">


        <h1 className="
          text-4xl
          font-black
        ">

          Ranking not found

        </h1>


      </main>

    )


  }








  function rankIt(){


    trackEvent(

      "rankd_started",

      {
        rankingId:ranking.id
      }

    )





    const items = ranking.items

      .map((item:any)=>item.name)

      .join("|")






    router.push(

      `/create?title=${encodeURIComponent(
        ranking.title
      )}&items=${encodeURIComponent(items)}&originalId=${ranking.id}`

    )


  }









  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">


      <div className="
        max-w-3xl
        mx-auto
      ">





        {debate && (

          <div className="mb-10">

            <DebateCard

              debate={debate}

              rankingId={ranking.id}

            />

          </div>

        )}







        {ranking.remixes > 0 && (

          <div className="
            mb-8
            bg-zinc-900
            rounded-3xl
            p-6
          ">


            <p className="
              text-2xl
              font-black
            ">

              🔥 {ranking.remixes} people ranked this differently

            </p>


            <p className="
              mt-2
              text-gray-400
            ">

              Your opinion could change the ranking.

            </p>


          </div>

        )}







        <p className="text-gray-400">

          #{ranking.category}

        </p>






        <h1 className="
          text-5xl
          font-black
          mt-4
        ">

          {ranking.title}

        </h1>






        <p className="
          mt-4
          text-gray-400
        ">

          Created by {ranking.creator}

        </p>








        <div className="
          mt-8
          bg-zinc-900
          rounded-3xl
          p-6
        ">


          <p className="
            text-xl
            font-black
          ">

            Would you rank this differently?

          </p>



          <p className="
            mt-2
            text-gray-400
          ">

            Everyone has their own Top 7.

          </p>



        </div>








        <button

          onClick={rankIt}

          className="
            mt-8
            w-full
            bg-white
            text-black
            px-8
            py-5
            rounded-full
            font-black
            text-xl
          "

        >

          RANKD IT

        </button>








        <div className="
          mt-12
          space-y-4
        ">



          {ranking.items.map((item:any)=>(


            <div

              key={item.position}

              className="
                bg-white
                text-black
                rounded-2xl
                p-5
                flex
                justify-between
                items-center
              "

            >


              <span className="
                text-xl
                font-bold
              ">

                #{item.position} {item.name}

              </span>




              <span className="text-gray-500">

                {item.votes}

              </span>


            </div>


          ))}


        </div>





      </div>


    </main>

  )


}