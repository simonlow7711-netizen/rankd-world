import {
TasteSignal
} from "@/utils/tasteGraphTypes"

import {
Ranking
} from "@/types/ranking"

import {
TasteFeedbackComparison
} from "@/utils/tasteFeedbackComparison"

function clamp(
value: number
): number {

return Math.max(
0,
Math.min(
value,
1
)
)

}

function positionStrength(
position: number
): number {

const strength =

1 -

(
  (position - 1) *
  0.1
)

return Number(

Math.max(
  strength,
  0.4
).toFixed(3)

)

}

export function buildTasteFeedbackSignals(

userId: string,

recommendation: Ranking,

userRanking: Ranking,

comparison: TasteFeedbackComparison

): TasteSignal[] {

const signals: TasteSignal[] = []

comparison.items.forEach(

feedback => {

  if (
    feedback.status ===
    "kept"
  ) {

    const strength =

      clamp(

        0.75 +
        (
          positionStrength(
            feedback.userPosition ?? 7
          ) *
          0.25
        )

      )


    signals.push({

      id:
        crypto.randomUUID(),

      userId,

      type:
        "preferred",

      category:
        userRanking.category,

      item:
        feedback.item,

      strength,

      position:
        feedback.userPosition ?? 7,

      source:
        userRanking.id

    })

    return

  }


  if (
    feedback.status ===
    "moved"
  ) {

    const recommendedStrength =

      positionStrength(
        feedback.recommendedPosition
      )


    const userStrength =

      positionStrength(
        feedback.userPosition ?? 7
      )


    const strength =

      clamp(

        (
          recommendedStrength +
          userStrength
        ) /
        2

      )


    signals.push({

      id:
        crypto.randomUUID(),

      userId,

      type:
        "challenged",

      category:
        userRanking.category,

      item:
        feedback.item,

      strength,

      position:
        feedback.userPosition ?? 7,

      source:
        userRanking.id

    })

    return

  }


  if (
    feedback.status ===
    "rejected"
  ) {

    const strength =

      clamp(

        0.65 +

        (
          positionStrength(
            feedback.recommendedPosition
          ) *
          0.2
        )

      )


    signals.push({

      id:
        crypto.randomUUID(),

      userId,

      type:
        "avoided",

      category:
        recommendation.category,

      item:
        feedback.item,

      strength,

      position:
        feedback.recommendedPosition,

      source:
        userRanking.id

    })

  }

}

)

userRanking.items?.forEach(

item => {

  const existsInRecommendation =

    recommendation.items?.some(

      recommendedItem =>

        recommendedItem.name
          .trim()
          .toLowerCase()

        ===

        item.name
          .trim()
          .toLowerCase()

    )


  if (
    existsInRecommendation
  ) {

    return

  }


  signals.push({

    id:
      crypto.randomUUID(),

    userId,

    type:
      "preferred",

    category:
      userRanking.category,

    item:
      item.name,

    strength:

      clamp(

        0.8 +

        (
          positionStrength(
            item.position
          ) *
          0.2
        )

      ),

    position:
      item.position,

    source:
      userRanking.id

  })

}

)

return signals

}