export type TasteNodeType =
  | "user"
  | "category"
  | "item"



export type TasteSignalType =
  | "created"
  | "ranked"
  | "preferred"
  | "avoided"
  | "challenged"





export type TasteNode = {

  id:string

  type:TasteNodeType

  label:string

}





export type TasteSignal = {

  id:string

  userId:string

  type:TasteSignalType

  category:string

  item:string

  strength:number

  position:number

  source:string

}





export type TasteBehaviour = {

  totalRankings:number

  averagePosition:number

  topChoiceRate:number

  uniqueness:number

}





export type TasteGraph = {

  userId:string

  nodes:TasteNode[]

  signals:TasteSignal[]

  behaviour:TasteBehaviour

}