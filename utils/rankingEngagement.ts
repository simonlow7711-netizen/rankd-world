import {
  supabase
} from "@/utils/supabase"


export type RankingEngagementData = {

  views:number

  rankd:number

  rerankd:number

}


async function countRankingEvents(

  rankingId:string,

  eventName:string

){

  const {

    count,

    error

  } = await supabase

    .from("analytics_events")

    .select(
      "*",
      {
        count: "exact",
        head: true
      }
    )

    .eq(
      "ranking_id",
      rankingId
    )

    .eq(
      "event_name",
      eventName
    )


  if(error){

    console.error(

      "Ranking engagement count error:",

      error

    )

    return 0

  }


  return count ?? 0

}


export async function getRankingEngagement(

  rankingId:string

):Promise<RankingEngagementData> {


  const [
    views,
    rankd,
    rerankd
  ] = await Promise.all([

    countRankingEvents(
      rankingId,
      "ranking_viewed"
    ),

    countRankingEvents(
      rankingId,
      "ranking_rankd"
    ),

    countRankingEvents(
      rankingId,
      "ranking_rerank_started"
    )

  ])


  return {

    views,

    rankd,

    rerankd

  }

}


export async function getRecentRankingAnalytics(

  rankingIds:string[]

){

  if(
    rankingIds.length === 0
  ){

    return []

  }


  const cutoff =
    new Date(

      Date.now()
      -
      (
        72
        *
        60
        *
        60
        *
        1000
      )

    ).toISOString()


  const BATCH_SIZE =
    50


  const allEvents:any[] = []


  for(
    let i = 0;
    i < rankingIds.length;
    i += BATCH_SIZE
  ){

    const batch =
      rankingIds.slice(

        i,
        i + BATCH_SIZE

      )


    const {

      data,

      error

    } =
      await supabase

        .from("analytics_events")

        .select(
          `
          ranking_id,
          event_name,
          created_at
          `
        )

        .in(
          "ranking_id",
          batch
        )

        .in(
          "event_name",
          [
            "ranking_viewed",
            "ranking_rankd",
            "ranking_rerank_started"
          ]
        )

        .gte(
          "created_at",
          cutoff
        )


    if(
      error
    ){

      console.error(

        "Recent ranking analytics load error:",

        error

      )

      continue

    }


    allEvents.push(
      ...(data ?? [])
    )

  }


  return allEvents

}


export async function getRecentAnalyticsEvents(){

  const cutoff =
    new Date(
      Date.now()
      -
      (
        72
        *
        60
        *
        60
        *
        1000
      )
    ).toISOString()


  const {
    data,
    error
  } =
    await supabase
      .from("analytics_events")
      .select(
        `
          ranking_id,
          event_name,
          created_at
        `
      )
      .in(
        "event_name",
        [
          "ranking_viewed",
          "ranking_rankd",
          "ranking_rerank_started"
        ]
      )
      .gte(
        "created_at",
        cutoff
      )
      .limit(
        2000
      )


  if(
    error
  ){

    console.error(
      "Recent analytics events load error:",
      error
    )

    return []

  }


  return data ?? []

}