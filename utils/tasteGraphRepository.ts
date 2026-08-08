import {
supabase
} from "@/utils/supabase"

import {
TasteGraph
} from "@/utils/tasteGraph"

async function getOrCreateNode({

  type,

  label

}:{

  type:string

  label:string

})

{

const slug =

label
  .toLowerCase()
  .trim()
  .replace(
    /\s+/g,
    "-"
  )

const {

data:existing

} = await supabase

.from("taste_nodes")

.select("*")

.eq(
  "slug",
  slug
)

.single()

if(existing){

return existing

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

return newNode

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

export async function saveTasteGraph(

  graph:TasteGraph

){

for(

const signal of graph.signals

){

const itemNode =

  await getOrCreateNode({

    type:"item",

    label:signal.item

  })


if(!itemNode){

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

    itemNode.id

  )

  .eq(

    "source_rank_id",

    signal.source

  )

  .eq(

    "signal_type",

    signal.type

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

      itemNode.id,

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

signals as any[]

const nodes =

typedSignals

  .map(

    signal =>

      signal.taste_nodes

  )

  .filter(Boolean)

  .map(

    node => ({

      id:
        node.id,

      type:
        node.type,

      label:
        node.label

    })

  )

const graphSignals =

typedSignals.map(

  signal => ({

    id:
      signal.id,

    userId:
      signal.user_id,

    type:
      signal.signal_type,

    category:

      signal.taste_nodes?.type === "category"

      ?

      signal.taste_nodes.label

      :

      "",

    item:
      signal.taste_nodes?.label ?? "",

    strength:
      Number(signal.strength),

    position:
      signal.position,

    source:
      signal.source_rank_id

  })

)

const positions =

graphSignals.map(

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

  graphSignals.map(

    signal =>
      signal.item

  )

)

return {

userId,

nodes,

signals:
  graphSignals,

behaviour:{

  totalRankings:

    new Set(

      graphSignals.map(

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

    graphSignals.length > 0

    ?

    Number(

      (

        uniqueItems.size /
        graphSignals.length

      ).toFixed(3)

    )

    :

    0

}

}

}