import Link from "next/link"

import RankingCard from "@/components/RankingCard"

import {
  Ranking
} from "@/types/ranking"


type Props = {
  rankings: Ranking[]
}


export default function RANKDFeed({
  rankings
}: Props) {


  const latestRankings =

    [...rankings]

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
          mb-10
          text-center
        ">


          <div className="
            mx-auto
          ">


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
              mx-auto
              mt-4
              max-w-xl
              text-gray-500
            ">

              Fresh perspectives from the community.

            </p>


          </div>


          <Link

            href="/explore"

            className="
              mt-5
              inline-block
              font-black
              transition
              hover:opacity-60
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