import {
  NextResponse
} from "next/server"

import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"

import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


export const dynamic =
  "force-dynamic"


type RouteContext = {

  params: Promise<{

    id: string

  }>

}


export async function GET(

  request: Request,

  context: RouteContext

) {

  try {

    const {
      id
    } = await context.params


    if (!id) {

      return NextResponse.json(

        {
          error:
            "Missing recommendation id."
        },

        {
          status:
            400
        }

      )

    }


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


    const ranking =

      await getSupabaseRanking(

        id

      )


    if (!ranking) {

      return NextResponse.json(

        {
          error:
            "Recommendation not found."
        },

        {
          status:
            404
        }

      )

    }


    return NextResponse.json(

      ranking

    )

  }

  catch (error) {

    console.error(

      "TASTE RECOMMENDATION API ERROR",

      error

    )


    return NextResponse.json(

      {
        error:
          "Unable to load recommendation."
      },

      {
        status:
          500
      }

    )

  }

}