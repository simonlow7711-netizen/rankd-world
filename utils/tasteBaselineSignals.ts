import {
  TasteSignal
} from "@/utils/tasteGraphTypes"

import {
  Ranking
} from "@/types/ranking"


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


export function buildTasteBaselineSignals(

  userId: string,

  ranking: Ranking

): TasteSignal[] {

  return (

    ranking.items ?? []

  ).map(

    item => ({

      id:
        crypto.randomUUID(),

      userId,

      type:
        "preferred",

      category:
        ranking.category,

      item:
        item.name,

      strength:

        clamp(

          0.7 +

          (
            positionStrength(
              item.position
            ) *
            0.3
          )

        ),

      position:
        item.position,

      source:
        ranking.id

    })

  )

}