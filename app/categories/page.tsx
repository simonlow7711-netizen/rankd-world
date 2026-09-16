import Link from "next/link"

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


type Category = {
  name: string
  slug: string
  description: string
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


const categories: Category[] = [
  {
    name: "Food & Drink",
    slug: "food-drink",
    description:
      "Restaurants, dishes, drinks and the places worth arguing about."
  },
  {
    name: "Film & TV",
    slug: "film-tv",
    description:
      "Films, television, characters, scenes and everything worth watching."
  },
  {
    name: "Music",
    slug: "music",
    description:
      "Artists, albums, songs, sounds and the records that define your taste."
  },
  {
    name: "Sport",
    slug: "sport",
    description:
      "Teams, players, moments, rivalries and sporting greatness."
  },
  {
    name: "Gaming",
    slug: "gaming",
    description:
      "Games, consoles, characters and the experiences worth playing."
  },
  {
    name: "Travel",
    slug: "travel",
    description:
      "Cities, destinations, journeys and places worth discovering."
  },
  {
    name: "Technology",
    slug: "technology",
    description:
      "Products, platforms, inventions and the technology shaping everyday life."
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description:
      "Everyday choices, experiences and the things that make life better."
  },
  {
    name: "Books",
    slug: "books",
    description:
      "Novels, non-fiction, authors and the books that stay with you."
  },
  {
    name: "Art & Design",
    slug: "art-design",
    description:
      "Artists, objects, buildings, graphics and ideas worth looking at."
  },
  {
    name: "Fashion",
    slug: "fashion",
    description:
      "Designers, labels, looks and the clothes that define an era."
  },
  {
    name: "Beauty",
    slug: "beauty",
    description:
      "Products, routines, brands and the beauty choices worth ranking."
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    description:
      "Training, wellbeing, habits and the choices that help you feel better."
  },
  {
    name: "Business",
    slug: "business",
    description:
      "Companies, founders, ideas and the businesses shaping the world."
  },
  {
    name: "Science",
    slug: "science",
    description:
      "Discoveries, ideas, questions and the science behind the world."
  },
  {
    name: "History",
    slug: "history",
    description:
      "People, events, places and moments that changed the course of history."
  },
  {
    name: "Nature & Animals",
    slug: "nature-animals",
    description:
      "Wildlife, landscapes, species and the natural world."
  },
  {
    name: "Cars & Transport",
    slug: "cars-transport",
    description:
      "Cars, trains, planes, bikes and the machines that move us."
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description:
      "Interiors, gardens, objects and the spaces we choose to live in."
  },
  {
    name: "General",
    slug: "general",
    description:
      "Everything else. If it can be ranked, it belongs on RANKD."
  }
]


function getTheme(
  category: string
) {
  return (
    categoryThemes[category] ??
    categoryThemes["General"]
  )
}


export const metadata = {
  title:
    "RANKD Categories | Explore Top 7 Rankings",

  description:
    "Explore RANKD by category and discover the Top 7 opinions shaping conversations."
}


export default function CategoriesPage() {

  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >

        <section
          className="
            relative
            mb-12
            overflow-hidden
            md:mb-14
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-16
              select-none
              text-[16rem]
              font-black
              leading-none
              tracking-[-0.16em]
              text-[#FF6B35]
              opacity-[0.055]
              md:-right-16
              md:-top-28
              md:text-[25rem]
            "
            aria-hidden="true"
          >
            7
          </div>


          <div
            className="
              relative
              z-10
              max-w-4xl
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.24em]
                text-[#FF6B35]
              "
            >
              RANKD / CATEGORIES
            </p>


            <h1
              className="
                mt-4
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.06em]
                md:text-7xl
              "
            >
              Find your
              <br />
              next debate.
            </h1>


            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                leading-relaxed
                text-black/55
                md:text-xl
              "
            >
              Explore rankings by category.
              Discover what other people think.
              Then rank it differently.
            </p>

          </div>

        </section>


        <section
          className="
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
            md:gap-5
          "
        >

          {categories.map(
            category => {

              const theme =
                getTheme(
                  category.name
                )

              return (
                <Link
                  key={
                    category.slug
                  }
                  href={
                    `/category/${categoryToSlug(
                      category.name
                    )}`
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    p-6
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                    md:p-7
                  "
                  style={{
                    backgroundColor:
                      theme.bg,

                    color:
                      theme.text,

                    borderColor:
                      "rgba(0,0,0,0.06)"
                  }}
                >

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-5
                      -top-8
                      select-none
                      text-[10rem]
                      font-black
                      leading-none
                      tracking-[-0.16em]
                      opacity-[0.07]
                    "
                    style={{
                      color:
                        "#FF6B35"
                    }}
                    aria-hidden="true"
                  >
                    7
                  </div>


                  <div
                    className="
                      relative
                      z-10
                    "
                  >

                    <p
                      className="
                        text-[11px]
                        font-black
                        uppercase
                        tracking-[0.2em]
                      "
                      style={{
                        color:
                          theme.accent
                      }}
                    >
                      RANKD
                      {" / "}
                      {theme.label}
                    </p>


                    <h2
                      className="
                        mt-7
                        max-w-[92%]
                        text-3xl
                        font-black
                        leading-[0.95]
                        tracking-[-0.045em]
                        md:text-[2.15rem]
                      "
                    >
                      {category.name}
                    </h2>


                    <p
                      className="
                        mt-4
                        max-w-md
                        text-[15px]
                        leading-relaxed
                      "
                      style={{
                        color:
                          theme.muted
                      }}
                    >
                      {category.description}
                    </p>


                    <div
                      className="
                        mt-7
                        flex
                        items-center
                        justify-between
                        border-t
                        pt-4
                        text-[11px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                      "
                      style={{
                        borderColor:
                          "rgba(0,0,0,0.07)"
                      }}
                    >

                      <span
                        className="
                          opacity-70
                          transition
                          duration-300
                          group-hover:opacity-100
                        "
                      >
                        Explore rankings
                      </span>


                      <span
                        className="
                          text-base
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

                </Link>
              )
            }
          )}

        </section>

      </div>

    </main>
  )
}