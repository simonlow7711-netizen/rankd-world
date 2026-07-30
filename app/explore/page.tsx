"use client"

import { useEffect, useState } from "react"

import { rankings } from "@/data/rankings"
import RankingCard from "@/components/RankingCard"


export default function Explore() {


  const [communityRankings, setCommunityRankings] = useState<any[]>([])



  useEffect(() => {


    const storedRankings = JSON.parse(
      localStorage.getItem("createdRankings") || "[]"
    )


    setCommunityRankings(storedRankings)


  }, [])



  const allRankings = [

    ...communityRankings,

    ...rankings

  ]



  const trendingRankings = [...allRankings]
    .sort(
      (a,b) =>
        b.views - a.views
    )
    .slice(0,3)



  const newRankings = [...communityRankings]
    .reverse()
    .slice(0,3)



  const officialRankings = rankings.filter(
    ranking =>
      ranking.source === "official"
  )



  return (

    <main className="
      bg-black
      min-h-screen
      text-white
      px-6
      py-20
    ">


      <section className="
        max-w-6xl
        mx-auto
      ">


        <h1 className="
          text-5xl
          md:text-6xl
          font-black
          mb-4
        ">
          Explore RANKD
        </h1>



        <p className="
          text-gray-400
          text-lg
          mb-16
        ">
          Discover opinions. Find your next ranking.
        </p>



        <section className="mb-16">


          <h2 className="
            text-3xl
            font-black
            mb-8
          ">
            🔥 Trending Today
          </h2>


          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {trendingRankings.map((ranking)=>(

              <RankingCard

                key={ranking.id}

                ranking={ranking}

              />

            ))}


          </div>


        </section>





        {newRankings.length > 0 && (

          <section className="mb-16">


            <h2 className="
              text-3xl
              font-black
              mb-8
            ">
              🆕 New RANKDs
            </h2>



            <div className="
              grid
              md:grid-cols-3
              gap-8
            ">


              {newRankings.map((ranking)=>(

                <RankingCard

                  key={ranking.id}

                  ranking={ranking}

                />

              ))}


            </div>


          </section>

        )}






        <section>


          <h2 className="
            text-3xl
            font-black
            mb-8
          ">
            ⭐ Official Picks
          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">



            {officialRankings.map((ranking)=>(

              <RankingCard

                key={ranking.id}

                ranking={ranking}

              />

            ))}



          </div>


        </section>



      </section>


    </main>

  )

}