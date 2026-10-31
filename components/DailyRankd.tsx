import Link from "next/link"


import {
  getDailyRankd
} from "@/utils/dailyRankd"

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
              theme.accent
          }}
        >

          <div
            className="
              relative
              z-10
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                border-b
                pb-7
                md:flex-row
                md:items-start
                md:justify-between
              "
              style={{
                borderColor:
                  "rgba(0,0,0,0.10)"
              }}
            >

              <div>

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
                  RANKD OF THE DAY
                </p>


                <p
                  className="
                    mt-2
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.22em]
                    opacity-60
                  "
                >
                  {theme.label}
                </p>

              </div>


              <div
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  opacity-50
                "
              >
                DAILY EDITION
              </div>

            </div>


            <div
              className="
                max-w-5xl
                py-10
                md:py-14
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
                TOP 7
              </p>


              <h2
                className="
                  max-w-5xl
                  text-4xl
                  font-black
                  leading-[0.94]
                  tracking-[-0.055em]
                  md:text-6xl
                  lg:text-8xl
                "
              >
                {activeTitle}
              </h2>


              <div
                className="
                  mt-9
                  h-px
                  w-full
                "
                style={{
                  backgroundColor:
                    "rgba(0,0,0,0.10)"
                }}
              />


              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div
                  className="
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

            </div>


            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                pt-5
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                opacity-55
                md:flex-row
                md:items-center
                md:justify-between
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