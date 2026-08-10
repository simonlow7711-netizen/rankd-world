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

  id: string

  type: string

  label: string

}


type TasteSignalRow = {

  id: string

  user_id: string

  signal_type: string

  strength: number

  position: number

  source_rank_id: string

  node_id: string

  taste_nodes:
    | TasteNodeRow
    | TasteNodeRow[]
    | null

}


type NormalisedTasteSignalRow = {

  id: string

  user_id: string

  signal_type: string

  strength: number

  position: number

  source_rank_id: string

  node_id: string

  taste_nodes:
    | TasteNodeRow
    | null

}


function createSlug(

  label: string

): string {

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


function mergeStrength(

  existing: number,

  incoming: number

): number {

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


function normaliseTasteSignalRows(

  rows: unknown

): NormalisedTasteSignalRow[] {

  if (!Array.isArray(rows)) {

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


function buildGraphNodes(

  signals: NormalisedTasteSignalRow[]

): {

  id: string

  type: TasteNodeType

  label: string

}[] {

  const nodes =

    new Map<

      string,

      {

        id: string

        type: TasteNodeType

        label: string

      }

    >()


  signals.forEach(

    signal => {

      const node =

        signal.taste_nodes


      if (!node) {

        return

      }


      if (

        nodes.has(

          node.id

        )

      ) {

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


function buildRankingCategoryMap(

  signals: NormalisedTasteSignalRow[]

): Map<string, string> {

  const categoryMap =

    new Map<string, string>()


  signals.forEach(

    signal => {

      const node =

        signal.taste_nodes


      if (!node) {

        return

      }


      if (

        node.type !== "category"

      ) {

        return

      }


      if (

        signal.signal_type !== "created"

      ) {

        return

      }


      if (

        signal.position !== 0

      ) {

        return

      }


      const category =

        node.label.trim()


      if (!category) {

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


function buildGraphSignals(

  signals: NormalisedTasteSignalRow[]

): TasteSignal[] {

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
            ? ""
            : node?.label ?? "",

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


function calculateBehaviour(

  signals: TasteSignal[]

): TasteGraph["behaviour"] {

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


async function getOrCreateNode({

  type,

  label

}: {

  type: string

  label: string

}): Promise<TasteNodeRow | null> {

  const cleanLabel =

    label.trim()


  if (!cleanLabel) {

    return null

  }


  const slug =

    createSlug(

      cleanLabel

    )


  const {

    data: existing,

    error: lookupError

  } =
    await supabase

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


  if (lookupError) {

    console.error(

      "LOOKUP TASTE NODE ERROR",

      {

        message:
          lookupError.message,

        details:
          lookupError.details,

        hint:
          lookupError.hint,

        code:
          lookupError.code,

        type,

        label:
          cleanLabel,

        slug

      }

    )

  }


  if (existing) {

    return existing as TasteNodeRow

  }


  const {

    data: newNode,

    error

  } =
    await supabase

      .from("taste_nodes")

      .insert({

        type,

        label:
          cleanLabel,

        slug

      })

      .select(

        "id, type, label"

      )

      .single()


  if (error) {

    console.error(

      "CREATE TASTE NODE ERROR",

      {

        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,

        code:
          error.code,

        type,

        label:
          cleanLabel,

        slug

      }

    )

    return null

  }


  return newNode as TasteNodeRow

}


async function getCategoryNode(

  category: string

): Promise<TasteNodeRow | null> {

  const cleanCategory =

    category.trim()


  if (!cleanCategory) {

    return null

  }


  return getOrCreateNode({

    type:
      "category",

    label:
      cleanCategory

  })

}


async function getItemNode(

  item: string

): Promise<TasteNodeRow | null> {

  const cleanItem =

    item.trim()


  if (!cleanItem) {

    return null

  }


  return getOrCreateNode({

    type:
      "item",

    label:
      cleanItem

  })

}


/**
 * Saves Taste Graph signals.
 *
 * This function is intentionally client-safe.
 *
 * Client components such as CreateClient.tsx
 * can use this function without importing
 * next/headers or any server-only module.
 */
export async function saveTasteGraph(

  graph: TasteGraph

): Promise<void> {

  for (

    const signal of graph.signals

  ) {

    if (!signal) {

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


    if (!sourceRankId) {

      continue

    }


    let node: TasteNodeRow | null = null


    if (

      signalType === "created"

      &&

      cleanCategory

      &&

      signal.position === 0

    ) {

      node =

        await getCategoryNode(

          cleanCategory

        )

    }

    else if (

      cleanItem

    ) {

      node =

        await getItemNode(

          cleanItem

        )

    }


    if (!node) {

      continue

    }


    const {

      data: existingSignal,

      error: lookupError

    } =
      await supabase

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


    if (lookupError) {

      console.error(

        "LOOKUP TASTE SIGNAL ERROR",

        lookupError

      )

      continue

    }


    if (existingSignal) {

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

        error: updateError

      } =
        await supabase

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


      if (updateError) {

        console.error(

          "UPDATE TASTE SIGNAL ERROR",

          updateError

        )

      }


      continue

    }


    const {

      error: insertError

    } =
      await supabase

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


    if (insertError) {

      console.error(

        "SAVE TASTE SIGNAL ERROR",

        insertError

      )

    }

  }

}


/**
 * Client-safe Taste Graph reader.
 *
 * NOTE:
 * This uses the browser Supabase client.
 *
 * Server components and API routes that need
 * server-side authentication should use
 * utils/tasteGraphServer.ts instead.
 */
export async function getTasteGraph(

  userId: string

): Promise<TasteGraph> {

  const {

    data: signals,

    error

  } =
    await supabase

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


  if (

    error

    ||

    !signals

  ) {

    console.error(

      "LOAD TASTE GRAPH ERROR",

      error

    )


    return {

      userId,

      nodes: [],

      signals: [],

      behaviour: {

        totalRankings: 0,

        averagePosition: 0,

        topChoiceRate: 0,

        uniqueness: 0

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


  return {

    userId,

    nodes,

    signals:
      graphSignals,

    behaviour

  }

}