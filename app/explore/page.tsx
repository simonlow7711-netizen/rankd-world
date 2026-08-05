import Link from "next/link"

import {
  getAllSupabaseRankings
} from "@/utils/supabaseRankings"

import {
  rankings as seedRankings
} from "@/data/rankings"

import RankingCard from "@/components/RankingCard"

import DailyRankd from "@/components/DailyRankd"

import PerspectiveCard from "@/components/PerspectiveCard"

import TasteMatchCard from "@/components/TasteMatchCard"

import ChallengeCard from "@/components/ChallengeCard"

import {
  getTrendingRankings
} from "@/utils/rankingMetrics"

import {
  getPerspectiveGaps
} from "@/utils/perspectiveMetrics"

import {
  getDiscoverableUsers
} from "@/utils/userDiscovery"

import {
  calculateChallenge
} from "@/utils/challengeTaste"





export const metadata = {

  title:

    "Explore Top 7 Rankings | RANKD",


  description:

    "Discover what the world is ranking."

}









export default async function ExplorePage(){



  const supabaseRankings =

    await getAllSupabaseRankings()







  const allRankings = [

    ...(supabaseRankings ?? []),

    ...seedRankings

  ]

  .filter(

    (ranking,index,self)=>

      ranking &&

      index === self.findIndex(

        item =>

          item.id === ranking.id

      )

  )









  const trendingRankings =

    getTrendingRankings(

      allRankings

    )









  const perspectiveGaps =

    getPerspectiveGaps(

      allRankings

    )









  const discoverableUsers =

    await getDiscoverableUsers(

      "",

      allRankings

    )









  const challenge =

    calculateChallenge(

      allRankings,

      allRankings

    )








  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-12
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">





        <section className="
          mb-16
          text-center
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
            mt-5
            leading-none
          ">

            Explore
            <br />
            RANKD

          </h1>







          <p className="
            mt-6
            text-xl
            rankd-muted
            max-w-xl
            mx-auto
          ">

            Discover the Top 7 opinions
            shaping conversations.

          </p>



        </section>









        <DailyRankd />
                


        <section className="
          mb-20
        ">



          <div className="
            mb-10
          ">


            <p className="
              rankd-accent
              uppercase
              tracking-widest
              text-sm
              font-black
            ">

              Community

            </p>





            <h2 className="
              text-5xl
              font-black
              mt-3
            ">

              Latest RANKDs

            </h2>


          </div>







          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">



            {allRankings

              .slice(0,6)

              .map((ranking:any)=>(


                <RankingCard

                  key={ranking.id}

                  ranking={ranking}

                />


              ))}


          </div>



        </section>









        <section className="
          mb-20
        ">



          <h2 className="
            text-5xl
            font-black
            mb-10
          ">

            🔥 Trending debates

          </h2>







          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">



            {trendingRankings

              .slice(0,3)

              .map((ranking:any)=>(


                <RankingCard

                  key={ranking.id}

                  ranking={ranking}

                />


              ))}


          </div>


        </section>









        <section className="
          mb-20
        ">



          <h2 className="
            text-5xl
            font-black
            mb-10
          ">

            Different perspectives

          </h2>







          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">



            {perspectiveGaps

              .slice(0,3)

              .map((gap:any,index:number)=>(


                <PerspectiveCard

                  key={index}

                  perspective={gap}

                />


              ))}


          </div>


        </section>









        <section className="
          mb-20
        ">



          <h2 className="
            text-5xl
            font-black
            mb-10
          ">

            Your Taste Match

          </h2>







          {discoverableUsers.length > 0 ? (


            <TasteMatchCard

              person={discoverableUsers[0]}

              rankings={allRankings}

            />


          ) : (


            <div className="
              rankd-card
              p-8
            ">


              <p className="
                text-xl
                font-black
              ">

                Create more RANKDs to discover your taste matches.

              </p>


            </div>


          )}



        </section>








        <section className="
          mb-20
        ">



          <h2 className="
            text-5xl
            font-black
            mb-10
          ">

            Challenge your opinion

          </h2>







          {allRankings?.[0] && (

            <ChallengeCard

              ranking={allRankings[0]}

            />

          )}



        </section>









        <Link

          href="/create"

          className="
            block
            bg-black
            text-white
            rounded-[40px]
            p-12
            text-center
          "

        >


          <h2 className="
            text-5xl
            font-black
          ">

            What is your Top 7?

          </h2>





          <p className="
            mt-5
            text-xl
            text-gray-300
          ">

            Create the ranking everyone debates.

          </p>



        </Link>







      </div>


    </main>


  )

}