import {
  ReactNode
} from "react"

import CategoryMark from "@/components/CategoryMark"

import {
  CategoryTheme
} from "@/utils/categoryTheme"


type EditionHeaderProps = {
  theme: CategoryTheme
  category?: string | null
  children: ReactNode
  bleed?: "card" | "tile" | "hero" | "page" | "rank"
}


type EditionMarkProps = {
  theme: CategoryTheme
  children: ReactNode
  size?: "title" | "label"
}


export function EditionMark({
  children
}: EditionMarkProps) {

  return (
    <span
      className="
        inline-block
        max-w-full
      "
    >
      {children}
    </span>
  )

}


export function EditionTitle({
  children
}: EditionMarkProps) {

  return (
    <span
      className="
        inline-block
        max-w-full
        text-balance
        hyphens-none
      "
    >
      {children}
    </span>
  )

}


const bleedClass = {
  card:
    "-mx-7 -mt-7 w-[calc(100%+3.5rem)] md:-mx-8 md:-mt-8 md:w-[calc(100%+4rem)]",
  tile:
    "-mx-6 -mt-6 w-[calc(100%+3rem)] md:-mx-8 md:-mt-8 md:w-[calc(100%+4rem)]",
  hero:
    "-mx-7 -mt-7 w-[calc(100%+3.5rem)] md:-mx-12 md:-mt-12 md:w-[calc(100%+6rem)] lg:-mx-16 lg:-mt-16 lg:w-[calc(100%+8rem)]",
  page:
    "-mx-6 -mt-10 w-[calc(100%+3rem)] md:-mx-12 md:-mt-16 md:w-[calc(100%+6rem)]",
  rank:
    "-mx-3 -mt-6 w-[calc(100%+1.5rem)] md:-mx-10 md:-mt-10 md:w-[calc(100%+5rem)] lg:-mx-12 lg:-mt-12 lg:w-[calc(100%+6rem)]"
}


const spineClass = {
  card:
    "w-[72px] min-h-[200px] md:w-[84px]",
  tile:
    "w-[64px] min-h-[188px] md:w-[76px]",
  hero:
    "w-[84px] min-h-[240px] md:w-[104px]",
  page:
    "w-[84px] min-h-[220px] md:w-[104px]",
  rank:
    "w-[84px] min-h-[280px] md:w-[112px]"
}


export default function EditionHeader({
  theme,
  category,
  children,
  bleed = "card"
}: EditionHeaderProps) {

  return (
    <div
      className={`
        relative
        isolate
        self-stretch
        border-b
        border-black
        ${bleedClass[bleed]}
      `}
    >

      <div
        className="
          grid
          grid-cols-[auto_minmax(0,1fr)]
        "
      >

        <div
          className={`
            shrink-0
            border-r
            border-black
            ${spineClass[bleed]}
          `}
          style={{
            backgroundColor:
              theme.paper
          }}
        >
          <CategoryMark
            category={
              category ||
              theme.name
            }
            className="
              h-full
              min-h-full
            "
          />
        </div>

        <div
          className="
            min-w-0
            px-5
            py-5
            text-left
            md:px-7
            md:py-6
          "
        >
          {children}
        </div>

      </div>

    </div>
  )

}
