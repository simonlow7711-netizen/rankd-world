import Link from "next/link"

import CategoryCover from "@/components/CategoryCover"

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
        min-h-[268px]
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
            ? "md:min-h-[320px] md:p-8"
            : "md:min-h-[280px]"
        }
      `}
      style={{
        backgroundColor:
          theme.paper,
        borderColor:
          "#111111"
      }}
    >

      <CategoryCover
        theme={theme}
        title={category}
        description={description}
        size={
          isIndex
            ? "index"
            : "tile"
        }
        footer="Open category"
      />

    </Link>

  )

}
