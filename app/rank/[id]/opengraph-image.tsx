import {
  ImageResponse
} from "next/og"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


export const alt =
  "RANKD"


export const size = {

  width:
    1200,

  height:
    630

}


export const contentType =
  "image/png"


type Props = {

  params: Promise<{
    id: string
  }>

}


export default async function Image(

  {
    params

  }: Props

) {


  const {
    id

  } =
    await params


  const ranking =
    await getSupabaseRanking(
      id
    )


  if (!ranking) {

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

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "#000000",

            color:
              "#ffffff",

            fontSize:
              72,

            fontWeight:
              700

          }}

        >

          RANKD

        </div>

      ),

      {

        ...size

      }

    )

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const items =

    [...ranking.items]

      .sort(

        (a, b) =>

          a.position -
          b.position

      )


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

          padding:
            "64px",

          background:
            "#000000",

          color:
            "#ffffff",

          fontFamily:
            "Arial"

        }}

      >

        <div

          style={{

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            marginBottom:
              "36px"

          }}

        >

          <div

            style={{

              fontSize:
                42,

              fontWeight:
                800

            }}

          >

            RANKD

          </div>


          <div

            style={{

              fontSize:
                28,

              fontWeight:
                600,

              opacity:
                0.7

            }}

          >

            THE WORLD'S TOP 7 EVERYTHING

          </div>

        </div>


        <div

          style={{

            display:
              "flex",

            flexDirection:
              "column",

            flex:
              1

          }}

        >

          <div

            style={{

              fontSize:
                title.length > 55
                  ? 52
                  : 64,

              fontWeight:
                800,

              lineHeight:
                1.05,

              marginBottom:
                "34px"

            }}

          >

            {title}

          </div>


          <div

            style={{

              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "8px",

              fontSize:
                24,

              opacity:
                0.85

            }}

          >

            {items
              .slice(
                0,
                7
              )
              .map(

                item => (

                  <div

                    key={
                      item.position
                    }

                    style={{

                      display:
                        "flex",

                      alignItems:
                        "center"

                    }}

                  >

                    <div

                      style={{

                        width:
                          44,

                        fontWeight:
                          800

                      }}

                    >

                      {item.position}.

                    </div>


                    <div>

                      {item.name}

                    </div>

                  </div>

                )

              )}

          </div>

        </div>


        <div

          style={{

            display:
              "flex",

            fontSize:
              24,

            fontWeight:
              600,

            opacity:
              0.7

          }}

        >

          www.rankd.world

        </div>

      </div>

    ),

    {

      ...size

    }

  )

}