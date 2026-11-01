import {
  ReactNode
} from "react"


function MarkSvg({
  children
}: {
  children: ReactNode
}) {

  return (
    <svg
      viewBox="0 0 80 240"
      width="80"
      height="240"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%"
      }}
    >
      {children}
    </svg>
  )

}


export default function PhotoRankdMark({
  ink = "#111111",
  accent = "#FF6B35"
}: {
  ink?: string
  accent?: string
}) {

  const frames = [
    22,
    50,
    78,
    106,
    134,
    162,
    190
  ]

  return (
    <MarkSvg>
      <rect
        x="16"
        y="12"
        width="48"
        height="216"
        fill="none"
        stroke={ink}
        strokeWidth="1.5"
      />

      {
        frames.map(
          (y, index) => (
            <g key={y}>
              <rect
                x="24"
                y={y}
                width="32"
                height="22"
                fill="none"
                stroke={ink}
                strokeWidth="1.5"
              />
              <rect
                x="18"
                y={y + 6}
                width="4"
                height="10"
                fill={
                  index === 0
                    ? accent
                    : ink
                }
              />
              <rect
                x="58"
                y={y + 6}
                width="4"
                height="10"
                fill={
                  index === 0
                    ? accent
                    : ink
                }
              />
              {
                index === 0 && (
                  <path
                    d="M30 26 H48 V29.5 H41.5 L35.5 40 H31.5 L38 29.5 H30 Z"
                    fill={accent}
                  />
                )
              }
            </g>
          )
        )
      }
    </MarkSvg>
  )

}
