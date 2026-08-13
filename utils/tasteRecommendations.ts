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


type RecommendationCandidate = {

  ranking: Ranking

  rawScore: number

  reasons: string[]

  conversationRootId: string

}


/*
 *
 * Normalise an individual value.
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
 * Normalise text for comparisons.
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
 * Determine whether the user has already
 * ranked an item.
 *
 */


function hasAlreadyRankedItem(

  graph: TasteGraph,

  itemName: string

) {

  return getItemSignals(

    graph,

    itemName

  ).some(

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

}


/*
 *
 * Return the conversation root
 * for a ranking.
 *
 */


function getConversationRootId(

  ranking: Ranking

): string {

  return (

    ranking.rootId ??

    ranking.id

  )

}


/*
 *
 * Find conversations the user has
 * participated in directly.
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


  rankings.forEach(

    ranking => {

      if (

        ranking.creatorId !==
        currentUserId

      ) {

        return

      }


      excludedRoots.add(

        getConversationRootId(

          ranking

        )

      )

    }

  )


  return excludedRoots

}


/*
 *
 * Find conversations represented
 * in the Taste Graph.
 *
 */


function getExcludedConversationRootsFromGraph(

  graph: TasteGraph,

  rankings: Ranking[]

): Set<string> {

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


      excludedRoots.add(

        getConversationRootId(

          sourceRanking

        )

      )

    }

  )


  return excludedRoots

}


/*
 *
 * Direct taste match.
 *
 * This looks for actual previous taste
 * signals against items contained in the
 * candidate ranking.
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

      strongestPosition: null,

      strongestStrength: 0,

      signalCount: 0

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

    55


  if (

    strongestSignal.position === 1

  ) {

    score += 30

  }

  else if (

    strongestSignal.position === 2

  ) {

    score += 22

  }

  else if (

    strongestSignal.position === 3

  ) {

    score += 15

  }

  else if (

    strongestSignal.position <= 5

  ) {

    score += 8

  }


  return {

    score,

    strongestPosition:

      strongestSignal.position,

    strongestStrength:

      strongestSignal.strength,

    signalCount:

      tasteSignals.length

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

          8

        positiveFeedback += 1

      }


      if (

        signal.type ===
          "feedback_ranked"

      ) {

        adjustment +=

          signal.strength *

          28

        positiveFeedback += 1

      }


      if (

        signal.type ===
          "feedback_skipped"

      ) {

        adjustment -=

          signal.strength *

          18

        negativeFeedback += 1

      }


      if (

        signal.type ===
          "feedback_disagreed"

      ) {

        adjustment -=

          signal.strength *

          35

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
 * Calculate category affinity.
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

    ).filter(

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

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      signalCount: 0,

      rankingCount: 0,

      averageStrength: 0,

      averagePosition: 0

    }

  }


  const rankingIds =

    new Set(

      categorySignals

        .map(

          signal =>

            signal.source

        )

        .filter(

          Boolean

        )

    )


  const totalStrength =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.strength,

      0

    )


  const totalPosition =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.position,

      0

    )


  const averageStrength =

    totalStrength /

    categorySignals.length


  const averagePosition =

    totalPosition /

    categorySignals.length


  let score =

    Math.min(

      rankingIds.size * 5,

      15

    )


  score +=

    Math.min(

      averageStrength * 18,

      18

    )


  if (

    averagePosition <= 2.5

  ) {

    score += 12

  }

  else if (

    averagePosition <= 4

  ) {

    score += 7

  }

  else if (

    averagePosition <= 5

  ) {

    score += 3

  }


  return {

    score,

    signalCount:

      categorySignals.length,

    rankingCount:

      rankingIds.size,

    averageStrength,

    averagePosition

  }

}


/*
 *
 * Calculate novelty.
 *
 * Novelty is deliberately kept as a secondary
 * factor. RANKD should recommend things because
 * they fit the user's taste, not simply because
 * they are unfamiliar.
 *
 */


function calculateNovelty(

  graph: TasteGraph,

  ranking: Ranking

) {

  if (

    ranking.items.length === 0

  ) {

    return {

      score: 0,

      newItems: 0,

      knownItems: 0,

      noveltyRatio: 0

    }

  }


  const knownItems =

    ranking.items.filter(

      item =>

        hasAlreadyRankedItem(

          graph,

          item.name

        )

    ).length


  const newItems =

    ranking.items.length -

    knownItems


  const noveltyRatio =

    newItems /

    ranking.items.length


  if (

    knownItems ===

    ranking.items.length

  ) {

    return {

      score: -12,

      newItems,

      knownItems,

      noveltyRatio

    }

  }


  let score =

    noveltyRatio * 14


  if (

    noveltyRatio >= 0.75

  ) {

    score += 4

  }


  return {

    score,

    newItems,

    knownItems,

    noveltyRatio

  }

}


/*
 *
 * Taste neighbour discovery.
 *
 * This rewards rankings that sit inside
 * an established area of taste without
 * overpowering direct item matches.
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

    ).filter(

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

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      active: false

    }

  }


  const categoryRankings =

    new Set(

      categorySignals

        .map(

          signal =>

            signal.source

        )

        .filter(

          Boolean

        )

    )


  const averagePosition =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.position,

      0

    )

    /

    categorySignals.length


  let score =

    Math.min(

      categoryRankings.size * 4,

      12

    )


  if (

    averagePosition <= 3

  ) {

    score += 9

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
 * Build recommendation reasons.
 *
 * Reasons are generated specifically from
 * the signals that contributed to this ranking.
 *
 */


function buildRecommendationReasons(

  graph: TasteGraph,

  ranking: Ranking

): string[] {

  const reasons: string[] = []


  const directMatches =

    ranking.items

      .map(

        item => ({

          item,

          match:

            calculateDirectTasteMatch(

              graph,

              item.name

            )

        })

      )

      .filter(

        result =>

          result.match.score > 0

      )

      .sort(

        (

          a,

          b

        ) =>

          b.match.score -

          a.match.score

      )


  const strongestMatch =

    directMatches[0]


  if (

    strongestMatch

  ) {

    const itemName =

      strongestMatch.item.name


    if (

      strongestMatch.match.strongestPosition === 1

    ) {

      reasons.push(

        `You ranked ${itemName} #1`

      )

    }

    else if (

      strongestMatch.match.strongestPosition !== null

      &&

      strongestMatch.match.strongestPosition <= 3

    ) {

      reasons.push(

        `You ranked ${itemName} in your Top 3`

      )

    }

    else {

      reasons.push(

        `You have already ranked ${itemName}`

      )

    }

  }


  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  if (

    categoryAffinity.rankingCount >= 2

    &&

    categoryAffinity.averagePosition <= 3.5

  ) {

    reasons.push(

      `You consistently rank ${ranking.category} highly`

    )

  }

  else if (

    categoryAffinity.rankingCount >= 2

  ) {

    reasons.push(

      `You have a strong history in ${ranking.category}`

    )

  }

  else if (

    categoryAffinity.signalCount > 0

  ) {

    reasons.push(

      `You have shown interest in ${ranking.category}`

    )

  }


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  if (

    novelty.newItems >= 5

    &&

    novelty.knownItems > 0

  ) {

    reasons.push(

      `${novelty.newItems} of 7 choices are new to you`

    )

  }

  else if (

    novelty.newItems >= 5

  ) {

    reasons.push(

      `Most of these choices are new to you`

    )

  }

  else if (

    novelty.newItems >= 3

    &&

    novelty.knownItems > 0

  ) {

    reasons.push(

      `${novelty.newItems} choices are new to you`

    )

  }


  const feedbackResults =

    ranking.items.map(

      item =>

        calculateFeedbackAdjustment(

          graph,

          item.name

        )

    )


  const positiveFeedback =

    feedbackResults.reduce(

      (

        total,

        feedback

      ) =>

        total +

        feedback.positiveFeedback,

      0

    )


  const negativeFeedback =

    feedbackResults.reduce(

      (

        total,

        feedback

      ) =>

        total +

        feedback.negativeFeedback,

      0

    )


  if (

    positiveFeedback > 0

    &&

    positiveFeedback >

    negativeFeedback

  ) {

    reasons.push(

      "Your previous recommendation choices point this way"

    )

  }


  if (

    reasons.length === 0

  ) {

    reasons.push(

      `A new direction within ${ranking.category}`

    )

  }


  return [

    ...new Set(

      reasons

    )

  ].slice(

    0,

    3

  )

}


/*
 *
 * Calculate the raw recommendation score.
 *
 * This score is intentionally NOT normalised.
 *
 */


function calculateRawRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

) {

  let score = 0


  /*
   *
   * 1. Direct item taste.
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

        /*
         *
         * Weight the strongest matches heavily,
         * while allowing several weaker matches
         * to contribute.
         *
         */

        score +=

          directMatch.score


        if (

          directMatch.strongestPosition === 1

        ) {

          score += 8

        }

      }


      const feedback =

        calculateFeedbackAdjustment(

          graph,

          item.name

        )


      score +=

        feedback.adjustment

    }

  )


  /*
   *
   * 2. Category affinity.
   *
   */


  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  score +=

    categoryAffinity.score


  /*
   *
   * 3. Taste neighbour.
   *
   */


  const neighbourBonus =

    calculateTasteNeighbourBonus(

      graph,

      ranking

    )


  score +=

    neighbourBonus.score


  /*
   *
   * 4. Novelty.
   *
   */


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  score +=

    novelty.score


  /*
   *
   * 5. Decisiveness.
   *
   */


  if (

    graph.behaviour.averagePosition > 0

    &&

    graph.behaviour.averagePosition <= 3

  ) {

    score += 4

  }


  /*
   *
   * 6. New category discovery.
   *
   */


  if (

    categoryAffinity.signalCount === 0

  ) {

    score += 5

  }


  return score

}


/*
 *
 * Calculate recommendation score.
 *
 * This remains the public single-ranking
 * scoring function.
 *
 */


function calculateRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  const rawScore =

    calculateRawRecommendationScore(

      graph,

      ranking

    )


  const reasons =

    buildRecommendationReasons(

      graph,

      ranking

    )


  return {

    ranking,

    score:

      normalise(

        rawScore

      ),

    reasons

  }

}


/*
 *
 * Create a useful relative score across
 * the recommendation pool.
 *
 * We do not want every candidate independently
 * normalised to the same percentage.
 *
 */


function calculateRelativeScore(

  rawScore: number,

  strongestScore: number,

  weakestScore: number

) {

  if (

    strongestScore <= 0

  ) {

    return 0

  }


  if (

    strongestScore ===
    weakestScore

  ) {

    return normalise(

      rawScore

    )

  }


  const relativePosition =

    (

      rawScore -

      weakestScore

    )

    /

    (

      strongestScore -

      weakestScore

    )


  /*
   *
   * Establish a meaningful floor and ceiling.
   *
   * The strongest candidate approaches 90–95,
   * while weaker candidates remain visibly
   * differentiated rather than collapsing.
   *
   */

  const score =

    45 +

    (

      relativePosition *

      48

    )


  return normalise(

    score

  )

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
 * This deliberately exposes the exclusion
 * decision so we can verify whether a remix
 * or conversation is being removed before
 * scoring.
 *
 */


export function debugTasteRecommendationEligibility(

  rankings: Ranking[],

  currentUserId?: string

) {

  const userRoots =

    getUserParticipatedConversationRoots(

      rankings,

      currentUserId

    )


  const results =

    rankings.map(

      ranking => {

        const resolvedRootId =

          getConversationRootId(

            ranking

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
   */


  const eligibleRankings =

    rankings.filter(

      ranking => {

        const conversationRootId =

          getConversationRootId(

            ranking

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
   * 5. Hard deduplicate by conversation.
   *
   *
   * This is important.
   *
   * Even if multiple rankings somehow bypass
   * the exclusion stage, only one ranking from
   * each conversation is allowed into the
   * recommendation pool.
   *
   */


  const uniqueConversationRankings =

    new Map<

      string,

      Ranking

    >()


  eligibleRankings.forEach(

    ranking => {

      const rootId =

        getConversationRootId(

          ranking

        )


      const existing =

        uniqueConversationRankings.get(

          rootId

        )


      if (

        !existing

      ) {

        uniqueConversationRankings.set(

          rootId,

          ranking

        )

        return

      }


      const existingTime =

        new Date(

          existing.createdAt ||

          0

        ).getTime()


      const rankingTime =

        new Date(

          ranking.createdAt ||

          0

        ).getTime()


      /*
       *
       * Prefer the newer representation of a
       * conversation when duplicate roots exist.
       *
       */


      if (

        rankingTime >

        existingTime

      ) {

        uniqueConversationRankings.set(

          rootId,

          ranking

        )

      }

    }

  )


  /*
   *
   * 6. Remove exact duplicate ranking identities.
   *
   */


  const uniqueRankings =

    [

      ...

      uniqueConversationRankings.values()

    ]


  /*
   *
   * 7. Score candidates using RAW scores.
   *
   */


  const candidates =

    uniqueRankings

      .map(

        ranking => {

          const rawScore =

            calculateRawRecommendationScore(

              graph,

              ranking

            )


          return {

            ranking,

            rawScore,

            reasons:

              buildRecommendationReasons(

                graph,

                ranking

              ),

            conversationRootId:

              getConversationRootId(

                ranking

              )

          }

        }

      )

      .filter(

        candidate =>

          candidate.rawScore > 0

      )


  if (

    candidates.length === 0

  ) {

    return []

  }


  /*
   *
   * 8. Establish the score range across
   * the actual recommendation pool.
   *
   */


  const rawScores =

    candidates.map(

      candidate =>

        candidate.rawScore

    )


  const strongestScore =

    Math.max(

      ...rawScores

    )


  const weakestScore =

    Math.min(

      ...rawScores

    )


  /*
   *
   * 9. Convert raw scores into relative
   * Taste Alignment scores.
   *
   */


  const recommendations =

    candidates

      .map(

        candidate => {

          const score =

            calculateRelativeScore(

              candidate.rawScore,

              strongestScore,

              weakestScore

            )


          return {

            ranking:
              candidate.ranking,

            score,

            reasons:
              candidate.reasons,

            rawScore:
              candidate.rawScore,

            conversationRootId:
              candidate.conversationRootId

          }

        }

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


  /*
   *
   * 10. Return the strongest recommendations.
   *
   * The caller can still decide how many cards
   * to display.
   *
   */


  return recommendations.map(

    recommendation => ({

      ranking:

        recommendation.ranking,

      score:

        recommendation.score,

      reasons:

        recommendation.reasons

    })

  )

}