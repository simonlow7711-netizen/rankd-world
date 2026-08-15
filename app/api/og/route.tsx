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
          width: 1200,
          height: 630
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
        width: 1200,
        height: 630
      }

    )

  } catch {

    return new ImageResponse(

      <OgCard
        title="RANKD"
      />,

      {
        width: 1200,
        height: 630
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
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "64px 72px",
        fontFamily:
          "Arial, Helvetica, sans-serif"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          width: "100%"
        }}
      >

        <div
          style={{
            display: "flex",
            fontSize: "44px",
            fontWeight: 800,
            letterSpacing:
              "-2px"
          }}
        >

          RANKD

        </div>


        <div
          style={{
            display: "flex",
            width: "42px",
            height: "42px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor:
              "#ffffff",
            color:
              "#000000",
            fontSize: "22px",
            fontWeight: 800
          }}
        >

          7

        </div>

      </div>


      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "1000px"
        }}
      >

        <div
          style={{
            display: "flex",
            width: "72px",
            height: "6px",
            marginBottom: "30px",
            backgroundColor:
              "#ffffff"
          }}
        />


        <div
          style={{
            display: "flex",
            fontSize: "68px",
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing:
              "-3px"
          }}
        >

          {title}

        </div>

      </div>


      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent:
            "space-between",
          width: "100%"
        }}
      >

        <div
          style={{
            display: "flex",
            fontSize: "22px",
            fontWeight: 600,
            opacity: 0.55
          }}
        >

          rankd.world

        </div>


        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing:
              "2px",
            opacity: 0.45
          }}
        >

          THE WORLD'S TOP 7 EVERYTHING

        </div>

      </div>

    </div>

  )

}