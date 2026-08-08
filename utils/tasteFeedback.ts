import {
  trackEvent
} from "@/utils/analytics"

import {
  ANALYTICS_EVENTS
} from "@/utils/analyticsEvents"





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

}