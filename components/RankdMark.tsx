type RankdMarkProps = {
  variant?: "rankd" | "rerankd" | "uprankd"
  color?: string
  size?: "sm" | "md" | "lg"
  playKey?: number
}


export default function RankdMark({
  variant = "rankd",
  color = "#FF6B35",
  size = "md",
  playKey = 0
}: RankdMarkProps) {

  const isRerankd =
    variant === "rerankd"

  const isUprankd =
    variant === "uprankd"

  const glyph =
    size === "sm"
      ? "text-[1.2rem]"
      : size === "lg"
        ? "text-[4.25rem] sm:text-[4.75rem]"
        : "text-[3.4rem] sm:text-[3.75rem]"

  const frame =
    size === "sm"
      ? isUprankd
        ? "h-8 w-5"
        : "h-5 w-5"
      : size === "lg"
        ? isUprankd
          ? "h-[5.25rem] w-16 sm:h-[5.75rem] sm:w-[4.5rem]"
          : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
        : isUprankd
          ? "h-[4.75rem] w-14 sm:h-[5.25rem] sm:w-16"
          : "h-14 w-14 sm:h-16 sm:w-16"

  const hat =
    size === "sm"
      ? "mb-px h-[13px] w-[12px]"
      : size === "lg"
        ? "mb-0.5 h-7 w-8"
        : "mb-0.5 h-6 w-7"

  return (
    <span
      className={`
        relative
        inline-flex
        shrink-0
        items-center
        justify-center
        ${
          isUprankd
            ? "flex-col"
            : ""
        }
        ${frame}
      `}
      aria-hidden="true"
    >

      {
        isUprankd && (
          <svg
            key={playKey}
            viewBox="0 0 24 20"
            className={`
              pointer-events-none
              shrink-0
              ${hat}
              ${playKey > 0 ? "uprankd-hat-play" : ""}
            `}
            aria-hidden="true"
          >
            {
              [
                "M3 18 L12 12.5 L21 18",
                "M3 12.5 L12 7 L21 12.5",
                "M3 7 L12 1.5 L21 7"
              ].map(
                d => (
                  <path
                    key={d}
                    className="uprankd-chevron"
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                )
              )
            }
          </svg>
        )
      }

      {
        !isUprankd && (
          <span
            className={`
              pointer-events-none
              absolute
              select-none
              font-black
              leading-none
              tracking-[-0.16em]
              ${glyph}
              ${
                isRerankd
                  ? "left-[38%] top-[42%] -translate-x-1/2 -translate-y-1/2"
                  : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              }
            `}
            style={{
              color,
              opacity:
                isRerankd
                  ? 0.28
                  : 1
            }}
          >
            7
          </span>
        )
      }

      {
        isRerankd && (
          <span
            className={`
              pointer-events-none
              absolute
              left-[58%]
              top-[58%]
              z-10
              -translate-x-1/2
              -translate-y-1/2
              select-none
              font-black
              leading-none
              tracking-[-0.16em]
              ${glyph}
            `}
            style={{
              color
            }}
          >
            7
          </span>
        )
      }

      {
        isUprankd && (
          <span
            className={`
              pointer-events-none
              select-none
              font-black
              leading-none
              tracking-[-0.16em]
              ${glyph}
            `}
            style={{
              color
            }}
          >
            7
          </span>
        )
      }

    </span>
  )

}
