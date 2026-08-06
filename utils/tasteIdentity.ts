import {
  TasteGraphSignal
} from "@/utils/tasteGraph"





export type TasteIdentity = {

  title:string

  emoji:string

  description:string

}









export function generateTasteIdentity(

  signal:TasteGraphSignal

):TasteIdentity {



  if(

    signal.perspective >= 80

  ){

    return {


      title:

        "The Contrarian",



      emoji:

        "🔥",



      description:

        "You often choose differently from the crowd. Your rankings show a strong personal point of view."


    }

  }








  if(

    signal.uniqueness >= 70

  ){

    return {


      title:

        "The Explorer",



      emoji:

        "🌎",



      description:

        "Your choices reveal curiosity and a willingness to discover beyond obvious favourites."


    }

  }








  if(

    signal.confidence >= 70

  ){

    return {


      title:

        "The Decider",



      emoji:

        "⚡",



      description:

        "Your rankings show confident choices that create clear signals for the community."


    }

  }








  return {


    title:

      "The Curator",



    emoji:

      "✨",



    description:

      "Your rankings reveal a considered collection of favourites."


  }


}