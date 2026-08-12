import Link from "next/link"


import {
  getAllRankings
} from "@/utils/supabaseRankings"


import RankingCard from "@/components/RankingCard"


import TasteRecommendationCard from "@/components/TasteRecommendationCard"


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


import {
  getCurrentUserId
} from "@/utils/currentUserServer"


import {
  getTasteGraph
} from "@/utils/tasteGraphServer"


import {
  getTasteRecommendedRankings
} from "@/utils/tasteRecommendations"


export const dynamic = "force-dynamic"


export const metadata = {

  title:
    "Explore Top 7 Rankings | RANKD",

  description:
    "Discover what the world is ranking."

}


export default async function ExplorePage() {

  const allRankings =
    await getAllRankings()


  const currentUserId =
    await getCurrentUserId()


  const tasteGraph =
    currentUserId
      ? await getTasteGraph(
          currentUserId
        )
      : null


  const recommendedRankings =
    tasteGraph &&
    currentUserId
      ? getTasteRecommendedRankings(
          tasteGraph,
          allRankings,
          currentUserId
        )
      : []


  const latestRankings =
    [...allRankings]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ).getTime()
          -
          new Date(
            a.createdAt || 0
          ).getTime()
      )
      .slice(
        0,
        6
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
      currentUserId ?? "",
      allRankings
    )


  const challenge =
    calculateChallenge(
      allRankings,
      allRankings
    )


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
        px-6
        py-12
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >

        <section
          className="
            mb-16
            text-center
          "
        >

          <p
            className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            "
          >

            Discover

          </p>


          <h1
            className="
              text-6xl
              md:text-8xl
              font-black
              mt-5
              leading-none
            "
          >

            Explore
            <br />
            RANKD

          </h1>


          <p
            className="
              mt-6
              text-xl
              rankd-muted
              max-w-xl
              mx-auto
            "
          >

            Discover the Top 7 opinions
            shaping conversations.

          </p>

        </section>


        <DailyRankd />


        <section
          className="
            mb-20
          "
        >

          <div
            className="
              mb-10
            "
          >

            <p
              className="
                rankd-accent
                uppercase
                tracking-widest
                text-sm
                font-black
              "
            >

              Personalised

            </p>


            <h2
              className="
                text-5xl
                font-black
                mt-3
              "
            >

              Picked for your taste

            </h2>

          </div>


          {
            recommendedRankings.length > 0
              ? (

                <div
                  className="
                    grid
                    md:grid-cols-3
                    gap-8
                  "
                >

                  {
                    recommendedRankings
                      .slice(
                        0,
                        3
                      )
                      .map(
                        recommendation => (

                          <TasteRecommendationCard

                            key={
                              recommendation
                                .ranking
                                .id
                            }

                            recommendation={
                              recommendation
                            }

                          />

                        )
                      )
                  }

                </div>

              )
              : (

                <div
                  className="
                    rankd-card
                    p-8
                  "
                >

                  <p
                    className="
                      text-xl
                      font-black
                    "
                  >

                    Create more RANKDs to unlock
                    personalised discoveries.

                  </p>

                </div>

              )
          }

        </section>


        <section
          className="
            mb-20
          "
        >

          <div
            className="
              mb-10
            "
          >

            <p
              className="
                rankd-accent
                uppercase
                tracking-widest
                text-sm
                font-black
              "
            >

              Community

            </p>


            <h2
              className="
                text-5xl
                font-black
                mt-3
              "
            >

              Latest RANKDs

            </h2>

          </div>


          <div
            className="
              grid
              md:grid-cols-3
              gap-8
            "
          >

            {
              latestRankings.map(
                ranking => (

                  <RankingCard

                    key={
                      ranking.id
                    }

                    ranking={
                      ranking
                    }

                  />

                )
              )
            }

          </div>

        </section>


        <section
          className="
            mb-20
          "
        >

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            🔥 Trending debates

          </h2>


          <div
            className="
              grid
              md:grid-cols-3
              gap-8
            "
          >

            {
              trendingRankings
                .slice(
                  0,
                  3
                )
                .map(
                  ranking => (

                    <RankingCard

                      key={
                        ranking.id
                      }

                      ranking={
                        ranking
                      }

                    />

                  )
                )
            }

          </div>

        </section>


        <section
          className="
            mb-20
          "
        >

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Different perspectives

          </h2>


          <div
            className="
              grid
              md:grid-cols-3
              gap-8
            "
          >

            {
              perspectiveGaps
                .slice(
                  0,
                  3
                )
                .map(
                  (
                    gap,
                    index
                  ) => (

                    <PerspectiveCard

                      key={
                        index
                      }

                      perspective={
                        gap
                      }

                    />

                  )
                )
            }

          </div>

        </section>


        <section
          className="
            mb-20
          "
        >

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Your Taste Match

          </h2>


          {
            discoverableUsers.length > 0
              ? (

                <TasteMatchCard

                  person={
                    discoverableUsers[0]
                  }

                  rankings={
                    allRankings
                  }

                />

              )
              : (

                <div
                  className="
                    rankd-card
                    p-8
                  "
                >

                  <p
                    className="
                      text-xl
                      font-black
                    "
                  >

                    Create more RANKDs to discover
                    your taste matches.

                  </p>

                </div>

              )
          }

        </section>


        <section
          className="
            mb-20
          "
        >

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Challenge your opinion

          </h2>


          {
            allRankings?.[0] && (

              <ChallengeCard

                ranking={
                  allRankings[0]
                }

              />

            )
          }

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

          <h2
            className="
              text-5xl
              font-black
            "
          >

            Create your own RANKD

          </h2>


          <p
            className="
              mt-4
              text-lg
              opacity-80
            "
          >

            Add your perspective to the world.

          </p>

        </Link>

      </div>

    </main>

  )

}