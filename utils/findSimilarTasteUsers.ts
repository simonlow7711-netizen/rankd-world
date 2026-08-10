import {
  supabase
} from "@/utils/supabase"


export type TasteMatch = {

  userId: string

  score: number

}


/*
 * Compare two ranking strengths.
 *
 * Identical strength = 1
 * Completely different = 0
 */
function compareStrengths(
  a: number,
  b: number
): number {

  const difference =
    Math.abs(
      a - b
    )

  return Math.max(
    0,
    1 - difference
  )

}


/*
 * Find users whose Taste Graph
 * overlaps meaningfully with this user.
 *
 * This is deliberately based on
 * BOTH:
 *
 * 1. Shared items
 * 2. Similar ranking strength
 *
 * Therefore:
 *
 * #1 vs #1
 *
 * produces a stronger match than:
 *
 * #1 vs #7
 */
export async function findSimilarTasteUsers(

  userId: string,

  limit: number = 10

): Promise<TasteMatch[]> {


  const {
    data: userSignals,

    error: userSignalsError

  } = await supabase

    .from("taste_signals")

    .select(
      "node_id,strength"
    )

    .eq(
      "user_id",
      userId
    )


  if (
    userSignalsError
  ) {

    console.error(
      "TASTE MATCH USER SIGNAL ERROR",
      userSignalsError
    )

    return []

  }


  if (
    !userSignals ||
    userSignals.length === 0
  ) {

    return []

  }


  /*
   * Remove duplicate node IDs.
   *
   * A user can have multiple signals
   * for the same item, for example:
   *
   * ranked
   * preferred
   *
   * We want the strongest signal
   * for comparison.
   */

  const userStrengths =
    new Map<string, number>()


  userSignals.forEach(

    signal => {

      if (
        !signal.node_id
      ) {

        return

      }


      const strength =
        Number(
          signal.strength
        ) || 0


      const existing =
        userStrengths.get(
          signal.node_id
        )


      if (
        existing === undefined ||
        strength > existing
      ) {

        userStrengths.set(
          signal.node_id,
          strength
        )

      }

    }

  )


  const nodeIds =
    Array.from(
      userStrengths.keys()
    )


  if (
    nodeIds.length === 0
  ) {

    return []

  }


  /*
   * Find every other user who
   * has interacted with any of
   * the same Taste Graph nodes.
   */

  const {
    data: matches,

    error: matchesError

  } = await supabase

    .from("taste_signals")

    .select(
      "user_id,node_id,strength"
    )

    .in(
      "node_id",
      nodeIds
    )

    .neq(
      "user_id",
      userId
    )


  if (
    matchesError
  ) {

    console.error(
      "TASTE MATCH SEARCH ERROR",
      matchesError
    )

    return []

  }


  if (
    !matches ||
    matches.length === 0
  ) {

    return []

  }


  /*
   * Store:
   *
   * total similarity
   * number of shared nodes
   *
   * This allows us to calculate
   * an average similarity rather
   * than simply rewarding users
   * who happen to share lots of
   * signals.
   */

  const scores =
    new Map<
      string,
      {
        total: number
        count: number
      }
    >()


  matches.forEach(

    match => {

      if (
        !match.user_id ||
        !match.node_id
      ) {

        return

      }


      const originalStrength =
        userStrengths.get(
          match.node_id
        )


      if (
        originalStrength === undefined
      ) {

        return

      }


      const matchStrength =
        Number(
          match.strength
        ) || 0


      const similarity =
        compareStrengths(
          originalStrength,
          matchStrength
        )


      const current =
        scores.get(
          match.user_id
        ) || {
          total: 0,
          count: 0
        }


      current.total +=
        similarity

      current.count +=
        1


      scores.set(
        match.user_id,
        current
      )

    }

  )


  /*
   * Convert the raw similarity
   * into a 0–100 Taste Match score.
   *
   * A small shared sample should
   * not automatically produce a
   * perfect match, so we apply a
   * confidence multiplier based
   * on the number of shared nodes.
   */

  return Array.from(
    scores.entries()
  )

    .map(

      ([matchedUserId, result]) => {


        if (
          result.count === 0
        ) {

          return {

            userId:
              matchedUserId,

            score:
              0

          }

        }


        const averageSimilarity =
          result.total /
          result.count


        /*
         * Confidence increases as
         * more common Taste Graph
         * nodes are shared.
         *
         * 1 shared node = 25%
         * 2 = 50%
         * 3 = 75%
         * 4+ = 100%
         */

        const confidence =
          Math.min(
            1,
            result.count / 4
          )


        const score =
          averageSimilarity *
          confidence *
          100


        return {

          userId:
            matchedUserId,

          score:
            Number(
              score.toFixed(1)
            )

        }

      }

    )

    .filter(
      match =>
        match.score > 0
    )

    .sort(

      (a, b) =>
        b.score -
        a.score

    )

    .slice(
      0,
      limit
    )

}