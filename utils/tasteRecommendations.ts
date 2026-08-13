import {
  Ranking
} from "@/types/ranking"


import {
  TasteGraph
} from "@/utils/tasteGraphTypes"


export type TasteRecommendation = {

  ranking: Ranking

  /*
   *
   * Score is retained internally for
   * candidate ordering and future work.
   *
   * It is deliberately NOT displayed
   * to the user.
   *
   */

  score: number

  /*
   *
   * One concise explanation only.
   *
   */

  reason: string

}


/*
 *
 * Internal recommendation scoring model.
 *
 * IMPORTANT:
 *
 * This score is currently used only to
 * order candidates.
 *
 * It is NOT presented as a calibrated
 * percentage to the user.
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
 * Recommendation limits.
 *
 */


const MAX_RECOMMENDATIONS = 3


/*
 *
 * Prevent rankings with excessive item
 * overlap from occupying multiple cards.
 *
 */


const ITEM_OVERLAP_THRESHOLD = 0.6


/*
 *
 * Keep internal scores within
 * a 0–100 range.
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
 * Normalise strings for matching.
 *
 */


function normaliseItem(

  value: string

) {

  return value

    .toLowerCase()

    .trim()

    .replace(

      /\s+/g,

      " "

    )

}


/*
 *
 * Normalise ranking titles for
 * duplicate detection.
 *
 */


function normaliseTitle(

  value: string

) {

  return normaliseItem(

    value

  )

    .replace(

      /[^a-z0-9\s]/g,

      ""

    )

}


/*
 *
 * Find all Taste Graph signals for
 * an item.
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
 * Find all Taste Graph signals for
 * a category.
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
 * Check whether an item has already
 * appeared in the user's Taste Graph.
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
 * Identify feedback signals.
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
 */


function calculateDirectTasteMatch(

  graph: TasteGraph,

  ranking: Ranking

) {

  type DirectMatch = {

    score: number

    strongestPosition:
      number | null

    strongestStrength:
      number

    signalCount:
      number

    matchingItem:
      string | null

  }


  const initial: DirectMatch = {

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

  }


  return ranking.items.reduce(

    (

      strongest,

      item

    ): DirectMatch => {

      const signals =

        getItemSignals(

          graph,

          item.name

        ).filter(

          signal =>

            !isFeedbackSignal(

              signal.type

            )

        )


      if (

        signals.length === 0

      ) {

        return strongest

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


      const evidenceValues =

        signals.map(

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

          ...evidenceValues

        )


      const averageEvidence =

        evidenceValues.reduce(

          (

            total,

            value

          ) =>

            total +

            value,

          0

        )

        /

        evidenceValues.length


      const confidenceMultiplier =

        Math.min(

          1,

          0.7 +

          (

            Math.min(

              signals.length,

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


      const itemScore =

        Math.min(

          1,

          evidenceScore *

          confidenceMultiplier

        )


      const strongestSignal =

        signals.reduce(

          (

            strongestSignalValue,

            signal

          ) =>

            signal.strength >

            strongestSignalValue.strength

              ? signal

              : strongestSignalValue,

          signals[0]

        )


      if (

        itemScore >

        strongest.score

      ) {

        return {

          score:
            itemScore,

          strongestPosition:
            strongestSignal.position,

          strongestStrength:
            strongestSignal.strength,

          signalCount:
            signals.length,

          matchingItem:
            item.name

        }

      }


      return strongest

    },

    initial

  )

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


  if (

    newItems === 0

  ) {

    return {

      score: 0,

      newItems,

      knownItems

    }

  }


  const noveltyRatio =

    newItems /

    ranking.items.length


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
 * Calculate internal recommendation score.
 *
 */


function calculateRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  const directMatch =

    calculateDirectTasteMatch(

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
   * Prevent category and novelty evidence
   * from masquerading as strong direct taste.
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


  /*
   *
   * Generate one reason.
   *
   */

  const reason =

    generateRecommendationReason(

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

    reason

  }

}


/*
 *
 * Generate ONE concise reason.
 *
 * The reason should explain actual evidence
 * rather than repeating generic recommendation
 * language.
 *
 */


function generateRecommendationReason(

  graph: TasteGraph,

  ranking: Ranking,

  directMatch: ReturnType<
    typeof calculateDirectTasteMatch
  >,

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

): string {

  /*
   *
   * Strongest direct item evidence.
   *
   */


  if (

    directMatch.matchingItem

    &&

    directMatch.strongestPosition === 1

  ) {

    return (

      `You ranked ${

        directMatch.matchingItem

      } #1`

    )

  }


  if (

    directMatch.matchingItem

    &&

    directMatch.strongestPosition !== null

    &&

    directMatch.strongestPosition <= 3

  ) {

    return (

      `You ranked ${

        directMatch.matchingItem

      } highly`

    )

  }


  /*
   *
   * Meaningful feedback evidence.
   *
   */


  if (

    feedback.score >= 0.65

  ) {

    return (

      "Your previous choices point in this direction"

    )

  }


  /*
   *
   * Strong category evidence.
   *
   */


  if (

    categoryAffinity.score >= 0.65

    &&

    categoryAffinity.uniqueRankings >= 2

  ) {

    return (

      `You've shown a strong interest in ${

        ranking.category

      }`

    )

  }


  /*
   *
   * Stronger neighbour evidence.
   *
   */


  if (

    neighbourBonus.active

    &&

    neighbourBonus.score >= 0.7

  ) {

    return (

      `Close to choices you've ranked highly`

    )

  }


  /*
   *
   * Moderate direct evidence.
   *
   */


  if (

    directMatch.matchingItem

  ) {

    return (

      `Includes ${

        directMatch.matchingItem

      }, which matches your taste`

    )

  }


  /*
   *
   * Novelty should only be described as
   * discovery when there is no stronger
   * evidence.
   *
   */

  if (

    novelty.newItems > 0

    &&

    ranking.category

  ) {

    return (

      `A new ${

        ranking.category

      } ranking to explore`

    )

  }


  /*
   *
   * Final fallback.
   *
   *
   * This is intentionally specific to the
   * ranking rather than pretending there is
   * strong taste evidence.
   *
   */

  return (

    `A new ranking to compare with your taste`

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
 * Determine the overlap between two rankings.
 *
 * This prevents several closely related rankings
 * from occupying the recommendation slots.
 *
 */


function calculateItemOverlap(

  first: Ranking,

  second: Ranking

) {

  const firstItems =

    new Set(

      first.items.map(

        item =>

          normaliseItem(

            item.name

          )

      )

    )


  const secondItems =

    new Set(

      second.items.map(

        item =>

          normaliseItem(

            item.name

          )

      )

    )


  if (

    firstItems.size === 0

    ||

    secondItems.size === 0

  ) {

    return 0

  }


  let sharedItems = 0


  firstItems.forEach(

    item => {

      if (

        secondItems.has(

          item

        )

      ) {

        sharedItems += 1

      }

    }

  )


  const smallerSetSize =

    Math.min(

      firstItems.size,

      secondItems.size

    )


  if (

    smallerSetSize === 0

  ) {

    return 0

  }


  return (

    sharedItems /

    smallerSetSize

  )

}


/*
 *
 * Determine whether a candidate is
 * too similar to an already selected
 * recommendation.
 *
 */


function isTooSimilarToSelected(

  candidate: Ranking,

  selected: Ranking[]

) {

  const candidateRoot =

    getConversationRootId(

      candidate

    )


  const candidateTitle =

    normaliseTitle(

      candidate.title

    )


  for (

    const existing of selected

  ) {

    /*
     *
     * Same ranking.
     *
     */

    if (

      existing.id ===

      candidate.id

    ) {

      return true

    }


    /*
     *
     * Same conversation.
     *
     */

    if (

      getConversationRootId(

        existing

      ) ===

      candidateRoot

    ) {

      return true

    }


    /*
     *
     * Same normalised title.
     *
     */

    if (

      normaliseTitle(

        existing.title

      ) ===

      candidateTitle

    ) {

      return true

    }


    /*
     *
     * Heavy item overlap.
     *
     */

    const overlap =

      calculateItemOverlap(

        existing,

        candidate

      )


    if (

      overlap >=

      ITEM_OVERLAP_THRESHOLD

    ) {

      return true

    }

  }


  return false

}


/*
 *
 * Select diverse recommendations.
 *
 *
 * This is deliberately separate from
 * scoring.
 *
 * Scoring decides which candidates are
 * interesting.
 *
 * This function decides which candidates
 * are sufficiently different to show.
 *
 */


function selectDiverseRecommendations(

  recommendations: TasteRecommendation[]

): TasteRecommendation[] {

  const selected:

    TasteRecommendation[] = []


  const usedIds =

    new Set<string>()


  const usedRoots =

    new Set<string>()


  const usedTitles =

    new Set<string>()


  for (

    const recommendation of

    recommendations

  ) {

    if (

      selected.length >=

      MAX_RECOMMENDATIONS

    ) {

      break

    }


    const ranking =

      recommendation.ranking


    const rootId =

      getConversationRootId(

        ranking

      )


    const title =

      normaliseTitle(

        ranking.title

      )


    if (

      usedIds.has(

        ranking.id

      )

    ) {

      continue

    }


    if (

      usedRoots.has(

        rootId

      )

    ) {

      continue

    }


    if (

      usedTitles.has(

        title

      )

    ) {

      continue

    }


    if (

      isTooSimilarToSelected(

        ranking,

        selected.map(

          item =>

            item.ranking

        )

      )

    ) {

      continue

    }


    selected.push(

      recommendation

    )


    usedIds.add(

      ranking.id

    )


    usedRoots.add(

      rootId

    )


    usedTitles.add(

      title

    )

  }


  return selected

}


/*
 *
 * Diagnostic helper.
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
   * 4. Remove rankings that the user
   * has already participated in.
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
   * 5. Score candidates.
   *
   *
   * The score remains internal.
   *
   */

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


  /*
   *
   * 6. Sort candidates.
   *
   *
   * Taste evidence still determines the
   * order internally.
   *
   * Created date breaks ties.
   *
   */

  const sortedRecommendations =

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


  /*
   *
   * 7. Apply diversity and duplication
   * protection.
   *
   *
   * This is the important new layer.
   *
   */

  return selectDiverseRecommendations(

    sortedRecommendations

  )

}