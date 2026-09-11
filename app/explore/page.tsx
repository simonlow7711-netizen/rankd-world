import type {
  Metadata
} from "next"

import Link from "next/link"


import {
  getAllRankings
} from "@/utils/supabaseRankings"


import RankingCard from "@/components/RankingCard"


import DailyRankd from "@/components/DailyRankd"


import {
  getRecentRankingAnalytics
} from "@/utils/rankingEngagement"


import {
  calculateTrendingScores
} from "@/utils/trendingScore"


const SITE_URL =
  "https://rankd.world"


export const dynamic =
  "force-dynamic"


export const metadata: Metadata = {

  title:
    "Explore Top 7 Rankings",

  description:
    "Discover the world's Top 7 rankings, trending debates and different perspectives on RANKD.",

  alternates: {

    canonical:
      `${SITE_URL}/explore`

  },

  openGraph: {

    type:
      "website",

    url:
      `${SITE_URL}/explore`,

    siteName:
      "RANKD",

    title:
      "Explore Top 7 Rankings | RANKD",

    description:
      "Discover the world's Top 7 rankings, trending debates and different perspectives on RANKD.",

    locale:
      "en_GB"

  },

  twitter: {

    card:
      "summary_large_image",

    title:
      "Explore Top 7 Rankings | RANKD",

    description:
      "Discover the world's Top 7 rankings, trending debates and different perspectives on RANKD."

  },

  robots: {

    index:
      true,

    follow:
      true

  }

}


export default async function ExplorePage() {

  const allRankings =
    await getAllRankings()


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


  const rankingIds =
    allRankings.map(

      ranking =>

        ranking.id

    )


  const recentEvents =
    await getRecentRankingAnalytics(

      rankingIds

    )


  const trendingRankings =
    calculateTrendingScores(

      allRankings,

      recentEvents

    )

      .sort(

        (a, b) =>

          b.trendingScore -

          a.trendingScore

      )

      .slice(
        0,
        3
      )

      .map(

        item =>

          item.ranking

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


          {
            latestRankings.length > 0

              ? (

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

                    No RANKDs yet.

                  </p>


                  <p
                    className="
                      mt-2
                      rankd-muted
                    "
                  >

                    Be the first person to create
                    a Top 7.

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

              What's happening

            </p>


            <h2
              className="
                text-5xl
                font-black
                mt-3
              "
            >

              Trending debates

            </h2>

          </div>


          {
            trendingRankings.length > 0

              ? (

                <div
                  className="
                    grid
                    md:grid-cols-3
                    gap-8
                  "
                >

                  {
                    trendingRankings.map(

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

                    Trending debates
                    will appear here.

                  </p>

                </div>

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