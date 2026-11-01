import {
  ImageResponse
} from "next/og"

import fs from "node:fs/promises"

import path from "node:path"

import CategoryMark from "@/components/CategoryMark"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"


export const runtime =
  "nodejs"


const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const PAPER =
  "#F7F4EE"


type RankingRow = {
  id: string
  title: string
  category: string | null
}


async function getFont(
  filename: string
) {

  return fs.readFile(
    path.join(
      process.cwd(),
      "node_modules",
      "geist",
      "dist",
      "fonts",
      "geist-sans",
      filename
    )
  )

}


function withAlpha(
  hex: string,
  alpha: number
) {

  const value =
    hex.replace("#", "").slice(0, 6)

  const r =
    Number.parseInt(value.slice(0, 2), 16)

  const g =
    Number.parseInt(value.slice(2, 4), 16)

  const b =
    Number.parseInt(value.slice(4, 6), 16)

  return `rgba(${r},${g},${b},${alpha})`

}


async function loadRanking(
  id: string
) {

  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY
  ) {
    return null
  }

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/rankings` +
      `?select=id,title,category` +
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

  if (!response.ok) {
    return null
  }

  const rankings =
    await response.json() as RankingRow[]

  return rankings[0] ?? null

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
      searchParams.get("id")

    const ranking =
      id
        ? await loadRanking(id)
        : null

    const category =
      ranking?.category ||
      searchParams.get("category") ||
      "General"

    const title =
      ranking?.title
        ? formatRankingTitle(ranking.title)
        : searchParams.get("title") ||
          "The World's Top 7 Everything"

    const theme =
      getCategoryTheme(category)

    const [
      geistRegular,
      geistBold,
      geistBlack
    ] =
      await Promise.all([
        getFont("Geist-Regular.ttf"),
        getFont("Geist-Bold.ttf"),
        getFont("Geist-Black.ttf")
      ])

    return new ImageResponse(
      <OgCard
        title={title}
        category={theme.name}
        paper={theme.paper}
        accent={theme.accent}
      />,
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800"
        },
        fonts: [
          {
            name: "Geist",
            data: geistRegular,
            weight: 400,
            style: "normal"
          },
          {
            name: "Geist",
            data: geistBold,
            weight: 700,
            style: "normal"
          },
          {
            name: "Geist",
            data: geistBlack,
            weight: 900,
            style: "normal"
          }
        ]
      }
    )

  } catch (error) {

    console.error(
      "RANKD OG IMAGE ERROR",
      error
    )

    return new ImageResponse(
      <OgCard
        title="RANKD"
        category="General"
        paper={PAPER}
        accent="#FF6B35"
      />,
      {
        width: 1200,
        height: 630
      }
    )

  }

}


function OgCard({
  title,
  category,
  paper,
  accent
}: {
  title: string
  category: string
  paper: string
  accent: string
}) {

  const titleSize =
    title.length > 52
      ? 48
      : title.length > 34
        ? 60
        : 72

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        overflow: "hidden",
        backgroundColor: paper,
        color: "#111111",
        fontFamily: "Geist",
        border: "1px solid #111111"
      }}
    >

      <div
        style={{
          display: "flex",
          width: "188px",
          height: "630px",
          borderRight: "1px solid #111111",
          backgroundColor: paper
        }}
      >
        <CategoryMark
          category={category}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          height: "630px",
          padding: "48px 52px 42px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >

          <div
            style={{
              display: "flex",
              position: "relative",
              alignItems: "center",
              height: 72
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                fontSize: 92,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.16em",
                color: withAlpha(accent, 0.18)
              }}
            >
              7
            </div>
            <div
              style={{
                display: "flex",
                position: "relative",
                fontSize: 40,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.065em",
                color: "#111111"
              }}
            >
              RANKD
            </div>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px"
          }}
        >

          <div
            style={{
              display: "flex",
              marginBottom: "14px",
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accent
            }}
          >
            {category}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: "-0.055em"
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "20px",
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: accent
            }}
          >
            Would you rank it differently?
          </div>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between"
          }}
        >

          <div
            style={{
              display: "flex",
              fontSize: "21px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#6B6B6B"
            }}
          >
            rankd.world
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.08em"
            }}
          >
            THE WORLD'S TOP 7 EVERYTHING
          </div>

        </div>

      </div>

    </div>
  )

}
