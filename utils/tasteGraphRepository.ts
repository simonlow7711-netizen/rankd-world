import {
  supabase
} from "@/utils/supabase"

import {
  TasteGraph,
  TasteNodeType,
  TasteSignalType
} from "@/utils/tasteGraph"


type TasteNodeRow = {

  id:string

  type:string

  label:string

}


type TasteSignalRow = {

  id:string

  user_id:string

  signal_type:string

  strength:number

  position:number

  source_rank_id:string

  taste_nodes:
    | TasteNodeRow
    | TasteNodeRow[]
    | null

}


type NormalisedTasteSignalRow = {

  id:string

  user_id:string

  signal_type:string

  strength:number

  position:number

  source_rank_id:string

  taste_nodes:TasteNodeRow | null

}


async function getOrCreateNode({

  type,

  label

}:{

  type:string

  label:string

}):Promise<TasteNodeRow | null>{

  const cleanLabel =

    label
      .toLowerCase()
      .trim()


  if(!cleanLabel){

    return null

  }


  const slug =

    cleanLabel
      .replace(
        /\s+/g,
        "-"
      )


  const {
    data:existing,
    error:lookupError
  } = await supabase

    .from("taste_nodes")

    .select(
      "*"
    )

    .eq(
      "slug",
      slug
    )

    .eq(
      "type",
      type
    )

    .maybeSingle()


  if(lookupError){

    console.error(

      "LOOKUP TASTE NODE ERROR",

      lookupError

    )

  }


  if(existing){

    return existing as TasteNodeRow

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

    .select()

    .single()


  if(error){

    console.error(

      "CREATE TASTE NODE ERROR",

      error

    )

    return null

  }


  return newNode as TasteNodeRow

}


function mergeStrength(

  existing:number,

  incoming:number

):number{

  const existingValue =

    Number(existing) || 0


  const incomingValue =

    Number(incoming) || 0


  const merged =

    (
      existingValue * 0.65
    )
    +
    (
      incomingValue * 0.35
    )


  return Number(

    Math.max(

      0,

      Math.min(

        merged,

        1

      )

    ).toFixed(3)

  )

}


function getSignalNodeType(

  signalType:TasteSignalType

):TasteNodeType{

  if(

    signalType ===
      "created"

  ){

    return "category"

  }


  return "item"

}


export async function saveTasteGraph(

  graph:TasteGraph

){

  for(

    const signal of graph.signals

  ){

    const signalType =

      signal.type as TasteSignalType


    const nodeType =

      getSignalNodeType(

        signalType

      )


    const nodeLabel =

      signalType === "created"

        ?

        signal.category

        :

        signal.item


    const node =

      await getOrCreateNode({

        type:
          nodeType,

        label:
          nodeLabel

      })


    if(!node){

      continue

    }


    const {

      data:existingSignal,

      error:lookupError

    } = await supabase

      .from("taste_signals")

      .select(
        "id, strength, position"
      )

      .eq(
        "user_id",
        signal.userId
      )

      .eq(
        "node_id",
        node.id
      )

      .eq(
        "source_rank_id",
        signal.source
      )

      .eq(
        "signal_type",
        signalType
      )

      .maybeSingle()


    if(lookupError){

      console.error(

        "LOOKUP TASTE SIGNAL ERROR",

        lookupError

      )

      continue

    }


    if(existingSignal){

      const mergedStrength =

        mergeStrength(

          Number(
            existingSignal.strength
          ),

          signal.strength

        )


      const {
        error:updateError
      } = await supabase

        .from("taste_signals")

        .update({

          strength:
            mergedStrength,

          position:
            signal.position

        })

        .eq(
          "id",
          existingSignal.id
        )


      if(updateError){

        console.error(

          "UPDATE TASTE SIGNAL ERROR",

          updateError

        )

      }


      continue

    }


    const {
      error
    } = await supabase

      .from("taste_signals")

      .insert({

        user_id:
          signal.userId,

        node_id:
          node.id,

        source_rank_id:
          signal.source,

        signal_type:
          signalType,

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


function normaliseTasteSignalRows(

  rows:unknown

):NormalisedTasteSignalRow[]{

  if(!Array.isArray(rows)){

    return []

  }


  return (

    rows as TasteSignalRow[]

  ).map(

    row => {

      const node =

        Array.isArray(
          row.taste_nodes
        )

        ?

        row.taste_nodes[0]

        :

        row.taste_nodes


      return {

        id:
          row.id,

        user_id:
          row.user_id,

        signal_type:
          row.signal_type,

        strength:
          Number(
            row.strength
          ),

        position:
          Number(
            row.position
          ),

        source_rank_id:
          row.source_rank_id,

        taste_nodes:
          node ?? null

      }

    }

  )

}


export async function getTasteGraph(

  userId:string

):Promise<TasteGraph>{

  const {

    data:signals,

    error

  } = await supabase

    .from("taste_signals")

    .select(

      `
      id,
      user_id,
      signal_type,
      strength,
      position,
      source_rank_id,
      taste_nodes(
        id,
        type,
        label
      )
      `

    )

    .eq(
      "user_id",
      userId
    )


  if(error || !signals){

    console.error(

      "LOAD TASTE GRAPH ERROR",

      error

    )


    return {

      userId,

      nodes:[],

      signals:[],

      behaviour:{

        totalRankings:0,

        averagePosition:0,

        topChoiceRate:0,

        uniqueness:0

      }

    }

  }


  const typedSignals =

    normaliseTasteSignalRows(

      signals

    )


  const nodes =

    typedSignals

      .map(

        signal =>
          signal.taste_nodes

      )

      .filter(

        (
          node
        ):node is TasteNodeRow =>

          Boolean(node)

      )

      .map(

        node => ({

          id:
            node.id,

          type:
            node.type as TasteNodeType,

          label:
            node.label

        })

      )


  const graphSignals =

    typedSignals.map(

      signal => {

        const node =
          signal.taste_nodes


        const signalType =

          signal.signal_type as TasteSignalType


        return {

          id:
            signal.id,

          userId:
            signal.user_id,

          type:
            signalType,

          category:

            node?.type === "category"

            ?

            node.label

            :

            "",

          item:

            node?.type === "item"

            ?

            node.label

            :

            "",

          strength:

            Number(
              signal.strength
            ),

          position:

            Number(
              signal.position
            ),

          source:

            signal.source_rank_id

        }

      }

    )


  /*
   *
   * BEHAVIOUR METRICS
   *
   * Only actual ranked item signals
   * should influence ranking behaviour.
   *
   * "created" category signals have
   * position 0 and therefore must be
   * excluded.
   *
   */


  const rankingSignals =

    graphSignals.filter(

      signal =>

        signal.type === "ranked"

        ||

        signal.type === "preferred"

        ||

        signal.type === "avoided"

        ||

        signal.type === "challenged"

    )


  const positions =

    rankingSignals

      .map(

        signal =>
          Number(
            signal.position
          )

      )

      .filter(

        position =>

          position >= 1

      )


  const topChoices =

    positions.filter(

      position =>
        position === 1

    ).length


  const uniqueItems =

    new Set(

      rankingSignals

        .map(

          signal =>

            signal.item
              .toLowerCase()
              .trim()

        )

        .filter(

          Boolean

        )

    )


  const totalRankings =

    new Set(

      rankingSignals.map(

        signal =>
          signal.source

      )

    ).size


  const averagePosition =

    positions.length > 0

    ?

    Number(

      (

        positions.reduce(

          (
            total,

            value

          ) =>

            total + value,

          0

        )

        /

        positions.length

      ).toFixed(2)

    )

    :

    0


  const topChoiceRate =

    positions.length > 0

    ?

    Number(

      (

        topChoices /
        positions.length

      ).toFixed(3)

    )

    :

    0


  const uniqueness =

    positions.length > 0

    ?

    Number(

      (

        uniqueItems.size /
        positions.length

      ).toFixed(3)

    )

    :

    0


  return {

    userId,

    nodes,

    signals:
      graphSignals,

    behaviour:{

      totalRankings,

      averagePosition,

      topChoiceRate,

      uniqueness

    }

  }

}