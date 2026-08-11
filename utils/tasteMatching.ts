import {
  TasteDNA
} from "@/utils/tasteProfile"







function normaliseScores(

  values: Record<string, number> = {}

) {


  const total =

    Object.values(values)

      .reduce(

        (sum, value) =>

          sum + value,

        0

      )





  if (!total) {

    return {}

  }





  return Object.fromEntries(

    Object.entries(values)

      .map(

        ([key, value]) => [

          key,

          value / total

        ]

      )

  )


}









function calculateCategorySimilarity(

  a: Record<string, number> = {},

  b: Record<string, number> = {}

) {


  const normalA =

    normaliseScores(

      a

    )


  const normalB =

    normaliseScores(

      b

    )





  const categories =

    new Set([

      ...Object.keys(normalA),

      ...Object.keys(normalB)

    ])





  if (

    categories.size === 0

  ) {

    return 0

  }





  let difference = 0





  categories.forEach(

    category => {


      difference +=

        Math.abs(

          (normalA[category] ?? 0)

          -

          (normalB[category] ?? 0)

        )


    }

  )








  return Math.max(

    0,

    100 -

    (

      difference * 100

    )

  )


}









function calculateChoiceSimilarity(

  a: Record<string, number> = {},

  b: Record<string, number> = {}

) {


  const normalA =

    normaliseScores(

      a

    )


  const normalB =

    normaliseScores(

      b

    )





  const choices =

    new Set([

      ...Object.keys(normalA),

      ...Object.keys(normalB)

    ])





  if (

    choices.size === 0

  ) {

    return 0

  }





  let difference = 0





  choices.forEach(

    choice => {


      difference +=

        Math.abs(

          (normalA[choice] ?? 0)

          -

          (normalB[choice] ?? 0)

        )


    }

  )








  return Math.max(

    0,

    100 -

    (

      difference * 100

    )

  )


}









function calculateBehaviourSimilarity(

  a: TasteDNA["behaviour"],

  b: TasteDNA["behaviour"]

) {


  if (

    !a ||

    !b ||

    !a.totalRankings ||

    !b.totalRankings

  ) {

    return 0

  }





  const positionDifference =

    Math.abs(

      a.averagePosition -

      b.averagePosition

    )





  return Math.max(

    0,

    100 -

    (

      positionDifference * 20

    )

  )


}









function calculatePerspectiveScore(

  choiceScore: number,

  behaviourScore: number

) {


  const difference =

    100 - choiceScore





  const judgementDifference =

    100 - behaviourScore





  return Math.round(

    (

      difference * 0.7

    )

    +

    (

      judgementDifference * 0.3

    )

  )


}









export function calculateTasteMatch(

  dnaA: TasteDNA = {

    categories: {},

    choices: {},

    behaviour: {

      averagePosition: 0,

      totalRankings: 0

    }

  },


  dnaB: TasteDNA = {

    categories: {},

    choices: {},

    behaviour: {

      averagePosition: 0,

      totalRankings: 0

    }

  }

) {


  const categoryScore =

    calculateCategorySimilarity(

      dnaA.categories,

      dnaB.categories

    )





  const choiceScore =

    calculateChoiceSimilarity(

      dnaA.choices,

      dnaB.choices

    )





  const behaviourScore =

    calculateBehaviourSimilarity(

      dnaA.behaviour,

      dnaB.behaviour

    )





  const perspectiveScore =

    calculatePerspectiveScore(

      choiceScore,

      behaviourScore

    )





  const score =

    Math.round(

      (

        categoryScore * 0.35

      )

      +

      (

        choiceScore * 0.45

      )

      +

      (

        behaviourScore * 0.20

      )

    )

  const sharedCategories =

    Object.keys(

      dnaA.categories

    )

      .filter(

        category =>

          (dnaB.categories[category] ?? 0) > 0

      )









  const differences = [

    {

      type: "Categories",

      value:

        Math.round(

          100 - categoryScore

        )

    },



    {

      type: "Choices",

      value:

        Math.round(

          100 - choiceScore

        )

    },



    {

      type: "Ranking style",

      value:

        Math.round(

          100 - behaviourScore

        )

    }

  ]

    .filter(

      item =>

        item.value > 0

    )









  let explanation =

    "Your rankings reveal different perspectives."





  if (

    sharedCategories.length > 0

  ) {

    explanation =

      `You share interests in ${sharedCategories.join(", ")}.`

  }





  if (

    choiceScore >= 75

  ) {

    explanation +=

      " Your choices are highly aligned."

  }

  else if (

    choiceScore >= 45

  ) {

    explanation +=

      " You overlap on some choices."

  }

  else {

    explanation +=

      " Your rankings create an interesting contrast."

  }





  return {

    score,



    label:

      score >= 85

        ?

        "Taste twins"

        :

        score >= 70

          ?

          "Strong taste alignment"

          :

          score >= 50

            ?

            "Similar perspectives"

            :

            "Different perspectives",





    explanation,





    sharedCategories,





    differences,





    perspectiveScore,





    breakdown: {

      categoryScore:

        Math.round(

          categoryScore

        ),



      choiceScore:

        Math.round(

          choiceScore

        ),



      behaviourScore:

        Math.round(

          behaviourScore

        ),



      perspectiveScore

    }


  }


}