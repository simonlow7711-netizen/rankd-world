import {
  supabase
} from "@/utils/supabase"


export type RankingEngagementData = {

  views:number

  rankd:number

  rerankd:number

}


export async function getRankingEngagement(

  rankingId:string

):Promise<RankingEngagementData> {


  const {

    data,

    error

  } = await supabase

    .from("analytics_events")

    .select(
      "event_name"
    )

    .eq(
      "ranking_id",
      rankingId
    )

    .in(

      "event_name",

      [
        "ranking_viewed",
        "ranking_rankd",
        "ranking_rerank_started"
      ]

    )


  if(error){

    console.error(

      "Ranking engagement load error:",

      error

    )


    return {

      views:0,

      rankd:0,

      rerankd:0

    }

  }


  const events =
    data ?? []


  return {

    views:

      events.filter(

        event =>
          event.event_name ===
          "ranking_viewed"

      ).length,


    rankd:

      events.filter(

        event =>
          event.event_name ===
          "ranking_rankd"

      ).length,


    rerankd:

      events.filter(

        event =>
          event.event_name ===
          "ranking_rerank_started"

      ).length

  }

}