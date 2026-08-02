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

      <section className="
        mb-20
      ">


        <h2 className="
          text-4xl
          font-black
          mb-8
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
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">





        <header className="
          text-center
          max-w-4xl
          mx-auto
          mb-20
        ">



          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            Discover

          </p>






          <h1 className="
            text-6xl
            md:text-8xl
            font-black
            mt-6
            leading-none
          ">

            Explore RANKD

          </h1>






          <p className="
            mt-8
            text-xl
            md:text-2xl
            rankd-muted
            leading-relaxed
          ">

            See what people think.

            <br />

            Find rankings that make you say:

            <br />

            <span className="
              font-black
              text-black
            ">

              "I'd rank it differently."

            </span>

          </p>



        </header>








        <DailyRankd />









        <Section

          title="Trending debates"

          items={debates}

        />









        <section className="
          mb-20
        ">


          <h2 className="
            text-4xl
            font-black
            mb-8
          ">

            Biggest perspective gaps

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









        <section className="
          mb-20
        ">


          <h2 className="
            text-4xl
            font-black
            mb-8
          ">

            People who rank like you

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









        <section className="
          mb-20
        ">


          <h2 className="
            text-4xl
            font-black
            mb-8
          ">

            Challenge your taste

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

          title="Latest opinions"

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