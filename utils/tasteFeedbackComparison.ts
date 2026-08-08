import {
Ranking
} from "@/types/ranking"

export type TasteFeedbackItemStatus =
| "kept"
| "moved"
| "rejected"

export type TasteFeedbackItem = {

item: string

recommendedPosition: number

userPosition: number | null

status: TasteFeedbackItemStatus

}

export type TasteFeedbackComparison = {

recommendationId: string

userRankingId: string

recommendationScore: number

items: TasteFeedbackItem[]

newChoices: string[]

keptCount: number

movedCount: number

rejectedCount: number

newChoiceCount: number

}

function normaliseName(
name: string
): string {

return name
.trim()
.toLowerCase()

}

export function compareTasteFeedback(

recommendation: Ranking,

userRanking: Ranking,

recommendationScore: number = 0

): TasteFeedbackComparison {

const userItems =

new Map(

  userRanking.items.map(

    item => [

      normaliseName(
        item.name
      ),

      item

    ]

  )

)

const recommendationItems =

recommendation.items ?? []

const items: TasteFeedbackItem[] = []

let keptCount = 0

let movedCount = 0

let rejectedCount = 0

recommendationItems.forEach(

recommendedItem => {

  const key =

    normaliseName(
      recommendedItem.name
    )


  const userItem =

    userItems.get(key)


  if (!userItem) {

    rejectedCount++


    items.push({

      item:
        recommendedItem.name,

      recommendedPosition:
        recommendedItem.position,

      userPosition:
        null,

      status:
        "rejected"

    })

    return

  }


  if (

    userItem.position ===
    recommendedItem.position

  ) {

    keptCount++


    items.push({

      item:
        recommendedItem.name,

      recommendedPosition:
        recommendedItem.position,

      userPosition:
        userItem.position,

      status:
        "kept"

    })

    return

  }


  movedCount++


  items.push({

    item:
      recommendedItem.name,

    recommendedPosition:
      recommendedItem.position,

    userPosition:
      userItem.position,

    status:
      "moved"

  })

}

)

const recommendationNames =

new Set(

  recommendationItems.map(

    item =>

      normaliseName(
        item.name
      )

  )

)

const newChoices =

(userRanking.items ?? [])

  .filter(

    item =>

      !recommendationNames.has(

        normaliseName(
          item.name
        )

      )

  )

  .map(

    item =>
      item.name

  )

return {

recommendationId:
  recommendation.id,

userRankingId:
  userRanking.id,

recommendationScore:
  Math.max(
    0,
    Math.min(
      recommendationScore,
      100
    )
  ),

items,

newChoices,

keptCount,

movedCount,

rejectedCount,

newChoiceCount:
  newChoices.length

}

}