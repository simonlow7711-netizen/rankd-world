"use client"

import { useEffect, useState } from "react"

import {
  getCommandCentreMetrics
} from "@/utils/commandCentre"


import {
  getMostViewedRankings,
  getBiggestDebates,
  getCategoryIntelligence,
  getTrendingRankings
} from "@/utils/commandCentreRankings"








export default function AdminPage(){



  const [metrics,setMetrics] = useState({

    views:0,

    uniqueUsers:0,

    created:0,

    published:0,

    remixes:0,

    opinionRate:0,

    publishRate:0,

    healthScore:0

  })




  const [mostViewed,setMostViewed] =

    useState<any[]>([])



  const [trending,setTrending] =

    useState<any[]>([])



  const [debates,setDebates] =

    useState<any[]>([])



  const [categories,setCategories] =

    useState<any[]>([])








  useEffect(()=>{


    async function load(){



      const [

        metricsData,

        viewedData,

        debateData,

        categoryData,

        trendingData


      ] = await Promise.all([



        getCommandCentreMetrics(),


        getMostViewedRankings(),


        getBiggestDebates(),


        getCategoryIntelligence(),


        getTrendingRankings()



      ])






      console.log(

        "COMMAND CENTRE",

        {

          metricsData,

          viewedData,

          debateData,

          categoryData,

          trendingData

        }

      )






      setMetrics(metricsData)



      setMostViewed(viewedData)



      setDebates(debateData)



      setCategories(categoryData)



      setTrending(trendingData)



    }





    load()



  },[])









  return (



    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">



      <div className="
        max-w-7xl
        mx-auto
      ">






        <header>


          <h1 className="
            text-5xl
            md:text-6xl
            font-black
          ">

            RANKD Command Centre

          </h1>




          <p className="
            mt-4
            text-gray-400
            text-xl
          ">

            Live product intelligence.

          </p>



        </header>









        <section className="
          mt-12
          grid
          md:grid-cols-4
          gap-6
        ">


          <MetricCard
            title="Views"
            value={metrics.views}
          />


          <MetricCard
            title="Community"
            value={metrics.uniqueUsers}
          />


          <MetricCard
            title="Created"
            value={metrics.created}
          />


          <MetricCard
            title="Published"
            value={metrics.published}
          />



        </section>









        <section className="
          mt-8
          grid
          md:grid-cols-4
          gap-6
        ">


          <MetricCard
            title="Remixes"
            value={metrics.remixes}
          />


          <MetricCard
            title="Opinion Rate"
            value={`${metrics.opinionRate}%`}
          />


          <MetricCard
            title="Publish Rate"
            value={`${metrics.publishRate}%`}
          />


          <MetricCard
            title="Health"
            value={`${metrics.healthScore}%`}
          />


        </section>









        <section className="
          mt-12
          grid
          md:grid-cols-2
          gap-8
        ">



          <Panel title="🔥 Most Viewed RANKDs">


            {mostViewed.length === 0 && (

              <Empty />

            )}



            {mostViewed.map((ranking)=>(


              <ListItem

                key={ranking.id}

                title={ranking.title}

                subtitle={`${ranking.views} views`}

              />


            ))}


          </Panel>








          <Panel title="🚀 Trending Now">


            {trending.length === 0 && (

              <Empty />

            )}



            {trending.map((ranking)=>(


              <ListItem

                key={ranking.id}

                title={ranking.title}

                subtitle={`${ranking.momentum} recent views`}

              />


            ))}


          </Panel>








          <Panel title="⚔️ Biggest Debates">


            {debates.length === 0 && (

              <Empty />

            )}



            {debates.map((debate:any)=>(


              <ListItem

                key={debate.id}

                title={debate.title}

                subtitle={`${debate.replies} perspectives`}

              />


            ))}


          </Panel>








          <Panel title="📊 Categories">


            {categories.length === 0 && (

              <Empty />

            )}



            {categories.map((category:any)=>(


              <ListItem

                key={category.name}

                title={category.name}

                subtitle={`${category.count} RANKDs`}

              />


            ))}


          </Panel>



        </section>









        <section className="
          mt-12
          bg-white
          text-black
          rounded-3xl
          p-10
        ">



          <h2 className="
            text-3xl
            font-black
          ">

            RANKD Health

          </h2>




          <p className="
            mt-5
            text-8xl
            font-black
          ">

            {metrics.healthScore}%

          </p>




          <p className="
            mt-4
            text-gray-600
          ">

            Measuring discovery → opinion → creation.

          </p>



        </section>






      </div>


    </main>


  )



}









function MetricCard({

  title,

  value

}:{

  title:string

  value:any

}){


  return (

    <div className="
      bg-zinc-900
      rounded-3xl
      p-6
    ">


      <p className="
        text-gray-400
      ">

        {title}

      </p>



      <p className="
        mt-3
        text-5xl
        font-black
      ">

        {value}

      </p>


    </div>

  )

}









function Panel({

  title,

  children

}:{

  title:string

  children:React.ReactNode

}){


  return (

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

        {title}

      </h2>



      <div className="
        space-y-3
      ">

        {children}

      </div>


    </div>


  )

}









function ListItem({

  title,

  subtitle

}:{

  title:string

  subtitle:string

}){


  return (

    <div className="
      border-b
      border-zinc-700
      pb-3
    ">


      <p className="
        font-black
      ">

        {title}

      </p>



      <p className="
        text-gray-400
        text-sm
      ">

        {subtitle}

      </p>


    </div>

  )

}









function Empty(){


  return (

    <p className="
      text-gray-500
    ">

      No data yet.

    </p>

  )

}