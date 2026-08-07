import {
  findSimilarTasteUsers
} from "@/utils/tasteGraphQueries"








export async function calculateTasteGraphMatch(

  userId:string

){

  const matches =

    await findSimilarTasteUsers(

      userId,

      5

    )







  if(matches.length === 0){

    return null

  }







  const bestMatch =

    matches[0]








  return {


    userId:

      bestMatch.userId,



    score:

      Math.min(

        Math.round(

          bestMatch.score * 100

        ),

        100

      )


  }


}