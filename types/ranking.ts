export interface RankingItem {

  position:number

  name:string

  votes:number

}



export interface Ranking {

  id:string

  title:string

  category:string

  creator:string

  description:string

  items:RankingItem[]


  // Discovery metadata

  source?: "official" | "community"

  createdAt?: string

  views?: number



  // Remix relationship

  remixedFrom?: string

  originalId?: string

}