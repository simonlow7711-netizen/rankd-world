"use client"

import Link from "next/link"

import {
  useEffect,
  useState
} from "react"

import RankingCard from "@/components/RankingCard"

import {
  Ranking
} from "@/types/ranking"

import {
  getAllRankings
} from "@/utils/supabaseRankings"

import {
  getRecentRankingAnalytics
} from "@/utils/rankingEngagement"

import {
  calculateTrendingScores
} from "@/utils/trendingScore"


export default function Trending() {

  const [
    rankings,
    setRankings
  ] =
    useState<Ranking[]>([])


  const [
    loading,
    setLoading
  ] =
    useState(true)


  useEffect(() => {

    async function loadRankings() {

      try {

        const data =
          await getAllRankings()


        const rankingIds =
          data.map(
            ranking =>
              ranking.id
          )


        const events =
          await getRecentRankingAnalytics(
            rankingIds
          )


        const trending =
          calculateTrendingScores(
            data,
            events
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


        setRankings(
          trending
        )

      }

      catch {

        setRankings([])

      }

      finally {

        setLoading(false)

      }

    }


    loadRankings()

  }, [])


  return (

    <section
      className="
        bg-[#F7F4EE]
        px-6
        py-20
        md:py-24
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            border-b
            border-black/10
            pb-8
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
              TRENDING
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
              RANKDs people are talking about.
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


          <Link
            href="/explore"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              text-sm
              font-black
              transition
              hover:opacity-50
              md:mb-1
            "
          >
            <span>
              Explore all
            </span>

            <span
              className="
                text-lg
                leading-none
                rankd-accent
              "
            >
              →
            </span>
          </Link>

        </div>


        {loading ? (

          <div
            className="
              border
              border-black/10
              bg-white/30
              p-8
              text-center
              text-sm
              font-black
            "
          >
            Loading perspectives...
          </div>

        ) : rankings.length === 0 ? (

          <div
            className="
              border
              border-black/10
              bg-white/30
              p-8
              text-center
              text-sm
              text-black/50
            "
          >
            No trending RANKDs yet.
          </div>

        ) : (

          <div
            className="
              grid
              gap-6
              md:grid-cols-3
              md:gap-8
            "
          >

            {rankings.map(
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
            )}

          </div>

        )}

      </div>

    </section>

  )

}