import {
  Ranking
} from "@/types/ranking"

type TrendingEvent = {
  ranking_id:string | null
  event_name:string
  created_at:string
}

type Activity = {
  rankd:number
  rerankd:number
  views:number
}

const WINDOW_HOURS = 72

function getDecay(
  createdAt:string
){
  const ageHours =
    Math.max(
      0,
      (
        Date.now()
        -
        new Date(
          createdAt
        ).getTime()
      )
      /
      (
        1000
        *
        60
        *
        60
      )
    )

  if(
    ageHours >=
    WINDOW_HOURS
  ){
    return 0
  }

  return Math.pow(
    0.5,
    ageHours / 24
  )
}

export function calculateTrendingScores(
  rankings:Ranking[],
  events:TrendingEvent[]
){

  const activityMap =
    new Map<
      string,
      Activity
    >()

  rankings.forEach(
    ranking=>{
      activityMap.set(
        ranking.id,
        {
          rankd:0,
          rerankd:0,
          views:0
        }
      )
    }
  )

  events.forEach(
    event=>{

      if(
        !event.ranking_id
      ){
        return
      }

      const activity =
        activityMap.get(
          event.ranking_id
        )

      if(
        !activity
      ){
        return
      }

      const decay =
        getDecay(
          event.created_at
        )

      if(
        decay <= 0
      ){
        return
      }

      if(
        event.event_name ===
        "ranking_rankd"
      ){
        activity.rankd +=
          decay
      }

      if(
        event.event_name ===
        "ranking_rerank_started"
      ){
        activity.rerankd +=
          decay
      }

      if(
        event.event_name ===
        "ranking_viewed"
      ){
        activity.views +=
          decay
      }
    }
  )

  const maxRankd =
    Math.max(
      1,
      ...[
        ...activityMap.values()
      ].map(
        activity =>
          activity.rankd
      )
    )

  const maxRerankd =
    Math.max(
      1,
      ...[
        ...activityMap.values()
      ].map(
        activity =>
          activity.rerankd
      )
    )

  const maxViews =
    Math.max(
      1,
      ...[
        ...activityMap.values()
      ].map(
        activity =>
          activity.views
      )
    )

  return rankings.map(
    ranking=>{

      const activity =
        activityMap.get(
          ranking.id
        )!

      const rankdScore =
        activity.rankd /
        maxRankd

      const rerankdScore =
        activity.rerankd /
        maxRerankd

      const viewScore =
        activity.views /
        maxViews

      const createdAt =
        ranking.createdAt

      let freshness =
        0

      if(
        createdAt
      ){

        const ageHours =
          Math.max(
            0,
            (
              Date.now()
              -
              new Date(
                createdAt
              ).getTime()
            )
            /
            (
              1000
              *
              60
              *
              60
            )
          )

        freshness =
          Math.max(
            0,
            1 -
            (
              ageHours /
              WINDOW_HOURS
            )
          )
      }

      const trendingScore =
        (
          rerankdScore *
          40
        )
        +
        (
          rankdScore *
          30
        )
        +
        (
          viewScore *
          20
        )
        +
        (
          freshness *
          10
        )

      return {
        ranking,
        trendingScore
      }
    }
  )
}