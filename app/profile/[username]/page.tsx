"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import TasteDNA from "@/components/TasteDNA"
import Achievements from "@/components/Achievements"
import ProfileCard from "@/components/ProfileCard"

import { calculateTasteDNA } from "@/utils/tasteProfile"
import { calculateAchievements } from "@/utils/achievements"



export default function PublicProfilePage({
  params
}: any) {


  const username = params.username



  const [rankings, setRankings] = useState<any[]>([])



  useEffect(() => {


    const created = JSON.parse(

      localStorage.getItem("createdRankings") || "[]"

    )


    setRankings(created)


  }, [])






  const categories = new Set(

    rankings.map(

      ranking => ranking.category

    )

  )






  const tasteData =
    calculateTasteDNA(rankings)





  const achievementData =
    calculateAchievements(rankings)







  return (

    <main
      className="
        min-h-screen
        bg-black
        text-white
        px-6
        py-16
      "
    >


      <div
        className="
          max-w-5xl
          mx-auto
        "
      >






        <div
          className="
            bg-zinc-900
            rounded-3xl
            p-10
            mb-12
          "
        >



          <h1
            className="
              text-5xl
              font-black
            "
          >
            @{username}
          </h1>



          <p
            className="
              text-gray-400
              mt-3
            "
          >
            RANKD identity
          </p>






          <div
            className="
              mt-8
              grid
              md:grid-cols-3
              gap-5
            "
          >



            <div
              className="
                bg-black
                rounded-2xl
                p-5
              "
            >

              <p className="text-gray-400">
                RANKDs
              </p>


              <p
                className="
                  text-3xl
                  font-black
                  mt-2
                "
              >
                {rankings.length}
              </p>


            </div>






            <div
              className="
                bg-black
                rounded-2xl
                p-5
              "
            >

              <p className="text-gray-400">
                Categories
              </p>


              <p
                className="
                  text-3xl
                  font-black
                  mt-2
                "
              >
                {categories.size}
              </p>


            </div>






            <div
              className="
                bg-black
                rounded-2xl
                p-5
              "
            >

              <p className="text-gray-400">
                Achievements
              </p>


              <p
                className="
                  text-3xl
                  font-black
                  mt-2
                "
              >
                {achievementData.length}
              </p>


            </div>



          </div>



        </div>







        <ProfileCard

          username={username}

          rankings={rankings}

          achievements={achievementData}

        />








        <TasteDNA

          data={tasteData}

        />







        <Achievements

          achievements={achievementData}

        />







        <h2
          className="
            text-3xl
            font-black
            mb-8
          "
        >
          Rankings
        </h2>







        <div
          className="
            space-y-4
          "
        >



          {rankings.map((ranking)=>(


            <Link

              key={ranking.id}

              href={`/rank/${ranking.id}`}

            >


              <div

                className="
                  bg-white
                  text-black
                  rounded-2xl
                  p-6
                  mb-4
                "

              >



                <p
                  className="
                    text-gray-500
                  "
                >
                  #{ranking.category}
                </p>




                <h3

                  className="
                    text-2xl
                    font-black
                  "

                >

                  {ranking.title}

                </h3>



              </div>


            </Link>


          ))}



        </div>






      </div>



    </main>

  )

}