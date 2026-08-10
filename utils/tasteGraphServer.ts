import {
  TasteGraph,
  TasteNodeType,
  TasteSignal,
  TasteSignalType
} from "@/utils/tasteGraphTypes"

import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


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


/**
 * Server-side Taste Graph reader.
 *
 * This file is intentionally server-only.
 *
 * It uses createSupabaseServerClient()
 * so authentication is resolved through
 * the user's server-side Supabase session.
 */
export async function getTasteGraph(

  userId: string

): Promise<TasteGraph> {

  const supabase =

    await createSupabaseServerClient()


  const {

    data: signals,

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


  if (

    error

    ||

    !signals

  ) {

    console.error(

      "LOAD SERVER TASTE GRAPH ERROR",

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