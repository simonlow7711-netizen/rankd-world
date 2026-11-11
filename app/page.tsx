import type {
  Metadata
} from "next"

import PhotoRankdSection from "@/components/PhotoRankdSection"
import RANKDFeed from "@/components/RANKDFeed"
import Trending from "@/components/Trending"
import WhyRankd from "@/components/WhyRankd"
import Categories from "@/components/Categories"
import Footer from "@/components/Footer"

import {
  getCachedPublishedPhotoRankds,
  getCachedRankingSummaries,
  getCachedRecentAnalyticsEvents
} from "@/utils/cachedRankings"

import {
  getRankingsByIds,
  pickHydratedRankings
} from "@/utils/supabaseRankings"

import {
  calculateTrendingScores
} from "@/utils/trendingScore"

import {
  sharePreviewImage
} from "@/utils/ogImage"

import {
  SITE_URL,
  indexableRobots
} from "@/utils/siteUrl"


export const revalidate =
  300


export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "RANKD",
    title: "RANKD — The World's Top 7 Everything",
    description:
      "Discover, create and debate the world's Top 7. Compare opinions, explore different perspectives and rank it differently.",
    locale: "en_GB",
    images: [
      sharePreviewImage(
        "RANKD — The World's Top 7 Everything"
      )
    ]
  },
  robots: indexableRobots
}


export default async function HomePage() {


  const [
    rankingSummaries,
    photoRankds,
    recentEvents
  ] =
    await Promise.all([
      getCachedRankingSummaries(),
      getCachedPublishedPhotoRankds(),
      getCachedRecentAnalyticsEvents()
    ])


  const latestSummaries =
    rankingSummaries.slice(
      0,
      6
    )


  const trendingSummaries =
    calculateTrendingScores(
      rankingSummaries,
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


  const rankingsToShow =
    await getRankingsByIds(
      [
        ...latestSummaries.map(
          ranking =>
            ranking.id
        ),
        ...trendingSummaries.map(
          ranking =>
            ranking.id
        )
      ]
    )


  const rankingsById =
    new Map(
      rankingsToShow.map(
        ranking =>
          [
            ranking.id,
            ranking
          ]
      )
    )


  const latestRankings =
    pickHydratedRankings(
      latestSummaries,
      rankingsById
    )


  const trendingRankings =
    pickHydratedRankings(
      trendingSummaries,
      rankingsById
    )


  return (

    <main
      className="
        bg-[#F7F4EE]
        text-black
      "
    >

      <section
        className="
          px-5
          py-10
          md:px-8
          md:py-16
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >

          <header
            className="
              mb-10
              text-center
              md:mb-12
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-[#FF6B35]
              "
            >
              RANKD / YOUR OPINION
            </p>


            <h1
              className="
                mx-auto
                mt-3
                max-w-3xl
                text-4xl
                font-black
                leading-[0.88]
                tracking-[-0.06em]
                md:text-5xl
                lg:text-6xl
              "
            >
              Would you rank it differently?
            </h1>


            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-base
                font-medium
                leading-relaxed
                text-black/50
                md:text-lg
              "
            >
              See it. Rank it differently.
            </p>

          </header>


          <PhotoRankdSection
            photoRankds={photoRankds}
            showHeading={false}
            showIntro
          />

        </div>

      </section>


      <div
        className="
          mx-auto
          max-w-3xl
          px-6
          md:max-w-7xl
        "
      >

        <RANKDFeed

          rankings={
            latestRankings
          }

        />


        <Trending
          rankings={
            trendingRankings
          }
        />


        <WhyRankd />


        <Categories />

      </div>


      <Footer />

    </main>

  )

}
