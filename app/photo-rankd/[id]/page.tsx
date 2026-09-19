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

        document
          .getElementById(
            "photo-rankd-preview"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })

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
            width: "100%",
            overflow: "hidden",
            borderRadius: "18px",
            background: "#111",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.12)"
          }}
        >

          <div
            style={{
              position: "relative",
              width: "fit-content",
              maxWidth: "100%",
              maxHeight: "80vh",
              margin: "0 auto"
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
                width: "auto",
                maxWidth: "100%",
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
                          ? "translate(-50%, -50%) scale(1.1)"
                          : "translate(-50%, -50%)",
                      width: "58px",
                      height: "58px",
                      padding: 0,
                      borderRadius: "50%",
                      background:
                        isSelected
                          ? "#FF6B35"
                          : "#F7F4EE",
                      color:
                        isSelected
                          ? "#fff"
                          : "#FF6B35",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      fontSize: "27px",
                      lineHeight: 1,
                      fontWeight: 900,
                      fontFamily:
                        "inherit",
                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.28)",
                      border:
                        "3px solid #111",
                      cursor: "pointer",
                      transition:
                        "transform 160ms ease, background 160ms ease, color 160ms ease"
                    }}
                    onMouseEnter={
                      event => {

                        event.currentTarget.style.transform =
                          "translate(-50%, -50%) scale(1.1)"

                      }
                    }
                    onMouseLeave={
                      event => {

                        event.currentTarget.style.transform =
                          isSelected
                            ? "translate(-50%, -50%) scale(1.1)"
                            : "translate(-50%, -50%)"

                      }
                    }
                  >

                    7


                    <span
                      style={{
                        position: "absolute",
                        right: "-8px",
                        top: "-8px",
                        minWidth: "22px",
                        height: "22px",
                        padding: "0 5px",
                        borderRadius: "999px",
                        background: "#111",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        lineHeight: 1,
                        fontWeight: 800,
                        border:
                          "2px solid #F7F4EE"
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
          Tap a RANKD 7 to preview the list.
        </div>


        {(previewLoading ||
          selectedHotspotIndex !== null) && (

          <section
            id="photo-rankd-preview"
            style={{
              marginTop: "32px",
              padding:
                "28px 24px 30px",
              background: "#fff",
              borderTop:
                "4px solid #FF6B35",
              boxShadow:
                "0 14px 40px rgba(0,0,0,0.08)"
            }}
          >

            {previewLoading && (

              <div
                style={{
                  padding: "24px 0",
                  textAlign: "center",
                  color: "#666",
                  fontSize: "14px"
                }}
              >
                Loading RANKD...
              </div>

            )}


            {!previewLoading &&
              !selectedRanking && (

                <div
                  style={{
                    padding: "24px 0",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px"
                  }}
                >
                  This RANKD could not be loaded.
                </div>

              )}


            {!previewLoading &&
              selectedRanking && (

                <div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "20px",
                      marginBottom: "22px"
                    }}
                  >

                    <div>

                      <p
                        style={{
                          margin:
                            "0 0 8px",
                          fontSize: "11px",
                          fontWeight: 900,
                          letterSpacing:
                            "0.14em",
                          textTransform:
                            "uppercase",
                          color: "#FF6B35"
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
                            "clamp(24px, 4vw, 42px)",
                          lineHeight: 1,
                          fontWeight: 900,
                          letterSpacing:
                            "-0.035em"
                        }}
                      >
                        {selectedRanking.title}
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
                        border: "none",
                        background:
                          "transparent",
                        color: "#666",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: "4px 0"
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
                        maxWidth: "760px",
                        color: "#666",
                        fontSize: "15px",
                        lineHeight: 1.5
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
                        "1px solid #ddd"
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
                                "42px 1fr",
                              alignItems:
                                "center",
                              gap: "12px",
                              padding:
                                "15px 0",
                              borderBottom:
                                "1px solid #ddd"
                            }}
                          >

                            <div
                              style={{
                                fontSize:
                                  "18px",
                                fontWeight:
                                  900,
                                color:
                                  "#FF6B35"
                              }}
                            >
                              {index + 1}
                            </div>


                            <div
                              style={{
                                fontSize:
                                  "16px",
                                fontWeight:
                                  700,
                                lineHeight:
                                  1.25
                              }}
                            >
                              {item.name}
                            </div>

                          </div>

                        )
                      )}

                  </div>


                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "flex-start",
                      marginTop:
                        "24px"
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
                          "48px",
                        padding:
                          "0 22px",
                        background:
                          "#111",
                        color:
                          "#fff",
                        textDecoration:
                          "none",
                        fontSize:
                          "13px",
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

        )}

      </div>

    </main>

  )

}