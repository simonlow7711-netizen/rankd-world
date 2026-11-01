"use client"

import {
  useId
} from "react"

import {
  CategoryCover,
  CategoryTheme
} from "@/utils/categoryTheme"


type EditionChromeProps = {
  theme: CategoryTheme
}


function PatternTiles({
  cover,
  accent
}: {
  cover: CategoryCover
  accent: string
}) {

  if (cover === "menu") {
    return (
      <>
        <path d="M0 8 H64 M0 16 H64 M0 24 H64 M0 32 H64 M0 40 H64 M0 48 H64 M0 56 H64" stroke={accent} />
        <path d="M8 0 V64 M56 0 V64" stroke={accent} />
      </>
    )
  }

  if (cover === "frame") {
    return (
      <>
        <rect x="4" y="10" width="6" height="4" stroke={accent} />
        <rect x="4" y="28" width="6" height="4" stroke={accent} />
        <rect x="4" y="46" width="6" height="4" stroke={accent} />
        <rect x="54" y="10" width="6" height="4" stroke={accent} />
        <rect x="54" y="28" width="6" height="4" stroke={accent} />
        <rect x="54" y="46" width="6" height="4" stroke={accent} />
        <rect x="14" y="8" width="36" height="48" stroke={accent} />
      </>
    )
  }

  if (cover === "sideA") {
    return (
      <>
        <circle cx="32" cy="32" r="26" stroke={accent} />
        <circle cx="32" cy="32" r="18" stroke={accent} />
        <circle cx="32" cy="32" r="10" stroke={accent} />
        <circle cx="32" cy="32" r="2" stroke={accent} />
      </>
    )
  }

  if (cover === "match") {
    return (
      <>
        <path d="M0 32 H64 M32 0 V64" stroke={accent} />
        <circle cx="32" cy="32" r="10" stroke={accent} />
        <path d="M8 8 H24 V24 H8 Z M40 40 H56 V56 H40 Z" stroke={accent} />
      </>
    )
  }

  if (cover === "player") {
    return (
      <>
        <path d="M8 16 H16 V8 M48 8 V16 H56 M56 48 H48 V56 M16 56 V48 H8" stroke={accent} />
        <rect x="22" y="22" width="20" height="20" stroke={accent} />
      </>
    )
  }

  if (cover === "itinerary") {
    return (
      <>
        <path d="M16 0 V64" stroke={accent} strokeDasharray="3 5" />
        <circle cx="16" cy="12" r="2.5" stroke={accent} />
        <circle cx="16" cy="32" r="2.5" stroke={accent} />
        <circle cx="16" cy="52" r="2.5" stroke={accent} />
        <path d="M24 12 H52 M24 32 H44 M24 52 H48" stroke={accent} />
      </>
    )
  }

  if (cover === "system") {
    return (
      <>
        <circle cx="12" cy="12" r="2" stroke={accent} />
        <circle cx="52" cy="12" r="2" stroke={accent} />
        <circle cx="32" cy="32" r="2" stroke={accent} />
        <circle cx="12" cy="52" r="2" stroke={accent} />
        <circle cx="52" cy="52" r="2" stroke={accent} />
        <path d="M12 12 H52 M12 12 V52 M52 12 V52 M12 52 H52 M12 12 L32 32 L52 12 M12 52 L32 32 L52 52" stroke={accent} />
      </>
    )
  }

  if (cover === "ritual") {
    return (
      <>
        <circle cx="32" cy="32" r="20" stroke={accent} />
        <circle cx="32" cy="32" r="8" stroke={accent} />
        <path d="M32 4 V14 M32 50 V60 M4 32 H14 M50 32 H60" stroke={accent} />
      </>
    )
  }

  if (cover === "folio") {
    return (
      <>
        <path d="M32 0 V64" stroke={accent} />
        <path d="M10 12 H26 M10 20 H24 M10 28 H26 M38 12 H54 M38 20 H50 M38 28 H54" stroke={accent} />
        <rect x="6" y="6" width="52" height="52" stroke={accent} />
      </>
    )
  }

  if (cover === "catalogue") {
    return (
      <>
        <path d="M32 8 V20 M32 44 V56 M8 32 H20 M44 32 H56" stroke={accent} />
        <rect x="20" y="20" width="24" height="24" stroke={accent} />
      </>
    )
  }

  if (cover === "collection") {
    return (
      <>
        <path d="M16 0 V64 M32 0 V64 M48 0 V64" stroke={accent} />
        <path d="M0 16 H64" stroke={accent} />
      </>
    )
  }

  if (cover === "vanity") {
    return (
      <>
        <ellipse cx="32" cy="30" rx="16" ry="20" stroke={accent} />
        <circle cx="12" cy="52" r="1.6" stroke={accent} />
        <circle cx="24" cy="56" r="1.2" stroke={accent} />
        <circle cx="40" cy="54" r="1.8" stroke={accent} />
        <circle cx="52" cy="50" r="1.3" stroke={accent} />
      </>
    )
  }

  if (cover === "energy") {
    return (
      <>
        <path d="M0 48 L16 32 L28 40 L44 16 L64 28" stroke={accent} />
        <path d="M8 56 V40 M20 56 V28 M32 56 V24 M44 56 V12 M56 56 V20" stroke={accent} />
      </>
    )
  }

  if (cover === "briefing") {
    return (
      <>
        <path d="M8 10 H56 M8 18 H56 M8 26 H48 M8 34 H52 M8 42 H44 M8 50 H56" stroke={accent} />
        <path d="M8 4 H24" stroke={accent} />
      </>
    )
  }

  if (cover === "journal") {
    return (
      <>
        <path d="M0 16 H64 M0 32 H64 M0 48 H64 M16 0 V64 M32 0 V64 M48 0 V64" stroke={accent} />
      </>
    )
  }

  if (cover === "archive") {
    return (
      <>
        <rect x="14" y="16" width="36" height="28" stroke={accent} />
        <path d="M18 22 H46 M18 28 H40 M18 34 H42" stroke={accent} />
        <circle cx="10" cy="10" r="1.4" stroke={accent} />
        <circle cx="54" cy="50" r="1.4" stroke={accent} />
      </>
    )
  }

  if (cover === "field") {
    return (
      <>
        <circle cx="22" cy="22" r="8" stroke={accent} />
        <circle cx="44" cy="40" r="6" stroke={accent} />
        <path d="M22 14 C18 8 12 10 16 16 M44 34 C40 28 50 26 48 34" stroke={accent} />
        <path d="M0 56 C16 48 32 60 48 52 56 48 64 52 64 52" stroke={accent} />
      </>
    )
  }

  if (cover === "road") {
    return (
      <>
        <path d="M0 20 H64 M0 44 H64" stroke={accent} />
        <path d="M8 32 H20 M28 32 H40 M48 32 H60" stroke={accent} />
      </>
    )
  }

  if (cover === "living") {
    return (
      <>
        <rect x="8" y="8" width="48" height="48" stroke={accent} />
        <path d="M8 32 H56 M32 8 V56" stroke={accent} />
        <rect x="12" y="12" width="16" height="16" stroke={accent} />
      </>
    )
  }

  return (
    <>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fill="none"
        stroke={accent}
        fontSize="28"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        7
      </text>
    </>
  )

}


function Watermark({
  cover,
  accent,
  index
}: {
  cover: CategoryCover
  accent: string
  index: string
}) {

  if (cover === "catalogue" || cover === "top7") {
    return (
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        fontSize="220"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        {cover === "top7" ? "7" : index}
      </text>
    )
  }

  if (cover === "sideA" || cover === "ritual") {
    return (
      <>
        <circle cx="50%" cy="50%" r="28%" fill="none" stroke={accent} />
        <circle cx="50%" cy="50%" r="18%" fill="none" stroke={accent} />
      </>
    )
  }

  if (cover === "vanity") {
    return (
      <ellipse
        cx="50%"
        cy="50%"
        rx="18%"
        ry="26%"
        fill="none"
        stroke={accent}
      />
    )
  }

  return null

}


export default function EditionChrome({
  theme
}: EditionChromeProps) {

  const uid =
    useId().replace(
      /:/g,
      ""
    )

  const patternId =
    `edition-pattern-${theme.cover}-${uid}`

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
      aria-hidden="true"
    >

      <svg
        className="
          absolute
          inset-0
          h-full
          w-full
        "
        xmlns="http://www.w3.org/2000/svg"
      >

        <defs>
          <pattern
            id={patternId}
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              strokeWidth="1"
              opacity="0.22"
            >
              <PatternTiles
                cover={
                  theme.cover
                }
                accent={
                  theme.accent
                }
              />
            </g>
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          opacity="0.45"
        />

        <g
          fill="none"
          opacity="0.12"
          strokeWidth="1"
        >
          <Watermark
            cover={
              theme.cover
            }
            accent={
              theme.accent
            }
            index={
              theme.index
            }
          />
        </g>

      </svg>

    </div>
  )

}
