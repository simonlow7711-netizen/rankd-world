import Link from "next/link"


import {
  getDailyRankd
} from "@/utils/dailyRankd"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type DailyRankdProps = {
  category?: string
  title?: string
  description?: string
  href?: string
}


function getTheme(
  category?: string
) {

  return getCategoryTheme(
    category
  )

}


export default function DailyRankd({
  category,
  title,
  description,
  href
}: DailyRankdProps) {

  const dailyRankd =
    getDailyRankd()


  const activeCategory =
    category ??
    dailyRankd.category


  const activeTitle =
    title ??
    dailyRankd.title


  const activeDescription =
    description ??
    "Thousands of possible answers. One question."


  const theme =
    getTheme(
      activeCategory
    )


  const createHref =
    href ??
    `/create?title=${encodeURIComponent(
      activeTitle
    )}&category=${encodeURIComponent(
      activeCategory
    )}`


  return (
    <section
      className="
        px-5
        py-8
        md:px-8
        md:py-10
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <div
          className="
            rankd-edition
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            p-7
            text-black
            md:rounded-[32px]
            md:p-12
            lg:p-16
          "
          style={{
            backgroundColor:
              theme.paper,
            borderColor:
              "#111111"
          }}
        >

          <EditionChrome
            theme={theme}
          />

          <div
            className="
              relative
              z-10
              text-left
            "
          >

            <EditionHeader
              theme={theme}
              category={activeCategory}
              bleed="hero"
            >

            <div
              className="
                flex
                flex-col
                items-start
                gap-3
              "
            >

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.28em]
                "
                style={{
                  color:
                    theme.accent
                }}
              >
                <EditionMark
                  theme={theme}
                >
                  RANKD OF THE DAY
                </EditionMark>
              </p>


              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  opacity-60
                "
              >
                <EditionMark
                  theme={theme}
                >
                  {theme.label} · DAILY EDITION
                </EditionMark>
              </p>

            </div>


            <div
              className="
                max-w-5xl
                py-8
                md:py-10
              "
            >

              <p
                className="
                  mb-5
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  opacity-55
                "
              >
                <EditionMark
                  theme={theme}
                >
                  TOP 7
                </EditionMark>
              </p>


              <h2
                className="
                  max-w-5xl
                  text-left
                  text-4xl
                  font-black
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-balance
                  hyphens-none
                  md:text-6xl
                  lg:text-7xl
                "
              >
                <EditionTitle
                  theme={theme}
                >
                  {activeTitle}
                </EditionTitle>
              </h2>

            </div>

            </EditionHeader>


              <div
                className="
                  relative
                  z-10
                  mt-6
                  flex
                  flex-col
                  items-start
                  gap-6
                "
              >

                <div
                  className="
                    mx-auto
                    max-w-2xl
                  "
                >

                  <p
                    className="
                      text-lg
                      leading-relaxed
                      md:text-xl
                    "
                    style={{
                      color:
                        theme.muted
                    }}
                  >
                    {activeDescription}
                  </p>


                  <p
                    className="
                      mt-3
                      text-lg
                      font-black
                      md:text-xl
                    "
                  >
                    How would you rank it?
                  </p>

                </div>


                <Link
                  href={createHref}
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-black
                    px-7
                    py-4
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:scale-[1.03]
                    hover:bg-black/85
                  "
                >

                  <span>
                    Rank it
                  </span>


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

                </Link>

              </div>


            <div
              className="
                flex
                flex-col
                items-center
                gap-2
                border-t
                pt-5
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                opacity-55
              "
              style={{
                borderColor:
                  "rgba(0,0,0,0.10)"
              }}
            >

              <span>
                {activeCategory}
              </span>


              <span>
                Would you rank it differently?
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}