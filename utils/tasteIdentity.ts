import {
  TasteGraphSignal
} from "@/utils/tasteGraphSignal"








export type TasteIdentity = {

  title:string

  description:string

}









export function generateTasteIdentity(

  signal:TasteGraphSignal

):TasteIdentity {



  let title =

    "Curious Explorer"




  let description =

    "Your rankings are building a unique taste profile through the choices you make."









  if(

    signal.uniqueness >= 70

  ){


    title =

      "Independent Tastemaker"



    description =

      "Your choices frequently stand apart from the crowd, revealing a distinctive perspective."

  }









  else if(

    signal.perspective >= 70

  ){


    title =

      "Opinion Shaper"



    description =

      "Your rankings show strong personal judgement and create interesting points of comparison."

  }









  else if(

    signal.confidence >= 80

  ){


    title =

      "Community Influencer"



    description =

      "Your preferences are becoming recognised patterns within the wider RANKD community."

  }









  return {


    title,


    description


  }


}