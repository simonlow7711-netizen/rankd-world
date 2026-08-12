import {
  Ranking
} from "@/types/ranking"


import {
  TasteGraph
} from "@/utils/tasteGraph"


export type TasteRecommendation = {

  ranking: Ranking

  score: number

  reasons: string[]

}


function normalise(

  value: number

) {

  return Math.max(

    0,

    Math.min(

      Math.round(value),

      100

    )

  )

}


function normaliseItem(

  value: string

) {

  return value

    .toLowerCase()

    .trim()

}


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


function getCategorySignals(

  graph: TasteGraph,

  category: string

) {

  return graph.signals.filter(

    signal =>

      signal.category ===

      category

  )

}


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
 * Return the conversation root for a ranking.
 *
 * A root ranking points to itself.
 * A remix/perspective points back to the
 * original ranking through rootId.
 *
 */


function getConversationRootId(

  ranking: Ranking

) {

  return (

    ranking.rootId ??

    ranking.id

  )

}


/*
 *
 * Find every conversation the user has already
 * participated in through their Taste Graph.
 *
 * The Taste Graph signal.source contains the
 * ranking ID which generated the signal.
 *
 * Once we find that ranking, we resolve its
 * rootId and exclude the entire conversation.
 *
 */


function getExcludedConversationRoots(

  graph: TasteGraph,

  rankings: Ranking[]

) {

  const rankingMap =

    new Map<string, Ranking>()


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

      if (!signal.source) {

        return

      }


      const sourceRanking =

        rankingMap.get(

          signal.source

        )


      if (!sourceRanking) {

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
 * Find every RANKD the user has previously
 * ranked.
 *
 * This is based on the ranking ID stored in
 * signal.source rather than individual item
 * names.
 *
 * A new RANKD containing familiar items can
 * therefore still be recommended.
 *
 */


function getPreviouslyRankedRankingIds(

  graph: TasteGraph

) {

  const previouslyRankedRankingIds =

    new Set<string>()


  graph.signals.forEach(

    signal => {

      if (!signal.source) {

        return

      }


      if (

        signal.type ===

          "ranked"

        ||

        signal.type ===

          "preferred"

      ) {

        previouslyRankedRankingIds.add(

          signal.source

        )

      }

    }

  )


  return previouslyRankedRankingIds

}


/*
 *
 * Calculate direct item-level taste match.
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

    strongestSignal.strength * 50


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
 * 5.2.3
 *
 * Calculate recommendation novelty.
 *
 * Novelty is deliberately treated as a discovery
 * signal rather than a replacement for taste
 * relevance.
 *
 */


function calculateNovelty(

  graph: TasteGraph,

  ranking: Ranking

) {

  const rankingItems =

    ranking.items ?? []


  if (

    rankingItems.length === 0

  ) {

    return {

      score: 0,

      newItems: 0,

      knownItems: 0,

      noveltyRatio: 0,

      categoryIsNew: false

    }

  }


  const knownItems =

    rankingItems.filter(

      item =>

        hasAlreadyRankedItem(

          graph,

          item.name

        )

    )


  const knownItemCount =

    knownItems.length


  const newItemCount =

    rankingItems.length -

    knownItemCount


  const noveltyRatio =

    newItemCount /

    rankingItems.length


  const categorySignals =

    getCategorySignals(

      graph,

      ranking.category

    )


  const categoryIsNew =

    categorySignals.length === 0


  if (

    newItemCount === 0

  ) {

    return {

      score: -20,

      newItems:

        newItemCount,

      knownItems:

        knownItemCount,

      noveltyRatio,

      categoryIsNew

    }

  }


  let score =

    noveltyRatio * 12


  if (

    noveltyRatio >= 0.25

    &&

    noveltyRatio <= 0.75

  ) {

    score += 6

  }


  if (

    noveltyRatio > 0.75

  ) {

    score += 3

  }


  if (

    categoryIsNew

  ) {

    score += 4

  }


  return {

    score:

      Math.min(

        score,

        15

      ),

    newItems:

      newItemCount,

    knownItems:

      knownItemCount,

    noveltyRatio,

    categoryIsNew

  }

}


/*
 *
 * Calculate taste-neighbour discovery bonus.
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
 * Apply feedback adjustments.
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

          signal.strength * 10

        positiveFeedback += 1

      }


      if (

        signal.type ===

          "feedback_ranked"

      ) {

        adjustment +=

          signal.strength * 30

        positiveFeedback += 1

      }


      if (

        signal.type ===

          "feedback_skipped"

      ) {

        adjustment -=

          signal.strength * 15

        negativeFeedback += 1

      }


      if (

        signal.type ===

          "feedback_disagreed"

      ) {

        adjustment -=

          signal.strength * 30

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
 * Calculate the percentage of overlapping items
 * between two rankings.
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


  secondItems.forEach(

    item => {

      if (

        firstItems.has(

          item

        )

      ) {

        sharedItems += 1

      }

    }

  )


  return (

    sharedItems /

    Math.max(

      firstItems.size,

      secondItems.size

    )

  )

}


/*
 *
 * 5.2.4
 *
 * Select recommendations that are not overly
 * similar to recommendations already selected.
 *
 * Diversity is deliberately applied after the
 * Taste Graph score has been calculated.
 *
 * This means a strong taste match remains
 * important, while preventing the final set
 * from becoming three versions of the same idea.
 *
 */


function selectDiverseRecommendations(

  recommendations: TasteRecommendation[],

  limit: number

) {

  if (

    recommendations.length <= limit

  ) {

    return recommendations

  }


  const selected: TasteRecommendation[] = []

  const selectedCategories =

    new Set<string>()


  const selectedCreators =

    new Set<string>()


  /*
   *
   * Start with the highest scoring recommendation.
   *
   */


  const firstRecommendation =

    recommendations[0]


  if (

    firstRecommendation

  ) {

    selected.push(

      firstRecommendation

    )


    selectedCategories.add(

      firstRecommendation.ranking.category

    )


    if (

      firstRecommendation.ranking.creatorId

    ) {

      selectedCreators.add(

        firstRecommendation.ranking.creatorId

      )

    }

  }


  /*
   *
   * Continue selecting the highest-scoring
   * recommendation that provides useful
   * diversity.
   *
   */


  while (

    selected.length < limit

  ) {

    let bestCandidate:

      TasteRecommendation | null =

      null


    let bestCandidateScore =

      -Infinity


    /*
     *
     * Use for...of here so TypeScript correctly
     * tracks the bestCandidate assignment.
     *
     */


    for (

      const candidate of recommendations

    ) {

      if (

        selected.some(

          recommendation =>

            recommendation.ranking.id ===

            candidate.ranking.id

        )

      ) {

        continue

      }


      const category =

        candidate.ranking.category


      const creatorId =

        candidate.ranking.creatorId


      const categoryAlreadyUsed =

        selectedCategories.has(

          category

        )


      const creatorAlreadyUsed =

        creatorId

          ?

          selectedCreators.has(

              creatorId

            )

          :

          false


      const maximumItemOverlap =

        selected.reduce(

          (

            maximum,

            selectedRecommendation

          ) =>

            Math.max(

              maximum,

              calculateItemOverlap(

                candidate.ranking,

                selectedRecommendation.ranking

              )

            ),

          0

        )


      let diversityBonus = 0


      /*
       *
       * Prefer a new category.
       *
       */


      if (

        !categoryAlreadyUsed

      ) {

        diversityBonus += 12

      }


      /*
       *
       * Prefer a new creator.
       *
       */


      if (

        creatorId

        &&

        !creatorAlreadyUsed

      ) {

        diversityBonus += 6

      }


      /*
       *
       * Penalise heavy item overlap.
       *
       */


      if (

        maximumItemOverlap >= 0.75

      ) {

        diversityBonus -= 18

      }

      else if (

        maximumItemOverlap >= 0.5

      ) {

        diversityBonus -= 10

      }

      else if (

        maximumItemOverlap >= 0.25

      ) {

        diversityBonus -= 4

      }


      /*
       *
       * Keep the original recommendation score
       * dominant.
       *
       */


      const candidateScore =

        candidate.score +

        diversityBonus


      if (

        candidateScore >

        bestCandidateScore

      ) {

        bestCandidate =

          candidate

        bestCandidateScore =

          candidateScore

      }

    }


    /*
     *
     * Safety fallback.
     *
     * If no candidate was found, stop rather than
     * producing duplicate recommendations.
     *
     */


    if (

      bestCandidate === null

    ) {

      break

    }


    selected.push(

      bestCandidate

    )


    selectedCategories.add(

      bestCandidate.ranking.category

    )


    if (

      bestCandidate.ranking.creatorId

    ) {

      selectedCreators.add(

        bestCandidate.ranking.creatorId

      )

    }

  }


  /*
   *
   * Return the selected recommendations in their
   * final recommendation order.
   *
   */


  return selected

}


/*
 *
 * Calculate the complete recommendation score.
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
   * 3. TASTE-NEIGHBOUR DISCOVERY
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

    if (

      novelty.noveltyRatio >= 0.25

      &&

      novelty.noveltyRatio <= 0.75

    ) {

      reasons.push(

        "Balances familiar taste with new discoveries"

      )

    }

    else {

      reasons.push(

        "Introduces new choices for you to discover"

      )

    }

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
   * 6. NEW CATEGORY CURIOSITY
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


  /*
   *
   * FINAL SCORE
   *
   */


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


export function calculateTasteRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  return calculateRecommendationScore(

    graph,

    ranking

  )

}


export function getTasteRecommendedRankings(

  graph: TasteGraph,

  rankings: Ranking[],

  currentUserId: string

): TasteRecommendation[] {


  /*
   *
   * Exclude every conversation the user has
   * already participated in.
   *
   * This means that if the user remixes one
   * ranking, the original ranking and all
   * perspectives belonging to that same
   * root conversation are excluded.
   *
   */


  const excludedConversationRoots =

    getExcludedConversationRoots(

      graph,

      rankings

    )


  /*
   *
   * Exclude every RANKD the user has previously
   * ranked.
   *
   * This is deliberately based on the ranking ID
   * stored in signal.source rather than matching
   * individual item names.
   *
   * This means a new RANKD containing some of the
   * same items can still be discovered.
   *
   */


  const previouslyRankedRankingIds =

    getPreviouslyRankedRankingIds(

      graph

    )


  /*
   *
   * Build the eligible recommendation pool.
   *
   * 1. Exclude own content.
   * 2. Exclude conversations already participated in.
   * 3. Exclude RANKDs already ranked.
   *
   */


  const eligibleRankings =

    rankings.filter(

      ranking => {

        if (

          ranking.creatorId ===

          currentUserId

        ) {

          return false

        }


        const conversationRootId =

          getConversationRootId(

            ranking

          )


        if (

          excludedConversationRoots.has(

            conversationRootId

          )

        ) {

          return false

        }


        if (

          previouslyRankedRankingIds.has(

            ranking.id

          )

        ) {

          return false

        }


        return true

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

      .sort(

        (

          a,

          b

        ) =>

          b.score -

          a.score

      )


  /*
   *
   * 5.2.4
   *
   * Apply diversity after recommendation
   * scoring.
   *
   * The Explore page currently displays
   * three recommendations, so we select
   * three diverse recommendations here.
   *
   */


  return selectDiverseRecommendations(

    scoredRecommendations,

    3

  )

}