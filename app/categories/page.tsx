import type {
  Metadata
} from "next"

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


const SITE_URL =
  "https://rankd.world"


export const metadata: Metadata = {

  title:
    "Categories | RANKD",

  description:
    "Explore the world's Top 7 rankings across food, travel, sport, culture, entertainment, lifestyle and more.",

  alternates: {

    canonical:
      `${SITE_URL}/categories`

  },

  openGraph: {

    type:
      "website",

    url:
      `${SITE_URL}/categories`,

    siteName:
      "RANKD",

    title:
      "Categories | RANKD",

    description:
      "Explore the world's Top 7 rankings across food, travel, sport, culture, entertainment, lifestyle and more.",

    locale:
      "en_GB"

  },

  twitter: {

    card:
      "summary_large_image",

    title:
      "Categories | RANKD",

    description:
      "Explore the world's Top 7 rankings across food, travel, sport, culture, entertainment, lifestyle and more."

  },

  robots: {

    index:
      true,

    follow:
      true

  }

}


type CategoryTheme = {

  background: string
  text: string
  accent: string
  muted: string
  border: string
  title: string
  secondaryLabel: string

}


const categoryThemes: Record<string, CategoryTheme> = {

  "Food & Drink": {

    background:
      "bg-[#F3E8D8]",

    text:
      "text-[#211A16]",

    accent:
      "text-[#D96B35]",

    muted:
      "text-[#6E5545]",

    border:
      "border-[#211A16]/10",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    secondaryLabel:
      "MENU / 07"

  },

  "Film & TV": {

    background:
      "bg-[#ECEAE5]",

    text:
      "text-[#151515]",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-[#686560]",

    border:
      "border-[#151515]/10",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    secondaryLabel:
      "FRAME / 07"

  },

  "Music": {

    background:
      "bg-[#EAE3EC]",

    text:
      "text-[#25152F]",

    accent:
      "text-[#A95BCB]",

    muted:
      "text-[#685C6D]",

    border:
      "border-[#25152F]/10",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.05em]",

    secondaryLabel:
      "SIDE A / 07"

  },

  "Sport": {

    background:
      "bg-[#E7EBE5]",

    text:
      "text-[#101510]",

    accent:
      "text-[#E54B2F]",

    muted:
      "text-[#586058]",

    border:
      "border-[#101510]/10",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    secondaryLabel:
      "MATCH / 07"

  },

  "Gaming": {

    background:
      "bg-[#E7ECE9]",

    text:
      "text-[#0E1416]",

    accent:
      "text-[#39A932]",

    muted:
      "text-[#59645F]",

    border:
      "border-[#0E1416]/10",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    secondaryLabel:
      "PLAYER 1 / 07"

  },

  "Travel": {

    background:
      "bg-[#E0ECE8]",

    text:
      "text-[#123B36]",

    accent:
      "text-[#087D71]",

    muted:
      "text-[#58736F]",

    border:
      "border-[#123B36]/10",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    secondaryLabel:
      "FIELD NOTES / 07"

  },

  "Technology": {

    background:
      "bg-[#E9EBE9]",

    text:
      "text-[#111820]",

    accent:
      "text-[#315AE8]",

    muted:
      "text-[#69737C]",

    border:
      "border-[#111820]/10",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.05em]",

    secondaryLabel:
      "SYSTEM / 07"

  },

  "Lifestyle": {

    background:
      "bg-[#EEE8DE]",

    text:
      "text-[#29241E]",

    accent:
      "text-[#A45D3E]",

    muted:
      "text-[#766E64]",

    border:
      "border-[#29241E]/10",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "EDIT / 07"

  },

  "Books": {

    background:
      "bg-[#F1EBDD]",

    text:
      "text-[#30251D]",

    accent:
      "text-[#9B493D]",

    muted:
      "text-[#75695E]",

    border:
      "border-[#30251D]/10",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.025em]",

    secondaryLabel:
      "PUBLISHING / 07"

  },

  "Art & Design": {

    background:
      "bg-[#E9E6DF]",

    text:
      "text-[#151515]",

    accent:
      "text-[#B58B18]",

    muted:
      "text-[#68645C]",

    border:
      "border-[#151515]/10",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.06em]",

    secondaryLabel:
      "CATALOGUE / 07"

  },

  "Fashion": {

    background:
      "bg-[#ECE3E9]",

    text:
      "text-[#231B22]",

    accent:
      "text-[#A52F68]",

    muted:
      "text-[#786773]",

    border:
      "border-[#231B22]/10",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    secondaryLabel:
      "COLLECTION / 07"

  },

  "Beauty": {

    background:
      "bg-[#F1E5E3]",

    text:
      "text-[#2C1C1F]",

    accent:
      "text-[#C34E68]",

    muted:
      "text-[#856B70]",

    border:
      "border-[#2C1C1F]/10",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    secondaryLabel:
      "EDIT / 07"

  },

  "Health & Fitness": {

    background:
      "bg-[#E4EEE6]",

    text:
      "text-[#17251B]",

    accent:
      "text-[#16824D]",

    muted:
      "text-[#607467]",

    border:
      "border-[#17251B]/10",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    secondaryLabel:
      "ENERGY / 07"

  },

  "Business": {

    background:
      "bg-[#E5E9EE]",

    text:
      "text-[#14202B]",

    accent:
      "text-[#245A91]",

    muted:
      "text-[#64717D]",

    border:
      "border-[#14202B]/10",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.04em]",

    secondaryLabel:
      "BRIEFING / 07"

  },

  "Science": {

    background:
      "bg-[#E0EAEC]",

    text:
      "text-[#14272C]",

    accent:
      "text-[#157D8C]",

    muted:
      "text-[#61767C]",

    border:
      "border-[#14272C]/10",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "FIELD NOTES / 07"

  },

  "History": {

    background:
      "bg-[#E9E0CF]",

    text:
      "text-[#2D2419]",

    accent:
      "text-[#86502E]",

    muted:
      "text-[#766A5B]",

    border:
      "border-[#2D2419]/10",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.035em]",

    secondaryLabel:
      "ARCHIVE / 07"

  },

  "Nature & Animals": {

    background:
      "bg-[#E0E9DC]",

    text:
      "text-[#172418]",

    accent:
      "text-[#4C7D3F]",

    muted:
      "text-[#62715E]",

    border:
      "border-[#172418]/10",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.045em]",

    secondaryLabel:
      "FIELD GUIDE / 07"

  },

  "Cars & Transport": {

    background:
      "bg-[#E2E5E7]",

    text:
      "text-[#141B20]",

    accent:
      "text-[#C63D2E]",

    muted:
      "text-[#68737B]",

    border:
      "border-[#141B20]/10",

    title:
      "text-3xl md:text-4xl leading-[0.8] tracking-[-0.055em] uppercase",

    secondaryLabel:
      "ROAD / 07"

  },

  "Home & Garden": {

    background:
      "bg-[#E9E7DD]",

    text:
      "text-[#25251E]",

    accent:
      "text-[#6E7C45]",

    muted:
      "text-[#707064]",

    border:
      "border-[#25251E]/10",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "LIVING / 07"

  },

  "General": {

    background:
      "bg-[#F7F4EE]",

    text:
      "text-black",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-black/50",

    border:
      "border-black/10",

    title:
      "text-3xl md:text-4xl leading-tight",

    secondaryLabel:
      "TOP 7"

  }

}


function getTheme(
  category: string
): CategoryTheme {

  return (
    categoryThemes[category] ??
    categoryThemes.General
  )

}


export default function CategoriesPage() {

  const categoriesUrl =
    `${SITE_URL}/categories`


  const structuredData = {

    "@context":
      "https://schema.org",

    "@graph": [

      {

        "@type":
          "CollectionPage",

        "@id":
          `${categoriesUrl}/#webpage`,

        url:
          categoriesUrl,

        name:
          "Categories | RANKD",

        description:
          "Explore the world's Top 7 rankings across food, travel, sport, culture, entertainment, lifestyle and more.",

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
          `${categoriesUrl}/#categories`,

        name:
          "RANKD Categories",

        url:
          categoriesUrl,

        numberOfItems:
          categories.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:

          categories.map(

            (
              category,
              index
            ) => ({

              "@type":
                "ListItem",

              position:
                index + 1,

              name:
                category,

              url:
                `${SITE_URL}/category/${categoryToSlug(
                  category
                )}`

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
          px-5
          py-12
          md:px-8
          md:py-20
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
          "
        >

          <header
            className="
              max-w-5xl
              mb-12
              md:mb-16
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-8
              "
            >

              <div>

                <p
                  className="
                    rankd-accent
                    uppercase
                    tracking-[0.3em]
                    text-sm
                    font-black
                  "
                >

                  Explore RANKD

                </p>


                <h1
                  className="
                    mt-4
                    text-5xl
                    md:text-7xl
                    font-black
                    leading-[0.85]
                    tracking-[-0.06em]
                  "
                >

                  Categories

                </h1>


                <p
                  className="
                    mt-5
                    text-xl
                    md:text-2xl
                    text-black/55
                    max-w-3xl
                    leading-relaxed
                  "
                >

                  Explore the world's Top 7
                  rankings across everything
                  worth having an opinion about.

                </p>

              </div>


              <div
                className="
                  hidden
                  md:block
                  text-[11rem]
                  leading-none
                  font-black
                  tracking-[-0.1em]
                  text-[#FF6B35]/[0.1]
                  select-none
                "
              >

                7

              </div>

            </div>

          </header>


          <section>

            <div
              className="
                grid
                sm:grid-cols-2
                lg:grid-cols-3
                gap-5
                md:gap-6
              "
            >

              {
                categories.map(

                  category => {

                    const metadata =
                      categoryMetadata[
                        category
                      ]


                    const slug =
                      categoryToSlug(
                        category
                      )


                    const theme =
                      getTheme(
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

                        className={`
                          group
                          relative
                          block
                          min-w-0
                          overflow-hidden
                          rounded-[28px]
                          border
                          p-7
                          md:p-8
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]
                          ${theme.background}
                          ${theme.text}
                          ${theme.border}
                        `}
                      >

                        <div
                          className="
                            absolute
                            right-5
                            top-3
                            text-[8rem]
                            md:text-[9rem]
                            leading-none
                            font-black
                            tracking-[-0.1em]
                            text-[#FF6B35]/[0.08]
                            select-none
                            pointer-events-none
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        >

                          7

                        </div>


                        <div
                          className="
                            relative
                            z-10
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

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                text-[11px]
                                uppercase
                                tracking-[0.2em]
                                font-black
                              "
                            >

                              <span
                                className="
                                  text-[#FF6B35]
                                "
                              >

                                RANKD

                              </span>


                              <span
                                className="
                                  opacity-30
                                "
                              >

                                /

                              </span>


                              <span
                                className={`
                                  ${theme.accent}
                                `}
                              >

                                {
                                  theme.secondaryLabel
                                }

                              </span>

                            </span>


                            <span
                              className={`
                                text-xl
                                font-black
                                opacity-40
                                transition-all
                                duration-300
                                group-hover:opacity-100
                                group-hover:translate-x-1
                                ${theme.accent}
                              `}
                            >

                              →

                            </span>

                          </div>


                          <div
                            className="
                              mt-16
                              min-w-0
                            "
                          >

                            <h2
                              className={`
                                font-black
                                max-w-full
                                break-words
                                ${theme.title}
                              `}
                            >

                              {
                                category
                              }

                            </h2>


                            <p
                              className={`
                                mt-4
                                max-w-md
                                leading-relaxed
                                ${theme.muted}
                              `}
                            >

                              {
                                metadata.description
                              }

                            </p>

                          </div>


                          <div
                            className="
                              mt-8
                              flex
                              items-center
                              justify-between
                              gap-4
                              border-t
                              border-black/10
                              pt-5
                            "
                          >

                            <span
                              className="
                                text-[11px]
                                uppercase
                                tracking-[0.18em]
                                font-black
                                text-[#FF6B35]
                              "
                            >

                              Explore rankings

                            </span>


                            <span
                              className={`
                                text-[11px]
                                uppercase
                                tracking-[0.18em]
                                font-black
                                ${theme.muted}
                              `}
                            >

                              Top 7

                            </span>

                          </div>

                        </div>

                      </Link>

                    )

                  }

                )
              }

            </div>

          </section>

        </div>

      </main>

    </>

  )

}