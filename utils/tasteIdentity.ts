import {
  TasteGraph
} from "@/utils/tasteGraphTypes"


import {
  TasteGraphSignal
} from "@/utils/tasteGraphSignal"


import {
  TasteDNADiagnostic,
  calculateTasteDNADiagnostic
} from "@/utils/tasteDNA"





type TasteIdentitySource =

  | TasteGraph

  | TasteGraphSignal

  | TasteDNADiagnostic





export type TasteIdentity = {

  title: string

  description: string

  categories: string[]

  traits: string[]

  stats: {

    uniqueness: number

    decisiveness: number

    exploration: number

  }

  confidence: number

  evidence: string[]

}





type IdentityCandidate = {

  title: string

  score: number

  description: string

  traits: string[]

}





function normalise(

  value: number

): number {

  if (
    !Number.isFinite(
      value
    )
  ) {

    return 0

  }


  return Math.min(

    Math.max(

      Math.round(
        value
      ),

      0

    ),

    100

  )

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





function isTasteGraph(

  source: TasteIdentitySource

): source is TasteGraph {

  return (

    "signals" in source &&

    "behaviour" in source &&

    "nodes" in source

  )

}





function isTasteDNA(

  source: TasteIdentitySource

): source is TasteDNADiagnostic {

  return (

    "totalSignals" in source &&

    "strongestCategories" in source &&

    "strongestChoices" in source &&

    "tasteVariety" in source

  )

}





function getCategories(

  diagnostic: TasteDNADiagnostic

): string[] {

  return diagnostic

    .strongestCategories

    .slice(

      0,

      3

    )

    .map(

      category =>

        category.label

    )

    .filter(Boolean)

}





function getExploration(

  diagnostic: TasteDNADiagnostic

): number {

  if (
    diagnostic.totalRankings === 0
  ) {

    return 0

  }


  const itemBreadth =

    clamp(

      diagnostic.uniqueItems /

      Math.max(

        diagnostic.totalItems,

        1

      )

    )


  const categoryBreadth =

    clamp(

      diagnostic.uniqueCategories /

      Math.max(

        Math.min(

          diagnostic.totalRankings,

          7

        ),

        1

      )

    )


  const rankingBreadth =

    clamp(

      diagnostic.totalRankings /

      10

    )


  return normalise(

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

}





function getUniqueness(

  diagnostic: TasteDNADiagnostic

): number {

  return normalise(

    diagnostic.tasteVariety *

    100

  )

}





function getDecisiveness(

  diagnostic: TasteDNADiagnostic

): number {

  const topChoice =

    clamp(

      diagnostic.topChoiceRate

    )


  const positionSignal =

    diagnostic.averagePosition > 0

      ?

      clamp(

        (

          7 -

          diagnostic.averagePosition

        )

        /

        6

      )

      :

      0


  return normalise(

    (

      topChoice *

      0.65

    )

    +

    (

      positionSignal *

      0.35

    )

  )

}





function getEvidence(

  diagnostic: TasteDNADiagnostic

): string[] {

  const evidence: string[] = []


  if (
    diagnostic.totalRankings > 0
  ) {

    evidence.push(

      `${diagnostic.totalRankings} ranking${
        diagnostic.totalRankings === 1
          ? ""
          : "s"
      } contributing to your Taste Graph`

    )

  }


  if (
    diagnostic.strongestCategories.length > 0
  ) {

    const strongestCategory =

      diagnostic

        .strongestCategories[0]

        .label


    evidence.push(

      `Strongest taste territory: ${strongestCategory}`

    )

  }


  if (
    diagnostic.topChoiceRate >= 0.6
  ) {

    evidence.push(

      "You regularly establish a clear #1 choice"

    )

  }
  else if (
    diagnostic.topChoiceRate <= 0.2 &&
    diagnostic.totalRankings >= 3
  ) {

    evidence.push(

      "You often spread preference rather than settling on an obvious #1"

    )

  }


  if (
    diagnostic.tasteConcentration >= 0.6 &&
    diagnostic.totalRankings >= 3
  ) {

    evidence.push(

      "A relatively small group of choices carries a large share of your taste signal"

    )

  }


  if (
    diagnostic.tasteVariety >= 0.8
  ) {

    evidence.push(

      "You introduce a high proportion of distinct choices"

    )

  }


  if (
    diagnostic.confidence >= 0.6
  ) {

    evidence.push(

      "Your behaviour is beginning to reveal recurring taste patterns"

    )

  }


  return evidence.slice(

    0,

    4

  )

}





function buildCandidates({

  uniqueness,

  decisiveness,

  exploration,

  concentration,

  confidence,

  topChoiceRate,

  variety,

  totalRankings

}: {

  uniqueness: number

  decisiveness: number

  exploration: number

  concentration: number

  confidence: number

  topChoiceRate: number

  variety: number

  totalRankings: number

}): IdentityCandidate[] {


  const candidates:

    IdentityCandidate[] = []





  candidates.push({

    title:
      "Independent Tastemaker",

    score:

      (

        uniqueness *

        0.45

      )

      +

      (

        decisiveness *

        0.25

      )

      +

      (

        exploration *

        0.15

      )

      +

      (

        confidence *

        0.15

      ),

    description:

      "You trust your own judgement and are comfortable putting your personal call ahead of the obvious answer.",

    traits:

      [

        "Original",

        "Independent",

        "Decisive"

      ]

  })





  candidates.push({

    title:
      "The Contrarian",

    score:

      (

        uniqueness *

        0.40

      )

      +

      (

        decisiveness *

        0.30

      )

      +

      (

        concentration *

        100 *

        0.20

      )

      +

      (

        confidence *

        0.10

      ),

    description:

      "You are willing to question the expected choice and back a position that feels more convincing to you.",

    traits:

      [

        "Independent",

        "Distinctive",

        "Opinionated"

      ]

  })





  candidates.push({

    title:
      "The Curator",

    score:

      (

        decisiveness *

        0.40

      )

      +

      (

        concentration *

        100 *

        0.30

      )

      +

      (

        confidence *

        0.20

      )

      +

      (

        uniqueness *

        0.10

      ),

    description:

      "You filter aggressively, giving the strongest options more weight than everything else.",

    traits:

      [

        "Selective",

        "Focused",

        "Discerning"

      ]

  })





  candidates.push({

    title:
      "The Explorer",

    score:

      (

        exploration *

        0.50

      )

      +

      (

        uniqueness *

        0.25

      )

      +

      (

        variety *

        0.15

      )

      +

      (

        confidence *

        0.10

      ),

    description:

      "You like moving across subjects and possibilities rather than staying inside one predictable lane.",

    traits:

      [

        "Curious",

        "Adventurous",

        "Open-minded"

      ]

  })





  candidates.push({

    title:
      "The Selective Eye",

    score:

      (

        decisiveness *

        0.45

      )

      +

      (

        concentration *

        100 *

        0.25

      )

      +

      (

        confidence *

        0.20

      )

      +

      (

        (

          100 -

          exploration

        ) *

        0.10

      ),

    description:

      "You are not easily persuaded by the full field. A choice has to earn its place before it gets your attention.",

    traits:

      [

        "Selective",

        "Decisive",

        "Discerning"

      ]

  })





  candidates.push({

    title:
      "The Specialist",

    score:

      (

        concentration *

        100 *

        0.35

      )

      +

      (

        decisiveness *

        0.25

      )

      +

      (

        confidence *

        0.25

      )

      +

      (

        (

          100 -

          exploration

        ) *

        0.15

      ),

    description:

      "You develop strong preferences within particular areas and tend to return to what you know works for you.",

    traits:

      [

        "Focused",

        "Knowledgeable",

        "Consistent"

      ]

  })





  candidates.push({

    title:
      "The Eclectic",

    score:

      (

        exploration *

        0.45

      )

      +

      (

        uniqueness *

        0.35

      )

      +

      (

        variety *

        0.15

      )

      +

      (

        confidence *

        0.05

      ),

    description:

      "You move easily between different subjects and are difficult to pin down to one predictable preference.",

    traits:

      [

        "Eclectic",

        "Curious",

        "Open-minded"

      ]

  })





  candidates.push({

    title:
      "The Instinctive Ranker",

    score:

      (

        decisiveness *

        0.50

      )

      +

      (

        topChoiceRate *

        100 *

        0.25

      )

      +

      (

        exploration *

        0.15

      )

      +

      (

        confidence *

        0.10

      ),

    description:

      "You are comfortable making the call quickly and giving one option a clear position at the top.",

    traits:

      [

        "Instinctive",

        "Decisive",

        "Confident"

      ]

  })





  candidates.push({

    title:
      "The Challenger",

    score:

      (

        uniqueness *

        0.40

      )

      +

      (

        decisiveness *

        0.30

      )

      +

      (

        exploration *

        0.15

      )

      +

      (

        confidence *

        0.15

      ),

    description:

      "You enjoy testing the obvious answer and are happy to put your own judgement on the line.",

    traits:

      [

        "Independent",

        "Challenging",

        "Decisive"

      ]

  })





  if (
    totalRankings < 3 ||
    confidence < 25
  ) {

    candidates.push({

      title:
        "Taste in the Making",

      score:
        100,

      description:
        "You're still establishing your RANKD signature. Keep making choices and the pattern will become clearer.",

      traits:

        [

          "Curious",

          "Developing"

        ]

    })

  }


  return candidates

}





function getFallbackDescription(

  totalRankings: number

): string {

  if (
    totalRankings === 0
  ) {

    return "Your RANKD signature starts with your first choice."

  }


  if (
    totalRankings < 3
  ) {

    return "You're still establishing your RANKD signature. A few more choices will give it more shape."

  }


  return "A recognisable ranking style is starting to emerge."

}





export function generateTasteIdentity(

  source: TasteIdentitySource

): TasteIdentity {


  if (
    !isTasteGraph(source) &&
    !isTasteDNA(source)
  ) {

    const uniqueness =

      normalise(
        source.uniqueness
      )


    const decisiveness =

      normalise(
        source.confidence
      )


    const exploration =

      normalise(
        source.perspective
      )


    return {

      title:
        "Taste in the Making",

      description:
        "You're still establishing your RANKD signature. Keep making choices and the pattern will become clearer.",

      categories:
        [],

      traits:
        [

          uniqueness >= 60
            ? "Distinctive"
            : "Developing",

          decisiveness >= 60
            ? "Decisive"
            : "Curious"

        ],

      stats: {

        uniqueness,

        decisiveness,

        exploration

      },

      confidence:
        Math.round(
          (
            uniqueness +
            decisiveness +
            exploration
          ) /
          3
        ),

      evidence:
        [

          "This identity is based on early Taste Graph evidence."

        ]

    }

  }





  const diagnostic =

    isTasteGraph(source)

      ?

      calculateTasteDNADiagnostic(
        source
      )

      :

      source





  const uniqueness =

    getUniqueness(
      diagnostic
    )


  const decisiveness =

    getDecisiveness(
      diagnostic
    )


  const exploration =

    getExploration(
      diagnostic
    )


  const confidence =

    normalise(
      diagnostic.confidence *
      100
    )


  const concentration =

    clamp(
      diagnostic.tasteConcentration
    )


  const variety =

    clamp(
      diagnostic.tasteVariety
    )


  const candidates =

    buildCandidates({

      uniqueness,

      decisiveness,

      exploration,

      concentration,

      confidence,

      topChoiceRate:
        diagnostic.topChoiceRate,

      variety,

      totalRankings:
        diagnostic.totalRankings

    })





  candidates.sort(

    (a, b) =>

      b.score -

      a.score

  )





  const selected =

    candidates[0]





  const hasEnoughEvidence =

    diagnostic.totalRankings >= 3 &&

    confidence >= 25





  const title =

    hasEnoughEvidence

      ?

      selected.title

      :

      "Taste in the Making"





  const description =

    hasEnoughEvidence

      ?

      selected.description

      :

      getFallbackDescription(
        diagnostic.totalRankings
      )





  const categories =

    getCategories(
      diagnostic
    )





  const evidence =

    getEvidence(
      diagnostic
    )





  const traits =

    [

      ...new Set(

        selected.traits

      )

    ]

    .slice(

      0,

      3

    )





  return {

    title,

    description,

    categories,

    traits,

    stats: {

      uniqueness,

      decisiveness,

      exploration

    },

    confidence,

    evidence

  }

}