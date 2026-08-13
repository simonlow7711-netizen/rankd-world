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
 * The score represents the strength of the
 * available evidence that this specific
 * ranking is relevant to the user's taste.
 *
 *
 * IMPORTANT:
 *
 * We deliberately do NOT add generic user
 * behaviour into every recommendation.
 *
 * Behaviour belongs to the user's Taste Graph,
 * but it does not make one candidate more
 * relevant than another candidate.
 *
 */


const SCORE_WEIGHTS = {

  directTaste:
    60,

  categoryAffinity:
    15,

  tasteNeighbour:
    10,

  feedback:
    10,

  novelty:
    5

}


/*
 *
 * Minimum evidence required for a ranking
 * to appear as a taste recommendation.
 *
 *
 * This prevents arbitrary category matches
 * from becoming recommendations.
 *
 */


const MINIMUM_RECOMMENDATION_SCORE = 12


/*
 *
 * Maximum score when there is no direct
 * item-level evidence.
 *
 *
 * A category match can be interesting,
 * but should never pretend to be as strong
 * as a demonstrated item-level taste match.
 *
 */


const NO_DIRECT_EVIDENCE_CAP = 42


/*
 *
 * Maximum score when there is only weak
 * direct evidence.
 *
 */


const WEAK_DIRECT_EVIDENCE_CAP = 68


/*
 *
 * Keep scores within a 0–100 range.
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
 * Normalise item/category strings.
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
 * Create a stable text fingerprint.
 *
 */


function createFingerprint(

  value: string

) {

  return normaliseItem(

    value

  )

    .replace(

      /[^a-z0-9]+/g,

      "-"

    )

    .replace(

      /^-+|-+$/g,

      ""

    )

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
 * Feedback signal types are not considered
 * direct taste evidence.
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

  ).some(

    signal =>

      !isFeedbackSignal(

        signal.type

      )

  )

}


/*
 *
 * Return the conversation root.
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
 *
 * A recommendation should not take the user
 * back into a conversation they have already
 * contributed to through Taste Graph signals.
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
 * Direct taste evidence.
 *
 *
 * This is the most important part of the
 * recommendation model.
 *
 *
 * We calculate evidence for every matching
 * item in the candidate ranking.
 *
 *
 * #1 is substantially stronger than #7.
 *
 */


function calculateDirectTasteMatch(

  graph: TasteGraph,

  ranking: Ranking

) {

  const positionMultiplier = (

    position: number

  ) => {

    if (

      position <= 1

    ) {

      return 1

    }


    if (

      position === 2

    ) {

      return 0.92

    }


    if (

      position === 3

    ) {

      return 0.84

    }


    if (

      position === 4

    ) {

      return 0.72

    }


    if (

      position === 5

    ) {

      return 0.60

    }


    if (

      position === 6

    ) {

      return 0.48

    }


    return 0.36

  }


  const matches =

    ranking.items

      .flatMap(

        item =>

          getItemSignals(

            graph,

            item.name

          )

            .filter(

              signal =>

                !isFeedbackSignal(

                  signal.type

                )

            )

            .map(

              signal => ({

                itemName:
                  item.name,

                position:
                  signal.position,

                strength:
                  Math.max(

                    0,

                    Math.min(

                      signal.strength,

                      1

                    )

                  ),

                evidence:

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

              })

            )

      )


  if (

    matches.length === 0

  ) {

    return {

      score: 0,

      strongestPosition: null,

      strongestStrength: 0,

      strongestItem: null,

      matchingItems: 0,

      evidence: []

    }

  }


  /*
   *
   * Sort strongest evidence first.
   *
   */


  const sortedMatches =

    [

      ...matches

    ].sort(

      (

        a,

        b

      ) =>

        b.evidence -

        a.evidence

    )


  /*
   *
   * The strongest item carries most of
   * the recommendation.
   *
   *
   * A second matching item provides useful
   * corroboration.
   *
   */


  const strongestEvidence =

    sortedMatches[0].evidence


  const secondEvidence =

    sortedMatches[1]?.evidence ??

    0


  const thirdEvidence =

    sortedMatches[2]?.evidence ??

    0


  const combinedEvidence =

    (

      strongestEvidence *

      0.72

    )

    +

    (

      secondEvidence *

      0.18

    )

    +

    (

      thirdEvidence *

      0.10

    )


  /*
   *
   * Multiple matching items increase
   * confidence, but never linearly.
   *
   */


  const confidenceMultiplier =

    Math.min(

      1,

      0.78 +

      (

        Math.min(

          matches.length,

          3

        )

        *

        0.08

      )

    )


  const score =

    Math.min(

      1,

      combinedEvidence *

      confidenceMultiplier

    )


  return {

    score,

    strongestPosition:

      sortedMatches[0].position,

    strongestStrength:

      sortedMatches[0].strength,

    strongestItem:

      sortedMatches[0].itemName,

    matchingItems:

      matches.length,

    evidence:

      sortedMatches

  }

}


/*
 *
 * Category affinity.
 *
 *
 * Category evidence is supporting evidence.
 *
 * It becomes stronger when:
 *
 * - the user has ranked multiple rankings
 *   in the category
 *
 * - those signals are relatively strong
 *
 * - the user's positions in the category
 *   are consistently high
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

      uniqueRankings: 0,

      averagePosition: null

    }

  }


  const uniqueRankings =

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


  const averageStrength =

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

    /

    categorySignals.length


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

      uniqueRankings.size /

      4

    )


  const score =

    (

      averageStrength *

      0.40

    )

    +

    (

      positionStrength *

      0.40

    )

    +

    (

      rankingConfidence *

      0.20

    )


  return {

    score:

      Math.max(

        0,

        Math.min(

          score,

          1

        )

      ),

    signalCount:

      categorySignals.length,

    uniqueRankings:

      uniqueRankings.size,

    averagePosition

  }

}


/*
 *
 * Taste neighbour evidence.
 *
 *
 * This is deliberately different from simply
 * knowing that the category exists.
 *
 *
 * It asks:
 *
 * "Does the user's existing behaviour in this
 * category look like a strong preference?"
 *
 */


function calculateTasteNeighbourBonus(

  graph: TasteGraph,

  ranking: Ranking

) {

  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  if (

    categoryAffinity.signalCount === 0

  ) {

    return {

      score: 0,

      active: false

    }

  }


  if (

    categoryAffinity.uniqueRankings < 2

  ) {

    return {

      score:

        categoryAffinity.score *

        0.35,

      active: false

    }

  }


  const score =

    Math.min(

      1,

      categoryAffinity.score *

      0.85

    )


  return {

    score,

    active: true

  }

}


/*
 *
 * Feedback adjustment.
 *
 *
 * Feedback can strengthen or suppress
 * an existing recommendation.
 *
 */


function calculateFeedbackAdjustment(

  graph: TasteGraph,

  ranking: Ranking

) {

  const feedbackSignals =

    ranking.items.flatMap(

      item =>

        graph.signals.filter(

          signal =>

            normaliseItem(

              signal.item

            ) ===

            normaliseItem(

              item.name

            )

            &&

            isFeedbackSignal(

              signal.type

            )

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

          0.25

      }


      else if (

        signal.type ===
          "feedback_ranked"

      ) {

        positiveWeight +=

          strength *

          1

      }


      else if (

        signal.type ===
          "feedback_skipped"

      ) {

        negativeWeight +=

          strength *

          0.50

      }


      else if (

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
 *
 * Novelty is discovery support only.
 *
 * It must never be allowed to make an
 * irrelevant ranking look highly personalised.
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

      ratio: 0

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


  const ratio =

    newItems /

    ranking.items.length


  return {

    score:

      Math.max(

        0,

        Math.min(

          ratio,

          1

        )

      ),

    newItems,

    knownItems,

    ratio

  }

}


/*
 *
 * Generate reasons from actual evidence.
 *
 *
 * The order is intentional:
 *
 * 1. direct item evidence
 * 2. multiple matching items
 * 3. feedback
 * 4. category
 * 5. discovery
 *
 *
 * This means the explanation should describe
 * the actual reason this candidate is strong.
 *
 */


function generateRecommendationReasons(

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

): string[] {

  const reasons: string[] = []


  /*
   *
   * Strong direct match.
   *
   */


  if (

    directMatch.strongestItem

    &&

    directMatch.strongestPosition === 1

  ) {

    reasons.push(

      `You ranked ${directMatch.strongestItem} #1`

    )

  }


  else if (

    directMatch.strongestItem

    &&

    directMatch.strongestPosition !== null

    &&

    directMatch.strongestPosition <= 3

  ) {

    reasons.push(

      `You ranked ${directMatch.strongestItem} in your Top 3`

    )

  }


  else if (

    directMatch.strongestItem

    &&

    directMatch.score >= 0.25

  ) {

    reasons.push(

      `You have ranked ${directMatch.strongestItem} before`

    )

  }


  /*
   *
   * Multiple known items.
   *
   */


  if (

    directMatch.matchingItems >= 2

    &&

    reasons.length < 3

  ) {

    const matchingNames =

      directMatch.evidence

        .slice(

          0,

          2

        )

        .map(

          evidence =>

            evidence.itemName

        )


    if (

      matchingNames.length >= 2

    ) {

      reasons.push(

        `Connects with ${matchingNames[0]} and ${matchingNames[1]}`

      )

    }

  }


  /*
   *
   * Positive feedback.
   *
   */


  if (

    feedback.score >= 0.5

    &&

    reasons.length < 3

  ) {

    reasons.push(

      "Your previous recommendation choices point this way"

    )

  }


  /*
   *
   * Strong category evidence.
   *
   */


  if (

    categoryAffinity.score >= 0.60

    &&

    categoryAffinity.uniqueRankings >= 2

    &&

    reasons.length < 3

  ) {

    reasons.push(

      `Your ${ranking.category} choices tend to rank highly`

    )

  }


  /*
   *
   * Strong taste-neighbour evidence.
   *
   */


  if (

    neighbourBonus.active

    &&

    neighbourBonus.score >= 0.65

    &&

    reasons.length < 3

  ) {

    reasons.push(

      `Fits a pattern in your ${ranking.category} taste`

    )

  }


  /*
   *
   * Discovery.
   *
   */


  if (

    novelty.newItems > 0

    &&

    reasons.length < 3

  ) {

    if (

      directMatch.score > 0

    ) {

      reasons.push(

        "Introduces choices you haven't ranked yet"

      )

    }

    else {

      reasons.push(

        "Offers a new direction to explore"

      )

    }

  }


  /*
   *
   * If the candidate has no direct item
   * evidence, explicitly frame the reason
   * as category/discovery rather than
   * pretending it is a proven taste match.
   *
   */


  if (

    reasons.length === 0

    &&

    categoryAffinity.score > 0

  ) {

    reasons.push(

      `Based on your activity in ${ranking.category}`

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
 * Calculate recommendation score.
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


  const feedback =

    calculateFeedbackAdjustment(

      graph,

      ranking

    )


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  /*
   *
   * Direct taste is the dominant signal.
   *
   */


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

      feedback.score *

      SCORE_WEIGHTS.feedback

    )

    +

    (

      novelty.score *

      SCORE_WEIGHTS.novelty

    )


  /*
   *
   * Negative feedback should be allowed
   * to materially suppress a recommendation.
   *
   */


  if (

    feedback.score < 0

  ) {

    weightedScore =

      Math.max(

        0,

        weightedScore

      )

  }


  /*
   *
   * No direct evidence:
   *
   * category/discovery recommendations
   * should remain visibly weaker.
   *
   */


  if (

    directMatch.score === 0

  ) {

    weightedScore =

      Math.min(

        weightedScore,

        NO_DIRECT_EVIDENCE_CAP

      )

  }


  /*
   *
   * Weak direct evidence:
   *
   * prevent supporting evidence from
   * overwhelming the actual item match.
   *
   */


  else if (

    directMatch.score < 0.35

  ) {

    weightedScore =

      Math.min(

        weightedScore,

        WEAK_DIRECT_EVIDENCE_CAP

      )

  }


  /*
   *
   * If the candidate contains only known
   * items and has weak evidence, do not
   * manufacture a strong recommendation.
   *
   */


  if (

    novelty.newItems === 0

    &&

    directMatch.score < 0.30

  ) {

    weightedScore =

      Math.min(

        weightedScore,

        50

      )

  }


  /*
   *
   * Generate explanation after scoring.
   *
   */


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
 * Create a candidate fingerprint.
 *
 *
 * This prevents visually identical rankings
 * from appearing multiple times even when
 * they have different IDs.
 *
 */


function getRankingFingerprint(

  ranking: Ranking

) {

  const title =

    createFingerprint(

      ranking.title

    )


  const items =

    ranking.items

      .map(

        item =>

          createFingerprint(

            item.name

          )

      )

      .sort()

      .join(

        "|"

      )


  return (

    title +

    "::" +

    items

  )

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
 * Remove duplicate candidates.
 *
 *
 * There are three layers:
 *
 * 1. conversation root
 * 2. ranking fingerprint
 * 3. identical item set
 *
 *
 * Only the strongest recommendation survives.
 *
 */


function deduplicateRecommendations(

  recommendations: TasteRecommendation[]

) {

  const usedRoots =

    new Set<string>()


  const usedFingerprints =

    new Set<string>()


  const usedItemSets =

    new Set<string>()


  const result:

    TasteRecommendation[] = []


  recommendations.forEach(

    recommendation => {

      const ranking =

        recommendation.ranking


      const rootId =

        getConversationRootId(

          ranking

        )


      const fingerprint =

        getRankingFingerprint(

          ranking

        )


      const itemSet =

        ranking.items

          .map(

            item =>

              createFingerprint(

                item.name

              )

          )

          .sort()

          .join(

            "|"

          )


      /*
       *
       * A conversation should only contribute
       * one recommendation.
       *
       */


      if (

        usedRoots.has(

          rootId

        )

      ) {

        return

      }


      /*
       *
       * Identical-looking rankings should
       * not appear twice.
       *
       */


      if (

        usedFingerprints.has(

          fingerprint

        )

      ) {

        return

      }


      /*
       *
       * Identical item sets are effectively
       * the same discovery opportunity even
       * if their titles differ.
       *
       */


      if (

        usedItemSets.has(

          itemSet

        )

      ) {

        return

      }


      usedRoots.add(

        rootId

      )


      usedFingerprints.add(

        fingerprint

      )


      usedItemSets.add(

        itemSet

      )


      result.push(

        recommendation

      )

    }

  )


  return result

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
   * 5. Score candidates.
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

          recommendation.score >=

          MINIMUM_RECOMMENDATION_SCORE

      )


  /*
   *
   * 6. Sort by actual taste evidence.
   *
   */


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
   * 7. Remove repetition AFTER scoring.
   *
   *
   * This is important because the strongest
   * member of each conversation should win.
   *
   */


  return deduplicateRecommendations(

    scoredRecommendations

  )

}