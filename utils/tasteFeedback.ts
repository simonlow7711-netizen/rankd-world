import {
  trackEvent
} from "@/utils/analytics"


import {
  ANALYTICS_EVENTS
} from "@/utils/analyticsEvents"


import {
  supabase
} from "@/utils/supabase"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  getTasteGraph,

  saveTasteGraph
} from "@/utils/tasteGraphRepository"


import {
  TasteSignalType
} from "@/utils/tasteGraph"


export type TasteFeedbackType =

  | "viewed"

  | "clicked"

  | "ranked"

  | "skipped"

  | "disagreed"


type RecordTasteFeedbackOptions = {

  type:TasteFeedbackType

  rankingId:string

  recommendationScore?:number

  source?:string

}


const eventMap:Record<

  TasteFeedbackType,

  string

> = {


  viewed:

    ANALYTICS_EVENTS.RECOMMENDATION_VIEWED,


  clicked:

    ANALYTICS_EVENTS.RECOMMENDATION_CLICKED,


  ranked:

    ANALYTICS_EVENTS.RECOMMENDATION_RANKED,


  skipped:

    ANALYTICS_EVENTS.RECOMMENDATION_SKIPPED,


  disagreed:

    ANALYTICS_EVENTS.RECOMMENDATION_DISAGREED

}


const feedbackSignalMap:Record<

  Exclude<

    TasteFeedbackType,

    "viewed"

  >,

  {

    type:TasteSignalType

    strength:number

  }

> = {


  clicked:{

    type:

      "feedback_clicked",

    strength:

      0.15

  },


  ranked:{

    type:

      "feedback_ranked",

    strength:

      0.40

  },


  skipped:{

    type:

      "feedback_skipped",

    strength:

      0.15

  },


  disagreed:{

    type:

      "feedback_disagreed",

    strength:

      0.40

  }

}


function createFeedbackSignals(

  type:TasteFeedbackType,

  rankingId:string,

  userId:string,

  ranking:Awaited<

    ReturnType<

      typeof getSupabaseRanking

    >

  >

){


  if(

    type === "viewed"

  ){

    return []

  }


  if(!ranking){

    return []

  }


  const feedback =

    feedbackSignalMap[type]


  if(!feedback){

    return []

  }


  return ranking.items.map(

    item => ({


      id:

        crypto.randomUUID(),


      userId,


      type:

        feedback.type,


      category:

        ranking.category ?? "General",


      item:

        item.name,


      strength:

        feedback.strength,


      position:

        item.position,


      source:

        rankingId

    })

  )

}


export async function recordTasteFeedback({

  type,

  rankingId,

  recommendationScore,

  source

}:RecordTasteFeedbackOptions){


  if(!rankingId){

    return

  }


  await trackEvent(

    eventMap[type],

    {

      rankingId,

      recommendationScore:

        recommendationScore ?? null,

      source:

        source ??

        "taste_recommendation"

    }

  )


  if(

    type === "viewed"

  ){

    return

  }


  try{


    const {

      data:{

        user

      }

    } = await supabase.auth.getUser()


    if(!user){

      return

    }


    const ranking =

      await getSupabaseRanking(

        rankingId

      )


    if(!ranking){

      return

    }


    const existingGraph =

      await getTasteGraph(

        user.id

      )


    const feedbackSignals =

      createFeedbackSignals(

        type,

        rankingId,

        user.id,

        ranking

      )


    if(

      feedbackSignals.length === 0

    ){

      return

    }


    const updatedGraph = {


      ...existingGraph,


      signals:[

        ...existingGraph.signals,

        ...feedbackSignals

      ]

    }


    await saveTasteGraph(

      updatedGraph

    )


  }

  catch(error){


    console.error(

      "RECORD TASTE FEEDBACK ERROR",

      error

    )

  }

}