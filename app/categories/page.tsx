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
          px-6
          py-20
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
              max-w-4xl
              mb-16
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


            <h1
              className="
                mt-4
                text-5xl
                md:text-7xl
                font-black
                leading-none
              "
            >

              Categories

            </h1>


            <p
              className="
                mt-6
                text-xl
                md:text-2xl
                text-gray-500
                max-w-3xl
              "
            >

              Explore the world's Top 7
              rankings across everything
              worth having an opinion about.

            </p>

          </header>


          <section>

            <div
              className="
                grid
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
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
                          block
                          bg-white
                          rounded-[32px]
                          p-8
                          border
                          border-black/5
                          transition
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-xl
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
                            className="
                              text-5xl
                            "
                          >

                            {
                              metadata.emoji
                            }

                          </span>


                          <span
                            className="
                              text-2xl
                              font-black
                              opacity-30
                              transition
                              duration-300
                              group-hover:opacity-100
                              group-hover:translate-x-1
                            "
                          >

                            →

                          </span>

                        </div>


                        <h2
                          className="
                            mt-8
                            text-2xl
                            md:text-3xl
                            font-black
                            leading-tight
                          "
                        >

                          {
                            category
                          }

                        </h2>


                        <p
                          className="
                            mt-3
                            text-gray-500
                            leading-relaxed
                          "
                        >

                          {
                            metadata.description
                          }

                        </p>


                        <p
                          className="
                            mt-6
                            text-sm
                            uppercase
                            tracking-[0.2em]
                            font-black
                            rankd-accent
                          "
                        >

                          Explore rankings

                        </p>

                      </Link>

                    )

                  }

                )
              }

            </div>

          </section>


          <section
            className="
              mt-20
            "
          >

            <div
              className="
                bg-black
                text-white
                rounded-[40px]
                px-8
                py-14
                md:px-16
                text-center
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

                Your opinion matters

              </p>


              <h2
                className="
                  mt-4
                  text-4xl
                  md:text-5xl
                  font-black
                "
              >

                Can't find your
                perfect Top 7?

              </h2>


              <p
                className="
                  mt-4
                  text-gray-300
                  max-w-2xl
                  mx-auto
                "
              >

                Create your own RANKD,
                put your choices in order,
                and see how the world ranks it.

              </p>


              <Link

                href="/create"

                className="
                  inline-block
                  mt-8
                  bg-white
                  text-black
                  px-8
                  py-4
                  rounded-full
                  font-black
                  transition
                  duration-300
                  hover:scale-105
                "
              >

                Create a RANKD →

              </Link>

            </div>

          </section>

        </div>

      </main>

    </>

  )

}