import {
  Ranking
} from "@/types/ranking"





export function getRankdExplanation(

  ranking: Ranking

){


  const signals =

    ranking.signals





  const reasons:string[] = []







  if(

    (signals?.perspectiveScore ?? 0) >= 70

  ){

    reasons.push(

      "🧠 Very different perspectives"

    )

  }







  if(

    (signals?.debateHeat ?? 0) >= 70

  ){

    reasons.push(

      "🔥 High debate activity"

    )

  }







  if(

    (signals?.liveScore ?? 0) >= 70

  ){

    reasons.push(

      "⚡ Gaining attention right now"

    )

  }







  if(

    (signals?.views ?? 0) >= 500

  ){

    reasons.push(

      "👀 Popular with the community"

    )

  }







  if(

    reasons.length === 0

  ){

    reasons.push(

      "💡 Interesting community opinion"

    )

  }







  return reasons.slice(0,3)


}