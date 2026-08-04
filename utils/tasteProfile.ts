export type TasteDNA = {

  categories: Record<string, number>

  choices: Record<string, number>

  behaviour: {

    averagePosition:number

    totalRankings:number

  }

}








export function calculateTasteDNA(

  rankings:any[] = []

):TasteDNA{



  const categories:Record<string,number> = {}

  const choices:Record<string,number> = {}



  let totalPosition = 0

  let totalItems = 0






  rankings.forEach((ranking)=>{



    const category =

      ranking.category || "General"





    categories[category] =

      (categories[category] || 0) + 1





    ranking.items?.forEach(

      (item:any)=>{



        const name =

          item.name?.toLowerCase()



        if(!name){

          return

        }





        choices[name] =

          (choices[name] || 0) + 1





        totalPosition +=

          item.position ?? 7



        totalItems++



      }

    )



  })







  return {


    categories,



    choices,



    behaviour:{


      averagePosition:

        totalItems

        ?

        totalPosition / totalItems

        :

        0,



      totalRankings:

        rankings.length


    }



  }


}