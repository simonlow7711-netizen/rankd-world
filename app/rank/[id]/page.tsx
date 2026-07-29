"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { rankings } from "@/data/rankings"


export default function RankPage() {


  const params = useParams()

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



    const createdRanking = createdRankings.find(
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

        <h1 className="
          text-3xl
          font-black
        ">
          Loading ranking...
        </h1>

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
          mt-12
          space-y-4
        ">


          {ranking.items.map((item:any) => (

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