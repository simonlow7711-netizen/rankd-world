import {
  TasteGraph,
  TasteNode,
  TasteSignal
} from "@/utils/tasteGraphTypes"

import {
  Ranking
} from "@/types/ranking"


function createNodeId(
  type: string,
  value: string
): string {

  return `${type}:${value
    .trim()
    .toLowerCase()
  }`

}


/*
 * Converts a ranking position into a taste strength.
 *
 * #1 = strongest signal
 * Last position = weakest signal
 *
 * A minimum of 0.1 is retained so that
 * lower-ranked choices still contribute
 * to the Taste Graph.
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

      .toFixed(3)

  )

}


export function buildTasteGraph(
  userId: string,
  rankings: Ranking[] = []
): TasteGraph {


  const nodes: TasteNode[] = []

  const signals: TasteSignal[] = []


  const nodeIds =
    new Set<string>()


  function addNode(
    node: TasteNode
  ): void {

    if (
      !nodeIds.has(
        node.id
      )
    ) {

      nodes.push(
        node
      )

      nodeIds.add(
        node.id
      )

    }

  }


  /*
   * User node
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


  let totalPosition = 0

  let totalItems = 0

  let topChoices = 0


  const uniqueChoices =
    new Set<string>()


  /*
   * Build the graph from
   * every ranking belonging
   * to this user.
   */

  rankings.forEach(

    ranking => {

      if (
        !ranking
      ) {

        return

      }


      const category =
        ranking.category ||
        "General"


      /*
       * Category node
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
       * Ranking creation signal.
       *
       * Creating a ranking tells us
       * something about the user's
       * interest in this category.
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
       * Only use valid ranking items.
       */

      const rankingItems =
        ranking.items?.filter(

          item =>
            Boolean(
              item?.name
            )

        ) ?? []


      const totalRankingItems =
        rankingItems.length


      /*
       * Item signals
       */

      rankingItems.forEach(

        item => {


          const itemName =
            item.name.trim()


          const itemId =
            createNodeId(
              "item",
              itemName
            )


          /*
           * Item node
           */

          addNode({

            id:
              itemId,

            type:
              "item",

            label:
              itemName

          })


          const position =
            Number(
              item.position
            ) ||
            totalRankingItems


          /*
           * Position determines
           * the strength of the
           * user's taste signal.
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
           * General ranking signal.
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
           * #1 creates an additional
           * preferred signal.
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
   * Return the completed
   * Taste Graph.
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
              .toFixed(2)

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
              .toFixed(3)

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
              .toFixed(3)

          )

          :

          0

    }

  }

}