"use client"

import { useEffect, useState } from "react"

import { rankings } from "@/data/rankings"

import DailyRankd from "@/components/DailyRankd"
import RankingCard from "@/components/RankingCard"
import PerspectiveCard from "@/components/PerspectiveCard"
import TasteMatchCard from "@/components/TasteMatchCard"
import ChallengeCard from "@/components/ChallengeCard"

import {
  getAllSupabaseRankings
} from "@/utils/supabaseRankings"


import {
  getTrendingRankings,
  getLatestRankings,
  getBiggestDebates
} from "@/utils/rankingMetrics"


import {
  getPerspectiveGaps
} from "@/utils/perspectiveMetrics"


import {
  getDiscoverableUsers
} from "@/utils/userDiscovery"


import {
  calculateTasteMatch
} from "@/utils/tasteMatching"


import {
  calculateTasteChallenge
} from "@/utils/tasteChallenge"





export default function Explore(){


  const [communityRankings,setCommunityRankings] =
    useState<any[]>([])



  useEffect(()=>{


    async function loadRankings(){


      const data =
        await getAllSupabaseRankings()



      setCommunityRankings(data)


    }



    loadRankings()



  },[])








  const allRankings = [

    ...communityRankings,

    ...rankings

  ].filter(

    (ranking,index,self)=>

      index === self.findIndex(

        item =>

          item.id === ranking.id

      )

  )







  const trending =
    getTrendingRankings(allRankings)


  const debates =
    getBiggestDebates(allRankings)


  const latest =
    getLatestRankings(allRankings)





  const perspectiveGaps =
    getPerspectiveGaps(allRankings)





  const people =
    getDiscoverableUsers(allRankings)





  const currentUser =
    people[0]







  const tasteMatches =

    people

      .slice(1)

      .map(person=>({


        person,


        match:

          calculateTasteMatch(

            currentUser?.rankings || [],

            person.rankings

          )


      }))







  const challenges =

    people

      .slice(1)

      .flatMap(person=>{


        return calculateTasteChallenge(

          currentUser?.rankings || [],

          person.rankings || []

        )

        .map(challenge=>({

          person,

          ranking:

            challenge.ranking,


          challenge


        }))


      })








  function Section({

    title,

    items

  }:{

    title:string

    items:any[]

  }){


    if(!items || items.length === 0)

      return null





    return (

      <section className="mb-16">


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


          {items.map(item=>(


            <RankingCard

              key={item.id}

              ranking={item}

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


      <div className="
        max-w-6xl
        mx-auto
      ">



        <h1 className="
          text-5xl
          md:text-6xl
          font-black
        ">

          Explore RANKD

        </h1>



        <p className="
          mt-4
          text-gray-400
          text-lg
        ">

          Discover opinions. Create your own Top 7.

        </p>





        <DailyRankd />





        <Section
          title="🧬 Because You Ranked..."
          items={trending}
        />





        <Section
          title="🔥 Trending Debates"
          items={debates}
        />







        <section className="mb-16">


          <h2 className="
            text-3xl
            font-black
            mb-6
          ">

            🌍 Biggest Perspective Gaps

          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {perspectiveGaps.map(item=>(


              <PerspectiveCard

                key={item.ranking.id}

                ranking={item.ranking}

                gap={item.gap}

              />


            ))}


          </div>


        </section>







        <section className="mb-16">


          <h2 className="
            text-3xl
            font-black
            mb-6
          ">

            👥 People Who Rank Like You

          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {tasteMatches.map(item=>(


              <TasteMatchCard

                key={item.person.username}

                person={item.person}

                match={item.match}

              />


            ))}


          </div>


        </section>








        <section className="mb-16">


          <h2 className="
            text-3xl
            font-black
            mb-6
          ">

            🆚 Challenge My Taste

          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {challenges.map(item=>(


              <ChallengeCard

                key={`${item.person.username}-${item.ranking.id}`}

                person={item.person}

                ranking={item.ranking}

                challenge={item.challenge}

              />


            ))}


          </div>


        </section>







        <Section

          title="🆕 Latest Opinions"

          items={latest}

        />





        <Section

          title="All RANKDs"

          items={allRankings}

        />




      </div>


    </main>

  )


}