import {
  ReactElement,
  ReactNode
} from "react"

import {
  RankingCategory
} from "@/utils/categories"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type MarkProps = {
  ink: string
  accent: string
  paper: string
}


const vb = "0 0 80 240"


function MarkSvg({
  children
}: {
  children: ReactNode
}) {

  return (
    <svg
      viewBox={vb}
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


function GeometricSeven({
  x,
  y,
  height,
  fill
}: {
  x: number
  y: number
  height: number
  fill: string
}) {

  const width =
    height * 0.58

  const bar =
    height * 0.13

  return (
    <g fill={fill}>
      <rect
        x={x}
        y={y}
        width={width}
        height={bar}
      />
      <polygon
        points={[
          `${x + width},${y}`,
          `${x + width},${y + bar}`,
          `${x + width * 0.36},${y + height}`,
          `${x + width * 0.12},${y + height}`
        ].join(" ")}
      />
    </g>
  )

}


function FoodMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <circle
        cx="-8"
        cy="168"
        r="54"
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      {
        [18, 26, 34, 42, 50, 58, 66].map(
          (x, index) => (
            <rect
              key={x}
              x={x}
              y={index === 0 ? 28 : 52}
              width="5"
              height={index === 0 ? 132 : 108}
              fill={index === 0 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function FilmMark({
  ink,
  accent,
  paper
}: MarkProps) {

  const holes =
    [16, 48, 80, 112, 144, 176, 208]

  return (
    <MarkSvg>
      <rect
        x="0"
        y="0"
        width="16"
        height="240"
        fill={ink}
      />
      <rect
        x="64"
        y="0"
        width="16"
        height="240"
        fill={ink}
      />
      {
        holes.map(
          (y, index) => (
            <rect
              key={`l-${y}`}
              x="3"
              y={y}
              width="10"
              height="10"
              fill={index === 0 ? accent : paper}
            />
          )
        )
      }
      {
        holes.map(
          y => (
            <rect
              key={`r-${y}`}
              x="67"
              y={y}
              width="10"
              height="10"
              fill={paper}
            />
          )
        )
      }
      <rect
        x="22"
        y="48"
        width="36"
        height="144"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <GeometricSeven
        x={28}
        y={86}
        height={72}
        fill={accent}
      />
    </MarkSvg>
  )

}


function MusicMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      {
        [86, 68, 50, 34, 20, 10].map(
          (radius, index) => (
            <circle
              key={radius}
              cx="36"
              cy="128"
              r={radius}
              fill="none"
              stroke={ink}
              strokeWidth={index === 0 ? 7 : 3}
            />
          )
        )
      }
      <circle
        cx="42"
        cy="120"
        r="7"
        fill={accent}
      />
    </MarkSvg>
  )

}


function SportMark({
  ink,
  accent
}: MarkProps) {

  const lanes =
    [10, 21, 32, 43, 54, 65, 76]

  const runnerY =
    [172, 154, 136, 118, 100, 82, 28]

  return (
    <MarkSvg>
      <line
        x1="4"
        y1="196"
        x2="76"
        y2="196"
        stroke={ink}
        strokeWidth="3.5"
      />
      {
        lanes.map(
          (x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1="12"
                x2={x}
                y2="228"
                stroke={ink}
                strokeWidth="2.5"
              />
              <rect
                x={x - 4}
                y={runnerY[index]}
                width="8"
                height={index === 6 ? 18 : 11}
                fill={index === 6 ? accent : ink}
              />
            </g>
          )
        )
      }
    </MarkSvg>
  )

}


function GamingMark({
  ink,
  accent
}: MarkProps) {

  const pips = [
    [22, 70],
    [50, 70],
    [22, 112],
    [36, 128],
    [50, 144],
    [22, 186],
    [50, 186]
  ]

  return (
    <MarkSvg>
      <rect
        x="10"
        y="48"
        width="60"
        height="160"
        rx="10"
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      {
        pips.map(
          ([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={index === 3 ? 7 : 5.5}
              fill={index === 3 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function TravelMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <circle
        cx="40"
        cy="120"
        r="70"
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      <ellipse
        cx="40"
        cy="120"
        rx="28"
        ry="70"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <line
        x1="-20"
        y1="120"
        x2="100"
        y2="120"
        stroke={ink}
        strokeWidth="3"
      />
      {
        [-8, 8, 24, 40, 56, 72, 88].map(
          (x, index) => (
            <line
              key={x}
              x1={x}
              y1={index === 3 ? 96 : 110}
              x2={x}
              y2={index === 3 ? 144 : 130}
              stroke={index === 3 ? accent : ink}
              strokeWidth={index === 3 ? 5 : 2.5}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function TechnologyMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      {
        [36, 60, 84, 108, 132, 156, 180].map(
          (y, index) => (
            <g key={y}>
              <line
                x1="-4"
                y1={y}
                x2="84"
                y2={y}
                stroke={index === 6 ? accent : ink}
                strokeWidth={index === 6 ? 5 : 3}
              />
              <rect
                x={index === 6 ? 48 : 18 + (index % 3) * 16}
                y={y - 6}
                width="12"
                height="12"
                fill={index === 6 ? accent : ink}
              />
            </g>
          )
        )
      }
    </MarkSvg>
  )

}


function LifestyleMark({
  ink,
  accent
}: MarkProps) {

  const cx = 40
  const cy = 120
  const radius = 34

  return (
    <MarkSvg>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      {
        [0, 1, 2, 3, 4, 5, 6].map(
          index => {

            const angle =
              (Math.PI * 2 * index) / 7 -
              Math.PI / 2

            const inner =
              index === 0
                ? radius - 24
                : radius - 14

            return (
              <line
                key={index}
                x1={cx + Math.cos(angle) * inner}
                y1={cy + Math.sin(angle) * inner}
                x2={cx + Math.cos(angle) * (radius - 2)}
                y2={cy + Math.sin(angle) * (radius - 2)}
                stroke={index === 0 ? accent : ink}
                strokeWidth={index === 0 ? 5 : 3}
              />
            )

          }
        )
      }
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - 34}
        stroke={accent}
        strokeWidth="4"
      />
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill={ink}
      />
    </MarkSvg>
  )

}


function BooksMark({
  ink,
  accent
}: MarkProps) {

  const lines =
    [40, 64, 88, 112, 136, 160, 184]

  return (
    <MarkSvg>
      <rect
        x="8"
        y="24"
        width="8"
        height="192"
        fill={ink}
      />
      {
        lines.map(
          (y, index) => (
            <rect
              key={y}
              x="22"
              y={y}
              width={index === 6 ? 28 : 50}
              height={index === 6 ? 8 : 5}
              fill={index === 6 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function ArtMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <rect x="8" y="16" width="64" height="28" fill={ink} />
      <rect x="8" y="50" width="28" height="48" fill={ink} />
      <rect x="42" y="50" width="30" height="48" fill="none" stroke={ink} strokeWidth="3" />
      <rect x="8" y="104" width="64" height="20" fill={ink} />
      <rect x="8" y="130" width="18" height="72" fill={ink} />
      <rect x="32" y="130" width="40" height="72" fill={accent} />
      <rect x="8" y="208" width="64" height="16" fill={ink} />
    </MarkSvg>
  )

}


function FashionMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      {
        [28, 56, 84, 112, 140, 168, 196].map(
          (y, index) => (
            <g
              key={y}
              stroke={index === 3 ? accent : ink}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="square"
            >
              <path
                d={`M36 ${y + 2} H44 V${y + 8} H36 Z`}
                fill={index === 3 ? accent : ink}
                stroke="none"
              />
              <path
                d={`M16 ${y + 16} C16 ${y + 6}, 64 ${y + 6}, 64 ${y + 16}`}
              />
              {
                index === 3
                  ? (
                    <line
                      x1="16"
                      y1={y + 16}
                      x2="28"
                      y2={y + 16}
                    />
                  )
                  : (
                    <line
                      x1="16"
                      y1={y + 16}
                      x2="64"
                      y2={y + 16}
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


function BeautyMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      {
        [36, 62, 88, 114, 140, 166, 192].map(
          (y, index) => (
            <rect
              key={y}
              x={index === 3 ? 8 : 18}
              y={y}
              width={index === 3 ? 64 : 44}
              height={index === 3 ? 10 : 6}
              transform={`rotate(-18 ${40} ${y})`}
              fill={index === 3 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function HealthMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <polyline
        points="40,8 40,40 18,52 62,76 18,100 62,124 18,148 40,160 40,232"
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      <polyline
        points="40,148 62,124 40,160"
        fill="none"
        stroke={accent}
        strokeWidth="5"
      />
    </MarkSvg>
  )

}


function BusinessMark({
  ink,
  accent
}: MarkProps) {

  const heights =
    [48, 64, 80, 96, 112, 128, 176]

  return (
    <MarkSvg>
      {
        heights.map(
          (height, index) => (
            <rect
              key={height}
              x={10 + index * 9}
              y={220 - height}
              width="7"
              height={height}
              fill={index === 6 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function ScienceMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <ellipse
        cx="40"
        cy="120"
        rx="18"
        ry="88"
        fill="none"
        stroke={ink}
        strokeWidth="3"
        transform="rotate(-32 40 120)"
      />
      <ellipse
        cx="40"
        cy="120"
        rx="18"
        ry="88"
        fill="none"
        stroke={ink}
        strokeWidth="3"
        transform="rotate(32 40 120)"
      />
      <ellipse
        cx="40"
        cy="120"
        rx="36"
        ry="22"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <circle
        cx="40"
        cy="120"
        r="8"
        fill={ink}
      />
      {
        [
          [40, 36],
          [18, 64],
          [62, 64],
          [12, 120],
          [68, 120],
          [22, 176],
          [58, 176]
        ].map(
          ([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={index === 0 ? 7 : 4.5}
              fill={index === 0 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function HistoryMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <line
        x1="40"
        y1="12"
        x2="40"
        y2="228"
        stroke={ink}
        strokeWidth="3"
      />
      {
        [28, 58, 88, 118, 148, 178, 208].map(
          (y, index) => (
            <g key={y}>
              <line
                x1={index === 3 ? 18 : 28}
                y1={y}
                x2={index === 3 ? 62 : 52}
                y2={y}
                stroke={index === 3 ? accent : ink}
                strokeWidth={index === 3 ? 5 : 3}
              />
              {
                index === 3 && (
                  <rect
                    x="28"
                    y={y - 10}
                    width="24"
                    height="20"
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


function NatureMark({
  ink,
  accent
}: MarkProps) {

  const birds = [
    { x: 40, y: 32, lead: true },
    { x: 26, y: 68, lead: false },
    { x: 54, y: 68, lead: false },
    { x: 16, y: 108, lead: false },
    { x: 64, y: 108, lead: false },
    { x: 8, y: 152, lead: false },
    { x: 72, y: 152, lead: false }
  ]

  return (
    <MarkSvg>
      {
        birds.map(
          bird => {

            const span =
              bird.lead ? 16 : 12

            const depth =
              bird.lead ? 14 : 11

            return (
              <polygon
                key={`${bird.x}-${bird.y}`}
                points={`${bird.x},${bird.y} ${bird.x - span},${bird.y + depth} ${bird.x},${bird.y + depth - 4} ${bird.x + span},${bird.y + depth}`}
                fill={bird.lead ? accent : ink}
              />
            )

          }
        )
      }
    </MarkSvg>
  )

}


function CarsMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <line
        x1="18"
        y1="8"
        x2="18"
        y2="232"
        stroke={ink}
        strokeWidth="4"
      />
      <line
        x1="62"
        y1="8"
        x2="62"
        y2="232"
        stroke={ink}
        strokeWidth="4"
      />
      {
        [20, 50, 80, 110, 140, 170, 200].map(
          (y, index) => (
            <rect
              key={y}
              x="37"
              y={y}
              width="6"
              height={index === 0 ? 22 : 16}
              fill={index === 0 ? accent : ink}
            />
          )
        )
      }
    </MarkSvg>
  )

}


function HomeMark({
  ink,
  accent
}: MarkProps) {

  const panes = [
    [12, 36, 26, 48],
    [42, 36, 26, 48],
    [12, 92, 26, 48],
    [42, 92, 26, 48],
    [12, 148, 26, 48],
    [42, 148, 26, 48],
    [12, 204, 56, 22]
  ]

  return (
    <MarkSvg>
      <rect
        x="8"
        y="28"
        width="64"
        height="196"
        fill="none"
        stroke={ink}
        strokeWidth="4"
      />
      {
        panes.map(
          ([x, y, w, h], index) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={index === 6 ? accent : "none"}
              stroke={ink}
              strokeWidth="3"
            />
          )
        )
      }
    </MarkSvg>
  )

}


function GeneralMark({
  ink,
  accent
}: MarkProps) {

  return (
    <MarkSvg>
      <rect
        x="-10"
        y="28"
        width="92"
        height="28"
        fill={accent}
      />
      <polygon
        points="72,28 72,56 18,230 -8,230"
        fill={ink}
      />
    </MarkSvg>
  )

}


const marks: Record<
  RankingCategory,
  (props: MarkProps) => ReactElement
> = {
  "Food & Drink": FoodMark,
  "Film & TV": FilmMark,
  Music: MusicMark,
  Sport: SportMark,
  Gaming: GamingMark,
  Travel: TravelMark,
  Technology: TechnologyMark,
  Lifestyle: LifestyleMark,
  Books: BooksMark,
  "Art & Design": ArtMark,
  Fashion: FashionMark,
  Beauty: BeautyMark,
  "Health & Fitness": HealthMark,
  Business: BusinessMark,
  Science: ScienceMark,
  History: HistoryMark,
  "Nature & Animals": NatureMark,
  "Cars & Transport": CarsMark,
  "Home & Garden": HomeMark,
  General: GeneralMark
}


export const categoryMarkJokes: Record<
  RankingCategory,
  string
> = {
  "Food & Drink": "Seven tines. The first is longer.",
  "Film & TV": "Empty gate. The 7 is the picture. Seven sprockets.",
  Music: "Seven grooves. The hole is slightly off, so it would skip.",
  Sport: "Seven lanes. One already left.",
  Gaming: "A die showing seven. Impossible, and ranked.",
  Travel: "Seven ticks on the equator. One is the trip.",
  Technology: "Seven traces. The last one is live.",
  Lifestyle: "A clock with seven hours. Time enough.",
  Books: "Seven lines. The last is the sentence they kept.",
  "Art & Design": "Seven blocks in a catalogue. One is the work.",
  Fashion: "Seven hangers. One is empty on purpose.",
  Beauty: "Seven tests on the back of the hand. One is the colour.",
  "Health & Fitness": "Seven beats. One spike.",
  Business: "Seven bars. The last overtook the rest.",
  Science: "Seven electrons. The outer one is the point.",
  History: "Seven notches. One event is marked.",
  "Nature & Animals": "Seven on the wing. Someone has to go first.",
  "Cars & Transport": "Seven dashes. The first is solid.",
  "Home & Garden": "Seven panes. The bottom one is lit.",
  General: "The 7, cropped by the spine."
}


type Props = {
  category?: string | null
  className?: string
}


export default function CategoryMark({
  category,
  className
}: Props) {

  const theme =
    getCategoryTheme(
      category
    )

  const Mark =
    marks[theme.name as RankingCategory] ??
    GeneralMark

  return (
    <div
      className={`
        [&>svg]:block
        [&>svg]:h-full
        [&>svg]:w-full
        ${className ?? ""}
      `}
      style={{
        color: theme.ink,
        display: "flex",
        width: "100%",
        height: "100%"
      }}
    >
      <Mark
        ink={theme.ink}
        accent={theme.accent}
        paper={theme.paper}
      />
    </div>
  )

}
