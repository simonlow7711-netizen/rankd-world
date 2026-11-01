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
          isMasthead
            ? (
                <h1
                  className={`
                    mx-auto
                    mt-6
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
            : (
                <h3
                  className={`
                    mx-auto
                    mt-8
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
        }

        {
          description && (
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
        }

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
