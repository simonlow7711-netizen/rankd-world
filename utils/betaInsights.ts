import { rankings } from "@/data/rankings"



type RankdEvent = {

  event: string

  data?: any

  timestamp?: string

}







export function getAllRankings() {


  if (typeof window === "undefined") {

    return rankings

  }



  const createdRankings = JSON.parse(

    localStorage.getItem("createdRankings") || "[]"

  )



  return [

    ...rankings,

    ...createdRankings

  ]

}








export function getTopViewedRankings() {


  const allRankings = getAllRankings()



  return [

    ...allRankings

  ]

    .sort(

      (a,b) =>

        (b.views || 0) -

        (a.views || 0)

    )

    .slice(0,5)


}








export function getCategoryBreakdown() {


  const allRankings = getAllRankings()



  const categories: Record<string, number> = {}



  allRankings.forEach((ranking)=>{


    if(!categories[ranking.category]){


      categories[ranking.category] = 0


    }



    categories[ranking.category]++


  })



  return categories


}








export function getCommunityCount(){


  if(typeof window === "undefined"){

    return 0

  }



  const createdRankings = JSON.parse(

    localStorage.getItem("createdRankings") || "[]"

  )



  return createdRankings.length


}








export function getHealthScore(){


  if(typeof window === "undefined"){

    return 0

  }



  const events: RankdEvent[] = JSON.parse(

    localStorage.getItem("rankdEvents") || "[]"

  )





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








  const score =

    (views * 0.2) +

    (started * 0.4) +

    (published * 0.4)







  return Math.min(

    Math.round(score),

    100

  )


}