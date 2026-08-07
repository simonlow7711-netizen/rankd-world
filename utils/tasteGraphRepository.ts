import {
  supabase
} from "@/utils/supabase"

import {
  TasteGraph
} from "@/utils/tasteGraph"







async function getOrCreateNode(

  type:string,

  label:string

):Promise<string>{



  const slug =

    label

      .toLowerCase()

      .trim()

      .replace(/\s+/g,"-")







  const {
    data:existing

  } = await supabase

    .from("taste_nodes")

    .select("id")

    .eq(

      "type",

      type

    )

    .eq(

      "slug",

      slug

    )

    .single()







  if(existing?.id){

    return existing.id

  }








  const {
    data:newNode,

    error

  } = await supabase

    .from("taste_nodes")

    .insert({

      type,

      label,

      slug

    })

    .select("id")

    .single()








  if(error){

    console.error(

      "CREATE TASTE NODE ERROR",

      error

    )

    throw error

  }








  return newNode.id



}









export async function saveTasteGraph(

  graph:TasteGraph

){



  for(const signal of graph.signals){



    const nodeId =

      await getOrCreateNode(

        "item",

        signal.item

      )







    const {

      error

    } = await supabase

      .from("taste_signals")

      .insert({

        user_id:

          graph.userId,


        node_id:

          nodeId,


        source_rank_id:

          signal.source,


        signal_type:

          signal.type,


        strength:

          signal.strength,


        position:

          signal.position


      })







    if(error){

      console.error(

        "SAVE TASTE SIGNAL ERROR",

        error

      )

    }



  }



}