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

import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


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


type PreviewRanking =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getSupabaseRanking
      >
    >
  >


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


  const [
    selectedRanking,
    setSelectedRanking
  ] =
    useState<PreviewRanking | null>(
      null
    )


  const [
    selectedHotspotIndex,
    setSelectedHotspotIndex
  ] =
    useState<number | null>(
      null
    )


  const [
    previewLoading,
    setPreviewLoading
  ] =
    useState(false)


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


  async function selectHotspot(
    hotspot: Hotspot,
    index: number
  ){

    if(
      !hotspot?.rankingSupabaseId
    ){
      return
    }


    if(
      selectedHotspotIndex === index
    ){

      setSelectedHotspotIndex(
        null
      )

      setSelectedRanking(
        null
      )

      return

    }


    setSelectedHotspotIndex(
      index
    )

    setSelectedRanking(
      null
    )

    setPreviewLoading(
      true
    )


    const ranking =
      await getSupabaseRanking(
        hotspot.rankingSupabaseId
      )


    setSelectedRanking(
      ranking
    )

    setPreviewLoading(
      false
    )


    window.setTimeout(
      () => {

        const preview =
          document.getElementById(
            "photo-rankd-preview"
          )


        if(
          preview &&
          window.innerWidth <= 900
        ){

          preview.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })

        }

      },
      50
    )

  }


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
              fontWeight: 950,
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
              fontWeight: 900,
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
            This Photo RANKD could not be found,
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
          maxWidth: "1480px",
          margin: "0 auto",
          padding:
            "28px 28px 72px"
        }}
      >

        <header
          style={{
            maxWidth: "1080px",
            margin:
              "0 auto 38px"
          }}
        >

          <p
            style={{
              margin:
                "0 0 12px",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing:
                "0.18em",
              textTransform:
                "uppercase",
              color: "#FF6B35"
            }}
          >
            PHOTO RANKD
          </p>


          <h1
            style={{
              margin: 0,
              maxWidth: "900px",
              fontSize:
                "clamp(36px, 5.5vw, 72px)",
              lineHeight:
                0.94,
              fontWeight: 950,
              letterSpacing:
                "-0.055em"
            }}
          >
            {photoRankd.title}
          </h1>


          {photoRankd.description && (

            <p
              style={{
                maxWidth: "650px",
                margin:
                  "18px 0 0",
                fontSize: "16px",
                lineHeight: 1.55,
                color: "#666"
              }}
            >
              {
                photoRankd.description
              }
            </p>

          )}

        </header>


        <div
          className="photo-rankd-layout"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.15fr) minmax(360px, 0.72fr)",
            alignItems: "start",
            gap: "48px",
            maxWidth: "1260px",
            margin:
              "0 auto"
          }}
        >

          <section
            className="photo-rankd-image-column"
            style={{
              minWidth: 0,
              display: "flex",
              justifyContent: "center"
            }}
          >

            <div
              className="photo-rankd-image-wrap"
              style={{
                position: "relative",
                display: "inline-block",
                width: "auto",
                maxWidth: "100%"
              }}
            >

              <img
                src={
                  photoRankd.image_url
                }
                alt={
                  photoRankd.title
                }
                className="photo-rankd-image"
                style={{
                  display: "block",
                  width: "auto",
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "78vh",
                  objectFit: "contain",
                  boxShadow:
                    "0 24px 60px rgba(0,0,0,0.16)",
                  borderRadius: "2px"
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


                  const isSelected =
                    selectedHotspotIndex ===
                    index


                  return (

                    <button
                      key={
                        `${hotspot.rankingSupabaseId}-${index}`
                      }
                      type="button"
                      aria-label={
                        `Preview RANKD ${index + 1}`
                      }
                      aria-pressed={
                        isSelected
                      }
                      onClick={
                        () =>
                          selectHotspot(
                            hotspot,
                            index
                          )
                      }
                      style={{
                        position: "absolute",
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform:
                          isSelected
                            ? "translate(-50%, -50%) scale(1.12)"
                            : "translate(-50%, -50%)",
                        width: "54px",
                        height: "54px",
                        padding: 0,
                        border: "none",
                        borderRadius: 0,
                        background:
                          "transparent",
                        color: "#FF6B35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        lineHeight: 1,
                        fontWeight: 950,
                        fontFamily:
                          "inherit",
                        cursor: "pointer",
                        opacity:
                          isSelected
                            ? 1
                            : 0.38,
                        filter:
                          isSelected
                            ? "drop-shadow(0 5px 12px rgba(0,0,0,0.34))"
                            : "drop-shadow(0 3px 7px rgba(0,0,0,0.20))",
                        transition:
                          "transform 160ms ease, opacity 160ms ease, filter 160ms ease"
                      }}
                      onMouseEnter={
                        event => {

                          event.currentTarget.style.opacity =
                            "1"

                          event.currentTarget.style.transform =
                            "translate(-50%, -50%) scale(1.12)"

                          event.currentTarget.style.filter =
                            "drop-shadow(0 5px 12px rgba(0,0,0,0.34))"

                        }
                      }
                      onMouseLeave={
                        event => {

                          event.currentTarget.style.opacity =
                            isSelected
                              ? "1"
                              : "0.38"

                          event.currentTarget.style.transform =
                            isSelected
                              ? "translate(-50%, -50%) scale(1.12)"
                              : "translate(-50%, -50%)"

                          event.currentTarget.style.filter =
                            isSelected
                              ? "drop-shadow(0 5px 12px rgba(0,0,0,0.34))"
                              : "drop-shadow(0 3px 7px rgba(0,0,0,0.20))"

                        }
                      }
                    >

                      7


                      <span
                        style={{
                          position: "absolute",
                          right: "-3px",
                          top: "-3px",
                          minWidth: "21px",
                          height: "21px",
                          padding:
                            "0 5px",
                          borderRadius:
                            "999px",
                          background:
                            isSelected
                              ? "#111"
                              : "rgba(17,17,17,0.68)",
                          color: "#fff",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize: "10px",
                          lineHeight: 1,
                          fontWeight: 900,
                          border:
                            "2px solid rgba(247,244,238,0.82)"
                        }}
                      >
                        {index + 1}
                      </span>

                    </button>

                  )

                }
              )}

            </div>

          </section>


          <section
            id="photo-rankd-preview"
            className="photo-rankd-preview"
            style={{
              minWidth: 0,
              position: "sticky",
              top: "28px"
            }}
          >

            {!previewLoading &&
              !selectedRanking && (

                <div
                  style={{
                    padding:
                      "42px 36px",
                    borderTop:
                      "1px solid #111",
                    borderBottom:
                      "1px solid #D8D3CA"
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "72px",
                      lineHeight: 0.8,
                      fontWeight: 950,
                      color:
                        "#FF6B35",
                      marginBottom:
                        "30px"
                    }}
                  >
                    7
                  </div>


                  <p
                    style={{
                      margin: 0,
                      maxWidth:
                        "360px",
                      fontSize:
                        "28px",
                      lineHeight:
                        1.03,
                      fontWeight: 900,
                      letterSpacing:
                        "-0.035em"
                    }}
                  >
                    Explore the seven RANKDs.
                  </p>


                  <p
                    style={{
                      margin:
                        "16px 0 0",
                      maxWidth:
                        "380px",
                      color:
                        "#666",
                      fontSize:
                        "14px",
                      lineHeight:
                        1.55
                    }}
                  >
                    Each 7 on the photograph
                    reveals a different ranking.
                  </p>

                </div>

              )}


            {previewLoading && (

              <div
                style={{
                  minHeight:
                    "300px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  padding:
                    "40px",
                  borderTop:
                    "1px solid #111",
                  borderBottom:
                    "1px solid #D8D3CA",
                  color:
                    "#666",
                  fontSize:
                    "14px"
                }}
              >
                Loading RANKD...
              </div>

            )}


            {!previewLoading &&
              selectedRanking && (

                <div
                  style={{
                    padding:
                      "34px 32px 30px",
                    borderTop:
                      "4px solid #FF6B35",
                    borderBottom:
                      "1px solid #D8D3CA",
                    background:
                      "rgba(255,255,255,0.42)"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "flex-start",
                      justifyContent:
                        "space-between",
                      gap:
                        "20px",
                      marginBottom:
                        "26px"
                    }}
                  >

                    <div>

                      <p
                        style={{
                          margin:
                            "0 0 9px",
                          fontSize:
                            "10px",
                          fontWeight:
                            900,
                          letterSpacing:
                            "0.16em",
                          textTransform:
                            "uppercase",
                          color:
                            "#FF6B35"
                        }}
                      >
                        RANKD{" "}
                        {(
                          selectedHotspotIndex ??
                          0
                        ) + 1}
                      </p>


                      <h2
                        style={{
                          margin: 0,
                          fontSize:
                            "clamp(25px, 3vw, 42px)",
                          lineHeight:
                            0.98,
                          fontWeight:
                            950,
                          letterSpacing:
                            "-0.045em"
                        }}
                      >
                        {
                          selectedRanking.title
                        }
                      </h2>

                    </div>


                    <button
                      type="button"
                      onClick={
                        () => {

                          setSelectedHotspotIndex(
                            null
                          )

                          setSelectedRanking(
                            null
                          )

                        }
                      }
                      style={{
                        flexShrink: 0,
                        border:
                          "none",
                        background:
                          "transparent",
                        color:
                          "#666",
                        fontSize:
                          "12px",
                        fontWeight:
                          800,
                        cursor:
                          "pointer",
                        padding:
                          "4px 0"
                      }}
                    >
                      Close
                    </button>

                  </div>


                  {selectedRanking.description && (

                    <p
                      style={{
                        margin:
                          "0 0 24px",
                        color:
                          "#666",
                        fontSize:
                          "14px",
                        lineHeight:
                          1.55
                      }}
                    >
                      {
                        selectedRanking.description
                      }
                    </p>

                  )}


                  <div
                    style={{
                      borderTop:
                        "1px solid #D8D3CA"
                    }}
                  >

                    {selectedRanking.items
                      .slice()
                      .sort(
                        (
                          a,
                          b
                        ) =>
                          a.position -
                          b.position
                      )
                      .map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={
                              `${item.name}-${index}`
                            }
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "38px 1fr",
                              alignItems:
                                "center",
                              gap:
                                "10px",
                              padding:
                                "14px 0",
                              borderBottom:
                                "1px solid #D8D3CA"
                            }}
                          >

                            <div
                              style={{
                                fontSize:
                                  "17px",
                                fontWeight:
                                  950,
                                color:
                                  "#FF6B35"
                              }}
                            >
                              {index + 1}
                            </div>


                            <div
                              style={{
                                fontSize:
                                  "15px",
                                fontWeight:
                                  750,
                                lineHeight:
                                  1.3
                              }}
                            >
                              {
                                item.name
                              }
                            </div>

                          </div>

                        )
                      )}

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap:
                        "20px",
                      marginTop:
                        "26px"
                    }}
                  >

                    <a
                      href={
                        `/rank/${selectedRanking.id}`
                      }
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        minHeight:
                          "46px",
                        padding:
                          "0 20px",
                        background:
                          "#111",
                        color:
                          "#fff",
                        textDecoration:
                          "none",
                        fontSize:
                          "12px",
                        fontWeight:
                          900,
                        letterSpacing:
                          "0.04em",
                        textTransform:
                          "uppercase"
                      }}
                    >
                      Open RANKD →
                    </a>

                  </div>

                </div>

              )}

          </section>

        </div>

      </div>


      <style jsx>{`

        @media (max-width: 900px){

          .photo-rankd-layout{
            grid-template-columns:
              minmax(0, 1fr) !important;
            gap:
              32px !important;
          }

          .photo-rankd-image-column{
            display:
              block !important;
          }

          .photo-rankd-image-wrap{
            width:
              100% !important;
            max-width:
              100% !important;
          }

          .photo-rankd-image{
            width:
              100% !important;
            max-width:
              100% !important;
            max-height:
              none !important;
          }

          .photo-rankd-preview{
            position:
              static !important;
          }

        }


        @media (max-width: 600px){

          .photo-rankd-layout{
            gap:
              24px !important;
          }

        }

      `}</style>

    </main>

  )

}