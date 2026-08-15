import {
  ImageResponse
} from "next/og"


export const runtime =
  "edge"


const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL


const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


type RankingRow = {

  id: string

  title: string

}


export async function GET(
  request: Request
) {

  try {

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


    if (
      !id ||
      !SUPABASE_URL ||
      !SUPABASE_ANON_KEY
    ) {

      return new ImageResponse(

        <OgCard
          title="RANKD"
        />,

        {

          width:
            1200,

          height:
            630

        }

      )

    }


    const response =
      await fetch(

        `${SUPABASE_URL}/rest/v1/rankings` +
        `?select=id,title` +
        `&id=eq.${encodeURIComponent(id)}`,

        {

          headers: {

            apikey:
              SUPABASE_ANON_KEY,

            Authorization:
              `Bearer ${SUPABASE_ANON_KEY}`

          },

          cache:
            "no-store"

        }

      )


    if (
      !response.ok
    ) {

      throw new Error(
        "Ranking request failed"
      )

    }


    const rankings =
      await response.json() as RankingRow[]


    const ranking =
      rankings[0]


    return new ImageResponse(

      <OgCard
        title={
          ranking?.title ??
          "RANKD"
        }
      />,

      {

        width:
          1200,

        height:
          630

      }

    )

  } catch {

    return new ImageResponse(

      <OgCard
        title="RANKD"
      />,

      {

        width:
          1200,

        height:
          630

      }

    )

  }

}


function OgCard(
  {
    title
  }: {
    title: string
  }
) {

  return (

    <div

      style={{

        width:
          "1200px",

        height:
          "630px",

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "space-between",

        position:
          "relative",

        overflow:
          "hidden",

        backgroundColor:
          "#F7F4EE",

        color:
          "#111111",

        padding:
          "58px 68px",

        fontFamily:
          "Arial, Helvetica, sans-serif"

      }}

    >

      <div

        style={{

          position:
            "absolute",

          right:
            "-20px",

          top:
            "-70px",

          display:
            "flex",

          fontSize:
            "300px",

          lineHeight:
            1,

          fontWeight:
            900,

          color:
            "#111111",

          opacity:
            0.035

        }}

      >

        7

      </div>


      <div

        style={{

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          position:
            "relative"

        }}

      >

        <div

          style={{

            display:
              "flex",

            fontSize:
              "52px",

            lineHeight:
              1,

            fontWeight:
              900,

            letterSpacing:
              "-0.06em"

          }}

        >

          RANKD

        </div>


        <div

          style={{

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            width:
              "52px",

            height:
              "52px",

            borderRadius:
              "999px",

            backgroundColor:
              "#FF6B35",

            color:
              "#FFFFFF",

            fontSize:
              "25px",

            fontWeight:
              900

          }}

        >

          7

        </div>

      </div>


      <div

        style={{

          display:
            "flex",

          flexDirection:
            "column",

          position:
            "relative",

          maxWidth:
            "1030px"

        }}

      >

        <div

          style={{

            display:
              "flex",

            width:
              "74px",

            height:
              "7px",

            marginBottom:
              "28px",

            backgroundColor:
              "#FF6B35"

          }}

        />


        <div

          style={{

            display:
              "flex",

            fontSize:
              "76px",

            lineHeight:
              0.94,

            fontWeight:
              900,

            letterSpacing:
              "-0.055em",

            textTransform:
              "uppercase"

          }}

        >

          {title}

        </div>


        <div

          style={{

            display:
              "flex",

            marginTop:
              "28px",

            fontSize:
              "32px",

            lineHeight:
              1.1,

            fontWeight:
              900,

            letterSpacing:
              "-0.035em",

            color:
              "#FF6B35"

          }}

        >

          Would you rank it differently?

        </div>

      </div>


      <div

        style={{

          display:
            "flex",

          alignItems:
            "flex-end",

          justifyContent:
            "space-between",

          position:
            "relative",

          paddingTop:
            "20px",

          borderTop:
            "1px solid rgba(17,17,17,0.10)"

        }}

      >

        <div

          style={{

            display:
              "flex",

            fontSize:
              "21px",

            fontWeight:
              700,

            color:
              "#6B6B6B",

            letterSpacing:
              "-0.02em"

          }}

        >

          rankd.world

        </div>


        <div

          style={{

            display:
              "flex",

            fontSize:
              "18px",

            fontWeight:
              900,

            letterSpacing:
              "0.08em",

            color:
              "#111111",

            opacity:
              0.45

          }}

        >

          THE WORLD'S TOP 7 EVERYTHING

        </div>

      </div>

    </div>

  )

}