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
        ? "h-8 min-w-[4.85rem] px-0.5"
        : "h-5 w-5"
      : size === "lg"
        ? isUprankd
          ? "h-16 min-w-[11rem] px-1"
          : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
        : isUprankd
          ? "h-12 min-w-[8.5rem] px-1"
          : "h-14 w-14 sm:h-16 sm:w-16"

  const word =
    size === "sm"
      ? "text-[15px]"
      : size === "lg"
        ? "text-4xl"
        : "text-2xl"

  const shadow =
    size === "sm"
      ? "text-[2.75rem]"
      : size === "lg"
        ? "text-[5.5rem]"
        : "text-[5rem]"

  return (
    <span
      className={`
        relative
        inline-flex
        shrink-0
        items-center
        justify-center
        ${frame}
      `}
      aria-hidden="true"
    >

      {
        isUprankd && (
          <>
            <span
              key={playKey}
              className={`
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                select-none
                font-black
                leading-none
                tracking-[-0.16em]
                ${shadow}
                ${playKey > 0 ? "uprankd-shadow-play" : ""}
              `}
              style={{
                color: "#FF6B35",
                opacity: 0.14
              }}
            >
              7
            </span>

            <span
              className={`
                relative
                z-10
                select-none
                font-black
                leading-none
                tracking-[-0.065em]
                text-black
                ${word}
              `}
            >
              upRANK
            </span>
          </>
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

    </span>
  )

}
