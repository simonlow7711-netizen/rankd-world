import EntryExperience from "@/components/EntryExperience"
import RANKDFeed from "@/components/RANKDFeed"
import Trending from "@/components/Trending"
import WhyRankd from "@/components/WhyRankd"
import Categories from "@/components/Categories"
import Footer from "@/components/Footer"

import {
  getAllRankings
} from "@/utils/supabaseRankings"


export const dynamic =
  "force-dynamic"


export default async function HomePage() {


  const rankings =
    await getAllRankings()


  return (

    <main
      className="
        bg-[#F7F4EE]
        text-black
      "
    >

      <EntryExperience

        rankings={
          rankings
        }

      />


      <div
        className="
          mx-auto
          max-w-7xl
          px-6
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