import { rankings } from "@/data/rankings"

import { Ranking } from "@/types/ranking"





function getUserRankings(): Ranking[] {


  if(typeof window === "undefined"){

    return []

  }



  return JSON.parse(

    localStorage.getItem("createdRankings") || "[]"

  )


}







function getUserCategories(

  userRankings: Ranking[]

){


  return [

    ...new Set(

      userRankings.map(

        ranking => ranking.category

      )

    )

  ]

}







function calculateFeedScore(

  ranking: Ranking,

  categories:string[]

){


  let score = 0





  // Personal interest

  if(

    categories.includes(

      ranking.category

    )

  ){

    score += 30

  }





  // Popularity

  if(

    (ranking.views || 0) > 500

  ){

    score += 10

  }





  if(

    (ranking.views || 0) > 1500

  ){

    score += 10

  }





  // Community opinions

  if(

    ranking.source === "community"

  ){

    score += 15

  }





  // Fresh content

  if(ranking.createdAt){


    const created =

      new Date(

        ranking.createdAt

      )



    const now =

      new Date()



    const days =

      Math.floor(

        (

          now.getTime() -

          created.getTime()

        )

        /

        (

          1000 *

          60 *

          60 *

          24

        )

      )



    if(days < 14){

      score += 10

    }


  }







  return score


}








export function getPersonalisedFeed(){



  const userRankings =

    getUserRankings()





  const categories =

    getUserCategories(

      userRankings

    )







  return rankings

    .map(

      ranking => ({


        ranking,


        score:

          calculateFeedScore(

            ranking,

            categories

          )


      })

    )

    .sort(

      (a,b)=>

        b.score -

        a.score

    )

    .map(

      item => item.ranking

    )

    .slice(

      0,

      6

    )


}








export function getFeedSections(){



  return {


    personalised:

      getPersonalisedFeed(),




    trending:

      [...rankings]

        .sort(

          (a,b)=>

            (b.views || 0) -

            (a.views || 0)

        )

        .slice(

          0,

          3

        ),





    debates:

      [...rankings]

        .sort(

          (a,b) =>

            (b.views || 0) -

            (a.views || 0)

        )

        .slice(

          0,

          3

        ),





    newest:

      [...rankings]

        .reverse()

        .slice(

          0,

          3

        )


  }


}