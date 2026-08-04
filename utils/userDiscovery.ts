import type { Ranking } from "@/types/ranking"

export interface DiscoveryUser {

  id: string

  username: string

  displayName: string

  rankings: Ranking[]

}

export function getDiscoverableUsers(

  rankings: Ranking[] = []

): DiscoveryUser[] {

  const users = new Map<string, DiscoveryUser>()

  rankings.forEach((ranking) => {

    const id =
      ranking.creatorId ??
      ranking.creator ??
      "anonymous"

    if (!users.has(id)) {

      users.set(id, {

        id,

        username:
          ranking.creatorUsername ??
          ranking.creator ??
          "anonymous",

        displayName:
          ranking.creatorDisplayName ??
          ranking.creator ??
          "RANKD User",

        rankings: []

      })

    }

    users.get(id)!.rankings.push(ranking)

  })

  return Array

    .from(users.values())

    .sort(

      (a, b) =>

        b.rankings.length -

        a.rankings.length

    )

}