import {
  ImageResponse
} from "next/og"





type RankingRow = {

  id: string

  title: string

}





export async function GET(

  request: Request

) {


  const {
    searchParams
  } =
    new URL(

      request.url

    )


  const id =
    searchParams.get(
      "id"
    )
    ??
    ""


  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL


  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


  let title =
    "RANKD"


  if (

    id &&

    supabaseUrl &&

    supabaseAnonKey

  ) {


    try {


      const response =
        await fetch(

          `${supabaseUrl}/rest/v1/rankings?id=eq.${encodeURIComponent(id)}&select=id,title`,

          {

            headers: {

              apikey:
                supabaseAnonKey,

              Authorization:
                `Bearer ${supabaseAnonKey}`

            },

            cache:
              "no-store"

          }

        )


      if (response.ok) {


        const rankings =
          await response.json() as RankingRow[]


        if (rankings[0]) {

          title =
            rankings[0].title

        }

      }


    } catch {

      title =
        "RANKD"

    }

  }


  return new ImageResponse(

    (

      <div

        style={{

          width:
            "100%",

          height:
            "100%",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "#000000",

          color:
            "#ffffff",

          fontSize:
            48,

          fontWeight:
            700

        }}

      >

        <div>

          RANKD

        </div>


        <div

          style={{

            marginTop:
              "24px",

            fontSize:
              48

          }}

        >

          {title}

        </div>

      </div>

    ),

    {

      width:
        1200,

      height:
        630

    }

  )

}