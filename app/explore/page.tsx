"use client"

import { useEffect, useState } from "react"

import { rankings } from "@/data/rankings"
import RankingCard from "@/components/RankingCard"

import {
  getTrendingRankings,
  getLatestRankings,
  getBiggestDebates
} from "@/utils/rankingMetrics"



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




  const trending = getTrendingRankings(
    allRankings
  )



  const debates = getBiggestDebates(
    allRankings
  )



  const latest = getLatestRankings(
    allRankings
  )







  function Section({
    title,
    items
  }: {
    title:string
    items:any[]
  }) {


    if(items.length === 0) return null



    return (

      <section className="
        mb-16
      ">


        <h2 className="
          text-3xl
          font-black
          mb-6
        ">

          {title}

        </h2>



        <div className="
          grid
          md:grid-cols-3
          gap-8
        ">


          {items.map((ranking)=>(
            
            <RankingCard

              key={ranking.id}

              ranking={ranking}

            />

          ))}


        </div>



      </section>

    )

  }








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

          Discover opinions. Create your own Top 7.

        </p>






        <Section

          title="🔥 Trending RANKDs"

          items={trending}

        />





        <Section

          title="⚡ Biggest Debates"

          items={debates}

        />






        <Section

          title="🆕 Latest Opinions"

          items={latest}

        />







        <Section

          title="All RANKDs"

          items={allRankings}

        />





      </section>



    </main>

  )

}