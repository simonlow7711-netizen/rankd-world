import { Ranking } from "@/types/ranking"





export function calculatePerspectiveScore(

  ranking: Ranking

){


  let score = 0





  /*
    More views = more opinions
    More opinions = more chance of differences
  */

  if((ranking.views || 0) > 500){

    score += 20

  }



  if((ranking.views || 0) > 1500){

    score += 20

  }







  /*
    Full Top 7 rankings create clearer
    comparison points
  */

  if(

    ranking.items &&

    ranking.items.length === 7

  ){

    score += 20

  }







  /*
    Community rankings naturally create
    different viewpoints
  */

  if(

    ranking.source === "community"

  ){

    score += 20

  }







  /*
    Recent rankings create active debate
  */

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




    if(days < 30){

      score += 20

    }


  }








  return Math.min(

    score,

    100

  )


}