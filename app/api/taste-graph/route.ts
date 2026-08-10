import {
  NextResponse
} from "next/server"

import {
  getTasteGraph
} from "@/utils/tasteGraphServer"

import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


export const dynamic =
  "force-dynamic"


export async function GET() {

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


    const graph =

      await getTasteGraph(

        user.id

      )


    return NextResponse.json(

      graph

    )

  }

  catch (error) {

    console.error(

      "TASTE GRAPH API ERROR",

      error

    )


    return NextResponse.json(

      {
        error:
          "Unable to load Taste Graph."
      },

      {
        status:
          500
      }

    )

  }

}