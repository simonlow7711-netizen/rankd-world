import {
  Ranking
} from "@/types/ranking"


import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"









export function getRemixCount(

  rankings: Ranking[] = [],

  id:string

){


  return rankings.filter(

    ranking =>

      ranking.parentId === id

  ).length


}









export function getConversationCount(

  rankings: Ranking[] = [],

  id:string

){


  return rankings.filter(

    ranking =>

      ranking.rootId === id

  ).length


}









export function getRootRanking(

  rankings: Ranking[] = [],

  id:string

):Ranking | null {


  const ranking =

    rankings.find(

      item =>

        item.id === id

    )





  if(!ranking){

    return null

  }







  const rootId =

    ranking.rootId ??

    ranking.id







  return (

    rankings.find(

      item =>

        item.id === rootId

    )

    ??

    ranking

  )


}









export function getTrendingRankings(

  rankings: Ranking[] = []

){


  return (

    [...rankings]

    .sort(

      (a,b)=>{


        const scoreA =

          calculateLivePerspectiveScore(

            a

          )



        const scoreB =

          calculateLivePerspectiveScore(

            b

          )



        return scoreB - scoreA


      }

    )

  )


}









export function getLatestRankings(

  rankings: Ranking[] = []

){


  return (

    [...rankings]

    .sort(

      (a,b)=>{


        const dateA =

          new Date(

            a.createdAt ?? 0

          )

          .getTime()



        const dateB =

          new Date(

            b.createdAt ?? 0

          )

          .getTime()



        return dateB - dateA


      }

    )

  )


}









export function getBiggestDebates(

  rankings: Ranking[] = []

){


  return (

    [...rankings]

    .sort(

      (a,b)=>{


        const debateA =

          a.signals

          ?.debateHeat

          ??

          0





        const debateB =

          b.signals

          ?.debateHeat

          ??

          0





        return debateB - debateA


      }

    )

  )


}

export function getMostRemixedRankings(

  rankings: Ranking[] = []

){


  return (

    [...rankings]

    .map(ranking => ({


      ...ranking,


      remixCount:

        getRemixCount(

          rankings,

          ranking.id

        )


    }))

    .sort(

      (a,b)=>

        b.remixCount -

        a.remixCount

    )

  )


}









export function getPerspectiveGaps(

  rankings: Ranking[] = []

){


  return (

    [...rankings]

    .filter(

      ranking =>

        getRemixCount(

          rankings,

          ranking.id

        ) > 0

    )

    .map(ranking => ({


      ranking,


      remixCount:

        getRemixCount(

          rankings,

          ranking.id

        ),


      conversationSize:

        getConversationCount(

          rankings,

          ranking.id

        )


    }))

    .sort(

      (a,b)=>

        b.conversationSize -

        a.conversationSize

    )

  )


}









export function calculateRankingMomentum(

  ranking:Ranking

){


  const views =

    ranking.views ??

    0





  const remixCount =

    ranking.remixes ??

    0





  const debateHeat =

    ranking.signals

    ?.debateHeat

    ??

    0







  return Math.round(

    (

      views * 0.4

    )

    +

    (

      remixCount * 20 * 0.3

    )

    +

    (

      debateHeat * 0.3

    )

  )


}









export function getRankingsByCategory(

  rankings:Ranking[] = [],

  category:string

){


  return rankings.filter(

    ranking =>

      ranking.category === category

  )


}









export function getTopCreators(

  rankings:Ranking[] = []

){


  const creators:

    Record<string,number> = {}





  rankings.forEach(

    ranking =>{


      const creator =

        ranking.creatorId ??

        ranking.creator ??

        "anonymous"





      creators[creator] =

        (

          creators[creator] ??

          0

        )

        +

        1


    }

  )









  return Object.entries(

    creators

  )

  .map(

    ([creator,count])=>({


      creator,


      count


    })

  )

  .sort(

    (a,b)=>

      b.count -

      a.count

  )


}

