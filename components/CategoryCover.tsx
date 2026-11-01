import {
  CategoryTheme
} from "@/utils/categoryTheme"


type CategoryCoverProps = {
  theme: CategoryTheme
  title: string
  description?: string
  kicker?: string
  footer?: string
  size?: "tile" | "index" | "masthead"
}


function MenuRules({
  accent
}: {
  accent: string
}) {

  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-xs
        flex-col
        gap-2
      "
      aria-hidden="true"
    >
      {
        ["01", "02", "03", "04", "05", "06", "07"].map(
          (course, index) => (
            <div
              key={course}
              className="
                flex
                w-full
                items-center
                gap-3
              "
            >
              <span
                className="
                  w-6
                  text-left
                  text-[9px]
                  font-black
                  tracking-[0.14em]
                "
                style={{
                  color:
                    index === 0
                      ? accent
                      : "rgba(17,17,17,0.45)"
                }}
              >
                {course}
              </span>
              <span
                className="
                  h-px
                  flex-1
                "
                style={{
                  backgroundColor:
                    index === 0
                      ? accent
                      : "rgba(17,17,17,0.45)"
                }}
              />
            </div>
          )
        )
      }
    </div>
  )

}


function EnergyBars({
  accent
}: {
  accent: string
}) {

  return (
    <div
      className="
        mx-auto
        flex
        h-8
        items-end
        justify-center
        gap-1.5
      "
      aria-hidden="true"
    >
      {
        [8, 14, 10, 20, 16, 24, 32].map(
          (height, index) => (
            <span
              key={index}
              className="
                w-1.5
                border
              "
              style={{
                height:
                  `${height}px`,
                borderColor:
                  index === 6
                    ? accent
                    : "#111111"
              }}
            />
          )
        )
      }
    </div>
  )

}


function RoadLines({
  accent
}: {
  accent: string
}) {

  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-[220px]
        flex-col
        gap-1
      "
      aria-hidden="true"
    >
      {
        [100, 78, 56, 34].map(
          (width, index) => (
            <span
              key={width}
              className="
                mx-auto
                block
                h-px
              "
              style={{
                width:
                  `${width}%`,
                backgroundColor:
                  index === 0
                    ? accent
                    : "rgba(17,17,17,0.28)"
              }}
            />
          )
        )
      }
    </div>
  )

}


function CoverMark({
  cover,
  accent,
  index,
  size
}: {
  cover: CategoryTheme["cover"]
  accent: string
  index: string
  size: "tile" | "index" | "masthead"
}) {

  const box =
    size === "masthead"
      ? "h-[148px] w-[148px]"
      : size === "index"
        ? "h-[92px] w-[92px]"
        : "h-[76px] w-[76px]"

  if (
    cover === "menu"
  ) {
    return <MenuRules accent={accent} />
  }

  if (
    cover === "frame"
  ) {
    return null
  }

  if (
    cover === "energy"
  ) {
    return <EnergyBars accent={accent} />
  }

  if (
    cover === "road"
  ) {
    return <RoadLines accent={accent} />
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className={`
        mx-auto
        ${box}
      `}
      fill="none"
      aria-hidden="true"
    >
      {
        cover === "frame" && (
          <>
            <rect x="8" y="14" width="104" height="92" stroke="#111111" />
            <rect x="14" y="20" width="92" height="80" stroke={accent} />
            <path d="M8 28 H16 M104 28 H112 M8 92 H16 M104 92 H112" stroke="#111111" />
          </>
        )
      }
      {
        cover === "sideA" && (
          <>
            <circle cx="60" cy="60" r="46" stroke="#111111" />
            <circle cx="60" cy="60" r="32" stroke={accent} />
            <circle cx="60" cy="60" r="16" stroke="#111111" />
            <circle cx="60" cy="60" r="3" fill="#111111" />
          </>
        )
      }
      {
        cover === "match" && (
          <>
            <rect x="18" y="18" width="84" height="84" stroke="#111111" />
            <path d="M18 60 H102 M60 18 V102" stroke="#111111" />
            <circle cx="60" cy="60" r="12" stroke={accent} />
          </>
        )
      }
      {
        cover === "player" && (
          <>
            <path d="M16 32 V16 H32 M88 16 H104 V32 M104 88 V104 H88 M32 104 H16 V88" stroke="#111111" />
            <rect x="40" y="40" width="40" height="40" stroke={accent} />
          </>
        )
      }
      {
        cover === "itinerary" && (
          <>
            <path d="M60 10 V110" stroke="#111111" strokeDasharray="3 5" />
            {
              [18, 36, 54, 72, 90, 108].map(
                y => (
                  <circle
                    key={y}
                    cx="60"
                    cy={y}
                    r="3.5"
                    stroke={
                      y === 18
                        ? accent
                        : "#111111"
                    }
                  />
                )
              )
            }
          </>
        )
      }
      {
        cover === "system" && (
          <>
            {
              [20, 50, 80].map(
                y => (
                  [20, 50, 80].map(
                    x => (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="20"
                        height="20"
                        stroke={
                          x === 50 && y === 50
                            ? accent
                            : "#111111"
                        }
                      />
                    )
                  )
                )
              )
            }
          </>
        )
      }
      {
        cover === "ritual" && (
          <>
            <circle cx="60" cy="60" r="48" stroke="#111111" />
            <circle cx="60" cy="60" r="34" stroke={accent} />
            <path d="M60 12 V26 M60 94 V108 M12 60 H26 M94 60 H108" stroke="#111111" />
          </>
        )
      }
      {
        cover === "folio" && (
          <>
            <rect x="14" y="16" width="92" height="88" stroke="#111111" />
            <path d="M60 16 V104" stroke={accent} />
            <path d="M24 30 H50 M24 40 H46 M70 30 H96 M70 40 H90" stroke="#111111" />
          </>
        )
      }
      {
        cover === "catalogue" && (
          <>
            <rect x="22" y="18" width="76" height="84" stroke="#111111" />
            <path d="M22 36 H98" stroke={accent} />
            <path d="M34 50 H86 M34 62 H78 M34 74 H70" stroke="#111111" />
          </>
        )
      }
      {
        cover === "collection" && (
          <>
            <path d="M40 16 V104 M80 16 V104" stroke="#111111" />
            <path d="M28 28 H92" stroke={accent} />
            <path d="M32 104 H88" stroke="#111111" />
          </>
        )
      }
      {
        cover === "vanity" && (
          <>
            <ellipse cx="60" cy="58" rx="34" ry="42" stroke="#111111" />
            <ellipse cx="60" cy="58" rx="24" ry="32" stroke={accent} />
            <path d="M48 102 H72" stroke="#111111" />
          </>
        )
      }
      {
        cover === "briefing" && (
          <>
            <rect x="16" y="20" width="88" height="80" stroke="#111111" />
            <path d="M16 38 H104" stroke={accent} />
            <path d="M28 52 H92 M28 64 H80 M28 76 H70" stroke="#111111" />
          </>
        )
      }
      {
        cover === "journal" && (
          <>
            <rect x="24" y="12" width="72" height="96" stroke="#111111" />
            <path d="M36 12 V108" stroke={accent} />
            <path d="M44 32 H84 M44 44 H80 M44 56 H76" stroke="#111111" />
          </>
        )
      }
      {
        cover === "archive" && (
          <>
            <rect x="18" y="28" width="84" height="64" stroke="#111111" />
            <rect x="30" y="40" width="60" height="40" stroke={accent} />
            <path d="M18 20 H48" stroke="#111111" />
          </>
        )
      }
      {
        cover === "field" && (
          <>
            <rect x="16" y="16" width="88" height="88" stroke="#111111" />
            <rect x="24" y="24" width="72" height="72" stroke="#111111" />
            <circle cx="60" cy="60" r="18" stroke={accent} />
          </>
        )
      }
      {
        cover === "living" && (
          <>
            <rect x="16" y="20" width="88" height="80" stroke="#111111" />
            <path d="M16 60 H104 M60 20 V100" stroke="#111111" />
            <rect x="24" y="28" width="28" height="24" stroke={accent} />
          </>
        )
      }
      {
        cover === "top7" && (
          <text
            x="60"
            y="88"
            textAnchor="middle"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            fontSize="84"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            {index === "20" ? "7" : index}
          </text>
        )
      }
    </svg>
  )

}


export default function CategoryCover({
  theme,
  title,
  description,
  kicker,
  footer,
  size = "tile"
}: CategoryCoverProps) {

  const isMasthead =
    size === "masthead"

  const isIndex =
    size === "index"

  const titleSize =
    isMasthead
      ? "text-5xl md:text-7xl"
      : isIndex
        ? "text-3xl md:text-[2.15rem]"
        : "text-[1.65rem] md:text-2xl"

  const markFirst =
    theme.cover === "frame" ||
    theme.cover === "sideA" ||
    theme.cover === "system" ||
    theme.cover === "ritual" ||
    theme.cover === "vanity" ||
    theme.cover === "field" ||
    theme.cover === "top7"

  const titleNode = (
    <h3
      className={`
        mx-auto
        w-full
        max-w-[16ch]
        text-center
        font-black
        ${theme.titleClass}
        ${titleSize}
      `}
    >
      {title}
    </h3>
  )

  const descriptionNode =
    description
      ? (
          <p
            className={`
              mx-auto
              mt-4
              max-w-md
              text-center
              leading-relaxed
              text-black/50
              ${
                isMasthead
                  ? "text-lg md:text-xl"
                  : "line-clamp-2 text-sm"
              }
            `}
          >
            {description}
          </p>
        )
      : null

  return (
    <div
      className={`
        relative
        z-10
        flex
        h-full
        w-full
        flex-col
        items-center
        text-center
        ${
          isMasthead
            ? "justify-center"
            : ""
        }
      `}
    >

      {
        theme.cover === "frame" && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-3
              rounded-[18px]
              border
              md:inset-4
            "
            style={{
              borderColor:
                "rgba(17,17,17,0.35)"
            }}
          />
        )
      }

      {
        theme.cover === "folio" && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-1/2
              w-px
              bg-black/15
            "
          />
        )
      }

      {
        theme.cover === "player" && (
          <>
            <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-black" />
            <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-black" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b border-l border-black" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b border-r border-black" />
          </>
        )
      }

      <div
        className="
          flex
          w-full
          flex-col
          items-center
        "
      >

        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.28em]
          "
          style={{
            color:
              theme.accent
          }}
        >
          {
            kicker ??
            `${theme.index} · ${theme.label}`
          }
        </p>

        {
          theme.cover === "briefing" && (
            <div
              className="
                mx-auto
                mt-4
                w-full
                max-w-xs
                border-y
                border-black/20
                py-2
                text-[9px]
                font-black
                uppercase
                tracking-[0.18em]
                text-black/40
              "
            >
              <p>Edition {theme.index}</p>
              <p className="mt-1">Subject / {title}</p>
            </div>
          )
        }

        {
          theme.cover === "archive" && (
            <span
              className="
                mt-4
                inline-flex
                items-center
                justify-center
                border
                px-3
                py-1
                text-[10px]
                font-black
                uppercase
                tracking-[0.22em]
              "
              style={{
                borderColor:
                  theme.accent,
                color:
                  theme.accent
              }}
            >
              File {theme.index}
            </span>
          )
        }

        {
          markFirst && (
            <div
              className={`
                ${
                  isMasthead
                    ? "mt-7"
                    : "mt-5"
                }
              `}
            >
              <CoverMark
                cover={
                  theme.cover
                }
                accent={
                  theme.accent
                }
                index={
                  theme.index
                }
                size={
                  size
                }
              />
            </div>
          )
        }

        <div
          className={`
            ${
              markFirst
                ? isMasthead
                  ? "mt-7"
                  : "mt-5"
                : isMasthead
                  ? "mt-6"
                  : "mt-8"
            }
          `}
        >
          {
            isMasthead
              ? (
                  <h1
                    className={`
                      mx-auto
                      w-full
                      max-w-[16ch]
                      text-center
                      font-black
                      ${theme.titleClass}
                      ${titleSize}
                    `}
                  >
                    {title}
                  </h1>
                )
              : titleNode
          }
        </div>

        {
          !markFirst && (
            <div className="mt-5">
              <CoverMark
                cover={
                  theme.cover
                }
                accent={
                  theme.accent
                }
                index={
                  theme.index
                }
                size={
                  size
                }
              />
            </div>
          )
        }

        {descriptionNode}

      </div>

      {
        footer && (
          <div
            className={`
              flex
              w-full
              items-center
              justify-center
              gap-3
              border-t
              border-black/10
              ${
                isMasthead
                  ? "mt-8 pt-6"
                  : "mt-auto pt-4"
              }
            `}
          >
            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-black/40
                transition
                group-hover:text-black
              "
            >
              {footer}
            </span>
            {
              !isMasthead && (
                <span
                  className="
                    text-lg
                    leading-none
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >
                  →
                </span>
              )
            }
          </div>
        )
      }

    </div>
  )

}
