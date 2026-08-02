import RankingCard from "@/components/RankingCard"

import { rankings } from "@/data/rankings"

import { getAllSupabaseRankings } from "@/utils/supabaseRankings"





const categoryNames = {

  "food-drink": "Food & Drink",

  "film-tv": "Film & TV",

  "music": "Music",

  "sport": "Sport",

  "travel": "Travel",

  "gaming": "Gaming",

  "books": "Books",

  "technology": "Technology",

  "places": "Places",

  "lifestyle": "Lifestyle",

  "entertainment": "Entertainment",

  "business": "Business",

  "art-design": "Art & Design",

  "education": "Education",

  "science": "Science",

  "general": "General"

}





export default async function CategoryPage({

  params

}: {

  params: Promise<{

    slug:string

  }>

}) {


  const {slug} = await params





  const category =

    categoryNames[

      slug as keyof typeof categoryNames

    ]







  const communityRankings =

    await getAllSupabaseRankings()






  const allRankings = [

    ...communityRankings,

    ...rankings

  ].filter(

    (ranking,index,self)=>

      index === self.findIndex(

        item => item.id === ranking.id

      )

  )







  const categoryRankings =

    allRankings.filter(

      ranking =>

        ranking.category === category

    )







  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-16
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">





        <section className="
          text-center
        ">


          <h1 className="
            text-5xl
            md:text-7xl
            font-black
            tracking-tight
          ">

            {category ?? "Explore RANKDs"}

          </h1>





          <p className="
            mt-5
            text-xl
            text-gray-500
            max-w-2xl
            mx-auto
          ">

            Discover the Top 7 opinions people are sharing.

          </p>



        </section>








        {categoryRankings.length === 0 && (

          <div className="
            mt-12
            bg-white
            rounded-3xl
            p-10
            text-center
          ">


            <h2 className="
              text-2xl
              font-black
            ">

              No RANKDs yet

            </h2>


            <p className="
              mt-3
              text-gray-500
            ">

              Be the first person to create a Top 7 in this category.

            </p>


          </div>

        )}







        <section className="
          mt-14
          grid
          md:grid-cols-3
          gap-8
        ">


          {categoryRankings.map(ranking=>(


            <RankingCard

              key={ranking.id}

              ranking={ranking}

            />


          ))}



        </section>





      </div>


    </main>

  )

}