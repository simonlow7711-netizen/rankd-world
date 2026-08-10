import {
  NextResponse
} from "next/server"

import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"

import {
  getTasteGraph,
  saveTasteGraph
} from "@/utils/tasteGraphRepository"

import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"

import {
  compareTasteFeedback
} from "@/utils/tasteFeedbackComparison"

import {
  buildTasteFeedbackSignals
} from "@/utils/tasteFeedbackSignals"


export const dynamic =
  "force-dynamic"


export async function POST(

  request: Request

) {

  try {

    const supabase =

      await createSupabaseServerClient()


    const {
      data: {
        user
      }
    } = await supabase.auth.getUser()


    if (!user) {

      return NextResponse.json(

        {
          error:
            "No authenticated user found."
        },

        {
          status:
            401
        }

      )

    }


    const body =

      await request.json()


    const rankingId =

      typeof body?.rankingId === "string"

        ?

        body.rankingId

        :

        ""


    const recommendationScore =

      typeof body?.recommendationScore === "number"

        ?

        body.recommendationScore

        :

        0


    if (!rankingId) {

      return NextResponse.json(

        {
          error:
            "Missing rankingId."
        },

        {
          status:
            400
        }

      )

    }


    const recommendation =

      await getSupabaseRanking(

        rankingId

      )


    if (!recommendation) {

      return NextResponse.json(

        {
          error:
            "Recommendation ranking not found."
        },

        {
          status:
            404
        }

      )

    }


    const existingGraph =

      await getTasteGraph(

        user.id

      )


    const comparison =

      compareTasteFeedback(

        recommendation,

        recommendation,

        recommendationScore

      )


    const feedbackSignals =

      buildTasteFeedbackSignals(

        user.id,

        recommendation,

        recommendation,

        comparison

      )


    if (

      feedbackSignals.length === 0

    ) {

      return NextResponse.json(

        {
          success:
            true,

          signalsAdded:
            0
        }

      )

    }


    const updatedGraph = {

      ...existingGraph,

      signals: [

        ...existingGraph.signals,

        ...feedbackSignals

      ]

    }


    await saveTasteGraph(

      updatedGraph

    )


    return NextResponse.json(

      {

        success:
          true,

        signalsAdded:
          feedbackSignals.length

      }

    )

  }

  catch (error) {

    console.error(

      "TASTE FEEDBACK API ERROR",

      error

    )


    return NextResponse.json(

      {

        error:
          "Unable to record Taste Feedback."

      },

      {

        status:
          500

      }

    )

  }

}