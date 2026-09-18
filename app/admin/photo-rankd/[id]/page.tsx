"use client"

import {
  useEffect,
  useState
} from "react"

import Link from "next/link"

import {
  useParams
} from "next/navigation"

import {
  supabase
} from "@/utils/supabase"


type PhotoRankdHotspot = {
  id: number
  rankingId: string
  x: number
  y: number
}


type PhotoRankd = {
  id: string
  title: string
  description: string | null
  image_url: string
  hotspots: PhotoRankdHotspot[]
}


export default function PhotoRankdPage() {
  const params =
    useParams<{
      id: string
    }>()

  const [
    experience,
    setExperience
  ] = useState<PhotoRankd | null>(
    null
  )

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    notFound,
    setNotFound
  ] = useState(false)


  useEffect(() => {
    async function loadExperience() {
      if (!params.id) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const {
        data,
        error
      } = await supabase
        .from("photo_rankds")
        .select(
          `
            id,
            title,
            description,
            image_url,
            hotspots
          `
        )
        .eq(
          "id",
          params.id
        )
        .eq(
          "published",
          true
        )
        .single()

      if (
        error ||
        !data
      ) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setExperience({
        id: data.id,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        hotspots:
          Array.isArray(data.hotspots)
            ? data.hotspots
            : []
      })

      setLoading(false)
    }

    loadExperience()
  }, [params.id])


  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F7F4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, sans-serif"
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


  if (
    notFound ||
    !experience
  ) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F7F4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1,
              color: "#FF6B35",
              marginBottom: "18px"
            }}
          >
            7
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#111"
            }}
          >
            Photo RANKD not found
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#666"
            }}
          >
            This Photo RANKD may not have been published.
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "999px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            Back to RANKD
          </Link>
        </div>
      </main>
    )
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F4EE",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            marginBottom: "22px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                fontSize: "34px",
                fontWeight: 900,
                lineHeight: 1,
                color: "#FF6B35"
              }}
            >
              7
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#111"
              }}
            >
              RANKD
            </div>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5vw, 48px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontWeight: 900,
              color: "#111"
            }}
          >
            {experience.title}
          </h1>

          {experience.description && (
            <p
              style={{
                maxWidth: "720px",
                marginTop: "12px",
                marginBottom: 0,
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#555"
              }}
            >
              {experience.description}
            </p>
          )}
        </header>


        <section
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            borderRadius: "24px",
            background: "#111",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.16)"
          }}
        >
          <img
            src={experience.image_url}
            alt={experience.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />

          {experience.hotspots.map(
            hotspot => (
              <Link
                key={hotspot.id}
                href={`/rank/${hotspot.rankingId}`}
                aria-label={`Open RANKD ${hotspot.id}`}
                style={{
                  position: "absolute",
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "58px",
                  height: "58px",
                  borderRadius: "50%",
                  background: "#FF6B35",
                  color: "#111",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "27px",
                  fontWeight: 900,
                  border: "3px solid #111",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.28)",
                  zIndex: 5
                }}
              >
                7
              </Link>
            )
          )}
        </section>


        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "18px",
            color: "#777",
            fontSize: "13px"
          }}
        >
          Tap any 7 to explore the RANKD.
        </div>
      </div>
    </main>
  )
}