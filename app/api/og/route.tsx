import {
  ImageResponse
} from "next/og"

import fs from "node:fs/promises"

import path from "node:path"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  editionPhotoFilename
} from "@/utils/editionPhoto"

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


async function loadEditionPhoto(
  category: string
) {

  try {

    const file =
      await fs.readFile(
        path.join(
          process.cwd(),
          "public",
          "editions",
          editionPhotoFilename(category)
        )
      )

    return `data:image/jpeg;base64,${file.toString("base64")}`

  } catch {

    return null

  }

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

    const photoSrc =
      await loadEditionPhoto(category)

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
        label={theme.label}
        paper={theme.paper}
        accent={theme.accent}
        photoSrc={photoSrc}
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
        label="TOP 7"
        paper={PAPER}
        accent="#FF6B35"
        photoSrc={null}
      />,
      {
        width: 1200,
        height: 630
      }
    )

  }

}


function OgLogo({
  paper,
  accent
}: {
  paper: string
  accent: string
}) {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: 220,
        height: 118,
        borderRadius: 28,
        overflow: "hidden",
        backgroundColor: withAlpha(paper, 0.62)
      }}
    >

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 96,
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
          fontSize: 42,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "-0.065em",
          color: "#111111"
        }}
      >
        RANKD
      </div>

    </div>
  )

}


function OgMark({
  paper,
  children,
  size = "label",
  color = "#111111"
}: {
  paper: string
  children: string
  size?: "title" | "label"
  color?: string
}) {

  const isTitle =
    size === "title"

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        borderRadius: isTitle ? 28 : 999,
        padding: isTitle ? "18px 28px" : "9px 16px",
        backgroundColor: withAlpha(paper, 0.62),
        color
      }}
    >
      {children}
    </div>
  )

}


function OgCard({
  title,
  category,
  label,
  paper,
  accent,
  photoSrc
}: {
  title: string
  category: string
  label: string
  paper: string
  accent: string
  photoSrc: string | null
}) {

  const titleSize =
    title.length > 52
      ? 48
      : title.length > 34
        ? 60
        : 76

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: paper,
        color: "#111111",
        fontFamily: "Geist"
      }}
    >

      {photoSrc ? (
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "40px",
            display: "flex",
            fontSize: "620px",
            lineHeight: 0.8,
            fontWeight: 900,
            letterSpacing: "-0.16em",
            color: accent,
            opacity: 0.14
          }}
        >
          7
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundColor: withAlpha(paper, 0.16)
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `linear-gradient(to bottom, ${withAlpha(paper, 0.04)} 0%, ${withAlpha(paper, 0.08)} 28%, ${withAlpha(paper, 0.38)} 58%, ${withAlpha(paper, 0.88)} 82%, ${paper} 94%)`
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          border: "1px solid #111111"
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1200px",
          height: "630px",
          padding: "48px 56px 42px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >

          <OgLogo
            paper={paper}
            accent={accent}
          />

          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase"
            }}
          >
            <OgMark
              paper={paper}
              color={accent}
            >
              {label}
            </OgMark>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1040px"
          }}
        >

          <div
            style={{
              display: "flex",
              marginBottom: "16px",
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase"
            }}
          >
            <OgMark
              paper={paper}
              color={accent}
            >
              {category}
            </OgMark>
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: "1040px",
              fontSize: titleSize,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: "-0.055em",
              textTransform: "uppercase"
            }}
          >
            <OgMark
              paper={paper}
              size="title"
            >
              {title}
            </OgMark>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "22px",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "-0.035em"
            }}
          >
            <OgMark
              paper={paper}
              color={accent}
            >
              Would you rank it differently?
            </OgMark>
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
              letterSpacing: "-0.02em"
            }}
          >
            <OgMark
              paper={paper}
              color="#6B6B6B"
            >
              rankd.world
            </OgMark>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.08em"
            }}
          >
            <OgMark
              paper={paper}
              color="#111111"
            >
              THE WORLD'S TOP 7 EVERYTHING
            </OgMark>
          </div>

        </div>

      </div>

    </div>
  )

}
