export interface RankingBuilderItem {

  id: string

  name: string

}





export interface RankingItem {

  position: number

  name: string

  votes: number

}





export interface RankingSignals {

  rankdScore?: number

  liveScore?: number

  debateHeat?: number

  perspectiveScore?: number

  views?: number

}





export interface Ranking {

  id: string

  title: string

  category: string

  creator: string

  description: string

  items: RankingItem[]



  // Intelligence layer

  signals?: RankingSignals



  // Ownership / identity

  creatorId?: string

  creatorUsername?: string

  creatorDisplayName?: string



  // Ranking source

  source?: string



  // Dates / metrics

  createdAt?: string

  views?: number



  // Remix / parent-child system

  // Immediate ranking that inspired this one

  parentId?: string



  // Original ranking that started the conversation

  rootId?: string



  // Legacy fields

  remixedFrom?: string

  originalId?: string



  // Future social metrics

  remixes?: number

}