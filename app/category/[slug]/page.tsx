import type { Metadata } from "next"

import Link from "next/link"

import { notFound } from "next/navigation"

import RankingCard from "@/components/RankingCard"

import {
  getAllRankings
} from "@/utils/supabaseRankings"





type Props = {

  params: Promise<{
    slug:string
  }>

}







const categoryMap: Record<string,string> = {


  "food-drink":

    "Food & Drink",


  "film-tv":

    "Film & TV",


  "music":

    "Music",


  "sport":

    "Sport",


  "travel":

    "Travel",


  "technology":

    "Technology",


  "lifestyle":

    "Lifestyle"


}









function getCategoryName(slug:string){


  return (

    categoryMap[slug]

    ??

    slug

      .split("-")

      .map(

        word =>

          word.charAt(0).toUpperCase()

          +

          word.slice(1)

      )

      .join(" ")

  )


}









export async function generateMetadata(

  {
    params

  }:Props

):Promise<Metadata>{


  const {

    slug

  } = await params





  const category =

    getCategoryName(

      slug

    )







  return {


    title:

      `${category} Rankings | RANKD`,



    description:

      `Discover the best ${category} Top 7 rankings from the RANKD community.`


  }


}









export default async function CategoryPage(

  {
    params

  }:Props

){


  const {

    slug

  } = await params






  const category =

    getCategoryName(

      slug

    )








  const allRankings =

    await getAllRankings()







  const rankings =

    allRankings.filter(

      (ranking:any)=>

        ranking.category === category

    )







  if(

    rankings.length === 0

  ){

    notFound()

  }









  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-20
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">





        <header className="
          mb-16
        ">


          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            Category

          </p>





          <h1 className="
            text-5xl
            md:text-7xl
            font-black
            mt-4
          ">

            {category}

          </h1>





          <p className="
            mt-6
            text-xl
            text-gray-500
            max-w-2xl
          ">

            Explore the community's Top 7 opinions in {category}.

          </p>


        </header>









        <section>


          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {
              rankings.map(

                (ranking:any)=>(


                  <RankingCard

                    key={ranking.id}

                    ranking={ranking}

                  />


                )

              )
            }


          </div>


        </section>









        <section className="
          mt-20
        ">


          <div className="
            bg-black
            text-white
            rounded-[40px]
            px-8
            py-14
            text-center
          ">


            <h2 className="
              text-4xl
              md:text-5xl
              font-black
            ">

              Have a different opinion?

            </h2>





            <p className="
              mt-4
              text-gray-300
            ">

              Create your own Top 7.

            </p>





            <Link

              href="/create"

              className="
                inline-block
                mt-8
                bg-white
                text-black
                px-8
                py-4
                rounded-full
                font-black
              "

            >

              Create a RANKD →

            </Link>


          </div>


        </section>





      </div>


    </main>

  )

}