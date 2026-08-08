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


  rankings.forEach(

    ranking => {

      if (!ranking) {

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

        (item: any) => {

          if (!item) {

            return

          }


          const name =

            item.name

              ?.trim()

              ?.toLowerCase()


          if (!name) {

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

    }

  )


  return {

    categories,

    choices,

    behaviour: {

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

  dnaList: TasteDNA[] = []

): TasteDNA {


  const categories: Record<string, number> = {}

  const choices: Record<string, number> = {}


  let totalPosition = 0

  let totalItems = 0

  let totalRankings = 0


  dnaList.forEach(

    dna => {

      if (!dna) {

        return

      }


      Object.entries(

        dna.categories

      )

      .forEach(

        ([key, value]) => {

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

        ([key, value]) => {

          choices[key] =

            (

              choices[key] ||

              0

            )

            +

            value

        }

      )


      totalRankings +=

        dna.behaviour

          ?.totalRankings

        ||

        0


      const averagePosition =

        dna.behaviour

          ?.averagePosition

        ||

        0


      if (

        averagePosition > 0 &&

        dna.behaviour

          ?.totalRankings > 0

      ) {

        totalPosition +=

          averagePosition *

          dna.behaviour.totalRankings

      }

      totalItems +=

        dna.behaviour

          ?.totalRankings

        ||

        0

    }

  )


  return {

    categories,

    choices,

    behaviour: {

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


      totalRankings

    }

  }

}







export function normaliseTasteDNA(

  dna: TasteDNA

): TasteDNA {


  const categoryTotal =

    Object.values(

      dna.categories

    )

    .reduce(

      (

        total,

        value

      ) =>

        total + value,

      0

    )


  const choiceTotal =

    Object.values(

      dna.choices

    )

    .reduce(

      (

        total,

        value

      ) =>

        total + value,

      0

    )


  const categories: Record<string, number> = {}

  const choices: Record<string, number> = {}


  Object.entries(

    dna.categories

  )

  .forEach(

    ([key, value]) => {

      categories[key] =

        categoryTotal > 0

        ?

        Number(

          (

            value /

            categoryTotal

          )

          .toFixed(3)

        )

        :

        0

    }

  )


  Object.entries(

    dna.choices

  )

  .forEach(

    ([key, value]) => {

      choices[key] =

        choiceTotal > 0

        ?

        Number(

          (

            value /

            choiceTotal

          )

          .toFixed(3)

        )

        :

        0

    }

  )


  return {

    categories,

    choices,

    behaviour: {

      averagePosition:

        dna.behaviour

          ?.averagePosition

        ||

        0,


      totalRankings:

        dna.behaviour

          ?.totalRankings

        ||

        0

    }

  }

}