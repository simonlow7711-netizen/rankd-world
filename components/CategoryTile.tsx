import Link from "next/link"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type CategoryTileProps = {
  category: string
  description: string
  href: string
  size?: "home" | "index"
}


export default function CategoryTile({
  category,
  description,
  href,
  size = "home"
}: CategoryTileProps) {

  const theme =
    getCategoryTheme(
      category
    )

  const isIndex =
    size === "index"

  return (

    <Link
      href={href}
      className={`
        rankd-edition
        group
        relative
        flex
        min-h-[220px]
        flex-col
        items-center
        overflow-hidden
        rounded-[28px]
        border
        p-6
        text-center
        text-black
        ${
          isIndex
            ? "md:min-h-[260px] md:p-8"
            : ""
        }
      `}
      style={{
        backgroundColor:
          theme.paper,
        borderColor:
          "#111111"
      }}
    >

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          flex-col
          items-center
        "
      >

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
          "
        >

          <span
            className="
              text-[11px]
              font-black
              tracking-[0.28em]
            "
            style={{
              color:
                theme.accent
            }}
          >
            {theme.index}
          </span>

          <span
            className="
              text-black/20
            "
          >
            ·
          </span>

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-black/40
            "
          >
            {theme.label}
          </span>

        </div>

        <div
          className="
            mt-auto
            flex
            w-full
            flex-col
            items-center
            pt-12
          "
        >

          <h3
            className={`
              mx-auto
              w-full
              max-w-[92%]
              text-center
              font-black
              leading-[0.92]
              tracking-[-0.05em]
              ${
                isIndex
                  ? "text-3xl md:text-[2.2rem]"
                  : "text-2xl"
              }
            `}
          >
            {category}
          </h3>

          <p
            className="
              mx-auto
              mt-4
              line-clamp-2
              max-w-md
              text-center
              text-sm
              leading-relaxed
              text-black/50
            "
          >
            {description}
          </p>

          <div
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-3
              border-t
              border-black/10
              pt-4
            "
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
              Open category
            </span>

            <span
              className="
                text-lg
                leading-none
                transition
                duration-300
                group-hover:translate-x-0.5
              "
              style={{
                color:
                  theme.accent
              }}
            >
              →
            </span>

          </div>

        </div>

      </div>

    </Link>

  )

}
