type RankdMarkProps = {
  variant?: "rankd" | "rerankd"
  color?: string
  size?: "md" | "lg"
}


export default function RankdMark({
  variant = "rankd",
  color = "#FF6B35",
  size = "md"
}: RankdMarkProps) {

  const isRerankd =
    variant === "rerankd"

  const glyph =
    size === "lg"
      ? "text-[4.25rem] sm:text-[4.75rem]"
      : "text-[3.4rem] sm:text-[3.75rem]"

  const frame =
    size === "lg"
      ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
      : "h-14 w-14 sm:h-16 sm:w-16"

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
