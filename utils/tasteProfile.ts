export type TasteDNA = {

  categories: Record<string, number>

  choices: Record<string, number>

  behaviour: {

    averagePosition: number

    totalRankings: number

  }

}









export function calculateTasteDNA(

  rankings: any[] = []

): TasteDNA {


  const categories: Record<string, number> = {}

  const choices: Record<string, number> = {}



  let totalPosition = 0

  let totalItems = 0







  rankings.forEach((ranking)=>{



    if(!ranking){

      return

    }







    const category =

      ranking.category ||

      "General"







    categories[category] =

      (

        categories[category] ||

        0

      )

      +

      1







    ranking.items?.forEach(

      (item:any)=>{



        if(!item){

          return

        }







        const name =

          item.name

          ?.trim()

          ?.toLowerCase()







        if(!name){

          return

        }







        choices[name] =

          (

            choices[name] ||

            0

          )

          +

          1







        totalPosition +=

          Number(

            item.position

          )

          ||

          7







        totalItems++



      }

    )



  })









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

        rankings.length


    }


  }


}









export function mergeTasteDNA(

  dnaList:TasteDNA[] = []

):TasteDNA {


  const categories:Record<string,number> = {}

  const choices:Record<string,number> = {}



  let totalPosition = 0

  let totalRankings = 0







  dnaList.forEach((dna)=>{



    Object.entries(

      dna.categories

    )

    .forEach(

      ([key,value])=>{


        categories[key] =

          (

            categories[key] ||

            0

          )

          +

          value


      }

    )








    Object.entries(

      dna.choices

    )

    .forEach(

      ([key,value])=>{


        choices[key] =

          (

            choices[key] ||

            0

          )

          +

          value


      }

    )








    totalPosition +=

      dna.behaviour.averagePosition *

      dna.behaviour.totalRankings







    totalRankings +=

      dna.behaviour.totalRankings



  })









  return {


    categories,



    choices,



    behaviour:{



      averagePosition:

        totalRankings > 0

        ?

        Number(

          (

            totalPosition /

            totalRankings

          )

          .toFixed(2)

        )

        :

        0,





      totalRankings


    }


  }


}









export function normaliseTasteDNA(

  dna:TasteDNA

):TasteDNA {



  const normalise = (

    values:Record<string,number>

  )=>{


    const total =

      Object.values(

        values

      )

      .reduce(

        (

          sum,

          value

        )=>

          sum + value,

        0

      )





    if(total === 0){

      return {}

    }







    return Object.fromEntries(

      Object.entries(

        values

      )

      .map(

        ([key,value])=>

          [

            key,

            Number(

              (

                value /

                total

              )

              .toFixed(3)

            )

          ]

      )

    )


  }









  return {


    categories:

      normalise(

        dna.categories

      ),





    choices:

      normalise(

        dna.choices

      ),





    behaviour:

      dna.behaviour


  }


}