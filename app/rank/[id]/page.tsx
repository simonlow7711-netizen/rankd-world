"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { rankings } from "@/data/rankings"


export default function RankPage() {

  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  const [ranking, setRanking] = useState<any>(null)
  const [loading, setLoading] = useState(true)



  useEffect(() => {

    const existingRanking = rankings.find(
      item => item.id === id
    )


    if (existingRanking) {

      setRanking(existingRanking)
      setLoading(false)
      return

    }



    const createdRankings = JSON.parse(
      localStorage.getItem("createdRankings") || "[]"
    )



    const createdRanking = createdRankings.findLast(
      (item:any) => item.id === id
    )



    setRanking(createdRanking || null)

    setLoading(false)


  }, [id])




  if (loading) {

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




  if (!ranking) {

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




  function rankIt() {


    const items = ranking.items
      .map((item:any)=>item.name)
      .join("|")



    router.push(
      `/create?title=${encodeURIComponent(ranking.title)}&items=${encodeURIComponent(items)}&originalId=${ranking.id}`
    )

  }




  const remixCount = ranking.remixes || 0




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


        {remixCount > 0 && (

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
              🔥 {remixCount} people ranked this differently
            </p>


            <p className="
              mt-2
              text-gray-400
            ">
              Your opinion could change the ranking.
            </p>

          </div>

        )}



        {ranking.remixedFrom && (

          <div className="
            mb-8
            bg-white
            text-black
            rounded-2xl
            p-5
          ">


            <p className="
              text-xl
              font-black
            ">
              🔁 REMIXED RANKD
            </p>


            <p className="
              mt-2
              font-semibold
            ">
              This ranking was inspired by another opinion.
            </p>


          </div>

        )}




        <p className="
          text-gray-400
        ">
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


              <span className="
                text-gray-500
              ">
                {item.votes}
              </span>


            </div>


          ))}


        </div>



      </div>


    </main>

  )

}