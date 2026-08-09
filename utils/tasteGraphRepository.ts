import {
  TasteGraph,
  TasteNodeType,
  TasteSignal,
  TasteSignalType
} from "@/utils/tasteGraphTypes"

import {
  supabase
} from "@/utils/supabase"


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

  node_id:string

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

  node_id:string

  taste_nodes:TasteNodeRow | null

}


function createSlug(

  label:string

):string{

  return label

    .toLowerCase()

    .trim()

    .replace(

      /[^\w\s-]/g,

      ""

    )

    .replace(

      /\s+/g,

      "-"

    )

}


async function getOrCreateNode({

  type,

  label

}:{

  type:string

  label:string

}):Promise<TasteNodeRow | null>{

  const cleanLabel =

    label.trim()


  if(!cleanLabel){

    return null

  }


  const slug =

    createSlug(

      cleanLabel

    )


  const {

    data:existing,

    error:lookupError

  } = await supabase

    .from("taste_nodes")

    .select(

      "id, type, label"

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

      label:cleanLabel,

      slug

    })

    .select(

      "id, type, label"

    )

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


async function getCategoryNode(

  category:string

):Promise<TasteNodeRow | null>{

  const cleanCategory =

    category.trim()


  if(!cleanCategory){

    return null

  }


  return getOrCreateNode({

    type:"category",

    label:cleanCategory

  })

}


async function getItemNode(

  item:string

):Promise<TasteNodeRow | null>{

  const cleanItem =

    item.trim()


  if(!cleanItem){

    return null

  }


  return getOrCreateNode({

    type:"item",

    label:cleanItem

  })

}


/**
 * Saves the user's Taste Graph signals.
 *
 * Category signals are stored against category nodes.
 * Item signals are stored against item nodes.
 *
 * The category signal is deliberately preserved because it allows
 * the repository to reconstruct the category context for every
 * ranked item later.
 */
export async function saveTasteGraph(

  graph:TasteGraph

):Promise<void>{

  for(

    const signal of graph.signals

  ){

    if(!signal){

      continue

    }


    const cleanItem =

      signal.item?.trim()


    const cleanCategory =

      signal.category?.trim()


    const signalType =

      signal.type


    const sourceRankId =

      signal.source


    if(!sourceRankId){

      continue

    }


    let node:TasteNodeRow | null = null


    /*
     * A created signal at position 0 represents
     * the category selected for the ranking.
     */
    if(

      signalType === "created"

      &&

      cleanCategory

      &&

      signal.position === 0

    ){

      node =

        await getCategoryNode(

          cleanCategory

        )

    }

    /*
     * All item-level signals are stored against
     * item nodes.
     */
    else if(cleanItem){

      node =

        await getItemNode(

          cleanItem

        )

    }


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

        sourceRankId

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

          Number(

            signal.strength

          )

        )


      const {

        error:updateError

      } = await supabase

        .from("taste_signals")

        .update({

          strength:

            mergedStrength,

          position:

            signal.position,

          node_id:

            node.id

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

      error:insertError

    } = await supabase

      .from("taste_signals")

      .insert({

        user_id:

          signal.userId,

        node_id:

          node.id,

        source_rank_id:

          sourceRankId,

        signal_type:

          signalType,

        strength:

          Number(

            signal.strength

          ),

        position:

          signal.position

      })


    if(insertError){

      console.error(

        "SAVE TASTE SIGNAL ERROR",

        insertError

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

        node_id:

          row.node_id,

        taste_nodes:

          node ?? null

      }

    }

  )

}


/**
 * Builds the graph's node collection.
 */
function buildGraphNodes(

  signals:NormalisedTasteSignalRow[]

):{

  id:string

  type:TasteNodeType

  label:string

}[]{

  const nodes =

    new Map<

      string,

      {

        id:string

        type:TasteNodeType

        label:string

      }

    >()


  signals.forEach(

    signal => {

      const node =

        signal.taste_nodes


      if(!node){

        return

      }


      if(

        nodes.has(

          node.id

        )

      ){

        return

      }


      nodes.set(

        node.id,

        {

          id:

            node.id,

          type:

            node.type as TasteNodeType,

          label:

            node.label

        }

      )

    }

  )


  return Array.from(

    nodes.values()

  )

}


/**
 * Builds a lookup of ranking -> category.
 *
 * Category signals are stored as:
 *
 * signal_type = "created"
 * position = 0
 * node_type = "category"
 *
 * Item signals do not need to store the category
 * themselves because the relationship can be reconstructed
 * through source_rank_id.
 */
function buildRankingCategoryMap(

  signals:NormalisedTasteSignalRow[]

):Map<string,string>{

  const categoryMap =

    new Map<string,string>()


  signals.forEach(

    signal => {

      const node =

        signal.taste_nodes


      if(!node){

        return

      }


      if(

        node.type !== "category"

      ){

        return

      }


      if(

        signal.signal_type !== "created"

      ){

        return

      }


      if(

        signal.position !== 0

      ){

        return

      }


      const category =

        node.label.trim()


      if(!category){

        return

      }


      categoryMap.set(

        signal.source_rank_id,

        category

      )

    }

  )


  return categoryMap

}


/**
 * Builds the public TasteSignal objects used throughout
 * the Taste Graph system.
 *
 * IMPORTANT:
 *
 * Item signals inherit the category belonging to their
 * source ranking.
 *
 * This is what allows Taste DNA to calculate category
 * strength from item behaviour.
 */
function buildGraphSignals(

  signals:NormalisedTasteSignalRow[]

):TasteSignal[]{

  const rankingCategoryMap =

    buildRankingCategoryMap(

      signals

    )


  return signals.map(

    signal => {

      const node =

        signal.taste_nodes


      const signalType =

        signal.signal_type as TasteSignalType


      const isCategoryNode =

        node?.type === "category"


      const category =

        isCategoryNode

        ?

        node?.label ?? ""

        :

        rankingCategoryMap.get(

          signal.source_rank_id

        ) ?? ""


      return {

        id:

          signal.id,

        userId:

          signal.user_id,

        type:

          signalType,

        category,

        item:

          isCategoryNode

            ?

            ""

            :

            node?.label ?? "",

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

}


/**
 * Calculates behavioural metrics from item-level signals.
 *
 * Category signals are excluded because they have position 0.
 */
function calculateBehaviour(

  signals:TasteSignal[]

):TasteGraph["behaviour"]{

  const itemSignals =

    signals.filter(

      signal =>

        signal.item.trim() !== ""

        &&

        signal.position > 0

    )


  const positions =

    itemSignals.map(

      signal =>

        signal.position

    )


  const topChoices =

    positions.filter(

      position =>

        position === 1

    ).length


  const uniqueItems =

    new Set(

      itemSignals.map(

        signal =>

          signal.item

            .trim()

            .toLowerCase()

      )

    )


  return {

    totalRankings:

      new Set(

        signals.map(

          signal =>

            signal.source

        )

      ).size,


    averagePosition:

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

        0,


    topChoiceRate:

      positions.length > 0

        ?

        Number(

          (

            topChoices /

            positions.length

          ).toFixed(3)

        )

        :

        0,


    uniqueness:

      itemSignals.length > 0

        ?

        Number(

          (

            uniqueItems.size /

            itemSignals.length

          ).toFixed(3)

        )

        :

        0

  }

}


/**
 * Loads the complete Taste Graph for a user.
 *
 * Category signals are loaded together with item signals.
 * The category context is then reconstructed in
 * buildGraphSignals().
 */
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
      node_id,
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

    buildGraphNodes(

      typedSignals

    )


  const graphSignals =

    buildGraphSignals(

      typedSignals

    )


  const behaviour =

    calculateBehaviour(

      graphSignals

    )


  /*
   * Useful diagnostic logging while developing
   * the Taste Graph.
   */
  console.log(

    "TASTE GRAPH CATEGORY SIGNALS",

    graphSignals.filter(

      signal =>

        signal.category.trim() !== ""

    )

  )


  return {

    userId,

    nodes,

    signals:

      graphSignals,

    behaviour

  }

}