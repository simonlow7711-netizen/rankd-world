import Link from "next/link"

import Hero from "@/components/Hero"
import DailyRankd from "@/components/DailyRankd"
import Trending from "@/components/Trending"
import Categories from "@/components/Categories"
import WhyRankd from "@/components/WhyRankd"
import Footer from "@/components/Footer"

import { rankings } from "@/data/rankings"



export default function Home() {


  const featuredRanking = rankings[0]



  return (

    <main className="
      min-h-screen
      bg-black
      text-white
    ">


      <Hero />




      <div className="
        max-w-6xl
        mx-auto
        px-6
        py-16
      ">




        <section className="
          mb-16
          bg-zinc-900
          rounded-3xl
          p-8
        ">


          <p className="
            text-gray-400
            font-bold
          ">
            START HERE
          </p>



          <h2 className="
            text-4xl
            font-black
            mt-3
          ">
            Would you rank this differently?
          </h2>



          <p className="
            mt-3
            text-gray-400
          ">
            Everyone has their own Top 7.
          </p>




          <div className="
            mt-8
            bg-white
            text-black
            rounded-3xl
            p-6
          ">



            <p className="
              text-sm
              text-gray-500
            ">
              #{featuredRanking.category}
            </p>



            <h3 className="
              text-3xl
              font-black
              mt-2
            ">
              {featuredRanking.title}
            </h3>



            <div className="
              mt-5
              space-y-2
            ">


              {featuredRanking.items
                .slice(0,3)
                .map(item => (

                  <div
                    key={item.position}
                    className="
                      font-bold
                    "
                  >

                    #{item.position} {item.name}

                  </div>

                ))}


            </div>



            <Link href={`/rank/${featuredRanking.id}`}>

              <button className="
                mt-8
                w-full
                bg-black
                text-white
                py-4
                rounded-full
                font-black
              ">

                RANKD IT →

              </button>


            </Link>


          </div>


        </section>





        <DailyRankd />



        <Trending />



        <Categories />



        <WhyRankd />



      </div>



      <Footer />


    </main>

  )

}