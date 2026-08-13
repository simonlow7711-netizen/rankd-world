import {
  Ranking
} from "@/types/ranking"


import {
  TasteGraph
} from "@/utils/tasteGraphTypes"


export type TasteRecommendation = {

  ranking: Ranking

  score: number

  reasons: string[]

}


/*
 *
 * Normalise a score to 0–100.
 *
 */


function normalise(

  value: number

) {

  return Math.max(

    0,

    Math.min(

      Math.round(

        value

      ),

      100

    )

  )

}


/*
 *
 * Normalise item/category text.
 *
 */


function normaliseItem(

  value: string

) {

  return value

    .toLowerCase()

    .trim()

}


/*
 *
 * Return all signals for an item.
 *
 */


function getItemSignals(

  graph: TasteGraph,

  itemName: string

) {

  const normalisedItem =

    normaliseItem(

      itemName

    )


  return graph.signals.filter(

    signal =>

      normaliseItem(

        signal.item

      ) ===

      normalisedItem

  )

}


/*
 *
 * Return all signals for a category.
 *
 */


function getCategorySignals(

  graph: TasteGraph,

  category: string

) {

  const normalisedCategory =

    normaliseItem(

      category

    )


  return graph.signals.filter(

    signal =>

      normaliseItem(

        signal.category

      ) ===

      normalisedCategory

  )

}


/*
 *
 * Determine whether an item has already
 * appeared in the user's Taste Graph.
 *
 */


function hasAlreadyRankedItem(

  graph: TasteGraph,

  itemName: string

) {

  return (

    getItemSignals(

      graph,

      itemName

    ).length > 0

  )

}


/*
 *
 * Resolve the conversation root for a ranking.
 *
 * IMPORTANT:
 *
 * We prefer resolvedRootId because the ranking
 * data may already have had its conversation
 * lineage resolved.
 *
 * We then fall back to rootId, parentId and id.
 *
 */


function getConversationRootId(

  ranking: Ranking

): string {

  const rankingWithResolvedRoot =

    ranking as Ranking & {

      resolvedRootId?: string | null

    }


  return (

    rankingWithResolvedRoot.resolvedRootId ??

    ranking.rootId ??

    ranking.parentId ??

    ranking.id

  )

}


/*
 *
 * Build a map of ranking IDs.
 *
 */


function buildRankingMap(

  rankings: Ranking[]

) {

  const rankingMap =

    new Map<

      string,

      Ranking

    >()


  rankings.forEach(

    ranking => {

      rankingMap.set(

        ranking.id,

        ranking

      )

    }

  )


  return rankingMap

}


/*
 *
 * Find the root of a ranking by walking its
 * parent chain when necessary.
 *
 * This is a defensive fallback for rankings
 * where rootId/resolvedRootId is missing or
 * inconsistent.
 *
 */


function resolveConversationRootFromParents(

  ranking: Ranking,

  rankingMap: Map<string, Ranking>

): string {

  const rankingWithResolvedRoot =

    ranking as Ranking & {

      resolvedRootId?: string | null

    }


  if (

    rankingWithResolvedRoot.resolvedRootId

  ) {

    return (

      rankingWithResolvedRoot.resolvedRootId

    )

  }


  if (

    ranking.rootId

  ) {

    return ranking.rootId

  }


  const visited =

    new Set<string>()


  let current = ranking


  while (

    current.parentId &&

    !visited.has(

      current.id

    )

  ) {

    visited.add(

      current.id

    )


    const parent =

      rankingMap.get(

        current.parentId

      )


    if (

      !parent

    ) {

      break

    }


    current = parent

  }


  return (

    current.rootId ??

    current.id

  )

}


/*
 *
 * Find conversations the user has participated
 * in directly.
 *
 * Any ranking created by the current user
 * excludes the entire conversation.
 *
 */


function getUserParticipatedConversationRoots(

  rankings: Ranking[],

  currentUserId?: string

): Set<string> {

  const excludedRoots =

    new Set<string>()


  if (

    !currentUserId

  ) {

    return excludedRoots

  }


  const rankingMap =

    buildRankingMap(

      rankings

    )


  rankings.forEach(

    ranking => {

      if (

        ranking.creatorId !==

        currentUserId

      ) {

        return

      }


      const rootId =

        resolveConversationRootFromParents(

          ranking,

          rankingMap

        )


      excludedRoots.add(

        rootId

      )

    }

  )


  return excludedRoots

}


/*
 *
 * Find conversations represented in the
 * Taste Graph.
 *
 * A Taste Graph signal has a source ranking.
 *
 * If that source ranking belongs to a
 * conversation, that conversation is already
 * represented in the user's taste history and
 * should not be recommended again.
 *
 */


function getExcludedConversationRootsFromGraph(

  graph: TasteGraph,

  rankings: Ranking[]

): Set<string> {

  const rankingMap =

    buildRankingMap(

      rankings

    )


  const excludedRoots =

    new Set<string>()


  graph.signals.forEach(

    signal => {

      if (

        !signal.source

      ) {

        return

      }


      const sourceRanking =

        rankingMap.get(

          signal.source

        )


      if (

        !sourceRanking

      ) {

        return

      }


      const rootId =

        resolveConversationRootFromParents(

          sourceRanking,

          rankingMap

        )


      excludedRoots.add(

        rootId

      )

    }

  )


  return excludedRoots

}


/*
 *
 * Direct taste match.
 *
 */


function calculateDirectTasteMatch(

  graph: TasteGraph,

  itemName: string

) {

  const signals =

    getItemSignals(

      graph,

      itemName

    )


  if (

    signals.length === 0

  ) {

    return {

      score: 0,

      strongestPosition: null

    }

  }


  const tasteSignals =

    signals.filter(

      signal =>

        signal.type !==

          "feedback_clicked"

        &&

        signal.type !==

          "feedback_ranked"

        &&

        signal.type !==

          "feedback_skipped"

        &&

        signal.type !==

          "feedback_disagreed"

    )


  if (

    tasteSignals.length === 0

  ) {

    return {

      score: 0,

      strongestPosition: null

    }

  }


  const strongestSignal =

    tasteSignals.reduce(

      (

        strongest,

        signal

      ) =>

        signal.strength >

        strongest.strength

          ? signal

          : strongest,

      tasteSignals[0]

    )


  let score =

    strongestSignal.strength *

    50


  if (

    strongestSignal.position === 1

  ) {

    score += 20

  }

  else if (

    strongestSignal.position === 2

  ) {

    score += 15

  }

  else if (

    strongestSignal.position === 3

  ) {

    score += 10

  }


  return {

    score,

    strongestPosition:

      strongestSignal.position

  }

}


/*
 *
 * Category affinity.
 *
 */


function calculateCategoryAffinity(

  graph: TasteGraph,

  category: string

) {

  const categorySignals =

    getCategorySignals(

      graph,

      category

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      signalCount: 0

    }

  }


  const uniqueRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const categoryStrength =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.strength,

      0

    )


  const averageStrength =

    categorySignals.length > 0

      ?

      categoryStrength /

      categorySignals.length

      :

      0


  let score =

    Math.min(

      uniqueRankings.size * 8,

      24

    )


  score +=

    Math.min(

      averageStrength * 20,

      20

    )


  return {

    score,

    signalCount:

      categorySignals.length

  }

}


/*
 *
 * Novelty.
 *
 */


function calculateNovelty(

  graph: TasteGraph,

  ranking: Ranking

) {

  const rankedItems =

    ranking.items.filter(

      item =>

        hasAlreadyRankedItem(

          graph,

          item.name

        )

    )


  if (

    ranking.items.length === 0

  ) {

    return {

      score: 0,

      newItems: 0,

      knownItems: 0

    }

  }


  const newItems =

    ranking.items.length -

    rankedItems.length


  const knownItems =

    rankedItems.length


  if (

    knownItems ===

    ranking.items.length

  ) {

    return {

      score: -25,

      newItems,

      knownItems

    }

  }


  const noveltyRatio =

    newItems /

    ranking.items.length


  const score =

    noveltyRatio * 15


  return {

    score,

    newItems,

    knownItems

  }

}


/*
 *
 * Taste neighbour discovery.
 *
 */


function calculateTasteNeighbourBonus(

  graph: TasteGraph,

  ranking: Ranking

) {

  const categorySignals =

    getCategorySignals(

      graph,

      ranking.category

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      active: false

    }

  }


  const categoryRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const validPositions =

    categorySignals.filter(

      signal =>

        typeof signal.position ===

        "number"

    )


  const averagePosition =

    validPositions.length > 0

      ?

      validPositions.reduce(

        (

          total,

          signal

        ) =>

          total +

          signal.position,

        0

      ) /

      validPositions.length

      :

      7


  let score =

    Math.min(

      categoryRankings.size * 5,

      15

    )


  if (

    averagePosition <= 3

  ) {

    score += 10

  }

  else if (

    averagePosition <= 4

  ) {

    score += 5

  }


  return {

    score,

    active: true

  }

}


/*
 *
 * Feedback adjustment.
 *
 */


function calculateFeedbackAdjustment(

  graph: TasteGraph,

  itemName: string

) {

  const feedbackSignals =

    graph.signals.filter(

      signal =>

        normaliseItem(

          signal.item

        ) ===

        normaliseItem(

          itemName

        )

        &&

        (

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

        )

    )


  let adjustment = 0

  let positiveFeedback = 0

  let negativeFeedback = 0


  feedbackSignals.forEach(

    signal => {

      if (

        signal.type ===

        "feedback_clicked"

      ) {

        adjustment +=

          signal.strength *

          10

        positiveFeedback += 1

      }


      if (

        signal.type ===

        "feedback_ranked"

      ) {

        adjustment +=

          signal.strength *

          30

        positiveFeedback += 1

      }


      if (

        signal.type ===

        "feedback_skipped"

      ) {

        adjustment -=

          signal.strength *

          15

        negativeFeedback += 1

      }


      if (

        signal.type ===

        "feedback_disagreed"

      ) {

        adjustment -=

          signal.strength *

          30

        negativeFeedback += 1

      }

    }

  )


  return {

    adjustment,

    positiveFeedback,

    negativeFeedback

  }

}


/*
 *
 * Calculate recommendation score.
 *
 */


function calculateRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  let score = 0

  const reasons: string[] = []


  /*
   *
   * 1. DIRECT TASTE MATCH
   *
   */


  ranking.items.forEach(

    item => {

      const directMatch =

        calculateDirectTasteMatch(

          graph,

          item.name

        )


      if (

        directMatch.score > 0

      ) {

        score +=

          directMatch.score


        if (

          directMatch.strongestPosition === 1

        ) {

          reasons.push(

            `Matches your #1 choice: ${item.name}`

          )

        }

        else if (

          directMatch.strongestPosition !== null

          &&

          directMatch.strongestPosition <= 3

        ) {

          reasons.push(

            `You ranked ${item.name} highly`

          )

        }

        else {

          reasons.push(

            `You have ranked ${item.name}`

          )

        }

      }


      const feedback =

        calculateFeedbackAdjustment(

          graph,

          item.name

        )


      if (

        feedback.adjustment !== 0

      ) {

        score +=

          feedback.adjustment


        if (

          feedback.positiveFeedback >

          feedback.negativeFeedback

        ) {

          reasons.push(

            `Your previous choices suggest you like ${item.name}`

          )

        }


        if (

          feedback.negativeFeedback >

          feedback.positiveFeedback

        ) {

          reasons.push(

            `Your previous choices suggest ${item.name} may not be for you`

          )

        }

      }

    }

  )


  /*
   *
   * 2. CATEGORY AFFINITY
   *
   */


  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  if (

    categoryAffinity.score > 0

  ) {

    score +=

      categoryAffinity.score


    reasons.push(

      `Matches your interest in ${ranking.category}`

    )

  }


  /*
   *
   * 3. TASTE NEIGHBOUR
   *
   */


  const neighbourBonus =

    calculateTasteNeighbourBonus(

      graph,

      ranking

    )


  if (

    neighbourBonus.active

  ) {

    score +=

      neighbourBonus.score


    reasons.push(

      "Explores a direction close to your taste"

    )

  }


  /*
   *
   * 4. NOVELTY
   *
   */


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  score +=

    novelty.score


  if (

    novelty.newItems > 0

  ) {

    reasons.push(

      "Introduces new choices for you to discover"

    )

  }


  /*
   *
   * 5. DECISIVENESS
   *
   */


  if (

    graph.behaviour.averagePosition > 0

    &&

    graph.behaviour.averagePosition <= 3

  ) {

    score += 5


    reasons.push(

      "Fits your decisive ranking style"

    )

  }


  /*
   *
   * 6. NEW CATEGORY
   *
   */


  const categorySignals =

    getCategorySignals(

      graph,

      ranking.category

    )


  if (

    categorySignals.length === 0

  ) {

    score += 8


    reasons.push(

      "Introduces a new taste direction"

    )

  }


  return {

    ranking,

    score:

      normalise(

        score

      ),

    reasons:

      [

        ...new Set(

          reasons

        )

      ]

  }

}


/*
 *
 * Public score function.
 *
 */


export function calculateTasteRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  return calculateRecommendationScore(

    graph,

    ranking

  )

}


/*
 *
 * Diagnostic helper.
 *
 * Returns the complete eligibility audit without
 * writing anything to the browser/server console.
 *
 */


export function debugTasteRecommendationEligibility(

  rankings: Ranking[],

  currentUserId?: string

) {

  const rankingMap =

    buildRankingMap(

      rankings

    )


  const userRoots =

    getUserParticipatedConversationRoots(

      rankings,

      currentUserId

    )


  const results =

    rankings.map(

      ranking => {

        const resolvedRootId =

          resolveConversationRootFromParents(

            ranking,

            rankingMap

          )


        const isOwnRanking =

          Boolean(

            currentUserId

            &&

            ranking.creatorId ===

              currentUserId

          )


        const rootExcluded =

          userRoots.has(

            resolvedRootId

          )


        const eligible =

          !isOwnRanking

          &&

          !rootExcluded


        return {

          id:
            ranking.id,

          title:
            ranking.title,

          creatorId:
            ranking.creatorId,

          currentUserId,

          parentId:
            ranking.parentId,

          rootId:
            ranking.rootId,

          resolvedRootId,

          isOwnRanking,

          rootExcluded,

          eligible

        }

      }

    )


  return results

}


/*
 *
 * Return personalised recommendations.
 *
 */


export function getTasteRecommendedRankings(

  graph: TasteGraph,

  rankings: Ranking[],

  currentUserId?: string

): TasteRecommendation[] {

  /*
   *
   * Build the ranking map once.
   *
   */


  const rankingMap =

    buildRankingMap(

      rankings

    )


  /*
   *
   * 1. Direct user participation.
   *
   */


  const userParticipatedRoots =

    getUserParticipatedConversationRoots(

      rankings,

      currentUserId

    )


  /*
   *
   * 2. Taste Graph participation.
   *
   */


  const graphExcludedRoots =

    getExcludedConversationRootsFromGraph(

      graph,

      rankings

    )


  /*
   *
   * 3. Combine exclusions.
   *
   */


  const excludedConversationRoots =

    new Set<string>([

      ...userParticipatedRoots,

      ...graphExcludedRoots

    ])


  /*
   *
   * 4. Filter rankings.
   *
   *
   * IMPORTANT:
   *
   * The exclusion happens BEFORE scoring.
   *
   * This means a ranking from a conversation
   * the user has already participated in can
   * never become a recommendation simply because
   * it happens to score highly.
   *
   */


  const eligibleRankings =

    rankings.filter(

      ranking => {

        const conversationRootId =

          resolveConversationRootFromParents(

            ranking,

            rankingMap

          )


        const isOwnRanking =

          Boolean(

            currentUserId

            &&

            ranking.creatorId ===

              currentUserId

          )


        const rootExcluded =

          excludedConversationRoots.has(

            conversationRootId

          )


        return (

          !isOwnRanking

          &&

          !rootExcluded

        )

      }

    )


  /*
   *
   * 5. Score and sort.
   *
   */


  const recommendations =

    eligibleRankings

      .map(

        ranking =>

          calculateTasteRecommendationScore(

            graph,

            ranking

          )

      )

      .filter(

        recommendation =>

          recommendation.score > 0

      )

      .sort(

        (

          a,

          b

        ) => {

          if (

            b.score !==

            a.score

          ) {

            return (

              b.score -

              a.score

            )

          }


          const aTime =

            new Date(

              a.ranking.createdAt ||

              0

            ).getTime()


          const bTime =

            new Date(

              b.ranking.createdAt ||

              0

            ).getTime()


          return (

            bTime -

            aTime

          )

        }

      )


  return recommendations

}