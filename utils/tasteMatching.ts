import {
  TasteDNA
} from "@/utils/tasteProfile"







function calculateCategorySimilarity(

  a:Record<string,number> = {},

  b:Record<string,number> = {}

){


  const categories = new Set([

    ...Object.keys(a),

    ...Object.keys(b)

  ])





  if(categories.size === 0){

    return 0

  }







  let difference = 0





  categories.forEach(category=>{


    const valueA =

      a[category] ?? 0



    const valueB =

      b[category] ?? 0





    difference += Math.abs(

      valueA - valueB

    )


  })








  return Math.max(

    0,

    100 -

    (

      difference /

      categories.size

    )

  )


}









function calculateChoiceSimilarity(

  a:Record<string,number> = {},

  b:Record<string,number> = {}

){



  const choicesA =

    Object.keys(a)



  const choicesB =

    Object.keys(b)







  if(

    choicesA.length === 0 ||

    choicesB.length === 0

  ){

    return 0

  }







  const sharedChoices =

    choicesA.filter(

      choice =>

        choicesB.includes(choice)

    )







  const totalChoices =

    new Set([

      ...choicesA,

      ...choicesB

    ]).size







  return (

    sharedChoices.length /

    totalChoices

  ) * 100


}









function calculateBehaviourSimilarity(

  a:TasteDNA["behaviour"],

  b:TasteDNA["behaviour"]

){



  if(

    !a ||

    !b ||

    !a.totalRankings ||

    !b.totalRankings

  ){

    return 0

  }







  const positionDifference =

    Math.abs(

      a.averagePosition -

      b.averagePosition

    )







  const rankingDifference =

    Math.abs(

      a.totalRankings -

      b.totalRankings

    )








  return Math.max(

    0,

    100 -

    (

      positionDifference * 10

    )

    -

    (

      rankingDifference * 5

    )

  )


}









export function calculateTasteMatch(

  dnaA:TasteDNA = {

    categories:{},

    choices:{},

    behaviour:{

      averagePosition:0,

      totalRankings:0

    }

  },


  dnaB:TasteDNA = {

    categories:{},

    choices:{},

    behaviour:{

      averagePosition:0,

      totalRankings:0

    }

  }

){





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









  const score = Math.round(

    (

      categoryScore * 0.30

    )

    +

    (

      choiceScore * 0.50

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

      type:"Categories",

      value:

        Math.round(

          100 - categoryScore

        )

    },



    {

      type:"Choices",

      value:

        Math.round(

          100 - choiceScore

        )

    },



    {

      type:"Ranking style",

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







  if(sharedCategories.length > 0){


    explanation =

      `You share interests in ${sharedCategories.join(", ")}.`


  }








  if(choiceScore >= 70){


    explanation +=

      " Your choices are highly aligned."

  }

  else if(choiceScore >= 40){


    explanation +=

      " You overlap on some choices."

  }







  if(behaviourScore >= 70){


    explanation +=

      " You rank with a similar style."

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





    breakdown:{


      categoryScore:

        Math.round(categoryScore),



      choiceScore:

        Math.round(choiceScore),



      behaviourScore:

        Math.round(behaviourScore)


    }


  }


}