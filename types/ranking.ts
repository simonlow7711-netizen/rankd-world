export interface RankingBuilderItem {

  id:string

  name:string

}





export interface RankingItem {

  position:number

  name:string

  votes:number

}





export interface RankingSignals {

  rankdScore?:number

  liveScore?:number

  debateHeat?:number

  perspectiveScore?:number

  views?:number

}





export type RankingSource =

  | "community"

  | "seed"

  | "remix"

  | "challenge"







export interface Ranking {


  id:string


  title:string


  category:string


  creator?:string


  description:string


  items:RankingItem[]



  signals?:RankingSignals



  creatorId?:string


  creatorUsername?:string


  creatorDisplayName?:string



  source?:RankingSource



  createdAt?:string


  views?:number



  parentId:string | null


  rootId:string | null



  remixes?:number


}