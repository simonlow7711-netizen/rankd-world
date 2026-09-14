import type {
  Metadata
} from "next"

import Link from "next/link"

import {
  notFound
} from "next/navigation"

import RankingCard from "@/components/RankingCard"

import {
  getAllRankings
} from "@/utils/supabaseRankings"

import {
  categories,
  RankingCategory
} from "@/utils/categories"

import {
  categoryMetadata
} from "@/utils/categoryMetadata"


const SITE_URL =
  "https://rankd.world"


type Props = {

  params: Promise<{
    slug: string
  }>

}


type CategoryTheme = {

  bg: string

  text: string

  accent: string

  muted: string

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
    label: "MENU / 07"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    label: "FRAME / 07"
  },

  "Music": {
    bg: "#E9E3DE",
    text: "#211A1A",
    accent: "#C43D35",
    muted: "#746562",
    label: "SIDE A / 07"
  },

  "Sport": {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    label: "MATCH / 07"
  },

  "Gaming": {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    label: "PLAYER 1 / 07"
  },

  "Travel": {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    label: "FIELD NOTES / 07"
  },

  "Technology": {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    label: "SYSTEM / 07"
  },

  "Lifestyle": {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    label: "EDIT / 07"
  },

  "Books": {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    label: "PUBLISHING / 07"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    label: "CATALOGUE / 07"
  },

  "Fashion": {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    label: "COLLECTION / 07"
  },

  "Beauty": {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    label: "EDIT / 07"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    label: "ENERGY / 07"
  },

  "Business": {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    label: "BRIEFING / 07"
  },

  "Science": {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    label: "FIELD NOTES / 07"
  },

  "History": {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    label: "ARCHIVE / 07"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    label: "FIELD GUIDE / 07"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    label: "ROAD / 07"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    label: "LIVING / 07"
  },

  "General": {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#000000",
    label: "TOP 7"
  }

}


const categorySlugs: Record<
  RankingCategory,
  string
> = {

  "Food & Drink":
    "food-drink",

  "Film & TV":
    "film-tv",

  "Music":
    "music",

  "Sport":
    "sport",

  "Gaming":
    "gaming",

  "Travel":
    "travel",

  "Technology":
    "technology",

  "Lifestyle":
    "lifestyle",

  "Books":
    "books",

  "Art & Design":
    "art-design",

  "Fashion":
    "fashion",

  "Beauty":
    "beauty",

  "Health & Fitness":
    "health-fitness",

  "Business":
    "business",

  "Science":
    "science",

  "History":
    "history",

  "Nature & Animals":
    "nature-animals",

  "Cars & Transport":
    "cars-transport",

  "Home & Garden":
    "home-garden",

  "General":
    "general"

}


function slugToCategory(
  slug: string
): RankingCategory | null {

  const match =
    categories.find(

      category =>

        categorySlugs[
          category
        ] === slug

    )


  return match ?? null

}


function getTheme(
  category: RankingCategory
): CategoryTheme {

  return (
    categoryThemes[
      category
    ] ??
    categoryThemes.General
  )

}


export async function generateStaticParams() {

  return categories.map(

    category => ({

      slug:
        categorySlugs[
          category
        ]

    })

  )

}


export const revalidate =
  300


export async function generateMetadata(

  {
    params

  }: Props

): Promise<Metadata> {

  const {
    slug
  } =
    await params


  const category =
    slugToCategory(
      slug
    )


  if (!category) {

    return {

      title:
        "Category Not Found | RANKD"

    }

  }


  const metadata =
    categoryMetadata[
      category
    ]


  const description =
    metadata.description


  const categoryUrl =
    `${SITE_URL}/category/${slug}`


  return {

    title:
      `${category} Rankings | RANKD`,

    description,

    alternates: {

      canonical:
        categoryUrl

    },

    openGraph: {

      type:
        "website",

      url:
        categoryUrl,

      siteName:
        "RANKD",

      title:
        `${category} Rankings | RANKD`,

      description,

      locale:
        "en_GB"

    },

    twitter: {

      card:
        "summary_large_image",

      title:
        `${category} Rankings | RANKD`,

      description

    },

    robots: {

      index:
        true,

      follow:
        true

    }

  }

}


export default async function CategoryPage(

  {
    params

  }: Props

) {

  const {
    slug
  } =
    await params


  const category =
    slugToCategory(
      slug
    )


  if (!category) {

    notFound()

  }


  const metadata =
    categoryMetadata[
      category
    ]


  const theme =
    getTheme(
      category
    )


  const allRankings =
    await getAllRankings()


  const rankings =

    allRankings

      .filter(

        ranking =>

          ranking.category ===
          category

      )

      .sort(

        (a, b) =>

          new Date(
            b.createdAt || 0
          ).getTime()

          -

          new Date(
            a.createdAt || 0
          ).getTime()

      )


  const categoryUrl =
    `${SITE_URL}/category/${slug}`


  const structuredData = {

    "@context":
      "https://schema.org",

    "@graph": [

      {

        "@type":
          "CollectionPage",

        "@id":
          `${categoryUrl}/#webpage`,

        url:
          categoryUrl,

        name:
          `${category} Rankings | RANKD`,

        description:
          metadata.description,

        isPartOf: {

          "@id":
            `${SITE_URL}/#website`

        },

        about: {

          "@id":
            `${SITE_URL}/#organization`

        },

        inLanguage:
          "en-GB"

      },

      {

        "@type":
          "ItemList",

        "@id":
          `${categoryUrl}/#rankings`,

        name:
          `${category} Top 7 Rankings`,

        url:
          categoryUrl,

        numberOfItems:
          rankings.length,

        itemListOrder:
          "https://schema.org/ItemListOrderDescending",

        itemListElement:

          rankings.map(

            (
              ranking,
              index
            ) => ({

              "@type":
                "ListItem",

              position:
                index + 1,

              name:
                ranking.title,

              url:
                `${SITE_URL}/rank/${ranking.id}`

            })

          )

      }

    ]

  }


  return (

    <>

      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html:
            JSON.stringify(
              structuredData
            )

        }}

      />


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

          <header
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
                opacity-[0.055]
                md:-right-16
                md:-top-28
                md:text-[25rem]
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
                max-w-4xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.24em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >

                  RANKD / {theme.label}

                </p>


                <span
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    opacity-40
                  "
                >

                  Category

                </span>

              </div>


              <h1
                className="
                  mt-5
                  text-5xl
                  font-black
                  leading-[0.9]
                  tracking-[-0.06em]
                  md:text-7xl
                "
                style={{
                  color:
                    theme.text
                }}
              >

                {category}

              </h1>


              <p
                className="
                  mt-5
                  max-w-2xl
                  text-lg
                  leading-relaxed
                  md:text-xl
                "
                style={{
                  color:
                    theme.muted
                }}
              >

                {metadata.description}

              </p>

            </div>

          </header>


          <section>

            {
              rankings.length > 0 ? (

                <div
                  className="
                    grid
                    gap-5
                    md:grid-cols-2
                    lg:grid-cols-3
                  "
                >

                  {
                    rankings.map(

                      ranking => (

                        <RankingCard

                          key={
                            ranking.id
                          }

                          ranking={
                            ranking
                          }

                        />

                      )

                    )
                  }

                </div>

              ) : (

                <div
                  className="
                    rounded-[32px]
                    p-8
                    text-center
                    md:p-14
                  "
                  style={{
                    backgroundColor:
                      theme.bg,

                    color:
                      theme.text
                  }}
                >

                  <div
                    className="
                      relative
                      mx-auto
                      max-w-2xl
                    "
                  >

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        select-none
                        text-[12rem]
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
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.2em]
                        "
                        style={{
                          color:
                            theme.accent
                        }}
                      >

                        {theme.label}

                      </p>


                      <h2
                        className="
                          mt-5
                          text-4xl
                          font-black
                          leading-[0.95]
                          tracking-[-0.05em]
                          md:text-5xl
                        "
                      >

                        No RANKDs yet.

                      </h2>


                      <p
                        className="
                          mx-auto
                          mt-4
                          max-w-xl
                          text-base
                          leading-relaxed
                          opacity-65
                          md:text-lg
                        "
                      >

                        Be the first to create
                        a Top 7 in {category}.

                      </p>


                      <Link
                        href={
                          `/create?category=${encodeURIComponent(
                            category
                          )}`
                        }
                        className="
                          mt-7
                          inline-flex
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          px-7
                          py-4
                          text-sm
                          font-black
                          text-white
                          transition
                          hover:bg-[#FF6B35]
                          hover:text-black
                        "
                      >

                        Create the first RANKD →

                      </Link>

                    </div>

                  </div>

                </div>

              )

            }

          </section>


          {
            rankings.length > 0 && (

              <section
                className="
                  mt-14
                  md:mt-16
                "
              >

                <div
                  className="
                    rounded-[32px]
                    bg-black
                    px-7
                    py-12
                    text-center
                    text-white
                    md:px-12
                    md:py-14
                  "
                >

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#FF6B35]
                    "
                  >

                    Your turn

                  </p>


                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                      leading-[0.95]
                      tracking-[-0.05em]
                      md:text-5xl
                    "
                  >

                    Have a different opinion?

                  </h2>


                  <p
                    className="
                      mx-auto
                      mt-4
                      max-w-xl
                      text-sm
                      leading-relaxed
                      text-white/60
                      md:text-base
                    "
                  >

                    Create your own Top 7 in {category}.

                  </p>


                  <Link
                    href={
                      `/create?category=${encodeURIComponent(
                        category
                      )}`
                    }
                    className="
                      mt-7
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      px-7
                      py-4
                      text-sm
                      font-black
                      text-black
                      transition
                      hover:bg-[#FF6B35]
                    "
                  >

                    Create a RANKD →

                  </Link>

                </div>

              </section>

            )
          }

        </div>

      </main>

    </>

  )

}