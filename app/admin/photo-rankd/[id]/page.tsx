"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useParams
} from "next/navigation"

import {
  supabase
} from "@/utils/supabase"


type Hotspot = {
  rankingId?: number
  rankingSupabaseId: string
  x: number
  y: number
}


type PhotoRankd = {
  id: string
  title: string
  description: string | null
  image_url: string
  ranking_ids: string[]
  hotspots: Hotspot[]
}


export default function PhotoRankdPage(){

  const params =
    useParams()

  const id =
    typeof params?.id === "string"
      ? params.id
      : ""


  const [
    photoRankd,
    setPhotoRankd
  ] =
    useState<PhotoRankd | null>(
      null
    )


  const [
    loading,
    setLoading
  ] =
    useState(true)


  useEffect(
    () => {

      if(!id){
        return
      }


      async function loadPhotoRankd(){

        setLoading(true)


        const {
          data,
          error
        } =
          await supabase
            .from("photo_rankds")
            .select(
              `
                id,
                title,
                description,
                image_url,
                ranking_ids,
                hotspots
              `
            )
            .eq(
              "id",
              id
            )
            .maybeSingle()


        if(error){

          console.error(
            "Could not load Photo RANKD:",
            error
          )

          setPhotoRankd(
            null
          )

          setLoading(
            false
          )

          return
        }


        setPhotoRankd(
          data as PhotoRankd | null
        )

        setLoading(
          false
        )

      }


      loadPhotoRankd()

    },
    [
      id
    ]
  )


  if(loading){

    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F7F4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px"
        }}
      >

        <div
          style={{
            fontSize: "14px",
            color: "#111"
          }}
        >
          Loading Photo RANKD...
        </div>

      </main>
    )

  }


  if(!photoRankd){

    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F7F4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px"
        }}
      >

        <div
          style={{
            maxWidth: "520px",
            textAlign: "center"
          }}
        >

          <div
            style={{
              fontSize: "72px",
              lineHeight: 1,
              fontWeight: 900,
              color: "#FF6B35",
              marginBottom: "20px"
            }}
          >
            7
          </div>


          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#111"
            }}
          >
            Photo RANKD not found
          </h1>


          <p
            style={{
              marginTop: "12px",
              color: "#666",
              fontSize: "15px",
              lineHeight: 1.5
            }}
          >
            This Photo RANKD may no longer be available,
            or the link may be incorrect.
          </p>

        </div>

      </main>
    )

  }


  const hotspots =
    Array.isArray(
      photoRankd.hotspots
    )
      ? photoRankd.hotspots
      : []


  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#F7F4EE",
        color: "#111"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px 20px 60px"
        }}
      >

        <header
          style={{
            marginBottom: "24px"
          }}
        >

          <p
            style={{
              margin: "0 0 10px",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#FF6B35"
            }}
          >
            PHOTO RANKD
          </p>


          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 64px)",
              lineHeight: 0.98,
              fontWeight: 900,
              letterSpacing: "-0.04em"
            }}
          >
            {photoRankd.title}
          </h1>


          {photoRankd.description && (

            <p
              style={{
                maxWidth: "720px",
                margin: "14px 0 0",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#555"
              }}
            >
              {photoRankd.description}
            </p>

          )}

        </header>


        <section
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderRadius: "18px",
            background: "#111",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.12)"
          }}
        >

          <img
            src={
              photoRankd.image_url
            }
            alt={
              photoRankd.title
            }
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain"
            }}
          />


          {hotspots.map(
            (
              hotspot,
              index
            ) => {

              if(
                !hotspot?.rankingSupabaseId
              ){

                return null

              }


              return (

                <a
                  key={
                    `${hotspot.rankingSupabaseId}-${index}`
                  }
                  href={
                    `/rank/${hotspot.rankingSupabaseId}`
                  }
                  aria-label={
                    `Open RANKD ${index + 1}`
                  }
                  style={{
                    position: "absolute",
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform:
                      "translate(-50%, -50%)",
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    background: "#FF6B35",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    fontSize: "26px",
                    fontWeight: 900,
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.28)",
                    border:
                      "3px solid rgba(255,255,255,0.95)",
                    transition:
                      "transform 160ms ease"
                  }}
                  onMouseEnter={
                    event => {

                      event.currentTarget.style.transform =
                        "translate(-50%, -50%) scale(1.08)"

                    }
                  }
                  onMouseLeave={
                    event => {

                      event.currentTarget.style.transform =
                        "translate(-50%, -50%) scale(1)"

                    }
                  }
                >

                  7


                  <span
                    style={{
                      position: "absolute",
                      right: "-7px",
                      top: "-7px",
                      minWidth: "21px",
                      height: "21px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "#111",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800
                    }}
                  >
                    {index + 1}
                  </span>

                </a>

              )

            }
          )}

        </section>


        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            color: "#777",
            fontSize: "13px",
            textAlign: "center"
          }}
        >
          Tap a RANKD 7 to explore the list.
        </div>

      </div>

    </main>

  )

}