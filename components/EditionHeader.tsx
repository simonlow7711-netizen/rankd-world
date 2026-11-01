import {
  ReactNode
} from "react"

import {
  CategoryTheme
} from "@/utils/categoryTheme"

import {
  getEditionPhoto
} from "@/utils/editionPhoto"


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
  theme,
  children,
  size = "label"
}: EditionMarkProps) {

  const isTitle =
    size === "title"

  return (
    <span
      className={`
        inline-block
        max-w-full
        ${
          isTitle
            ? "rounded-[1.25rem] px-[0.55em] py-[0.34em]"
            : "rounded-full px-[0.72em] py-[0.3em]"
        }
      `}
      style={{
        backgroundColor:
          `color-mix(in srgb, ${theme.paper} 62%, transparent)`
      }}
    >
      {children}
    </span>
  )

}


export function EditionTitle({
  theme,
  children
}: EditionMarkProps) {

  return (
    <EditionMark
      theme={theme}
      size="title"
    >
      {children}
    </EditionMark>
  )

}


const bleedClass = {
  card:
    "-mx-7 -mt-7 w-[calc(100%+3.5rem)] min-h-[220px] px-7 pt-7 pb-16 md:-mx-8 md:-mt-8 md:w-[calc(100%+4rem)] md:px-8 md:pt-8",
  tile:
    "-mx-6 -mt-6 w-[calc(100%+3rem)] min-h-[196px] px-6 pt-6 pb-14 md:-mx-8 md:-mt-8 md:w-[calc(100%+4rem)] md:px-8 md:pt-8",
  hero:
    "-mx-7 -mt-7 w-[calc(100%+3.5rem)] min-h-[268px] px-7 pt-7 pb-20 md:-mx-12 md:-mt-12 md:w-[calc(100%+6rem)] md:px-12 md:pt-12 lg:-mx-16 lg:-mt-16 lg:w-[calc(100%+8rem)] lg:px-16 lg:pt-16",
  page:
    "-mx-6 -mt-10 w-[calc(100%+3rem)] min-h-[240px] px-6 pt-10 pb-16 md:-mx-12 md:-mt-16 md:w-[calc(100%+6rem)] md:px-12 md:pt-16",
  rank:
    "-mx-3 -mt-6 w-[calc(100%+1.5rem)] min-h-[320px] px-3 pt-6 pb-20 md:-mx-10 md:-mt-10 md:w-[calc(100%+5rem)] md:px-10 md:pt-10 lg:-mx-12 lg:-mt-12 lg:w-[calc(100%+6rem)] lg:px-12 lg:pt-12"
}


export default function EditionHeader({
  theme,
  category,
  children,
  bleed = "card"
}: EditionHeaderProps) {

  const paper =
    theme.paper

  const src =
    getEditionPhoto(
      category || theme.name
    )

  return (
    <div
      className={`
        relative
        isolate
        self-stretch
        ${bleedClass[bleed]}
      `}
    >

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >

        <img
          src={src}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            scale-[1.06]
            object-cover
            object-center
          "
        />

        <div
          className="
            absolute
            inset-0
          "
          style={{
            backgroundColor:
              paper,
            opacity:
              0.16
          }}
        />

        <div
          className="
            absolute
            inset-0
          "
          style={{
            background:
              `linear-gradient(to bottom, ${paper}10 0%, ${paper}08 28%, ${paper}40 62%, ${paper}d4 82%, ${paper} 92%)`
          }}
        />

      </div>

      <div
        className="
          relative
          z-10
        "
      >
        {children}
      </div>

    </div>
  )

}
