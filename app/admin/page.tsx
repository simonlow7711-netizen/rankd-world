"use client"

import { useEffect, useState } from "react"

import { getBetaMetrics } from "@/utils/betaMetrics"

import {
  getTopViewedRankings,
  getCategoryBreakdown,
  getCommunityCount,
  getHealthScore
} from "@/utils/betaInsights"



export default function AdminPage() {


  const [events, setEvents] = useState<any[]>([])


  const [metrics, setMetrics] = useState({

    views: 0,

    started: 0,

    published: 0,

    opinionRate: 0,

    publishRate: 0

  })


  const [topRankings, setTopRankings] = useState<any[]>([])


  const [categories, setCategories] = useState<any>({})


  const [communityCount, setCommunityCount] = useState(0)


  const [healthScore, setHealthScore] = useState(0)






  useEffect(() => {


    setEvents(

      JSON.parse(

        localStorage.getItem("rankdEvents") || "[]"

      )

    )



    setMetrics(

      getBetaMetrics()

    )



    setTopRankings(

      getTopViewedRankings()

    )



    setCategories(

      getCategoryBreakdown()

    )



    setCommunityCount(

      getCommunityCount()

    )



    setHealthScore(

      getHealthScore()

    )


  }, [])







  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">


        <h1 className="
          text-5xl
          font-black
        ">

          RANKD Beta Dashboard

        </h1>



        <p className="
          mt-3
          text-gray-400
        ">

          Product signals from the private beta.

        </p>







        <section className="
          mt-10
          grid
          md:grid-cols-3
          gap-6
        ">


          <MetricCard
            title="Views"
            value={metrics.views}
          />


          <MetricCard
            title="Started"
            value={metrics.started}
          />


          <MetricCard
            title="Published"
            value={metrics.published}
          />


        </section>







        <section className="
          mt-8
          grid
          md:grid-cols-2
          gap-6
        ">


          <MetricCard

            title="Opinion Rate"

            value={`${metrics.opinionRate}%`}

          />



          <MetricCard

            title="Publish Rate"

            value={`${metrics.publishRate}%`}

          />


        </section>








        <section className="
          mt-12
          bg-white
          text-black
          rounded-3xl
          p-8
        ">


          <h2 className="
            text-3xl
            font-black
          ">

            ❤️ RANKD Health

          </h2>


          <p className="
            text-7xl
            font-black
            mt-4
          ">

            {healthScore}%

          </p>


          <p className="mt-3">

            Based on discovery, opinions and completed rankings.

          </p>


        </section>








        <section className="
          mt-12
          grid
          md:grid-cols-2
          gap-8
        ">





          <div className="
            bg-zinc-900
            rounded-3xl
            p-8
          ">


            <h2 className="
              text-3xl
              font-black
              mb-6
            ">

              🔥 Most Viewed Rankings

            </h2>



            {topRankings.map((ranking,index)=>(


              <div
                key={`${ranking.id}-${ranking.creator}`}
                className="
                  border-b
                  border-zinc-700
                  py-4
                "
              >

                <p className="font-bold">

                  #{index + 1} {ranking.title}

                </p>


                <p className="
                  text-gray-400
                ">

                  {ranking.views || 0} views

                </p>


              </div>


            ))}


          </div>








          <div className="
            bg-zinc-900
            rounded-3xl
            p-8
          ">


            <h2 className="
              text-3xl
              font-black
              mb-6
            ">

              📊 Categories

            </h2>





            {Object.entries(categories).map(([name,count]:any)=>(


              <div

                key={name}

                className="
                  flex
                  justify-between
                  py-3
                  border-b
                  border-zinc-700
                "

              >

                <span>

                  {name}

                </span>


                <span className="font-bold">

                  {count}

                </span>


              </div>


            ))}



            <p className="
              mt-8
              text-gray-400
            ">

              Community RANKDs: {communityCount}

            </p>


          </div>





        </section>









        <section className="
          mt-16
        ">


          <h2 className="
            text-3xl
            font-black
            mb-6
          ">

            Event Log

          </h2>



          <div className="
            space-y-4
          ">


            {events.map((event,index)=>(


              <div

                key={index}

                className="
                  bg-zinc-900
                  rounded-xl
                  p-4
                "

              >

                <p className="font-bold">

                  {event.event}

                </p>


                <p className="
                  text-gray-400
                  text-sm
                ">

                  {event.timestamp}

                </p>


              </div>


            ))}


          </div>


        </section>




      </div>


    </main>

  )

}







function MetricCard({

  title,

  value

}:any) {


  return (

    <div className="
      bg-zinc-900
      rounded-3xl
      p-6
    ">


      <p className="text-gray-400">

        {title}

      </p>


      <p className="
        text-5xl
        font-black
        mt-3
      ">

        {value}

      </p>


    </div>

  )

}