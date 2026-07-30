export function calculateChallenge(

  original: any,

  remix: any

) {

  const comparisons = original.items
    .map((item: any) => {

      const other = remix.items.find(
        (candidate: any) => candidate.name === item.name
      )

      if (!other) return null

      return {
        item: item.name,
        originalPosition: item.position,
        remixPosition: other.position,
        difference: Math.abs(
          item.position - other.position
        )
      }

    })
    .filter(Boolean)



  comparisons.sort(

    (a: any, b: any) =>
      b.difference - a.difference

  )



  const biggestDifference =
    comparisons[0] || null



  const totalDifference =
    comparisons.reduce(

      (sum: number, comparison: any) =>

        sum + comparison.difference,

      0

    )



  const maxDifference =
    original.items.length * 6



  const challengeScore =

    Math.round(

      (totalDifference / maxDifference) * 100

    )



  return {

    challengeScore,

    biggestDifference,

    comparisons

  }

}