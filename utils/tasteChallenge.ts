import { Ranking } from "@/types/ranking"





type ChallengeResult = {

  ranking: Ranking

  difference: number

  reason: string

}







function compareItems(

  first:any[],

  second:any[]

){


  let difference = 0





  const firstMap = new Map(

    first.map(

      item => [

        item.name,

        item.position

      ]

    )

  )





  second.forEach((item)=>{


    const firstPosition =

      firstMap.get(

        item.name

      )



    if(firstPosition){


      difference +=

        Math.abs(

          firstPosition -

          item.position

        )


    }


  })







  return difference


}







export function calculateTasteChallenge(

  userRankings: Ranking[],

  otherRankings: Ranking[]

): ChallengeResult[] {



  const challenges:ChallengeResult[] = []







  userRankings.forEach((userRanking)=>{



    const match =

      otherRankings.find(

        other =>

          other.category ===

          userRanking.category

      )





    if(!match){

      return

    }







    const difference =

      compareItems(

        userRanking.items,

        match.items

      )







    if(difference > 0){



      challenges.push({

        ranking: match,

        difference,

        reason:

          "Your rankings are different"

      })


    }





  })







  return challenges.sort(

    (a,b)=>

      b.difference -

      a.difference

  )


}