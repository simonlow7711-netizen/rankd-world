import {
  ImageResponse
} from "next/og"





type RankingRow = {

  id: string

  title: string

}





type RankingItemRow = {

  position: number

  name: string

}





function createFallbackImage(

  title:
    string = "RANKD"

) {


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

          justifyContent:
            "center",

          padding:
            "64px",

          background:
            "#000000",

          color:
            "#ffffff"

        }}

      >

        <div

          style={{

            fontSize:
              72,

            fontWeight:
              700

          }}

        >

          {title}

        </div>


        <div

          style={{

            marginTop:
              "24px",

            fontSize:
              28,

            opacity:
              0.7

          }}

        >

          RANKD

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


  if (!id) {

    return createFallbackImage()

  }


  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL


  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


  if (

    !supabaseUrl ||

    !supabaseAnonKey

  ) {

    return createFallbackImage()

  }


  try {


    const rankingResponse =
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


    if (!rankingResponse.ok) {

      return createFallbackImage()

    }


    const rankings =
      await rankingResponse.json() as RankingRow[]


    const ranking =
      rankings[0]


    if (!ranking) {

      return createFallbackImage()

    }


    const itemsResponse =
      await fetch(

        `${supabaseUrl}/rest/v1/ranking_items?ranking_id=eq.${encodeURIComponent(id)}&select=position,name&order=position.asc`,

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


    let items:
      RankingItemRow[] =
      []


    if (itemsResponse.ok) {

      items =
        await itemsResponse.json() as RankingItemRow[]

    }


    const sortedItems =

      items

        .sort(

          (a, b) =>

            a.position -
            b.position

        )

        .slice(

          0,

          7

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
              "56px 64px",

            background:
              "#000000",

            color:
              "#ffffff"

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
                "28px"

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
                  24,

                fontWeight:
                  600,

                opacity:
                  0.65

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
                  ranking.title.length > 55
                    ? 48
                    : 60,

                fontWeight:
                  800,

                lineHeight:
                  1.05,

                marginBottom:
                  "28px"

              }}

            >

              {ranking.title}

            </div>


            <div

              style={{

                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  "7px",

                fontSize:
                  23

              }}

            >

              {sortedItems.map(

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
                          42,

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
                22,

              fontWeight:
                600,

              opacity:
                0.65

            }}

          >

            www.rankd.world

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


  } catch {

    return createFallbackImage()

  }

}