import Hero from "@/components/Hero"
import DailyRankd from "@/components/DailyRankd"
import RANKDFeed from "@/components/RANKDFeed"
import Trending from "@/components/Trending"
import Categories from "@/components/Categories"
import WhyRankd from "@/components/WhyRankd"
import Footer from "@/components/Footer"

import Link from "next/link"





export default function Home(){


  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
    ">



      <Hero />







      <DailyRankd />







      <RANKDFeed />







      <Trending />







      <WhyRankd />







      <Categories />









      <section className="
        px-6
        py-24
      ">


        <div className="
          max-w-5xl
          mx-auto
          bg-black
          text-white
          rounded-[40px]
          px-8
          py-16
          text-center
        ">


          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            font-black
            text-sm
          ">

            Your opinion matters

          </p>






          <h2 className="
            text-5xl
            md:text-7xl
            font-black
            mt-6
            leading-none
          ">

            What is your
            <br />
            Top 7?

          </h2>






          <p className="
            mt-6
            text-xl
            text-gray-300
          ">

            Create your ranking.
            Start a conversation.

          </p>







          <Link

            href="/create"

            className="
              inline-block
              mt-10
              bg-white
              text-black
              px-10
              py-5
              rounded-full
              font-black
              text-xl
              hover:scale-105
              transition
            "

          >

            Create Your Top 7 →

          </Link>




        </div>


      </section>








      <Footer />



    </main>

  )

}