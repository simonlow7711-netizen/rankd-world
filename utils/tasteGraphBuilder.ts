import {
  TasteGraph,
  TasteNode,
  TasteSignal
} from "@/utils/tasteGraphTypes"

import {
  Ranking
} from "@/types/ranking"







function positionStrength(

  position:number

){

  const strength =

    1 -

    (

      (position - 1)

      *

      0.1

    )



  return Number(

    Math.max(

      strength,

      0.4

    )

    .toFixed(3)

  )

}








function createNodeId(

  type:string,

  value:string

){

  return `${type}:${value
    .trim()
    .toLowerCase()
  }`

}









export function buildTasteGraph(

  userId:string,

  rankings:Ranking[] = []

):TasteGraph {



  const nodes:TasteNode[] = []

  const signals:TasteSignal[] = []



  const nodeIds = new Set<string>()







  function addNode(

    node:TasteNode

  ){


    if(

      !nodeIds.has(node.id)

    ){

      nodes.push(node)

      nodeIds.add(node.id)

    }


  }









  addNode({

    id:createNodeId(

      "user",

      userId

    ),

    type:"user",

    label:userId

  })









  let totalPosition = 0

  let totalItems = 0

  let topChoices = 0

  const uniqueChoices = new Set<string>()









  rankings.forEach(

    ranking=>{


      if(!ranking){

        return

      }







      const category =

        ranking.category

        ||

        "General"








      const categoryId =

        createNodeId(

          "category",

          category

        )







      addNode({

        id:categoryId,

        type:"category",

        label:category

      })









      signals.push({

        id:

          crypto.randomUUID(),


        userId,


        type:

          "created",


        category,


        item:

          category,


        strength:

          1,


        position:

          0,


        source:

          ranking.id


      })









      ranking.items?.forEach(

        item=>{


          if(!item?.name){

            return

          }







          const itemName =

            item.name.trim()







          const itemId =

            createNodeId(

              "item",

              itemName

            )







          addNode({

            id:itemId,

            type:"item",

            label:itemName

          })








          const position =

            Number(

              item.position

            )

            ||

            7







          const strength =

            positionStrength(

              position

            )








          totalPosition += position

          totalItems++







          uniqueChoices.add(

            itemName

              .toLowerCase()

          )








          if(position === 1){

            topChoices++

          }








          signals.push({

            id:

              crypto.randomUUID(),


            userId,


            type:

              position === 1

              ?

              "preferred"

              :

              "ranked",


            category,


            item:

              itemName,


            strength,


            position,


            source:

              ranking.id


          })


        }

      )


    }

  )









  return {


    userId,


    nodes,


    signals,


    behaviour:{



      totalRankings:

        rankings.length,





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





      topChoiceRate:

        totalItems > 0

        ?

        Number(

          (

            topChoices /

            totalItems

          )

          .toFixed(3)

        )

        :

        0,





      uniqueness:

        totalItems > 0

        ?

        Number(

          (

            uniqueChoices.size /

            totalItems

          )

          .toFixed(3)

        )

        :

        0


    }


  }


}