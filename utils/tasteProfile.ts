import {
  Ranking,
  RankingItem
} from "@/types/ranking"


export type TasteDNA = {

  categories: Record<string, number>

  choices: Record<string, number>

  behaviour: {

    averagePosition: number

    totalRankings: number

  }

}


/*
 *
 * Normalise category names so that
 *
 * "Sport"
 * "sport"
 * " SPORT "
 *
 * are treated as the same category.
 *
 */


function normaliseCategory(

  value: string

): string {

  const normalised =

    value

      .trim()

      .toLowerCase()


  return (

    normalised ||

    "general"

  )

}


/*
 *
 * Normalise item names so that
 * whitespace and capitalisation do not
 * create duplicate taste choices.
 *
 */


function normaliseChoice(

  value: string

): string {

  return value

    .trim()

    .toLowerCase()

}


/*
 *
 * Calculate a basic Taste DNA profile
 * from a collection of rankings.
 *
 * This measures:
 *
 * - category frequency
 * - item/choice frequency
 * - average ranking position
 * - total number of rankings
 *
 * This is intentionally a profile utility.
 *
 * Recommendation scoring should remain
 * separate from this model.
 *
 */


export function calculateTasteDNA(

  rankings: Ranking[] = []

): TasteDNA {


  const categories:
    Record<string, number> = {}


  const choices:
    Record<string, number> = {}


  let totalPosition = 0

  let totalItems = 0


  rankings.forEach(

    ranking => {

      if (!ranking) {

        return

      }


      const category =

        normaliseCategory(

          ranking.category ||

          "General"

        )


      categories[category] =

        (

          categories[category] ||

          0

        )

        +

        1


      const rankingItems =

        ranking.items ?? []


      rankingItems.forEach(

        (item: RankingItem) => {

          if (!item) {

            return

          }


          const name =

            normaliseChoice(

              item.name || ""

            )


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


          const position =

            Number(

              item.position

            )


          totalPosition +=

            position > 0

              ?

              position

              :

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

            ).toFixed(2)

          )

          :

          0,


      totalRankings:

        rankings.length

    }

  }

}


/*
 *
 * Merge multiple Taste DNA profiles.
 *
 * Category and choice frequencies are
 * combined directly.
 *
 * Average position is reconstructed using
 * the number of rankings represented by
 * each profile.
 *
 * NOTE:
 *
 * TasteDNA currently stores average position
 * rather than total position and total item
 * count, so this remains an approximation.
 *
 */


export function mergeTasteDNA(

  dnaList: TasteDNA[] = []

): TasteDNA {


  const categories:
    Record<string, number> = {}


  const choices:
    Record<string, number> = {}


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

      ).forEach(

        ([key, value]) => {

          const category =

            normaliseCategory(

              key

            )


          categories[category] =

            (

              categories[category] ||

              0

            )

            +

            value

        }

      )


      Object.entries(

        dna.choices

      ).forEach(

        ([key, value]) => {

          const choice =

            normaliseChoice(

              key

            )


          if (!choice) {

            return

          }


          choices[choice] =

            (

              choices[choice] ||

              0

            )

            +

            value

        }

      )


      const rankingsInDNA =

        dna.behaviour

          ?.totalRankings

        || 0


      const averagePosition =

        dna.behaviour

          ?.averagePosition

        || 0


      totalRankings +=

        rankingsInDNA


      if (

        averagePosition > 0 &&

        rankingsInDNA > 0

      ) {

        totalPosition +=

          averagePosition *

          rankingsInDNA


        totalItems +=

          rankingsInDNA

      }

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

            ).toFixed(2)

          )

          :

          0,


      totalRankings

    }

  }

}


/*
 *
 * Convert raw Taste DNA frequencies
 * into normalised proportions.
 *
 */


export function normaliseTasteDNA(

  dna: TasteDNA

): TasteDNA {


  const categoryTotal =

    Object.values(

      dna.categories

    ).reduce(

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

    ).reduce(

      (

        total,

        value

      ) =>

        total + value,

      0

    )


  const categories:
    Record<string, number> = {}


  const choices:
    Record<string, number> = {}


  Object.entries(

    dna.categories

  ).forEach(

    ([key, value]) => {

      const category =

        normaliseCategory(

          key

        )


      const existingValue =

        categories[category] ||

        0


      const combinedValue =

        existingValue +

        value


      categories[category] =

        categoryTotal > 0

          ?

          Number(

            (

              combinedValue /

              categoryTotal

            ).toFixed(3)

          )

          :

          0

    }

  )


  Object.entries(

    dna.choices

  ).forEach(

    ([key, value]) => {

      const choice =

        normaliseChoice(

          key

        )


      if (!choice) {

        return

      }


      const existingValue =

        choices[choice] ||

        0


      const combinedValue =

        existingValue +

        value


      choices[choice] =

        choiceTotal > 0

          ?

          Number(

            (

              combinedValue /

              choiceTotal

            ).toFixed(3)

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

        || 0,


      totalRankings:

        dna.behaviour

          ?.totalRankings

        || 0

    }

  }

}