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


import {
  supabase
} from "@/utils/supabase"


const SITE_URL =
  "https://rankd.world"


const PHOTO_RANKD_ID =
  "c08cfbd3-4a9f-4286-85c0-5daa4cff737b"


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


  const {
    data:
      photoRankd
  } =
    await supabase
      .from("photo_rankds")
      .select(
        `
          id,
          title,
          description,
          image_url
        `
      )
      .eq(
        "id",
        PHOTO_RANKD_ID
      )
      .maybeSingle()


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-6
        "
      >

        <section
          className="
            border-b
            border-black/10
            py-12
            md:py-16
          "
        >

          <div
            className="
              max-w-3xl
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                rankd-accent
              "
            >
              DISCOVER
            </p>


            <h1
              className="
                mt-3
                text-4xl
                font-black
                leading-none
                tracking-[-0.045em]
                md:text-6xl
              "
            >
              Explore RANKD.
            </h1>


            <p
              className="
                mt-4
                max-w-xl
                text-base
                leading-relaxed
                text-black/50
                md:text-lg
              "
            >
              Discover the Top 7 opinions
              shaping conversations.
            </p>

          </div>

        </section>


        <section
          className="
            border-b
            border-black/10
            py-2
            md:py-4
          "
        >

          <DailyRankd />

        </section>


        {
          photoRankd && (

            <section
              className="
                border-b
                border-black/10
                py-16
                md:py-24
              "
            >

              <div
                className="
                  mb-10
                  flex
                  flex-col
                  gap-6
                  md:mb-12
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.3em]
                      rankd-accent
                    "
                  >
                    VISUAL RANKD
                  </p>


                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                      leading-none
                      tracking-[-0.045em]
                      md:text-6xl
                    "
                  >
                    Photo RANKD.
                  </h2>


                  <p
                    className="
                      mt-4
                      max-w-xl
                      text-base
                      leading-relaxed
                      text-black/50
                      md:text-lg
                    "
                  >
                    A different way to make
                    your Top 7 choices.
                  </p>

                </div>


                <Link
                  href={`/photo-rankd/${PHOTO_RANKD_ID}`}
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-3
                    self-start
                    rounded-full
                    border
                    border-black
                    bg-black
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-[#FF6B35]
                    hover:text-black
                    md:self-end
                  "
                >

                  <span>
                    Open Photo RANKD
                  </span>


                  <span
                    className="
                      text-lg
                      leading-none
                    "
                  >
                    →
                  </span>

                </Link>

              </div>


              <Link
                href={`/photo-rankd/${PHOTO_RANKD_ID}`}
                className="
                  group
                  block
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/10
                  bg-white
                  shadow-sm
                  transition
                  hover:border-black/30
                  hover:shadow-md
                "
              >

                <div
                  className="
                    grid
                    md:grid-cols-[1.65fr_0.75fr]
                  "
                >

                  <div
                    className="
                      relative
                      min-h-[340px]
                      overflow-hidden
                      bg-black
                      md:min-h-[520px]
                    "
                  >

                    <img
                      src={
                        photoRankd.image_url
                      }
                      alt={
                        "Photo RANKD"
                      }
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-[1.015]
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/35
                        via-transparent
                        to-transparent
                      "
                    />


                    <div
                      className="
                        absolute
                        left-6
                        top-6
                        md:left-8
                        md:top-8
                      "
                    >

                      <span
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.2em]
                          text-white
                          drop-shadow
                        "
                      >
                        Photo RANKD
                      </span>

                    </div>

                  </div>


                  <div
                    className="
                      flex
                      flex-col
                      justify-between
                      bg-[#F7F4EE]
                      p-8
                      md:p-10
                      lg:p-12
                    "
                  >

                    <div>

                      <div
                        className="
                          flex
                          items-start
                          justify-end
                        "
                      >

                        <span
                          className="
                            border
                            border-black/15
                            px-3
                            py-2
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.2em]
                            text-black/50
                          "
                        >
                          Visual
                        </span>

                      </div>


                      <h3
                        className="
                          mt-10
                          text-4xl
                          font-black
                          leading-[0.9]
                          tracking-[-0.055em]
                          md:text-5xl
                        "
                      >
                        See it.
                        <br />
                        Rank it differently.
                      </h3>


                      <p
                        className="
                          mt-6
                          text-base
                          leading-relaxed
                          text-black/50
                        "
                      >
                        Photo RANKD turns photographs
                        into Top 7 choices. Explore an
                        image, discover the seven things
                        hidden within it, and make your
                        own order.
                      </p>

                    </div>


                    <div
                      className="
                        mt-12
                        border-t
                        border-black/10
                        pt-6
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span
                          className="
                            text-sm
                            font-black
                          "
                        >
                          Explore Photo RANKD
                        </span>


                        <span
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-black
                            text-lg
                            text-white
                            transition
                            group-hover:bg-[#FF6B35]
                            group-hover:text-black
                          "
                        >
                          →
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </Link>

            </section>

          )
        }


        <section
          className="
            border-b
            border-black/10
            py-16
            md:py-24
          "
        >

          <div
            className="
              mb-10
              flex
              flex-col
              gap-6
              md:mb-12
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.3em]
                  rankd-accent
                "
              >
                COMMUNITY
              </p>


              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  leading-none
                  tracking-[-0.045em]
                  md:text-6xl
                "
              >
                Latest RANKDs.
              </h2>


              <p
                className="
                  mt-4
                  max-w-xl
                  text-base
                  leading-relaxed
                  text-black/50
                  md:text-lg
                "
              >
                Fresh perspectives from the RANKD community.
              </p>

            </div>

          </div>


          {
            latestRankings.length > 0

              ? (

                <div
                  className="
                    grid
                    gap-6
                    md:grid-cols-3
                    md:gap-8
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
                    border
                    border-black/10
                    bg-white/30
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
                      text-black/50
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
            border-b
            border-black/10
            py-16
            md:py-24
          "
        >

          <div
            className="
              mb-10
              flex
              flex-col
              gap-6
              md:mb-12
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.3em]
                  rankd-accent
                "
              >
                WHAT'S HAPPENING
              </p>


              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  leading-none
                  tracking-[-0.045em]
                  md:text-6xl
                "
              >
                Trending debates.
              </h2>


              <p
                className="
                  mt-4
                  max-w-xl
                  text-base
                  leading-relaxed
                  text-black/50
                  md:text-lg
                "
              >
                The rankings generating the most interesting opinions.
              </p>

            </div>

          </div>


          {
            trendingRankings.length > 0

              ? (

                <div
                  className="
                    grid
                    gap-6
                    md:grid-cols-3
                    md:gap-8
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
                    border
                    border-black/10
                    bg-white/30
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


        <section
          className="
            py-20
            md:py-28
          "
        >

          <div
            className="
              flex
              flex-col
              gap-8
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.3em]
                  rankd-accent
                "
              >
                YOUR TURN
              </p>


              <h2
                className="
                  mt-4
                  max-w-3xl
                  text-4xl
                  font-black
                  leading-[0.95]
                  tracking-[-0.045em]
                  md:text-6xl
                "
              >
                Have a different
                <br className="hidden md:block" />
                perspective?
              </h2>


              <p
                className="
                  mt-5
                  max-w-xl
                  text-lg
                  leading-relaxed
                  text-black/50
                "
              >
                Create your own Top 7
                and add your perspective to the world.
              </p>

            </div>


            <Link
              href="/create"
              className="
                inline-flex
                shrink-0
                items-center
                gap-3
                self-start
                rounded-full
                border
                border-black
                bg-black
                px-7
                py-4
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#FF6B35]
                hover:text-black
                md:self-end
              "
            >

              <span>
                Create your RANKD
              </span>


              <span
                className="
                  text-lg
                  leading-none
                "
              >
                →
              </span>

            </Link>

          </div>

        </section>

      </div>

    </main>

  )

}