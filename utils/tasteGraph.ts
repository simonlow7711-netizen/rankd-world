import {
  TasteGraph,
  TasteNode,
  TasteSignal
} from "@/utils/tasteGraphTypes"


import {
  Ranking
} from "@/types/ranking"


/*
 *
 * Re-export the Taste Graph types.
 *
 * Existing callers can therefore import
 * TasteGraph from:
 *
 * "@/utils/tasteGraph"
 *
 * while tasteGraphTypes.ts remains the
 * canonical definition.
 *
 */

export type {
  TasteGraph,
  TasteNode,
  TasteSignal
} from "@/utils/tasteGraphTypes"


/*
 *
 * Create a stable identifier for a
 * Taste Graph node.
 *
 */

function createNodeId(

  type: string,

  value: string

): string {

  return (

    `${type}:${value
      .trim()
      .toLowerCase()
    }`

  )

}


/*
 *
 * Convert ranking position into
 * Taste Graph signal strength.
 *
 * #1 = strongest signal
 *
 * Lower-ranked choices still retain
 * a minimum signal so that the complete
 * ranking contributes to the graph.
 *
 */

function calculatePositionStrength(

  position: number,

  totalItems: number

): number {

  if (
    totalItems <= 1
  ) {

    return 1

  }


  const normalisedPosition =

    (
      totalItems -
      position
    )
    /
    (
      totalItems -
      1
    )


  return Number(

    Math.max(

      0.1,

      Math.min(

        1,

        normalisedPosition

      )

    )

      .toFixed(

        3

      )

  )

}


/*
 *
 * Build the complete Taste Graph
 * from a collection of rankings.
 *
 * This is the canonical graph-building
 * function used by:
 *
 * - Taste DNA
 * - Taste Identity
 * - recommendations
 * - future Taste Graph intelligence
 *
 */

export function buildTasteGraph(

  userId: string,

  rankings: Ranking[] = []

): TasteGraph {


  const nodes:
    TasteNode[] = []


  const signals:
    TasteSignal[] = []


  const nodeIds =
    new Set<string>()


  function addNode(

    node: TasteNode

  ): void {

    if (

      nodeIds.has(

        node.id

      )

    ) {

      return

    }


    nodes.push(

      node

    )


    nodeIds.add(

      node.id

    )

  }


  /*
   *
   * User node.
   *
   */

  addNode({

    id:
      createNodeId(

        "user",

        userId

      ),

    type:
      "user",

    label:
      userId

  })


  let totalPosition =
    0


  let totalItems =
    0


  let topChoices =
    0


  const uniqueChoices =
    new Set<string>()


  /*
   *
   * Process every ranking.
   *
   */

  rankings.forEach(

    ranking => {

      if (
        !ranking
      ) {

        return

      }


      const category =

        (
          ranking.category ||
          "General"
        )
          .trim() ||

        "General"


      /*
       *
       * Category node.
       *
       */

      const categoryId =

        createNodeId(

          "category",

          category

        )


      addNode({

        id:
          categoryId,

        type:
          "category",

        label:
          category

      })


      /*
       *
       * Ranking creation signal.
       *
       * Position 0 deliberately means
       * category/context rather than
       * item preference.
       *
       */

      signals.push({

        id:
          crypto.randomUUID(),

        userId,

        type:
          "created",

        category,

        item:
          category,

        strength:
          1,

        position:
          0,

        source:
          ranking.id

      })


      /*
       *
       * Only process valid ranking items.
       *
       */

      const rankingItems =

        ranking.items?.filter(

          item =>
            Boolean(

              item?.name?.trim()

            )

        ) ?? []


      const totalRankingItems =

        rankingItems.length


      /*
       *
       * Process ranked items.
       *
       */

      rankingItems.forEach(

        item => {

          const itemName =

            item.name.trim()


          if (
            !itemName
          ) {

            return

          }


          const itemId =

            createNodeId(

              "item",

              itemName

            )


          /*
           *
           * Item node.
           *
           */

          addNode({

            id:
              itemId,

            type:
              "item",

            label:
              itemName

          })


          /*
           *
           * Validate ranking position.
           *
           */

          const parsedPosition =

            Number(

              item.position

            )


          const position =

            Number.isFinite(

              parsedPosition

            )
            &&
            parsedPosition > 0

              ?

              parsedPosition

              :

              totalRankingItems


          /*
           *
           * Calculate preference strength.
           *
           */

          const strength =

            calculatePositionStrength(

              position,

              totalRankingItems

            )


          totalPosition +=

            position


          totalItems++


          uniqueChoices.add(

            itemName
              .toLowerCase()

          )


          if (
            position === 1
          ) {

            topChoices++

          }


          /*
           *
           * Ranked signal.
           *
           */

          signals.push({

            id:
              crypto.randomUUID(),

            userId,

            type:
              "ranked",

            category,

            item:
              itemName,

            strength,

            position,

            source:
              ranking.id

          })


          /*
           *
           * Explicit preferred signal
           * for the #1 choice.
           *
           */

          if (
            position === 1
          ) {

            signals.push({

              id:
                crypto.randomUUID(),

              userId,

              type:
                "preferred",

              category,

              item:
                itemName,

              strength:
                1,

              position,

              source:
                ranking.id

            })

          }

        }

      )

    }

  )


  /*
   *
   * Return completed Taste Graph.
   *
   */

  return {

    userId,

    nodes,

    signals,

    behaviour: {

      totalRankings:
        rankings.length,

      averagePosition:

        totalItems > 0

          ?

          Number(

            (

              totalPosition /
              totalItems

            )

              .toFixed(

                2

              )

          )

          :

          0,

      topChoiceRate:

        totalItems > 0

          ?

          Number(

            (

              topChoices /
              totalItems

            )

              .toFixed(

                3

              )

          )

          :

          0,

      uniqueness:

        totalItems > 0

          ?

          Number(

            (

              uniqueChoices.size /
              totalItems

            )

              .toFixed(

                3

              )

          )

          :

          0

    }

  }

}