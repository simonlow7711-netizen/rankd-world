import {
  Ranking
} from "@/types/ranking"


import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"


import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"





export type TasteGraphSignal = {

  uniqueness: number

  perspective: number

  confidence: number

  description: string

}





function normalise(

  value: number

): number {

  if (
    !Number.isFinite(
      value
    )
  ) {

    return 0

  }


  return Math.min(

    Math.max(

      Math.round(
        value
      ),

      0

    ),

    100

  )

}





function getRankingUniqueness(

  ranking: Ranking

): number {

  const items =
    ranking.items ?? []


  if (
    items.length === 0
  ) {

    return 0

  }


  /*
   *
   * A ranking should not automatically
   * receive a high uniqueness score simply
   * because it contains seven items.
   *
   * Instead, uniqueness reflects how much
   * the ranking appears to make its own
   * ordering.
   *
   */


  const positions =

    items

      .map(

        item =>
          Number(
            item.position
          )

      )

      .filter(

        position =>
          Number.isFinite(
            position
          )

      )


  if (
    positions.length === 0
  ) {

    return 0

  }


  const sortedPositions =

    [...positions].sort(

      (
        a,
        b
      ) =>
        a -
        b

    )


  let orderingDifference =
    0


  for (
    let index = 0;
    index < sortedPositions.length;
    index++
  ) {

    orderingDifference +=

      Math.abs(

        positions[index] -
        sortedPositions[index]

      )

  }


  const maximumDifference =

    positions.length *
    Math.max(

      positions.length -
      1,

      1

    )


  const orderingSignal =

    maximumDifference > 0

      ?

      orderingDifference /
      maximumDifference

      :

      0


  /*
   *
   * A ranking with a meaningful ordering
   * receives a stronger signal, but the score
   * remains deliberately moderate.
   *
   */


  return normalise(

    35 +
    (
      orderingSignal *
      65
    )

  )

}





function getDescription({

  uniqueness,

  perspective,

  confidence

}: {

  uniqueness: number

  perspective: number

  confidence: number

}): string {


  /*
   *
   * Keep this description focused on the
   * current ranking.
   *
   * Taste Identity owns the broader story
   * about the person.
   *
   */


  if (
    perspective >= 75
  ) {

    return (

      "This ranking takes a noticeably different position from the wider conversation."

    )

  }


  if (
    perspective >= 55
  ) {

    return (

      "This ranking adds a distinct angle to the wider conversation."

    )

  }


  if (
    uniqueness >= 70
  ) {

    return (

      "The order of your choices creates a clear personal ranking."

    )

  }


  if (
    confidence >= 75
  ) {

    return (

      "Your ordering shows a clear level of conviction."

    )

  }


  if (
    confidence >= 50
  ) {

    return (

      "Your choices form a reasonably clear order of preference."

    )

  }


  return (

    "This ranking gives RANKD another useful signal about your preferences."

  )

}





export function generateTasteGraphSignal(

  ranking: Ranking

): TasteGraphSignal {


  const liveScore =

    calculateLivePerspectiveScore(

      ranking

    )


  const perspectiveScore =

    calculatePerspectiveScore(

      ranking

    )


  const uniqueness =

    getRankingUniqueness(

      ranking

    )


  const perspective =

    normalise(

      perspectiveScore

    )


  const confidence =

    normalise(

      liveScore

    )


  const description =

    getDescription({

      uniqueness,

      perspective,

      confidence

    })


  return {

    uniqueness,

    perspective,

    confidence,

    description

  }

}