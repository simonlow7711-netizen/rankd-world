export interface RankingBuilderItem {

  id: string

  name: string

}





export interface RankingItem {

  position: number

  name: string

  votes: number

}





export interface Ranking {

  id: string

  title: string

  category: string

  creator: string

  description: string

  items: RankingItem[]



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