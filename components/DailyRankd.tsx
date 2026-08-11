"use client"

import Link from "next/link"





const dailyRankds = [

  {
    title:
      "Top 7 Films Everyone Should Watch",

    category:
      "Film & TV"
  },


  {
    title:
      "Top 7 Foods You Could Eat Forever",

    category:
      "Food & Drink"
  },


  {
    title:
      "Top 7 Cities To Visit",

    category:
      "Travel"
  },


  {
    title:
      "Top 7 Songs Of All Time",

    category:
      "Music"
  },


  {
    title:
      "Top 7 Athletes Ever",

    category:
      "Sport"
  },


  {
    title:
      "Top 7 Inventions That Changed The World",

    category:
      "Technology"
  },


  {
    title:
      "Top 7 Things That Make You Happy",

    category:
      "Lifestyle"
  }

]







function getDailyRankd(){


  const dayNumber =

    Math.floor(

      Date.now()

      /

      (

        1000 *

        60 *

        60 *

        24

      )

    )





  return (

    dailyRankds[

      dayNumber %

      dailyRankds.length

    ]

  )


}







export default function DailyRankd(){


  const dailyRankd =

    getDailyRankd()





  const createUrl =

    `/create?title=${encodeURIComponent(

      dailyRankd.title

    )}&category=${encodeURIComponent(

      dailyRankd.category

    )}`





  return (

    <section className="
      mb-20
      px-6
      flex
      justify-center
    ">


      <div className="
        bg-black
        text-white
        rounded-[40px]
        p-10
        md:p-14
        text-center
        max-w-4xl
        w-full
      ">


        <p className="
          uppercase
          tracking-[0.3em]
          text-sm
          font-black
          text-gray-400
        ">

          RANKD of the Day

        </p>





        <h2 className="
          text-4xl
          md:text-6xl
          font-black
          mt-5
          leading-tight
        ">

          {dailyRankd.title}

        </h2>





        <p className="
          mt-4
          text-xl
          text-gray-300
        ">

          Category: {dailyRankd.category}

        </p>





        <Link

          href={
            createUrl
          }

          className="
            inline-block
            mt-8
            bg-white
            text-black
            px-8
            py-4
            rounded-full
            font-black
            hover:scale-105
            transition
          "

        >

          Create your Top 7 →

        </Link>


      </div>


    </section>

  )

}