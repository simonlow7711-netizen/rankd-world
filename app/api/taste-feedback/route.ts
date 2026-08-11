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

import {
  TasteSignal
} from "@/utils/tasteGraphTypes"


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


    const type =

      typeof body?.type === "string"

        ?

        body.type

        :

        ""


    const rankingId =

      typeof body?.rankingId === "string"

        ?

        body.rankingId

        :

        ""


    const userRankingId =

      typeof body?.userRankingId === "string"

        ?

        body.userRankingId

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


    if (

      type !== "viewed"

      &&

      type !== "clicked"

      &&

      type !== "ranked"

      &&

      type !== "skipped"

      &&

      type !== "disagreed"

    ) {

      return NextResponse.json(

        {
          error:
            "Invalid taste feedback type."
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


    /*
     *
     * Direct recommendation feedback.
     *
     * These events happen before the user
     * creates a new ranking, so there is no
     * user ranking to compare yet.
     *
     */


    if (

      type === "viewed"

      ||

      type === "clicked"

      ||

      type === "skipped"

      ||

      type === "disagreed"

    ) {

      const feedbackSignalType =

        type === "viewed"

        ?

        "feedback_clicked"

        :

        type === "clicked"

        ?

        "feedback_clicked"

        :

        type === "skipped"

        ?

        "feedback_skipped"

        :

        "feedback_disagreed"


      const feedbackStrength =

        type === "viewed"

        ?

        0.25

        :

        type === "clicked"

        ?

        0.5

        :

        type === "skipped"

        ?

        0.5

        :

        0.75


      const signals: TasteSignal[] =

        recommendation.items.map(

          item => ({

            id:
              crypto.randomUUID(),

            userId:
              user.id,

            type:
              feedbackSignalType,

            category:
              recommendation.category,

            item:
              item.name,

            strength:
              feedbackStrength,

            position:
              item.position,

            source:
              recommendation.id

          })

        )


      if (

        signals.length === 0

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

          ...signals

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
            signals.length

        }

      )

    }


    /*
     *
     * A ranked event represents the point at
     * which the user has created their own
     * ranking from the recommendation.
     *
     * The recommendation and user's ranking
     * must be compared separately.
     *
     */


    if (!userRankingId) {

      return NextResponse.json(

        {
          error:
            "Missing userRankingId for ranked feedback."
        },

        {
          status:
            400
        }

      )

    }


    const userRanking =

      await getSupabaseRanking(

        userRankingId

      )


    if (!userRanking) {

      return NextResponse.json(

        {
          error:
            "User ranking not found."
        },

        {
          status:
            404
        }

      )

    }


    if (

      userRanking.creatorId

      &&

      userRanking.creatorId !== user.id

    ) {

      return NextResponse.json(

        {
          error:
            "User ranking does not belong to the authenticated user."
        },

        {
          status:
            403
        }

      )

    }


    const comparison =

      compareTasteFeedback(

        recommendation,

        userRanking,

        recommendationScore

      )


    const feedbackSignals =

      buildTasteFeedbackSignals(

        user.id,

        recommendation,

        userRanking,

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