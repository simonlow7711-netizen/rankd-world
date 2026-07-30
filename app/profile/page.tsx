"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import TasteDNA from "@/components/TasteDNA"
import Achievements from "@/components/Achievements"

import { calculateTasteDNA } from "@/utils/tasteProfile"
import { calculateAchievements } from "@/utils/achievements"



export default function ProfilePage() {


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






  const tasteData = calculateTasteDNA(rankings)



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
            Simon
          </h1>



          <p
            className="
              mt-3
              text-gray-400
            "
          >
            Your RANKD identity starts here.
          </p>





          <div
            className="
              mt-10
              grid
              md:grid-cols-3
              gap-6
            "
          >



            <div
              className="
                bg-black
                rounded-2xl
                p-6
              "
            >

              <p className="text-gray-500">
                RANKDs Created
              </p>


              <p
                className="
                  text-4xl
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
                p-6
              "
            >

              <p className="text-gray-500">
                Categories
              </p>


              <p
                className="
                  text-4xl
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
                p-6
              "
            >

              <p className="text-gray-500">
                Opinions Shared
              </p>


              <p
                className="
                  text-4xl
                  font-black
                  mt-2
                "
              >
                {rankings.length}
              </p>

            </div>



          </div>


        </div>







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
          My RANKDs
        </h2>








        <div
          className="
            space-y-4
          "
        >





          {rankings.length === 0 && (


            <div
              className="
                bg-zinc-900
                rounded-2xl
                p-8
              "
            >

              <p
                className="
                  text-xl
                  font-bold
                "
              >
                You haven't created a RANKD yet.
              </p>


            </div>


          )}








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
                  hover:scale-[1.02]
                  transition
                  cursor-pointer
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
                    mt-2
                  "
                >

                  {ranking.title}

                </h3>



              </div>


            </Link>


          ))}





        </div>








        <Link href="/create">


          <button

            className="
              mt-12
              bg-white
              text-black
              px-8
              py-4
              rounded-full
              font-black
            "

          >

            Create Another RANKD →

          </button>


        </Link>





      </div>


    </main>

  )

}