import {
  ImageResponse
} from "next/og"





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
    "NO ID"


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
              28,

            opacity:
              0.7

          }}

        >

          {id}

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