export type RankdEvent = {

  event: string

  data?: any

  timestamp?: string

}






function getEvents(): RankdEvent[] {


  if(typeof window === "undefined"){

    return []

  }



  return JSON.parse(

    localStorage.getItem("rankdEvents") || "[]"

  )


}







export function getBetaMetrics(){


  const events = getEvents()





  const views = events.filter(

    (event: RankdEvent) =>

      event.event === "ranking_viewed"

  ).length






  const started = events.filter(

    (event: RankdEvent) =>

      event.event === "rankd_started"

  ).length






  const published = events.filter(

    (event: RankdEvent) =>

      event.event === "rankd_published"

  ).length






  const remixViews = events.filter(

    (event: RankdEvent) =>

      event.event === "remix_viewed"

  ).length






  const opinionRate = views > 0

    ? Math.round(

        (started / views) * 100

      )

    : 0






  const publishRate = started > 0

    ? Math.round(

        (published / started) * 100

      )

    : 0






  return {


    views,


    started,


    published,


    remixViews,


    opinionRate,


    publishRate,


    healthScore:

      Math.min(

        Math.round(

          (views * 0.2) +

          (started * 0.4) +

          (published * 0.4)

        ),

        100

      )


  }


}







export function getViews(){


  return getBetaMetrics().views


}







export function getStarts(){


  return getBetaMetrics().started


}







export function getPublished(){


  return getBetaMetrics().published


}







export function getEngagementScore(){


  return getBetaMetrics().healthScore


}