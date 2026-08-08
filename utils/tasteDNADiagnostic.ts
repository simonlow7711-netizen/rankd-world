import {
  TasteGraph
} from "@/utils/tasteGraph"


export type TasteDNADiagnostic = {

  totalSignals: number

  totalRankings: number

  uniqueItems: number

  uniqueCategories: number

  averagePosition: number

  topChoiceRate: number

  preferredSignals: number

  rankedSignals: number

  createdSignals: number

  feedbackSignals: number

  categoryBreakdown: Record<
    string,
    number
  >

  itemBreakdown: Record<
    string,
    number
  >

}


function normaliseItem(
  value: string
): string {

  return value
    .trim()
    .toLowerCase()

}


export function calculateTasteDNADiagnostic(
  graph: TasteGraph
): TasteDNADiagnostic {

  const signals =
    graph.signals ?? []


  const itemBreakdown:
    Record<string, number> = {}


  const categoryBreakdown:
    Record<string, number> = {}


  const rankingIds =
    new Set<string>()


  const uniqueItems =
    new Set<string>()


  const uniqueCategories =
    new Set<string>()


  let totalPosition = 0

  let positionedSignals = 0

  let topChoices = 0

  let preferredSignals = 0

  let rankedSignals = 0

  let createdSignals = 0

  let feedbackSignals = 0


  signals.forEach(

    signal => {

      if (!signal) {

        return

      }


      if (signal.source) {

        rankingIds.add(
          signal.source
        )

      }


      const item =
        normaliseItem(
          signal.item ?? ""
        )


      const category =
        signal.category
          ?.trim()
          || ""


      if (item) {

        uniqueItems.add(
          item
        )


        itemBreakdown[item] =
          (
            itemBreakdown[item]
            || 0
          )
          + 1

      }


      if (category) {

        uniqueCategories.add(
          category
        )


        categoryBreakdown[category] =
          (
            categoryBreakdown[category]
            || 0
          )
          + 1

      }


      const position =
        Number(
          signal.position
        )


      if (

        Number.isFinite(
          position
        )

        &&

        position > 0

      ) {

        totalPosition +=
          position

        positionedSignals++


        if (
          position === 1
        ) {

          topChoices++

        }

      }


      if (
        signal.type ===
        "preferred"
      ) {

        preferredSignals++

      }


      if (
        signal.type ===
        "ranked"
      ) {

        rankedSignals++

      }


      if (
        signal.type ===
        "created"
      ) {

        createdSignals++

      }


      if (

        signal.type ===
          "feedback_clicked"

        ||

        signal.type ===
          "feedback_ranked"

        ||

        signal.type ===
          "feedback_skipped"

        ||

        signal.type ===
          "feedback_disagreed"

      ) {

        feedbackSignals++

      }

    }

  )


  return {

    totalSignals:
      signals.length,

    totalRankings:
      rankingIds.size,

    uniqueItems:
      uniqueItems.size,

    uniqueCategories:
      uniqueCategories.size,

    averagePosition:

      positionedSignals > 0

        ?

        Number(

          (

            totalPosition /
            positionedSignals

          ).toFixed(2)

        )

        :

        0,

    topChoiceRate:

      positionedSignals > 0

        ?

        Number(

          (

            topChoices /
            positionedSignals

          ).toFixed(3)

        )

        :

        0,

    preferredSignals,

    rankedSignals,

    createdSignals,

    feedbackSignals,

    categoryBreakdown,

    itemBreakdown

  }

}