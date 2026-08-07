import {
  supabase
} from "@/utils/supabase"








export type TasteMatch = {

  userId:string

  score:number

}









export async function findSimilarTasteUsers(

  userId:string,

  limit:number = 10

):Promise<TasteMatch[]>{



  const {
    data:userSignals

  } = await supabase

    .from("taste_signals")

    .select(

      "node_id,strength"

    )

    .eq(

      "user_id",

      userId

    )







  if(!userSignals || userSignals.length === 0){

    return []

  }







  const nodeIds =

    userSignals.map(

      signal =>

        signal.node_id

    )








  const {
    data:matches

  } = await supabase

    .from("taste_signals")

    .select(

      "user_id,node_id,strength"

    )

    .in(

      "node_id",

      nodeIds

    )

    .neq(

      "user_id",

      userId

    )








  if(!matches){

    return []

  }







  const scores =

    new Map<string,number>()







  matches.forEach(match=>{



    const current =

      scores.get(

        match.user_id

      )

      ||

      0






    const original =

      userSignals.find(

        signal =>

          signal.node_id === match.node_id

      )







    if(original){


      scores.set(

        match.user_id,

        current +

        (

          original.strength *

          match.strength

        )

      )


    }



  })







  return Array.from(

    scores.entries()

  )

  .map(

    ([userId,score])=>({


      userId,


      score:

        Number(

          score.toFixed(3)

        )


    })

  )

  .sort(

    (a,b)=>

      b.score -

      a.score

  )

  .slice(

    0,

    limit

  )


}