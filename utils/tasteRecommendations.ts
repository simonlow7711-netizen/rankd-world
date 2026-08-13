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
 * Recommendation scoring model.
 *
 * The percentage represents:
 *
 * "How strongly RANKD believes this ranking
 * matches the user's demonstrated taste."
 *
 * It is NOT a measure of how many scoring
 * bonuses the ranking has accumulated.
 *
 */


const SCORE_WEIGHTS = {

  directTaste:
    45,

  categoryAffinity:
    20,

  tasteNeighbour:
    15,

  feedback:
    10,

  novelty:
    5,

  behaviour:
    5

}


/*
 *
 * Keep recommendation scores within
 * a realistic 0–100 range.
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
 * Normalise item/category strings so
 * matching is case-insensitive and
 * whitespace-safe.
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
 * Find all Taste Graph signals for an item.
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
 * Find all Taste Graph signals for a category.
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
 * Check whether the user has already
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

  ).length > 0

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
 * Remove feedback-only signals from
 * direct taste calculations.
 *
 */


function isFeedbackSignal(

  type: string

) {

  return (

    type ===
      "feedback_clicked"

    ||

    type ===
      "feedback_ranked"

    ||

    type ===
      "feedback_skipped"

    ||

    type ===
      "feedback_disagreed"

  )

}


/*
 *
 * Direct taste evidence.
 *
 * This is the strongest recommendation signal.
 *
 * A #1 preference should contribute much more
 * than a #7 preference.
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

        !isFeedbackSignal(

          signal.type

        )

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


  const positionMultiplier = (

    position: number

  ) => {

    if (

      position <= 1

    ) {

      return 1

    }


    if (

      position >= 7

    ) {

      return 0.4

    }


    return (

      1 -

      (

        position - 1

      ) *

      0.1

    )

  }


  const evidence =

    tasteSignals.map(

      signal =>

        Math.max(

          0,

          Math.min(

            signal.strength,

            1

          )

        )

        *

        positionMultiplier(

          signal.position

        )

    )


  const strongestEvidence =

    Math.max(

      ...evidence

    )


  const averageEvidence =

    evidence.reduce(

      (

        total,

        value

      ) =>

        total +

        value,

      0

    )

    /

    evidence.length


  const confidenceMultiplier =

    Math.min(

      1,

      0.7 +

      (

        Math.min(

          tasteSignals.length,

          3

        )

        *

        0.1

      )

    )


  const evidenceScore =

    (

      strongestEvidence *

      0.7

    )

    +

    (

      averageEvidence *

      0.3

    )


  const score =

    Math.min(

      1,

      evidenceScore *

      confidenceMultiplier

    )


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
 * Category affinity.
 *
 * Category affinity is supporting evidence.
 *
 * It cannot produce a strong recommendation
 * on its own.
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

        !isFeedbackSignal(

          signal.type

        )

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      signalCount: 0,

      uniqueRankings: 0

    }

  }


  const uniqueRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const weightedStrength =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        Math.max(

          0,

          Math.min(

            signal.strength,

            1

          )

        ),

      0

    )


  const averageStrength =

    weightedStrength /

    categorySignals.length


  const rankingConfidence =

    Math.min(

      1,

      uniqueRankings.size /

      4

    )


  const score =

    (

      averageStrength *

      0.6

    )

    +

    (

      rankingConfidence *

      0.4

    )


  return {

    score:

      Math.min(

        score,

        1

      ),

    signalCount:

      categorySignals.length,

    uniqueRankings:

      uniqueRankings.size

  }

}


/*
 *
 * Taste neighbour discovery.
 *
 * Measures whether this ranking sits in
 * a category where the user's existing
 * preferences are relatively strong.
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

        !isFeedbackSignal(

          signal.type

        )

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      active: false,

      averagePosition: null,

      rankingCount: 0

    }

  }


  const categoryRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const positionTotal =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.position,

      0

    )


  const averagePosition =

    positionTotal /

    categorySignals.length


  const positionStrength =

    Math.max(

      0,

      Math.min(

        1,

        (

          7 -

          averagePosition

        )

        /

        6

      )

    )


  const rankingConfidence =

    Math.min(

      1,

      categoryRankings.size /

      4

    )


  const score =

    (

      positionStrength *

      0.65

    )

    +

    (

      rankingConfidence *

      0.35

    )


  return {

    score:

      Math.min(

        score,

        1

      ),

    active: true,

    averagePosition,

    rankingCount:

      categoryRankings.size

  }

}


/*
 *
 * Feedback adjustment.
 *
 * Feedback should modify existing evidence,
 * rather than create a recommendation from
 * nothing.
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

        isFeedbackSignal(

          signal.type

        )

    )


  if (

    feedbackSignals.length === 0

  ) {

    return {

      score: 0,

      positiveFeedback: 0,

      negativeFeedback: 0

    }

  }


  let positiveWeight = 0

  let negativeWeight = 0


  feedbackSignals.forEach(

    signal => {

      const strength =

        Math.max(

          0,

          Math.min(

            signal.strength,

            1

          )

        )


      if (

        signal.type ===
          "feedback_clicked"

      ) {

        positiveWeight +=

          strength *

          0.35

      }


      if (

        signal.type ===
          "feedback_ranked"

      ) {

        positiveWeight +=

          strength *

          1

      }


      if (

        signal.type ===
          "feedback_skipped"

      ) {

        negativeWeight +=

          strength *

          0.5

      }


      if (

        signal.type ===
          "feedback_disagreed"

      ) {

        negativeWeight +=

          strength *

          1

      }

    }

  )


  const totalWeight =

    positiveWeight +

    negativeWeight


  if (

    totalWeight === 0

  ) {

    return {

      score: 0,

      positiveFeedback: 0,

      negativeFeedback: 0

    }

  }


  const score =

    (

      positiveWeight -

      negativeWeight

    )

    /

    totalWeight


  return {

    score:

      Math.max(

        -1,

        Math.min(

          score,

          1

        )

      ),

    positiveFeedback:

      positiveWeight,

    negativeFeedback:

      negativeWeight

  }

}


/*
 *
 * Novelty.
 *
 * Novelty is useful for discovery but should
 * not masquerade as taste alignment.
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

      knownItems: 0

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

    noveltyRatio === 0

  ) {

    return {

      score: 0,

      newItems,

      knownItems

    }

  }


  return {

    score:

      Math.min(

        noveltyRatio,

        1

      ),

    newItems,

    knownItems

  }

}


/*
 *
 * Behaviour fit.
 *
 * This is deliberately small.
 *
 */


function calculateBehaviourFit(

  graph: TasteGraph

) {

  const averagePosition =

    graph.behaviour.averagePosition


  if (

    !averagePosition

    ||

    averagePosition <= 0

  ) {

    return 0

  }


  if (

    averagePosition <= 3

  ) {

    return 1

  }


  if (

    averagePosition <= 4

  ) {

    return 0.6

  }


  if (

    averagePosition <= 5

  ) {

    return 0.3

  }


  return 0

}


/*
 *
 * Direct match summary.
 *
 * Explicitly typed so TypeScript understands
 * that strongestPosition may be either a
 * number or null.
 *
 */


type DirectMatchSummary = {

  score: number

  strongestPosition: number | null

  strongestStrength: number

  signalCount: number

  matchingItem: string | null

}


/*
 *
 * Find the strongest direct item match
 * within a ranking.
 *
 */


function getStrongestDirectMatch(

  graph: TasteGraph,

  ranking: Ranking

): DirectMatchSummary {

  return ranking.items.reduce(

    (

      strongest: DirectMatchSummary,

      item

    ): DirectMatchSummary => {

      const directMatch =

        calculateDirectTasteMatch(

          graph,

          item.name

        )


      if (

        directMatch.score >

        strongest.score

      ) {

        return {

          score:
            directMatch.score,

          strongestPosition:
            directMatch.strongestPosition,

          strongestStrength:
            directMatch.strongestStrength,

          signalCount:
            directMatch.signalCount,

          matchingItem:
            item.name

        }

      }


      return strongest

    },

    {

      score:
        0,

      strongestPosition:
        null,

      strongestStrength:
        0,

      signalCount:
        0,

      matchingItem:
        null

    } satisfies DirectMatchSummary

  )

}


/*
 *
 * Generate reasons from the strongest
 * evidence rather than dumping every
 * scoring component into the card.
 *
 */


function generateRecommendationReasons(

  graph: TasteGraph,

  ranking: Ranking,

  directMatch: DirectMatchSummary,

  categoryAffinity: ReturnType<
    typeof calculateCategoryAffinity
  >,

  neighbourBonus: ReturnType<
    typeof calculateTasteNeighbourBonus
  >,

  feedback: ReturnType<
    typeof calculateFeedbackAdjustment
  >,

  novelty: ReturnType<
    typeof calculateNovelty
  >

): string[] {

  const reasons: string[] = []


  /*
   *
   * 1. Strong direct item match.
   *
   */


  if (

    directMatch.matchingItem

    &&

    directMatch.score >= 0.75

    &&

    directMatch.strongestPosition === 1

  ) {

    reasons.push(

      `You ranked ${directMatch.matchingItem} #1`

    )

  }

  else if (

    directMatch.matchingItem

    &&

    directMatch.score >= 0.6

    &&

    directMatch.strongestPosition !== null

    &&

    directMatch.strongestPosition <= 3

  ) {

    reasons.push(

      `You ranked ${directMatch.matchingItem} highly`

    )

  }

  else if (

    directMatch.matchingItem

    &&

    directMatch.score > 0.25

  ) {

    reasons.push(

      `Includes ${directMatch.matchingItem}, which matches your taste`

    )

  }


  /*
   *
   * 2. Feedback.
   *
   */


  if (

    feedback.score >= 0.5

    &&

    reasons.length < 3

  ) {

    reasons.push(

      "Your previous choices point in this direction"

    )

  }


  /*
   *
   * 3. Category.
   *
   */


  if (

    categoryAffinity.score >= 0.65

    &&

    categoryAffinity.uniqueRankings >= 2

    &&

    reasons.length < 3

  ) {

    reasons.push(

      `Strong match with your ${ranking.category} taste`

    )

  }


  /*
   *
   * 4. Taste neighbour.
   *
   */


  if (

    neighbourBonus.active

    &&

    neighbourBonus.score >= 0.7

    &&

    reasons.length < 3

  ) {

    reasons.push(

      "Close to choices you've ranked highly"

    )

  }


  /*
   *
   * 5. Discovery.
   *
   */


  if (

    novelty.newItems > 0

    &&

    reasons.length < 3

  ) {

    reasons.push(

      "Offers a new direction to explore"

    )

  }


  /*
   *
   * Avoid generic repetition where stronger
   * evidence is available.
   *
   */


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
 * Calculate recommendation score.
 *
 */


function calculateRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  const directMatch =

    getStrongestDirectMatch(

      graph,

      ranking

    )


  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  const neighbourBonus =

    calculateTasteNeighbourBonus(

      graph,

      ranking

    )


  const feedbackValues =

    ranking.items.map(

      item =>

        calculateFeedbackAdjustment(

          graph,

          item.name

        )

    )


  const feedback =

    feedbackValues.reduce(

      (

        strongest,

        current

      ) =>

        Math.abs(

          current.score

        )

        >

        Math.abs(

          strongest.score

        )

          ? current
          : strongest,

      {

        score: 0,

        positiveFeedback: 0,

        negativeFeedback: 0

      }

    )


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  const behaviourFit =

    calculateBehaviourFit(

      graph

    )


  let weightedScore =

    (

      directMatch.score *

      SCORE_WEIGHTS.directTaste

    )

    +

    (

      categoryAffinity.score *

      SCORE_WEIGHTS.categoryAffinity

    )

    +

    (

      neighbourBonus.score *

      SCORE_WEIGHTS.tasteNeighbour

    )

    +

    (

      Math.max(

        0,

        feedback.score

      )

      *

      SCORE_WEIGHTS.feedback

    )

    +

    (

      novelty.score *

      SCORE_WEIGHTS.novelty

    )

    +

    (

      behaviourFit *

      SCORE_WEIGHTS.behaviour

    )


  if (

    feedback.score < 0

  ) {

    weightedScore +=

      feedback.score *

      SCORE_WEIGHTS.feedback

  }


  /*
   *
   * Category and novelty evidence alone
   * must not masquerade as strong taste
   * alignment.
   *
   */


  if (

    directMatch.score < 0.2

  ) {

    weightedScore =

      Math.min(

        weightedScore,

        52

      )

  }

  else if (

    directMatch.score < 0.4

  ) {

    weightedScore =

      Math.min(

        weightedScore,

        68

      )

  }


  const reasons =

    generateRecommendationReasons(

      graph,

      ranking,

      directMatch,

      categoryAffinity,

      neighbourBonus,

      feedback,

      novelty

    )


  return {

    ranking,

    score:

      normalise(

        weightedScore

      ),

    reasons

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
 * This deliberately exposes the exclusion
 * decision so we can verify whether a remix
 * is being removed BEFORE scoring.
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

  const userParticipatedRoots =

    getUserParticipatedConversationRoots(

      rankings,

      currentUserId

    )


  const graphExcludedRoots =

    getExcludedConversationRootsFromGraph(

      graph,

      rankings

    )


  const excludedConversationRoots =

    new Set<string>([

      ...userParticipatedRoots,

      ...graphExcludedRoots

    ])


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


  const scoredRecommendations =

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


  const recommendations =

    scoredRecommendations.sort(

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