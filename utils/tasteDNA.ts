import {
  TasteGraph,
  TasteSignal
} from "@/utils/tasteGraphTypes"


export type TasteDNAInsight = {

  label: string

  value: number

  description: string

}


export type TasteDNADiagnostic = {

  totalSignals: number

  totalRankings: number

  totalItems: number

  uniqueItems: number

  uniqueCategories: number

  averagePosition: number

  topChoiceRate: number

  preferenceStrength: number

  tasteVariety: number

  tasteConcentration: number

  confidence: number

  strongestCategories: TasteDNAInsight[]

  strongestChoices: TasteDNAInsight[]

  insights: string[]

}


/*
 * Keep all diagnostic values between 0 and 1.
 */

function clamp(
  value: number,
  minimum: number = 0,
  maximum: number = 1
): number {

  return Math.max(
    minimum,
    Math.min(
      value,
      maximum
    )
  )

}


/*
 * Round diagnostic values consistently.
 */

function round(
  value: number,
  decimals: number = 3
): number {

  return Number(
    value.toFixed(
      decimals
    )
  )

}


/*
 * Normalise text so that:
 *
 * "Sport"
 * "sport"
 * " SPORT "
 *
 * are treated as the same value.
 */

function normaliseText(
  value: string
): string {

  return value
    .trim()
    .toLowerCase()

}


/*
 * Actual ranked item signals.
 *
 * Position 0 signals are category markers
 * and are deliberately excluded.
 */

function getRankingSignals(
  graph: TasteGraph
): TasteSignal[] {

  return graph.signals.filter(
    signal =>
      signal.position > 0 &&
      signal.item.trim() !== ""
  )

}


/*
 * Category marker signals created when
 * a ranking is created.
 */

function getCategorySignals(
  graph: TasteGraph
): TasteSignal[] {

  return graph.signals.filter(
    signal =>
      signal.position === 0 &&
      signal.category.trim() !== ""
  )

}


/*
 * Preferred signals represent explicit
 * #1 preference signals.
 */

function getPreferredSignals(
  graph: TasteGraph
): TasteSignal[] {

  return graph.signals.filter(
    signal =>
      signal.type === "preferred" &&
      signal.position > 0 &&
      signal.item.trim() !== ""
  )

}


/*
 * Calculate category strength from actual
 * ranked item behaviour.
 *
 * Category marker signals are excluded.
 *
 * This means category strength is based on
 * what the user actually ranked, rather than
 * simply how many rankings belong to a category.
 */

function calculateCategoryStrength(
  signals: TasteSignal[]
): Map<string, number> {

  const categoryStrength =
    new Map<string, number>()


  signals.forEach(
    signal => {

      if (
        signal.position <= 0
      ) {

        return

      }


      const category =
        normaliseText(
          signal.category
        )


      if (
        !category
      ) {

        return

      }


      const strength =
        clamp(
          Number(
            signal.strength
          ) || 0
        )


      const existing =
        categoryStrength.get(
          category
        ) || 0


      categoryStrength.set(
        category,
        existing +
        strength
      )

    }
  )


  return categoryStrength

}


/*
 * Calculate the accumulated strength
 * of individual choices.
 */

function calculateChoiceStrength(
  signals: TasteSignal[]
): Map<string, number> {

  const choiceStrength =
    new Map<string, number>()


  signals.forEach(
    signal => {

      const item =
        normaliseText(
          signal.item
        )


      if (
        !item
      ) {

        return

      }


      const strength =
        clamp(
          Number(
            signal.strength
          ) || 0
        )


      const existing =
        choiceStrength.get(
          item
        ) || 0


      choiceStrength.set(
        item,
        existing +
        strength
      )

    }
  )


  return choiceStrength

}


/*
 * Convert a strength map into diagnostic
 * insights.
 *
 * Values are relative to the strongest
 * entry rather than raw totals.
 */

function getStrongestInsights(
  values: Map<string, number>,
  limit: number = 5
): TasteDNAInsight[] {

  const entries =
    Array.from(
      values.entries()
    )


  if (
    entries.length === 0
  ) {

    return []

  }


  const maximum =
    Math.max(
      ...entries.map(
        ([, value]) =>
          value
      )
    )


  return entries

    .sort(
      (
        [, a],
        [, b]
      ) =>
        b - a
    )

    .slice(
      0,
      limit
    )

    .map(
      ([label, value]) => ({

        label,

        value:
          round(
            maximum > 0
              ? value / maximum
              : 0
          ),

        description:
          `Relative taste strength: ${round(
            value,
            2
          )}`

      })
    )

}


/*
 * Calculate the average position across
 * all ranked choices.
 *
 * Lower position = stronger average choice.
 */

function calculateAveragePosition(
  signals: TasteSignal[]
): number {

  if (
    signals.length === 0
  ) {

    return 0

  }


  const total =
    signals.reduce(
      (
        sum,
        signal
      ) =>
        sum +
        signal.position,
      0
    )


  return round(
    total /
    signals.length,
    2
  )

}


/*
 * Calculate the proportion of rankings
 * where the user selected a clear #1.
 *
 * IMPORTANT:
 *
 * This is calculated against rankings,
 * NOT against individual ranked items.
 *
 * Therefore:
 *
 * 7 rankings
 * 7 #1 choices
 *
 * produces:
 *
 * 1.0
 *
 * rather than:
 *
 * 1 / 49
 */

function calculateTopChoiceRate(
  signals: TasteSignal[],
  totalRankings: number
): number {

  if (
    signals.length === 0 ||
    totalRankings === 0
  ) {

    return 0

  }


  const rankingIds =
    new Set<string>()


  const topChoiceRankingIds =
    new Set<string>()


  signals.forEach(
    signal => {

      if (
        signal.source
      ) {

        rankingIds.add(
          signal.source
        )

      }


      if (
        signal.position === 1 &&
        signal.source
      ) {

        topChoiceRankingIds.add(
          signal.source
        )

      }

    }
  )


  const measuredRankings =
    rankingIds.size > 0

      ?

      rankingIds.size

      :

      totalRankings


  return round(
    clamp(
      topChoiceRankingIds.size /
      measuredRankings
    )
  )

}


/*
 * Calculate average preference strength.
 *
 * Explicit preferred signals are preferred
 * over generic ranked signals when available.
 */

function calculatePreferenceStrength(
  signals: TasteSignal[]
): number {

  if (
    signals.length === 0
  ) {

    return 0

  }


  const totalStrength =
    signals.reduce(
      (
        sum,
        signal
      ) =>
        sum +
        clamp(
          Number(
            signal.strength
          ) || 0
        ),
      0
    )


  return round(
    clamp(
      totalStrength /
      signals.length
    )
  )

}


/*
 * Exploration measures how much genuinely
 * new territory the user explores.
 *
 * It combines:
 *
 * - unique choices
 * - unique categories
 * - number of rankings
 *
 * This is intentionally different from
 * simple uniqueness.
 */

function calculateExploration(
  totalRankings: number,
  uniqueItems: number,
  totalItems: number,
  uniqueCategories: number
): number {

  if (
    totalRankings === 0 ||
    totalItems === 0
  ) {

    return 0

  }


  const itemBreadth =
    clamp(
      uniqueItems /
      Math.max(
        totalItems,
        1
      )
    )


  const categoryBreadth =
    clamp(
      uniqueCategories /
      Math.max(
        Math.min(
          totalRankings,
          7
        ),
        1
      )
    )


  const rankingBreadth =
    clamp(
      totalRankings /
      10
    )


  return round(
    clamp(
      (
        itemBreadth *
        0.45
      )
      +
      (
        categoryBreadth *
        0.35
      )
      +
      (
        rankingBreadth *
        0.20
      )
    )
  )

}


/*
 * Measures how much the user tends to
 * repeat the same choices.
 *
 * Higher uniqueness means choices are
 * more distinctive across the user's
 * own ranking history.
 */

function calculateTasteUniqueness(
  signals: TasteSignal[],
  uniqueItems: number
): number {

  if (
    signals.length === 0
  ) {

    return 0

  }


  const uniqueRatio =
    clamp(
      uniqueItems /
      signals.length
    )


  const choiceStrength =
    calculateChoiceStrength(
      signals
    )


  const repeatedChoices =
    Array.from(
      choiceStrength.entries()
    ).filter(
      ([, strength]) =>
        strength > 1
    ).length


  const repeatRatio =
    choiceStrength.size > 0

      ?

      clamp(
        repeatedChoices /
        choiceStrength.size
      )

      :

      0


  return round(
    clamp(
      (
        uniqueRatio *
        0.7
      )
      +
      (
        (
          1 -
          repeatRatio
        )
        *
        0.3
      )
    )
  )

}


/*
 * Measures concentration around the
 * strongest individual choices.
 *
 * Higher values mean a smaller number
 * of choices account for a larger share
 * of the Taste Graph.
 */

function calculateTasteConcentration(
  signals: TasteSignal[]
): number {

  if (
    signals.length === 0
  ) {

    return 0

  }


  const choiceStrength =
    calculateChoiceStrength(
      signals
    )


  const strengths =
    Array.from(
      choiceStrength.values()
    )


  if (
    strengths.length === 0
  ) {

    return 0

  }


  const totalStrength =
    strengths.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    )


  if (
    totalStrength === 0
  ) {

    return 0

  }


  /*
   * Instead of only looking at the single
   * strongest item, look at the strongest
   * three choices where possible.
   *
   * This better represents a concentrated
   * taste profile.
   */

  const strongestChoices =
    [...strengths]
      .sort(
        (a, b) =>
          b - a
      )
      .slice(
        0,
        3
      )


  const concentration =
    strongestChoices.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    ) /
    totalStrength


  return round(
    clamp(
      concentration
    )
  )

}


/*
 * Confidence measures the amount and quality
 * of behavioural evidence.
 *
 * It considers:
 *
 * - ranking volume
 * - signal volume
 * - unique choices
 * - category breadth
 * - repeated behavioural evidence
 *
 * More data increases confidence, but
 * confidence deliberately approaches 1
 * rather than jumping there quickly.
 */

function calculateConfidence(
  totalRankings: number,
  totalSignals: number,
  uniqueItems: number,
  uniqueCategories: number,
  signals: TasteSignal[]
): number {

  if (
    totalRankings === 0 ||
    signals.length === 0
  ) {

    return 0

  }


  const rankingEvidence =
    clamp(
      totalRankings /
      20
    )


  const signalEvidence =
    clamp(
      totalSignals /
      140
    )


  const itemEvidence =
    clamp(
      uniqueItems /
      50
    )


  const categoryEvidence =
    clamp(
      uniqueCategories /
      8
    )


  /*
   * Repeated choices indicate that the
   * observed behaviour is becoming a
   * recurring pattern rather than a
   * collection of isolated decisions.
   */

  const choiceStrength =
    calculateChoiceStrength(
      signals
    )


  const repeatedChoices =
    Array.from(
      choiceStrength.values()
    ).filter(
      value =>
        value > 1
    ).length


  const repeatEvidence =
    choiceStrength.size > 0

      ?

      clamp(
        repeatedChoices /
        Math.max(
          choiceStrength.size,
          1
        )
      )

      :

      0


  return round(
    clamp(
      (
        rankingEvidence *
        0.30
      )
      +
      (
        signalEvidence *
        0.20
      )
      +
      (
        itemEvidence *
        0.15
      )
      +
      (
        categoryEvidence *
        0.10
      )
      +
      (
        repeatEvidence *
        0.25
      )
    )
  )

}


/*
 * Build human-readable diagnostic insights.
 */

function buildInsights({

  totalRankings,

  averagePosition,

  topChoiceRate,

  preferenceStrength,

  tasteVariety,

  tasteConcentration,

  confidence,

  exploration

}: {

  totalRankings: number

  averagePosition: number

  topChoiceRate: number

  preferenceStrength: number

  tasteVariety: number

  tasteConcentration: number

  confidence: number

  exploration: number

}): string[] {

  const insights: string[] = []


  if (
    totalRankings === 0
  ) {

    insights.push(
      "Your Taste Graph does not have enough ranking activity yet."
    )

    return insights

  }


  if (
    topChoiceRate >= 0.7
  ) {

    insights.push(
      "You consistently establish a clear favourite when ranking."
    )

  }
  else if (
    topChoiceRate >= 0.4
  ) {

    insights.push(
      "You often identify a clear favourite, but your decisiveness varies by ranking."
    )

  }
  else if (
    topChoiceRate < 0.2 &&
    totalRankings >= 3
  ) {

    insights.push(
      "Your rankings suggest that you are comfortable with more nuanced choices rather than always having a clear favourite."
    )

  }


  if (
    averagePosition > 0 &&
    averagePosition <= 3
  ) {

    insights.push(
      "Your strongest preferences tend to appear near the top of your rankings."
    )

  }
  else if (
    averagePosition >= 5
  ) {

    insights.push(
      "Your rankings tend to distribute preference more evenly across the list."
    )

  }


  if (
    preferenceStrength >= 0.9
  ) {

    insights.push(
      "Your current Taste Graph contains strong preference signals."
    )

  }
  else if (
    preferenceStrength >= 0.7
  ) {

    insights.push(
      "Your choices are producing increasingly clear preference signals."
    )

  }


  if (
    exploration >= 0.75
  ) {

    insights.push(
      "You explore widely across different choices and categories."
    )

  }
  else if (
    exploration <= 0.35 &&
    totalRankings >= 3
  ) {

    insights.push(
      "Your taste is becoming concentrated around a relatively focused set of interests."
    )

  }


  if (
    tasteVariety >= 0.8
  ) {

    insights.push(
      "You introduce a high proportion of distinct choices into your rankings."
    )

  }
  else if (
    tasteVariety <= 0.4 &&
    totalRankings >= 3
  ) {

    insights.push(
      "You return to familiar choices frequently."
    )

  }


  if (
    tasteConcentration >= 0.6 &&
    totalRankings >= 3
  ) {

    insights.push(
      "A small number of choices currently carry a large share of your taste signal."
    )

  }


  if (
    confidence >= 0.75
  ) {

    insights.push(
      "There is substantial behavioural evidence for the Taste Graph to make confident personal recommendations."
    )

  }
  else if (
    confidence >= 0.4
  ) {

    insights.push(
      "Your Taste Graph is developing and is beginning to reveal recurring patterns."
    )

  }
  else {

    insights.push(
      "More rankings will help the Taste Graph distinguish recurring taste from isolated choices."
    )

  }


  return insights

}


/*
 * Main Taste DNA diagnostic.
 */

export function calculateTasteDNADiagnostic(
  graph: TasteGraph
): TasteDNADiagnostic {

  /*
   * Actual ranked item signals.
   */

  const rankingSignals =
    getRankingSignals(
      graph
    )


  /*
   * Category marker signals.
   */

  const categorySignals =
    getCategorySignals(
      graph
    )


  /*
   * Explicit preferred signals.
   */

  const preferredSignals =
    getPreferredSignals(
      graph
    )


  const totalSignals =
    graph.signals.length


  const totalRankings =
    graph.behaviour.totalRankings


  /*
   * Unique ranked items.
   */

  const uniqueItemsSet =
    new Set<string>()


  rankingSignals.forEach(
    signal => {

      const item =
        normaliseText(
          signal.item
        )


      if (
        item
      ) {

        uniqueItemsSet.add(
          item
        )

      }

    }
  )


  /*
   * Unique categories.
   *
   * We use both category marker signals
   * and item-level category context.
   */

  const uniqueCategoriesSet =
    new Set<string>()


  categorySignals.forEach(
    signal => {

      const category =
        normaliseText(
          signal.category
        )


      if (
        category
      ) {

        uniqueCategoriesSet.add(
          category
        )

      }

    }
  )


  rankingSignals.forEach(
    signal => {

      const category =
        normaliseText(
          signal.category
        )


      if (
        category
      ) {

        uniqueCategoriesSet.add(
          category
        )

      }

    }
  )


  const totalItems =
    rankingSignals.length


  const uniqueItems =
    uniqueItemsSet.size


  const uniqueCategories =
    uniqueCategoriesSet.size


  const averagePosition =
    calculateAveragePosition(
      rankingSignals
    )


  const topChoiceRate =
    calculateTopChoiceRate(
      rankingSignals,
      totalRankings
    )


  const preferenceStrength =
    calculatePreferenceStrength(
      preferredSignals.length > 0
        ? preferredSignals
        : rankingSignals
    )


  const tasteVariety =
    calculateTasteUniqueness(
      rankingSignals,
      uniqueItems
    )


  const tasteConcentration =
    calculateTasteConcentration(
      rankingSignals
    )


  const exploration =
    calculateExploration(
      totalRankings,
      uniqueItems,
      totalItems,
      uniqueCategories
    )


  const confidence =
    calculateConfidence(
      totalRankings,
      totalSignals,
      uniqueItems,
      uniqueCategories,
      rankingSignals
    )


  /*
   * Category strength is derived from
   * actual ranked item behaviour.
   */

  const categoryStrength =
    calculateCategoryStrength(
      rankingSignals
    )


  /*
   * Individual choice strength.
   */

  const choiceStrength =
    calculateChoiceStrength(
      rankingSignals
    )


  const strongestCategories =
    getStrongestInsights(
      categoryStrength
    )


  const strongestChoices =
    getStrongestInsights(
      choiceStrength
    )


  const insights =
    buildInsights({

      totalRankings,

      averagePosition,

      topChoiceRate,

      preferenceStrength,

      tasteVariety,

      tasteConcentration,

      confidence,

      exploration

    })


  return {

    totalSignals,

    totalRankings,

    totalItems,

    uniqueItems,

    uniqueCategories,

    averagePosition,

    topChoiceRate,

    preferenceStrength,

    tasteVariety,

    tasteConcentration,

    confidence,

    strongestCategories,

    strongestChoices,

    insights

  }

}