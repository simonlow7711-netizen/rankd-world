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


function normaliseText(
  value: string
): string {

  return value
    .trim()
    .toLowerCase()

}


/**
 * Item-level ranking signals.
 *
 * These represent actual ranked choices.
 *
 * Positions run from 1 to 7.
 *
 * Category marker signals at position 0
 * are deliberately excluded.
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


/**
 * Category marker signals.
 *
 * These are position 0 signals created when
 * a ranking is created.
 *
 * They identify the category but are NOT
 * themselves behavioural preference strength.
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


/**
 * Preferred item signals.
 *
 * These represent actual preferred choices.
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


/**
 * Calculate category strength from actual
 * ranked item behaviour.
 *
 * IMPORTANT:
 *
 * We deliberately do NOT use the strength of
 * the category marker signal.
 *
 * A category marker tells us:
 *
 * "This ranking belongs to Sport."
 *
 * It does not tell us:
 *
 * "The user has X amount of taste strength
 * for Sport."
 *
 * Category strength is therefore derived by
 * summing the strength of the ranked items
 * belonging to that category.
 */
function calculateCategoryStrength(
  signals: TasteSignal[]
): Map<string, number> {

  const categoryStrength =
    new Map<string, number>()


  signals.forEach(
    signal => {

      if(
        signal.position <= 0
      ){

        return

      }


      const category =
        normaliseText(
          signal.category
        )


      if(!category){

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


/**
 * Calculate total strength for each
 * individual ranked choice.
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


      if(!item){

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


/**
 * Convert a strength map into the
 * strongest diagnostic insights.
 *
 * Value is normalised against the
 * strongest entry.
 *
 * Description contains the actual
 * calculated strength.
 */
function getStrongestInsights(
  values: Map<string, number>,
  limit: number = 5
): TasteDNAInsight[] {

  const entries =
    Array.from(
      values.entries()
    )


  if(
    entries.length === 0
  ){

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
          `Relative taste strength: ${round(value, 2)}`

      })
    )

}


/**
 * Calculate average ranked position.
 */
function calculateAveragePosition(
  signals: TasteSignal[]
): number {

  if(
    signals.length === 0
  ){

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


/**
 * Calculate proportion of ranked choices
 * placed at #1.
 */
function calculateTopChoiceRate(
  signals: TasteSignal[]
): number {

  if(
    signals.length === 0
  ){

    return 0

  }


  const topChoices =
    signals.filter(
      signal =>
        signal.position === 1
    ).length


  return round(
    topChoices /
    signals.length
  )

}


/**
 * Calculate average preference strength.
 *
 * Preferred signals are used where available.
 */
function calculatePreferenceStrength(
  signals: TasteSignal[]
): number {

  if(
    signals.length === 0
  ){

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
          )
        ),
      0
    )


  return round(
    totalStrength /
    signals.length
  )

}


/**
 * Measures the proportion of unique
 * choices within the ranked choices.
 *
 * 1 = every ranked choice is unique.
 */
function calculateTasteVariety(
  uniqueItems: number,
  totalItems: number
): number {

  if(
    totalItems === 0
  ){

    return 0

  }


  return round(
    clamp(
      uniqueItems /
      totalItems
    )
  )

}


/**
 * Measures concentration around the
 * strongest individual choice.
 *
 * Lower values indicate a distributed
 * taste graph.
 *
 * Higher values indicate that one or
 * a small number of choices dominate.
 */
function calculateTasteConcentration(
  signals: TasteSignal[]
): number {

  if(
    signals.length === 0
  ){

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


  if(
    strengths.length === 0
  ){

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


  if(
    totalStrength === 0
  ){

    return 0

  }


  const strongestStrength =
    Math.max(
      ...strengths
    )


  return round(
    clamp(
      strongestStrength /
      totalStrength
    )
  )

}


/**
 * Confidence measures how much actual
 * behavioural evidence exists.
 *
 * This deliberately uses:
 *
 * - number of rankings
 * - number of signals
 * - number of unique choices
 *
 * Category count is NOT used as a proxy
 * for confidence.
 */
function calculateConfidence(
  totalRankings: number,
  totalSignals: number,
  uniqueItems: number
): number {

  const rankingConfidence =
    clamp(
      totalRankings /
      10
    )


  const signalConfidence =
    clamp(
      totalSignals /
      70
    )


  const varietyConfidence =
    clamp(
      uniqueItems /
      35
    )


  return round(
    (
      rankingConfidence *
      0.4
    )
    +
    (
      signalConfidence *
      0.4
    )
    +
    (
      varietyConfidence *
      0.2
    )
  )

}


/**
 * Build human-readable Taste DNA insights.
 */
function buildInsights({

  totalRankings,

  averagePosition,

  topChoiceRate,

  preferenceStrength,

  tasteVariety,

  tasteConcentration,

  confidence

}: {

  totalRankings: number

  averagePosition: number

  topChoiceRate: number

  preferenceStrength: number

  tasteVariety: number

  tasteConcentration: number

  confidence: number

}): string[] {

  const insights: string[] = []


  if(
    totalRankings === 0
  ){

    insights.push(
      "Your Taste Graph does not have enough ranking activity yet."
    )

    return insights

  }


  if(
    averagePosition > 0 &&
    averagePosition <= 3
  ){

    insights.push(
      "You tend to rank choices decisively."
    )

  }
  else if(
    averagePosition >= 5
  ){

    insights.push(
      "Your rankings tend to spread preference across the list."
    )

  }


  if(
    topChoiceRate >= 0.2
  ){

    insights.push(
      "You have a strong tendency to identify clear #1 choices."
    )

  }


  if(
    preferenceStrength >= 0.9
  ){

    insights.push(
      "Your current Taste Graph contains strong preference signals."
    )

  }


  if(
    tasteVariety >= 0.8
  ){

    insights.push(
      "Your taste currently covers a broad range of distinct choices."
    )

  }
  else if(
    tasteVariety <= 0.4
  ){

    insights.push(
      "Your taste currently appears concentrated around a smaller set of choices."
    )

  }


  if(
    tasteConcentration >= 0.3
  ){

    insights.push(
      "A small number of choices currently carry a significant share of your taste signal."
    )

  }


  if(
    confidence >= 0.7
  ){

    insights.push(
      "There is enough behavioural data for the Taste Graph to begin making meaningful personal recommendations."
    )

  }
  else if(
    confidence >= 0.35
  ){

    insights.push(
      "Your Taste Graph is developing, but more rankings will improve recommendation confidence."
    )

  }
  else{

    insights.push(
      "More rankings are needed before your Taste Graph can confidently model your preferences."
    )

  }


  return insights

}


/**
 * Main Taste DNA diagnostic.
 */
export function calculateTasteDNADiagnostic(
  graph: TasteGraph
): TasteDNADiagnostic {

  /**
   * Actual ranked item signals.
   */
  const rankingSignals =
    getRankingSignals(
      graph
    )


  /**
   * Category marker signals.
   *
   * These are retained for determining
   * which categories exist.
   */
  const categorySignals =
    getCategorySignals(
      graph
    )


  /**
   * Preferred item signals.
   */
  const preferredSignals =
    getPreferredSignals(
      graph
    )


  const totalSignals =
    graph.signals.length


  const totalRankings =
    graph.behaviour.totalRankings


  /**
   * Unique ranked items.
   */
  const uniqueItemsSet =
    new Set(
      rankingSignals.map(
        signal =>
          normaliseText(
            signal.item
          )
      )
    )


  /**
   * Unique categories are determined from
   * category context attached to the graph.
   *
   * We use BOTH:
   *
   * 1. category marker signals
   * 2. categories inherited by item signals
   *
   * This makes the diagnostic resilient if
   * category marker behaviour changes later.
   */
  const uniqueCategoriesSet =
    new Set<string>()


  categorySignals.forEach(
    signal => {

      const category =
        normaliseText(
          signal.category
        )


      if(category){

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


      if(category){

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
      rankingSignals
    )


  const preferenceStrength =
    calculatePreferenceStrength(
      preferredSignals.length > 0
        ? preferredSignals
        : rankingSignals
    )


  const tasteVariety =
    calculateTasteVariety(
      uniqueItems,
      totalItems
    )


  const tasteConcentration =
    calculateTasteConcentration(
      rankingSignals
    )


  const confidence =
    calculateConfidence(
      totalRankings,
      totalSignals,
      uniqueItems
    )


  /**
   * IMPORTANT:
   *
   * Category strength comes from the actual
   * ranked items and their strengths.
   *
   * We do NOT use the category marker signal
   * strength.
   *
   * This means:
   *
   * Sport strength =
   * sum of ranked Sport item strengths
   *
   * General strength =
   * sum of ranked General item strengths
   *
   * This is the correct behavioural model.
   */
  const categoryStrength =
    calculateCategoryStrength(
      rankingSignals
    )


  /**
   * Individual choices continue to use
   * item-level ranking signals.
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

      confidence

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