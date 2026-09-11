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

  card: string
  text: string
  accent: string
  accentBackground: string
  muted: string
  border: string
  decoration: string
  title: string
  secondaryLabel: string
  shape: "circle" | "square" | "line" | "none"

}


const categoryThemes: Record<string, CategoryTheme> = {

  "Food & Drink": {

    card:
      "bg-[#F1E4D1]",

    text:
      "text-[#211A16]",

    accent:
      "text-[#D96B35]",

    accentBackground:
      "bg-[#D96B35]",

    muted:
      "text-[#6E5545]",

    border:
      "border-[#8A5A3C]/20",

    decoration:
      "text-[#D96B35]/[0.07]",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    secondaryLabel:
      "MENU / 07",

    shape:
      "circle"

  },


  "Film & TV": {

    card:
      "bg-[#111111]",

    text:
      "text-[#F7F4EE]",

    accent:
      "text-[#FF6B35]",

    accentBackground:
      "bg-[#FF6B35]",

    muted:
      "text-white/55",

    border:
      "border-white/15",

    decoration:
      "text-white/[0.025]",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    secondaryLabel:
      "FRAME / 07",

    shape:
      "line"

  },


  "Music": {

    card:
      "bg-[#25152F]",

    text:
      "text-[#F7EFF8]",

    accent:
      "text-[#E7A8FF]",

    accentBackground:
      "bg-[#E7A8FF]",

    muted:
      "text-[#C8B7CC]",

    border:
      "border-[#E7A8FF]/20",

    decoration:
      "text-[#E7A8FF]/[0.04]",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.05em]",

    secondaryLabel:
      "SIDE A / 07",

    shape:
      "circle"

  },


  "Sport": {

    card:
      "bg-[#E9ECE7]",

    text:
      "text-[#101510]",

    accent:
      "text-[#E54B2F]",

    accentBackground:
      "bg-[#101510]",

    muted:
      "text-[#586058]",

    border:
      "border-[#101510]/15",

    decoration:
      "text-[#E54B2F]/[0.05]",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    secondaryLabel:
      "MATCH / 07",

    shape:
      "line"

  },


  "Gaming": {

    card:
      "bg-[#0E1416]",

    text:
      "text-[#EAF5EE]",

    accent:
      "text-[#72F36A]",

    accentBackground:
      "bg-[#72F36A]",

    muted:
      "text-[#8DA098]",

    border:
      "border-[#72F36A]/20",

    decoration:
      "text-[#72F36A]/[0.035]",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    secondaryLabel:
      "PLAYER 1 / 07",

    shape:
      "square"

  },


  "Travel": {

    card:
      "bg-[#D9EEE9]",

    text:
      "text-[#123B36]",

    accent:
      "text-[#087D71]",

    accentBackground:
      "bg-[#087D71]",

    muted:
      "text-[#58736F]",

    border:
      "border-[#123B36]/15",

    decoration:
      "text-[#087D71]/[0.05]",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    secondaryLabel:
      "FIELD NOTES / 07",

    shape:
      "circle"

  },


  "Technology": {

    card:
      "bg-[#ECEDEA]",

    text:
      "text-[#111820]",

    accent:
      "text-[#315AE8]",

    accentBackground:
      "bg-[#315AE8]",

    muted:
      "text-[#69737C]",

    border:
      "border-[#111820]/15",

    decoration:
      "text-[#315AE8]/[0.035]",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.05em]",

    secondaryLabel:
      "SYSTEM / 07",

    shape:
      "square"

  },


  "Lifestyle": {

    card:
      "bg-[#EFE8DC]",

    text:
      "text-[#29241E]",

    accent:
      "text-[#A45D3E]",

    accentBackground:
      "bg-[#A45D3E]",

    muted:
      "text-[#766E64]",

    border:
      "border-[#29241E]/15",

    decoration:
      "text-[#A45D3E]/[0.04]",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "EDIT / 07",

    shape:
      "circle"

  },


  "Books": {

    card:
      "bg-[#F3EDE0]",

    text:
      "text-[#30251D]",

    accent:
      "text-[#9B493D]",

    accentBackground:
      "bg-[#9B493D]",

    muted:
      "text-[#75695E]",

    border:
      "border-[#30251D]/15",

    decoration:
      "text-[#9B493D]/[0.035]",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.025em]",

    secondaryLabel:
      "PUBLISHING / 07",

    shape:
      "line"

  },


  "Art & Design": {

    card:
      "bg-[#151515]",

    text:
      "text-[#F5F1EA]",

    accent:
      "text-[#F2C14E]",

    accentBackground:
      "bg-[#F2C14E]",

    muted:
      "text-[#A8A39B]",

    border:
      "border-white/15",

    decoration:
      "text-[#F2C14E]/[0.025]",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.06em]",

    secondaryLabel:
      "CATALOGUE / 07",

    shape:
      "square"

  },


  "Fashion": {

    card:
      "bg-[#E9DFE7]",

    text:
      "text-[#231B22]",

    accent:
      "text-[#A52F68]",

    accentBackground:
      "bg-[#A52F68]",

    muted:
      "text-[#786773]",

    border:
      "border-[#231B22]/15",

    decoration:
      "text-[#A52F68]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    secondaryLabel:
      "COLLECTION / 07",

    shape:
      "line"

  },


  "Beauty": {

    card:
      "bg-[#F4E2E1]",

    text:
      "text-[#2C1C1F]",

    accent:
      "text-[#C34E68]",

    accentBackground:
      "bg-[#C34E68]",

    muted:
      "text-[#856B70]",

    border:
      "border-[#6F454A]/15",

    decoration:
      "text-[#C34E68]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    secondaryLabel:
      "EDIT / 07",

    shape:
      "circle"

  },


  "Health & Fitness": {

    card:
      "bg-[#E2F0E5]",

    text:
      "text-[#17251B]",

    accent:
      "text-[#16824D]",

    accentBackground:
      "bg-[#16824D]",

    muted:
      "text-[#607467]",

    border:
      "border-[#244A35]/15",

    decoration:
      "text-[#16824D]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    secondaryLabel:
      "ENERGY / 07",

    shape:
      "circle"

  },


  "Business": {

    card:
      "bg-[#E4E9EF]",

    text:
      "text-[#14202B]",

    accent:
      "text-[#245A91]",

    accentBackground:
      "bg-[#245A91]",

    muted:
      "text-[#64717D]",

    border:
      "border-[#14202B]/15",

    decoration:
      "text-[#245A91]/[0.04]",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.04em]",

    secondaryLabel:
      "BRIEFING / 07",

    shape:
      "square"

  },


  "Science": {

    card:
      "bg-[#DDECEF]",

    text:
      "text-[#14272C]",

    accent:
      "text-[#157D8C]",

    accentBackground:
      "bg-[#157D8C]",

    muted:
      "text-[#61767C]",

    border:
      "border-[#29525A]/15",

    decoration:
      "text-[#157D8C]/[0.04]",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "FIELD NOTES / 07",

    shape:
      "circle"

  },


  "History": {

    card:
      "bg-[#E8DDC8]",

    text:
      "text-[#2D2419]",

    accent:
      "text-[#86502E]",

    accentBackground:
      "bg-[#86502E]",

    muted:
      "text-[#766A5B]",

    border:
      "border-[#574735]/15",

    decoration:
      "text-[#86502E]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.035em]",

    secondaryLabel:
      "ARCHIVE / 07",

    shape:
      "line"

  },


  "Nature & Animals": {

    card:
      "bg-[#DDE9D8]",

    text:
      "text-[#172418]",

    accent:
      "text-[#4C7D3F]",

    accentBackground:
      "bg-[#4C7D3F]",

    muted:
      "text-[#62715E]",

    border:
      "border-[#31482E]/15",

    decoration:
      "text-[#4C7D3F]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.045em]",

    secondaryLabel:
      "FIELD GUIDE / 07",

    shape:
      "circle"

  },


  "Cars & Transport": {

    card:
      "bg-[#DCE1E5]",

    text:
      "text-[#141B20]",

    accent:
      "text-[#C63D2E]",

    accentBackground:
      "bg-[#141B20]",

    muted:
      "text-[#68737B]",

    border:
      "border-[#141B20]/15",

    decoration:
      "text-[#C63D2E]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.8] tracking-[-0.055em] uppercase",

    secondaryLabel:
      "ROAD / 07",

    shape:
      "line"

  },


  "Home & Garden": {

    card:
      "bg-[#E8E5D7]",

    text:
      "text-[#25251E]",

    accent:
      "text-[#6E7C45]",

    accentBackground:
      "bg-[#6E7C45]",

    muted:
      "text-[#707064]",

    border:
      "border-[#4F503E]/15",

    decoration:
      "text-[#6E7C45]/[0.045]",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    secondaryLabel:
      "LIVING / 07",

    shape:
      "square"

  },


  "General": {

    card:
      "bg-[#F7F4EE]",

    text:
      "text-black",

    accent:
      "text-[#FF6B35]",

    accentBackground:
      "bg-black",

    muted:
      "text-black/50",

    border:
      "border-black/10",

    decoration:
      "text-black/[0.02]",

    title:
      "text-3xl md:text-4xl leading-tight",

    secondaryLabel:
      "TOP 7",

    shape:
      "none"

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


            <div
              className="
                flex
                items-end
                justify-between
                gap-8
              "
            >

              <div>

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
                  text-[#FF6B35]/[0.08]
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
                          hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]
                          ${theme.card}
                          ${theme.text}
                          ${theme.border}
                        `}
                      >

                        <div
                          className={`
                            absolute
                            -right-8
                            -top-12
                            text-[11rem]
                            md:text-[13rem]
                            leading-none
                            font-black
                            select-none
                            pointer-events-none
                            ${theme.decoration}
                          `}
                        >

                          7

                        </div>


                        {
                          theme.shape === "circle" && (

                            <div
                              className={`
                                absolute
                                -bottom-16
                                -left-16
                                h-40
                                w-40
                                rounded-full
                                opacity-10
                                ${theme.accentBackground}
                              `}
                            />

                          )
                        }


                        {
                          theme.shape === "square" && (

                            <div
                              className={`
                                absolute
                                -bottom-10
                                -right-10
                                h-28
                                w-28
                                rotate-12
                                opacity-10
                                ${theme.accentBackground}
                              `}
                            />

                          )
                        }


                        {
                          theme.shape === "line" && (

                            <div
                              className={`
                                absolute
                                right-8
                                top-8
                                h-24
                                w-px
                                opacity-30
                                ${theme.accentBackground}
                              `}
                            />

                          )
                        }


                        <div
                          className="
                            relative
                            z-10
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-4
                            "
                          >

                            <span
                              className={`
                                text-xs
                                uppercase
                                tracking-[0.22em]
                                font-black
                                ${theme.accent}
                              `}
                            >

                              {
                                theme.secondaryLabel
                              }

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
                            "
                          >

                            <span
                              className={`
                                text-xs
                                uppercase
                                tracking-[0.18em]
                                font-black
                                ${theme.accent}
                              `}
                            >

                              Explore rankings

                            </span>


                            <span
                              className={`
                                text-xs
                                font-black
                                opacity-40
                                ${theme.muted}
                              `}
                            >

                              TOP 7

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