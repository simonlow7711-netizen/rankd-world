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


export default function PhotoRankdPage() {

  const params =
    useParams()

  const id =
    typeof params?.id === "string"
      ? params.id
      : null


  const [
    photoRankd,
    setPhotoRankd
  ] =
    useState<PhotoRankd | null>(null)


  const [
    loading,
    setLoading
  ] =
    useState(true)


  const [
    selectedRanking,
    setSelectedRanking
  ] =
    useState<PreviewRanking | null>(null)


  const [
    selectedHotspotIndex,
    setSelectedHotspotIndex
  ] =
    useState(0)


  const [
    previewLoading,
    setPreviewLoading
  ] =
    useState(false)


  useEffect(
    () => {

      if (!id) {
        return
      }


      let cancelled =
        false


      async function loadPhotoRankd() {

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


        if (
          cancelled
        ) {
          return
        }


        if (
          error ||
          !data
        ) {
          setPhotoRankd(null)
          setLoading(false)
          return
        }


        const loadedPhotoRankd: PhotoRankd =
          {
            id:
              data.id,

            title:
              data.title,

            description:
              data.description,

            image_url:
              data.image_url,

            ranking_ids:
              Array.isArray(
                data.ranking_ids
              )
                ? data.ranking_ids
                : [],

            hotspots:
              Array.isArray(
                data.hotspots
              )
                ? data.hotspots
                : []
          }


        setPhotoRankd(
          loadedPhotoRankd
        )

        setLoading(false)


        if (
          loadedPhotoRankd.hotspots.length === 0
        ) {
          return
        }


        const firstHotspot =
          loadedPhotoRankd.hotspots[0]


        setSelectedHotspotIndex(0)
        setPreviewLoading(true)


        const firstRanking =
          await getSupabaseRanking(
            firstHotspot.rankingSupabaseId
          )


        if (
          cancelled
        ) {
          return
        }


        setSelectedRanking(
          firstRanking
        )

        setPreviewLoading(false)
      }


      loadPhotoRankd()


      return () => {
        cancelled = true
      }

    },
    [
      id
    ]
  )


  async function selectRanking(
    hotspotIndex: number
  ) {

    if (
      !photoRankd
    ) {
      return
    }


    const hotspot =
      photoRankd.hotspots[
        hotspotIndex
      ]


    if (
      !hotspot
    ) {
      return
    }


    setSelectedHotspotIndex(
      hotspotIndex
    )


    setPreviewLoading(true)


    const ranking =
      await getSupabaseRanking(
        hotspot.rankingSupabaseId
      )


    setSelectedRanking(
      ranking
    )

    setPreviewLoading(false)


    if (
      window.innerWidth <= 900
    ) {
      window.setTimeout(
        () => {

          document
            .querySelector(
              ".photo-rankd-preview"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start"
            })

        },
        50
      )
    }
  }


  function closePreview() {

    setSelectedRanking(null)
  }


  if (
    loading
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#F7F4EE",
          color:
            "#111",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center"
        }}
      >
        Loading...
      </main>
    )
  }


  if (
    !photoRankd
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#F7F4EE",
          color:
            "#111",
          padding:
            "80px 24px"
        }}
      >
        <div
          style={{
            maxWidth:
              "900px",
            margin:
              "0 auto"
          }}
        >

          <h1
            style={{
              margin:
                "0 0 12px",
              fontSize:
                "36px",
              fontWeight:
                800,
              letterSpacing:
                "-0.04em"
            }}
          >
            Photo RANKD not found
          </h1>


          <p
            style={{
              margin:
                0,
              color:
                "#666"
            }}
          >
            This Photo RANKD could not be loaded.
          </p>

        </div>
      </main>
    )
  }


  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#F7F4EE",
        color:
          "#111",
        padding:
          "40px 24px 72px"
      }}
    >

      <div
        style={{
          maxWidth:
            "1320px",
          margin:
            "0 auto"
        }}
      >

        <header
          style={{
            maxWidth:
              "1180px",
            margin:
              "0 auto 36px"
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                "10px",
              marginBottom:
                "12px"
            }}
          >

            <span
              style={{
                color:
                  "#FF6B35",
                fontSize:
                  "24px",
                fontWeight:
                  900,
                lineHeight:
                  1
              }}
            >
              7
            </span>


            <span
              style={{
                fontSize:
                  "13px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.14em",
                textTransform:
                  "uppercase"
              }}
            >
              Photo RANKD
            </span>

          </div>


          <h1
            style={{
              margin:
                0,
              fontSize:
                "clamp(32px, 4vw, 52px)",
              lineHeight:
                0.98,
              fontWeight:
                900,
              letterSpacing:
                "-0.055em",
              maxWidth:
                "900px"
            }}
          >
            {photoRankd.title}
          </h1>


          {
            photoRankd.description && (
              <p
                style={{
                  margin:
                    "16px 0 0",
                  maxWidth:
                    "760px",
                  fontSize:
                    "16px",
                  lineHeight:
                    1.55,
                  color:
                    "#5F5B56"
                }}
              >
                {
                  photoRankd.description
                }
              </p>
            )
          }

        </header>


        <div
          className="photo-rankd-layout"
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "minmax(0, 1.22fr) minmax(360px, 0.72fr)",
            alignItems:
              "start",
            gap:
              "56px",
            maxWidth:
              "1320px",
            margin:
              "0 auto"
          }}
        >

          <div
            className="photo-rankd-image-column"
            style={{
              minWidth:
                0
            }}
          >

            <div
              className="photo-rankd-image-wrap"
              style={{
                position:
                  "relative",
                display:
                  "block",
                width:
                  "100%"
              }}
            >

              <img
                className="photo-rankd-image"
                src={
                  photoRankd.image_url
                }
                alt={
                  photoRankd.title
                }
                style={{
                  display:
                    "block",
                  width:
                    "100%",
                  height:
                    "auto",
                  maxWidth:
                    "100%",
                  boxShadow:
                    "0 28px 70px rgba(0,0,0,0.17)",
                  borderRadius:
                    "2px"
                }}
              />


              {
                photoRankd.hotspots.map(
                  (
                    hotspot,
                    index
                  ) => {

                    const selected =
                      index ===
                      selectedHotspotIndex


                    return (
                      <button
                        key={
                          `${hotspot.rankingSupabaseId}-${index}`
                        }
                        type="button"
                        aria-label={
                          `Open RANKD ${index + 1}`
                        }
                        onClick={() =>
                          selectRanking(
                            index
                          )
                        }
                        style={{
                          position:
                            "absolute",
                          left:
                            `${hotspot.x}%`,
                          top:
                            `${hotspot.y}%`,
                          width:
                            "58px",
                          height:
                            "58px",
                          margin:
                            "-29px 0 0 -29px",
                          padding:
                            0,
                          border:
                            "0",
                          background:
                            "transparent",
                          color:
                            "#FF6B35",
                          fontSize:
                            "36px",
                          lineHeight:
                            1,
                          fontWeight:
                            900,
                          cursor:
                            "pointer",
                          opacity:
                            selected
                              ? 1
                              : 0.42,
                          transform:
                            selected
                              ? "scale(1.14)"
                              : "scale(1)",
                          filter:
                            "drop-shadow(0 3px 8px rgba(0,0,0,0.24))",
                          transition:
                            "opacity 160ms ease, transform 160ms ease, filter 160ms ease",
                          zIndex:
                            2
                        }}
                        onMouseEnter={event => {

                          event.currentTarget.style.opacity =
                            "1"

                          event.currentTarget.style.transform =
                            "scale(1.14)"

                          event.currentTarget.style.filter =
                            "drop-shadow(0 4px 10px rgba(0,0,0,0.28))"

                        }}
                        onMouseLeave={event => {

                          if (
                            !selected
                          ) {

                            event.currentTarget.style.opacity =
                              "0.42"

                            event.currentTarget.style.transform =
                              "scale(1)"

                            event.currentTarget.style.filter =
                              "drop-shadow(0 3px 8px rgba(0,0,0,0.24))"

                          }

                        }}
                      >

                        7


                        <span
                          style={{
                            position:
                              "absolute",
                            right:
                              "-4px",
                            top:
                              "-3px",
                            minWidth:
                              "20px",
                            height:
                              "20px",
                            padding:
                              "0 5px",
                            borderRadius:
                              "999px",
                            background:
                              "#111",
                            color:
                              "#F7F4EE",
                            fontSize:
                              "10px",
                            fontWeight:
                              800,
                            lineHeight:
                              "20px",
                            textAlign:
                              "center",
                            boxSizing:
                              "border-box"
                          }}
                        >
                          {index + 1}
                        </span>

                      </button>
                    )
                  }
                )
              }

            </div>

          </div>


          <aside
            className="photo-rankd-preview"
            style={{
              position:
                "sticky",
              top:
                "28px",
              minWidth:
                0
            }}
          >

            <div
              style={{
                borderTop:
                  "4px solid #111",
                borderBottom:
                  "1px solid #D8D3CA"
              }}
            >

              <nav
                aria-label="RANKD selection"
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(7, minmax(0, 1fr))",
                  borderBottom:
                    "1px solid #D8D3CA"
                }}
              >

                {
                  photoRankd.hotspots
                    .slice(
                      0,
                      7
                    )
                    .map(
                      (
                        hotspot,
                        index
                      ) => {

                        const selected =
                          index ===
                          selectedHotspotIndex


                        return (
                          <button
                            key={
                              `menu-${hotspot.rankingSupabaseId}-${index}`
                            }
                            type="button"
                            onClick={() =>
                              selectRanking(
                                index
                              )
                            }
                            aria-label={
                              `Show RANKD ${index + 1}`
                            }
                            style={{
                              position:
                                "relative",
                              height:
                                "54px",
                              border:
                                "0",
                              borderRight:
                                index < 6
                                  ? "1px solid #D8D3CA"
                                  : "0",
                              background:
                                selected
                                  ? "#111"
                                  : "transparent",
                              color:
                                selected
                                  ? "#F7F4EE"
                                  : "#111",
                              fontSize:
                                "15px",
                              fontWeight:
                                900,
                              cursor:
                                "pointer",
                              transition:
                                "background 150ms ease, color 150ms ease"
                            }}
                          >

                            {index + 1}


                            {
                              selected && (
                                <span
                                  style={{
                                    position:
                                      "absolute",
                                    left:
                                      "50%",
                                    bottom:
                                      "-1px",
                                    width:
                                      "22px",
                                    height:
                                      "3px",
                                    transform:
                                      "translateX(-50%)",
                                    background:
                                      "#FF6B35"
                                  }}
                                />
                              )
                            }

                          </button>
                        )
                      }
                    )
                }

              </nav>


              {
                previewLoading ? (

                  <div
                    style={{
                      minHeight:
                        "430px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      padding:
                        "40px",
                      color:
                        "#777",
                      fontSize:
                        "14px"
                    }}
                  >
                    Loading RANKD...
                  </div>

                )
                : selectedRanking ? (

                  <div
                    style={{
                      background:
                        "rgba(255,255,255,0.42)",
                      borderBottom:
                        "1px solid #D8D3CA"
                    }}
                  >

                    <div
                      style={{
                        padding:
                          "22px 24px 20px",
                        borderBottom:
                          "1px solid #D8D3CA"
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
                            "16px"
                        }}
                      >

                        <div>

                          <div
                            style={{
                              color:
                                "#FF6B35",
                              fontSize:
                                "12px",
                              fontWeight:
                                900,
                              letterSpacing:
                                "0.12em",
                              textTransform:
                                "uppercase",
                              marginBottom:
                                "8px"
                            }}
                          >
                            RANKD #
                            {
                              selectedHotspotIndex + 1
                            }
                          </div>


                          <h2
                            style={{
                              margin:
                                0,
                              fontSize:
                                "27px",
                              lineHeight:
                                1.04,
                              fontWeight:
                                900,
                              letterSpacing:
                                "-0.04em"
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
                            closePreview
                          }
                          aria-label="Close preview"
                          style={{
                            flex:
                              "0 0 auto",
                            width:
                              "30px",
                            height:
                              "30px",
                            border:
                              "1px solid #CFC9C0",
                            borderRadius:
                              "50%",
                            background:
                              "transparent",
                            color:
                              "#111",
                            cursor:
                              "pointer",
                            fontSize:
                              "18px",
                            lineHeight:
                              "28px"
                          }}
                        >
                          ×
                        </button>

                      </div>


                      {
                        selectedRanking.description && (
                          <p
                            style={{
                              margin:
                                "16px 0 0",
                              color:
                                "#625E59",
                              fontSize:
                                "14px",
                              lineHeight:
                                1.5
                            }}
                          >
                            {
                              selectedRanking.description
                            }
                          </p>
                        )
                      }

                    </div>


                    <div
                      style={{
                        padding:
                          "4px 24px 8px"
                      }}
                    >

                      {
                        selectedRanking.items
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
                                    "34px minmax(0, 1fr)",
                                  gap:
                                    "10px",
                                  alignItems:
                                    "baseline",
                                  padding:
                                    "13px 0",
                                  borderBottom:
                                    index <
                                    selectedRanking.items.length - 1
                                      ? "1px solid #E2DED7"
                                      : "0"
                                }}
                              >

                                <span
                                  style={{
                                    color:
                                      "#FF6B35",
                                    fontSize:
                                      "13px",
                                    fontWeight:
                                      900
                                  }}
                                >
                                  {
                                    String(
                                      item.position
                                    ).padStart(
                                      2,
                                      "0"
                                    )
                                  }
                                </span>


                                <span
                                  style={{
                                    fontSize:
                                      "15px",
                                    lineHeight:
                                      1.3,
                                    fontWeight:
                                      700
                                  }}
                                >
                                  {
                                    item.name
                                  }
                                </span>

                              </div>
                            )
                          )
                      }

                    </div>


                    <div
                      style={{
                        padding:
                          "18px 24px 24px"
                      }}
                    >

                      <a
                        href={
                          `/rank/${selectedRanking.id}`
                        }
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap:
                            "16px",
                          padding:
                            "15px 17px",
                          background:
                            "#111",
                          color:
                            "#F7F4EE",
                          textDecoration:
                            "none",
                          fontSize:
                            "13px",
                          fontWeight:
                            800,
                          letterSpacing:
                            "0.02em"
                        }}
                      >

                        <span>
                          Open full RANKD
                        </span>


                        <span
                          style={{
                            color:
                              "#FF6B35",
                            fontSize:
                              "18px"
                          }}
                        >
                          →
                        </span>

                      </a>

                    </div>

                  </div>

                )
                : (

                  <div
                    style={{
                      minHeight:
                        "430px",
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      justifyContent:
                        "center",
                      padding:
                        "48px 32px"
                    }}
                  >

                    <div
                      style={{
                        color:
                          "#FF6B35",
                        fontSize:
                          "72px",
                        lineHeight:
                          0.8,
                        fontWeight:
                          900,
                        marginBottom:
                          "32px"
                      }}
                    >
                      7
                    </div>


                    <div
                      style={{
                        fontSize:
                          "28px",
                        lineHeight:
                          1.05,
                        fontWeight:
                          900,
                        letterSpacing:
                          "-0.04em",
                        maxWidth:
                          "320px"
                      }}
                    >
                      Explore the seven RANKDs.
                    </div>

                  </div>

                )
              }

            </div>

          </aside>

        </div>

      </div>


      <style jsx>{`

        @media (max-width: 900px) {

          .photo-rankd-layout {
            grid-template-columns:
              minmax(0, 1fr) !important;
            gap:
              32px !important;
          }


          .photo-rankd-image-column {
            display:
              block !important;
          }


          .photo-rankd-image-wrap {
            width:
              100% !important;
          }


          .photo-rankd-image {
            width:
              100% !important;
            max-width:
              100% !important;
            height:
              auto !important;
          }


          .photo-rankd-preview {
            position:
              static !important;
          }

        }


        @media (max-width: 600px) {

          main {
            padding:
              28px 16px 56px !important;
          }


          .photo-rankd-layout {
            gap:
              24px !important;
          }


          .photo-rankd-image-wrap button {
            width:
              48px !important;
            height:
              48px !important;
            margin:
              -24px 0 0 -24px !important;
            font-size:
              30px !important;
          }

        }

      `}</style>

    </main>
  )
}