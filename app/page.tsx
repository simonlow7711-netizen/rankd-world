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
  getAllRankings
} from "@/utils/supabaseRankings"

import {
  getPublishedPhotoRankds
} from "@/utils/photoRankds"

import {
  sharePreviewImage
} from "@/utils/ogImage"

import {
  SITE_URL,
  indexableRobots
} from "@/utils/siteUrl"


export const dynamic =
  "force-dynamic"


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
    rankings,
    photoRankds
  ] =
    await Promise.all([
      getAllRankings(),
      getPublishedPhotoRankds()
    ])


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
            rankings
          }

        />


        <Trending />


        <WhyRankd />


        <Categories />

      </div>


      <Footer />

    </main>

  )

}