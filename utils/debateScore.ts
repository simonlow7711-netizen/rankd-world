import {
  Ranking
} from "@/types/ranking"





export function calculateDebateScore(

  ranking: Ranking

) {


  let score = 0





  // Popularity creates more potential disagreement

  if (

    (ranking.views || 0) > 500

  ) {

    score += 20

  }





  if (

    (ranking.views || 0) > 1500

  ) {

    score += 20

  }





  // Rankings with more items create more comparison

  if (

    ranking.items &&

    ranking.items.length === 7

  ) {

    score += 20

  }





  // Community rankings create more opinion diversity

  if (

    ranking.source === "community"

  ) {

    score += 20

  }





  // Recently created rankings get a discovery boost

  if (

    ranking.createdAt

  ) {


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


    if (

      days < 14

    ) {

      score += 20

    }


  }





  return Math.min(

    score,

    100

  )


}