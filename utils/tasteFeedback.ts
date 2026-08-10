export type TasteFeedbackType =

  | "viewed"

  | "clicked"

  | "ranked"

  | "skipped"

  | "disagreed"


type RecordTasteFeedbackOptions = {

  type: TasteFeedbackType

  rankingId: string

  recommendationScore?: number

  source?: string

}


export async function recordTasteFeedback({

  type,

  rankingId,

  recommendationScore,

  source

}: RecordTasteFeedbackOptions) {

  if (!rankingId) {

    return

  }


  try {

    const response =

      await fetch(

        "/api/taste-feedback",

        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:

            JSON.stringify({

              type,

              rankingId,

              recommendationScore:
                recommendationScore ?? null,

              source:
                source ??
                "taste_recommendation"

            })

        }

      )


    if (!response.ok) {

      console.error(

        "TASTE FEEDBACK API ERROR",

        await response.text()

      )

    }

  }

  catch (error) {

    console.error(

      "RECORD TASTE FEEDBACK ERROR",

      error

    )

  }

}