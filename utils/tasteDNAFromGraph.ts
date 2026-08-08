import {
  TasteGraph
} from "@/utils/tasteGraph"

import {
  TasteDNA
} from "@/utils/tasteProfile"


function normaliseItem(

  value:string

){

  return value

    .trim()

    .toLowerCase()

}


export function calculateTasteDNAFromGraph(

  graph:TasteGraph

):TasteDNA{


  const categories:
    Record<string,number> = {}


  const choices:
    Record<string,number> = {}


  let totalPosition = 0

  let totalItems = 0


  const rankingSources =

    new Set<string>()


  graph.signals.forEach(

    signal => {


      if(!signal){

        return

      }


      if(signal.source){

        rankingSources.add(

          signal.source

        )

      }


      /*
       *
       * CATEGORY SIGNALS
       *
       */


      if(

        signal.category &&

        signal.item === signal.category

      ){

        categories[

          signal.category

        ] =

          (

            categories[

              signal.category

            ] || 0

          )

          +

          signal.strength


        return

      }


      /*
       *
       * ITEM SIGNALS
       *
       */


      if(!signal.item){

        return

      }


      const item =

        normaliseItem(

          signal.item

        )


      if(!item){

        return

      }


      /*
       *
       * Ignore feedback signals
       * when building baseline
       * Taste DNA.
       *
       */


      if(

        signal.type ===

          "feedback_clicked"

        ||

        signal.type ===

          "feedback_ranked"

        ||

        signal.type ===

          "feedback_skipped"

        ||

        signal.type ===

          "feedback_disagreed"

      ){

        return

      }


      /*
       *
       * Weight choices by signal
       * strength.
       *
       */


      choices[item] =

        (

          choices[item] || 0

        )

        +

        signal.strength


      /*
       *
       * Behaviour
       *
       */


      if(signal.position > 0){

        totalPosition +=

          signal.position

        totalItems++

      }

    }

  )


  return {

    categories,

    choices,

    behaviour:{

      averagePosition:

        totalItems > 0

        ?

        Number(

          (

            totalPosition /

            totalItems

          )

          .toFixed(2)

        )

        :

        0,


      totalRankings:

        rankingSources.size

    }

  }

}