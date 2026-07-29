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
}