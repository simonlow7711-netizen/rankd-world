"use client"

import { useEffect, useState } from "react"

import { rankings } from "@/data/rankings"

import RankingCard from "@/components/RankingCard"
import DailyRankd from "@/components/DailyRankd"
import PerspectiveCard from "@/components/PerspectiveCard"
import PeopleCard from "@/components/PeopleCard"
import TasteMatchCard from "@/components/TasteMatchCard"
import ChallengeCard from "@/components/ChallengeCard"

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
  calculateChallenge
} from "@/utils/challengeTaste"


export default function Explore() {


  const [communityRankings, setCommunityRankings] =
    useState<any[]>([])



  useEffect(() => {

    const storedRankings = JSON.parse(

      localStorage.getItem("createdRankings") || "[]"

    )


    setCommunityRankings(storedRankings)


  }, [])




  const allRankings = [

    ...communityRankings,

    ...rankings

  ].filter(

    (ranking, index, self) =>

      index === self.findIndex(

        item =>

          item.id === ranking.id &&

          item.creator === ranking.creator

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

      .map((person:any)=>({

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

      .map((person:any)=>{


        const challenge =

          calculateChallenge(

            currentUser?.rankings || [],

            person.rankings

          )



        if(!challenge)

          return null



        return {

          person,

          ranking:

            challenge.comparedRanking,


          challenge

        }


      })

      .filter(Boolean)






  function Section({

    title,

    items

  }:{

    title:string

    items:any[]

  }) {


    if(items.length === 0)

      return null



    return (

      <section

        className="mb-16"

      >


        <h2

          className="
            text-3xl
            font-black
            mb-6
          "

        >

          {title}

        </h2>




        <div

          className="
            grid
            md:grid-cols-3
            gap-8
          "

        >



          {items.map((ranking)=>(


            <RankingCard

              key={`${ranking.id}-${ranking.creator}`}

              ranking={ranking}

            />


          ))}



        </div>


      </section>


    )


  }





  return (


    <main

      className="
        bg-black
        min-h-screen
        text-white
        px-6
        py-20
      "

    >



      <section

        className="
          max-w-6xl
          mx-auto
        "

      >




        <h1

          className="
            text-5xl
            md:text-6xl
            font-black
            mb-4
          "

        >

          Explore RANKD

        </h1>




        <p

          className="
            text-gray-400
            text-lg
            mb-10
          "

        >

          Discover opinions. Create your own Top 7.

        </p>





        <DailyRankd />





        <Section

          title="🔥 Trending RANKDs"

          items={trending}

        />




        <Section

          title="⚡ Biggest Debates"

          items={debates}

        />






        <section

          className="mb-16"

        >



          <h2

            className="
              text-3xl
              font-black
              mb-6
            "

          >

            🌍 Biggest Perspective Gaps

          </h2>




          <div

            className="
              grid
              md:grid-cols-3
              gap-8
            "

          >



            {perspectiveGaps.map((item:any)=>(


              <PerspectiveCard

                key={`${item.ranking.id}-${item.ranking.creator}`}

                ranking={item.ranking}

                gap={item.gap}

              />


            ))}



          </div>


        </section>







        <section

          className="mb-16"

        >



          <h2

            className="
              text-3xl
              font-black
              mb-6
            "

          >

            👥 People to Explore

          </h2>




          <div

            className="
              grid
              md:grid-cols-3
              gap-8
            "

          >



            {people.map((person:any)=>(


              <PeopleCard

                key={person.username}

                person={person}

              />


            ))}



          </div>



        </section>







        <section

          className="mb-16"

        >



          <h2

            className="
              text-3xl
              font-black
              mb-6
            "

          >

            🧬 People Who Rank Like You

          </h2>




          <div

            className="
              grid
              md:grid-cols-3
              gap-8
            "

          >



            {tasteMatches.map((item:any)=>(


              <TasteMatchCard

                key={item.person.username}

                person={item.person}

                match={item.match}

              />


            ))}



          </div>



        </section>







        <section

          className="mb-16"

        >



          <h2

            className="
              text-3xl
              font-black
              mb-6
            "

          >

            🆚 Challenge My Taste

          </h2>




          <div

            className="
              grid
              md:grid-cols-3
              gap-8
            "

          >



            {challenges.map((item:any)=>(


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





      </section>


    </main>


  )


}