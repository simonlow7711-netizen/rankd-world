import { Ranking } from "@/types/ranking"





export function calculatePerspectiveGap(

  original:Ranking,

  remix:Ranking

){



  const differences = remix.items.map(

    remixItem=>{


      const originalItem =

        original.items.find(

          item =>

            item.name === remixItem.name

        )





      if(!originalItem){


        return {

          item:remixItem.name,

          originalPosition:null,

          remixPosition:remixItem.position,

          difference:7

        }


      }







      return {

        item:remixItem.name,

        originalPosition:

          originalItem.position,


        remixPosition:

          remixItem.position,


        difference:

          Math.abs(

            originalItem.position -

            remixItem.position

          )


      }


    }

  )







  const score =

    differences.reduce(

      (total,item)=>

        total + item.difference,

      0

    )







  return {


    score,


    differences:

      differences.sort(

        (a,b)=>

          b.difference -

          a.difference

      )


  }


}