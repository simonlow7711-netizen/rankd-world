import {
  supabase
} from "@/utils/supabase"


export async function getAnalyticsOverview(){


  const {

    data,

    error

  } = await supabase

    .from("analytics_events")

    .select(

      "event_name"

    )


  if(error){


    return {

      views:0,

      rankingViews:0,

      created:0,

      published:0,

      opinionRate:0,

      publishRate:0

    }


  }


  const events =

    data ?? []


  const rankingViews =

    events.filter(

      event =>

        event.event_name === "ranking_viewed"

    ).length


  const created =

    events.filter(

      event =>

        event.event_name === "rank_started"

    ).length


  const published =

    events.filter(

      event =>

        event.event_name === "rankd_published"

    ).length


  return {


    views:

      rankingViews,


    rankingViews,


    created,


    published,


    opinionRate:

      rankingViews > 0

      ?

      Math.round(

        (

          created /

          rankingViews

        )

        *

        100

      )

      :

      0,


    publishRate:

      created > 0

      ?

      Math.round(

        (

          published /

          created

        )

        *

        100

      )

      :

      0


  }


}


export async function getTopViewedRankings(){


  const {

    data:events,

    error:eventError

  } = await supabase

    .from("analytics_events")

    .select(

      "ranking_id"

    )

    .eq(

      "event_name",

      "ranking_viewed"

    )


  if(eventError){


    console.error(

      "VIEW EVENT ERROR",

      eventError

    )


    return []


  }


  const counts:any = {}


  ;(events ?? []).forEach(

    event => {


      if(!event.ranking_id){

        return

      }


      if(!counts[event.ranking_id]){


        counts[event.ranking_id]=0


      }


      counts[event.ranking_id]++


    }

  )


  const rankingIds =

    Object.keys(counts)


  if(rankingIds.length === 0){


    return []


  }


  const {

    data:rankings,

    error:rankingError

  } = await supabase

    .from("rankings")

    .select(

      `

      id,

      title,

      category

      `

    )

    .in(

      "id",

      rankingIds

    )


  if(rankingError){


    console.error(

      "RANKING LOOKUP ERROR",

      rankingError

    )


    return []


  }


  return (

    rankings ?? []

  )

  .map(

    ranking => ({


      ...ranking,


      views:

        counts[ranking.id] ?? 0


    })

  )

  .sort(

    (a:any,b:any)=>

      b.views -

      a.views

  )

  .slice(

    0,

    10

  )


}


export async function getTopDebateRankings(){


  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select(

      `

      id,

      title,

      parent_id,

      root_id

      `

    )

    .not(

      "parent_id",

      "is",

      null

    )


  if(error){


    console.error(

      "DEBATE ERROR",

      error

    )


    return []


  }


  const debates:any = {}


  ;(data ?? []).forEach(

    ranking => {


      const root =

        ranking.root_id

        ??

        ranking.id


      if(!debates[root]){


        debates[root]={


          id:root,


          title:

            ranking.title,


          count:0


        }


      }


      debates[root].count++


    }

  )


  return Object.values(debates)

    .sort(

      (a:any,b:any)=>

        b.count -

        a.count

    )

    .slice(

      0,

      10

    )


}


export async function getCategoryBreakdown(){


  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select(

      "category"

    )


  if(error){


    console.error(

      "CATEGORY ERROR",

      error

    )


    return {}


  }


  const categories:any = {}


  ;(data ?? []).forEach(

    ranking => {


      const category =

        ranking.category

        ??

        "General"


      if(!categories[category]){


        categories[category]=0


      }


      categories[category]++


    }

  )


  return categories


}


export async function getCommunityCount(){


  const {

    count,

    error

  } = await supabase

    .from("rankings")

    .select(

      "id",

      {

        count:"exact",

        head:true

      }

    )


  if(error){


    console.error(

      "COMMUNITY COUNT ERROR",

      error

    )


    return 0


  }


  return count ?? 0


}


export async function getHealthScore(){


  const metrics =

    await getAnalyticsOverview()


  if(metrics.views === 0){


    return 0


  }


  const score = Math.round(

    (

      metrics.opinionRate +

      metrics.publishRate

    )

    /

    2

  )


  return Math.min(

    score,

    100

  )


}