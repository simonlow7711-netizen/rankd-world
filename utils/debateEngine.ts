import { Ranking } from "@/types/ranking"



export type DebateResult = {

  item: string

  originalPosition: number

  newPosition: number

  difference: number

}





export function calculateDebate(

  originalRanking: Ranking,

  userRanking: Ranking

): DebateResult | null {


  if (

    !originalRanking ||

    !userRanking

  ) {

    return null

  }





  const movements: DebateResult[] = []





  originalRanking.items.forEach((originalItem)=>{


    const userItem =

      userRanking.items.find(

        item =>

          item.name === originalItem.name

      )




    if(!userItem){

      return

    }





    const difference =

      originalItem.position -

      userItem.position





    if(difference !== 0){


      movements.push({

        item: originalItem.name,

        originalPosition:
          originalItem.position,

        newPosition:
          userItem.position,

        difference:

          Math.abs(difference)

      })


    }


  })







  if(movements.length === 0){

    return null

  }





  movements.sort(

    (a,b)=>

      b.difference -

      a.difference

  )





  return movements[0]


}








export function getDebateScore(

  originalRanking: Ranking,

  userRanking: Ranking

) {


  const debate = calculateDebate(

    originalRanking,

    userRanking

  )



  if(!debate){

    return 0

  }





  return Math.min(

    debate.difference * 20,

    100

  )


}