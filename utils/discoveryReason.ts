import { Ranking } from "@/types/ranking"

export function getDiscoveryReason(

  ranking: Ranking

): string {

  const signals = ranking.signals

  if ((signals?.perspectiveScore ?? 0) >= 80) {

    return "🧠 Your taste is different from the community."

  }

  if ((signals?.debateHeat ?? 0) >= 70) {

    return "🔥 People are strongly disagreeing about this ranking."

  }

  if ((signals?.liveScore ?? 0) >= 70) {

    return "⚡ This conversation is growing quickly."

  }

  if ((signals?.views ?? 0) >= 500) {

    return "👀 Popular with the RANKD community."

  }

  return "✨ Recommended for you."
}