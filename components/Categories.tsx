import Link from "next/link"

import {
  categories
} from "@/utils/categories"

import {
  categoryMetadata
} from "@/utils/categoryMetadata"

import {
  categoryToSlug
} from "@/utils/categorySlug"


type CategoryTheme = {

  bg: string

  text: string

  accent: string

  muted: string

  border: string

  label: string

}


const categoryThemes: Record<
  string,
  CategoryTheme
> = {

  "Food & Drink": {
    bg: "#F3E8D8",
    text: "#211A16",
    accent: "#D96B35",
    muted: "#6E5545",
    border: "#211A16/10",
    label: "MENU / 07"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    border: "#151515/10",
    label: "FRAME / 07"
  },

  "Music": {
    bg: "#E9E3DE",
    text: "#211A1A",
    accent: "#C43D35",
    muted: "#746562",
    border: "#211A1A/10",
    label: "SIDE A / 07"
  },

  "Sport": {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    border: "#101510/10",
    label: "MATCH / 07"
  },

  "Gaming": {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    border: "#0E1416/10",
    label: "PLAYER 1 / 07"
  },

  "Travel": {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    border: "#123B36/10",
    label: "FIELD NOTES / 07"
  },

  "Technology": {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    border: "#111820/10",
    label: "SYSTEM / 07"
  },

  "Lifestyle": {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    border: "#29241E/10",
    label: "EDIT / 07"
  },

  "Books": {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    border: "#30251D/10",
    label: "PUBLISHING / 07"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    border: "#151515/10",
    label: "CATALOGUE / 07"
  },

  "Fashion": {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    border: "#231B22/10",
    label: "COLLECTION / 07"
  },

  "Beauty": {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    border: "#2C1C1F/10",
    label: "EDIT / 07"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    border: "#17251B/10",
    label: "ENERGY / 07"
  },

  "Business": {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    border: "#14202B/10",
    label: "BRIEFING / 07"
  },

  "Science": {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    border: "#14272C/10",
    label: "FIELD NOTES / 07"
  },

  "History": {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    border: "#2D2419/10",
    label: "ARCHIVE / 07"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    border: "#172418/10",
    label: "FIELD GUIDE / 07"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    border: "#141B20/10",
    label: "ROAD / 07"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    border: "#25251E/10",
    label: "LIVING / 07"
  },

  "General": {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#000000",
    border: "#000000/10",
    label: "TOP 7"
  }

}


function getTheme(
  category: string
) {

  return (
    categoryThemes[category] ??
    categoryThemes["General"]
  )

}


export default function Categories() {

  return (

    <section
      className="
        bg-[#F7F4EE]
        px-6
        py-20
        md:py-24
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
            mb-10
            flex
            flex-col
            gap-6
            border-b
            border-black/10
            pb-8
            md:mb-12
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                rankd-accent
              "
            >
              EXPLORE RANKD
            </p>


            <h2
              className="
                mt-4
                text-4xl
                font-black
                leading-[1]
                tracking-[-0.045em]
                md:text-6xl
              "
            >
              Find something to rank.
            </h2>


            <p
              className="
                mt-4
                max-w-xl
                text-base
                leading-relaxed
                text-black/50
                md:text-lg
              "
            >
              Choose a category and discover the Top 7 opinions
              people are debating.
            </p>

          </div>


          <Link
            href="/categories"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              text-sm
              font-black
              transition
              hover:opacity-50
              md:mb-1
            "
          >

            <span>
              View all categories
            </span>

            <span
              className="
                text-lg
                leading-none
                rankd-accent
              "
            >
              →
            </span>

          </Link>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {categories.map(
            category => {

              const metadata =
                categoryMetadata[
                  category
                ]


              const theme =
                getTheme(
                  category
                )


              const slug =
                categoryToSlug(
                  category
                )


              return (

                <Link
                  key={
                    category
                  }
                  href={
                    `/category/${slug}`
                  }
                  className="
                    group
                    relative
                    min-h-[220px]
                    overflow-hidden
                    rounded-[28px]
                    border
                    p-6
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                  style={{
                    backgroundColor:
                      theme.bg,
                    color:
                      theme.text,
                    borderColor:
                      "rgba(0,0,0,0.10)"
                  }}
                >

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-5
                      -top-7
                      select-none
                      text-[9rem]
                      font-black
                      leading-none
                      tracking-[-0.16em]
                      opacity-[0.06]
                    "
                    style={{
                      color:
                        theme.accent
                    }}
                    aria-hidden="true"
                  >
                    7
                  </div>


                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-full
                      flex-col
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-end
                      "
                    >

                      <span
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.18em]
                          opacity-60
                        "
                      >
                        {
                          theme.label
                        }
                      </span>

                    </div>


                    <div
                      className="
                        mt-auto
                        pt-12
                      "
                    >

                      <h3
                        className="
                          max-w-[90%]
                          text-2xl
                          font-black
                          leading-[0.95]
                          tracking-[-0.04em]
                        "
                      >
                        {
                          category
                        }
                      </h3>


                      <p
                        className="
                          mt-4
                          line-clamp-2
                          max-w-md
                          text-sm
                          leading-relaxed
                        "
                        style={{
                          color:
                            theme.muted
                        }}
                      >
                        {
                          metadata.description
                        }
                      </p>


                      <div
                        className="
                          mt-5
                          flex
                          items-center
                          justify-between
                          border-t
                          pt-4
                        "
                        style={{
                          borderColor:
                            "rgba(0,0,0,0.10)"
                        }}
                      >

                        <span
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            opacity-60
                          "
                        >
                          Explore
                        </span>


                        <span
                          className="
                            text-lg
                            leading-none
                            transition
                            duration-300
                            group-hover:translate-x-1
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
          )}

        </div>


        <div
          className="
            mt-10
            border-t
            border-black/10
            pt-6
          "
        >

          <Link
            href="/categories"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              transition
              hover:opacity-50
            "
          >

            <span>
              Explore all 20 categories
            </span>

            <span
              className="
                text-lg
                leading-none
                rankd-accent
              "
            >
              →
            </span>

          </Link>

        </div>

      </div>

    </section>

  )

}