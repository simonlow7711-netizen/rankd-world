import Link from "next/link"

import RankingCard from "@/components/RankingCard"

import {
  getAllRankings
} from "@/utils/supabaseRankings"


export default async function RANKDFeed() {


  const data =
    await getAllRankings()


  const latestRankings =

    (data ?? [])

      .sort(

        (a, b) =>

          new Date(

            b.createdAt ??
            "1970-01-01"

          ).getTime()

          -

          new Date(

            a.createdAt ??
            "1970-01-01"

          ).getTime()

      )

      .slice(
        0,
        6
      )


  return (

    <section className="
      py-20
      px-6
    ">

      <div className="
        max-w-6xl
        mx-auto
      ">


        <div className="
          flex
          justify-between
          items-end
          mb-10
        ">


          <div>


            <p className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            ">

              Community

            </p>


            <h2 className="
              text-4xl
              md:text-5xl
              font-black
              mt-3
            ">

              Latest RANKDs

            </h2>


            <p className="
              mt-4
              text-gray-500
              max-w-xl
            ">

              Fresh perspectives from the community.

            </p>


          </div>


          <Link

            href="/explore"

            className="
              hidden
              md:block
              font-black
              hover:opacity-60
              transition
            "

          >

            Explore all →

          </Link>


        </div>


        {
          latestRankings.length === 0 ? (

            <div className="
              rankd-card
              p-8
              text-center
            ">


              <h3 className="
                text-2xl
                font-black
              ">

                No RANKDs yet

              </h3>


              <p className="
                mt-3
                text-gray-500
              ">

                Be the first person to create a Top 7.

              </p>


              <Link

                href="/create"

                className="
                  inline-block
                  mt-6
                  rankd-button
                "

              >

                Create a RANKD →

              </Link>


            </div>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-8
            ">


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

        }


      </div>

    </section>

  )

}