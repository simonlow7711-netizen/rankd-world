"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import {
  getFeedSections
} from "@/utils/feedRecommendations"





export default function RANKDFeed(){


  const [mounted, setMounted] = useState(false)



  useEffect(() => {

    setMounted(true)

  }, [])





  if(!mounted){

    return null

  }





  const feed = getFeedSections()





  function RankingCard({

    ranking

  }:{

    ranking:any

  }) {


    return (

      <Link

        href={`/rank/${ranking.id}`}

      >

        <div

          className="
            bg-zinc-900
            rounded-3xl
            p-8
            hover:scale-105
            transition
            cursor-pointer
          "

        >


          <p className="
            text-gray-400
            font-bold
          ">

            {ranking.category}

          </p>





          <h3 className="
            text-2xl
            font-black
            mt-4
          ">

            {ranking.title}

          </h3>





          <p className="
            mt-6
            text-orange-400
            font-black
          ">

            Decide your #1 →

          </p>




        </div>


      </Link>

    )

  }








  function Section({

    title,

    items

  }:{

    title:string

    items:any[]

  }) {


    if(!items || items.length === 0){

      return null

    }



    return (

      <section className="
        mb-12
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
          gap-6
        ">


          {items.map((ranking:any)=>(


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

    <section className="
      bg-black
      text-white
      px-6
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">



        <h2 className="
          text-4xl
          md:text-5xl
          font-black
        ">

          Your RANKD Feed

        </h2>




        <p className="
          mt-4
          text-gray-400
          text-lg
        ">

          Discover opinions that match your curiosity.

        </p>





        <div className="mt-12">


          <Section

            title="🧬 Because You Ranked..."

            items={feed.personalised}

          />





          <Section

            title="🔥 Trending Debates"

            items={feed.trending}

          />





          <Section

            title="🔥 Most Debated"

            items={feed.debates}

          />





          <Section

            title="🆕 New Opinions"

            items={feed.newest}

          />



        </div>




      </div>


    </section>


  )


}