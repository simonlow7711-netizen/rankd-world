"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { rankings } from "@/data/rankings"
import { calculatePerspectiveGap } from "@/utils/perspectiveGap"


export default function RankPage() {


  const params = useParams()

  const router = useRouter()


  const id = params.id as string


  const [ranking, setRanking] = useState<any>(null)

  const [originalRanking, setOriginalRanking] = useState<any>(null)

  const [perspectiveGap, setPerspectiveGap] = useState<any>(null)

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



    if (createdRanking) {

      setRanking(createdRanking)



      if (createdRanking.remixedFrom) {


        const original = rankings.find(
          item => item.id === createdRanking.remixedFrom
        )



        if (original) {

          setOriginalRanking(original)


          const gaps = calculatePerspectiveGap(
            original,
            createdRanking
          )


          setPerspectiveGap(gaps[0])

        }


      }


    }



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









  function rankIt() {


    const items = ranking.items

      .map((item:any) => item.name)

      .join("|")



    router.push(

      `/create?title=${encodeURIComponent(ranking.title)}&items=${encodeURIComponent(items)}&originalId=${ranking.id}`

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







        {ranking.remixedFrom && (

          <div className="
            mb-8
            bg-white
            text-black
            rounded-2xl
            p-5
          ">


            <p className="
              font-black
              text-xl
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






        {perspectiveGap && (

          <div className="
            mb-8
            bg-zinc-900
            rounded-2xl
            p-6
          ">


            <p className="
              text-gray-400
              font-bold
            ">
              🔥 BIGGEST PERSPECTIVE GAP
            </p>



            <h2 className="
              text-3xl
              font-black
              mt-3
            ">
              {perspectiveGap.item}
            </h2>



            <p className="
              mt-3
              text-gray-300
            ">
              Original: #{perspectiveGap.originalPosition}
              <br />
              Your ranking: #{perspectiveGap.remixPosition}
            </p>



            <p className="
              mt-3
              font-bold
            ">
              {perspectiveGap.difference} position difference
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








        <button

          onClick={rankIt}

          className="
            mt-8
            bg-white
            text-black
            px-8
            py-4
            rounded-full
            font-black
          "

        >

          RANKD IT

        </button>









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