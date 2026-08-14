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

import {
  categoryToSlug
} from "@/utils/categorySlug"


const SITE_URL =
  "https://rankd.world"


type Props = {

  params: Promise<{
    slug: string
  }>

}


function slugToCategory(
  slug: string
): RankingCategory | null {

  const match =
    categories.find(

      category =>

        categoryToSlug(
          category
        ) === slug

    )

  return match ?? null

}


export async function generateStaticParams() {

  return categories.map(

    category => ({

      slug:
        categoryToSlug(
          category
        )

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


  if (
    rankings.length === 0
  ) {

    notFound()

  }


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

              Category

            </p>


            <div
              className="
                flex
                items-center
                gap-4
                mt-4
              "

            >

              <span
                className="
                  text-6xl
                "

              >

                {
                  metadata.emoji
                }

              </span>


              <div>

                <h1
                  className="
                    text-5xl
                    md:text-7xl
                    font-black
                  "

                >

                  {category}

                </h1>


                <p
                  className="
                    mt-3
                    text-xl
                    text-gray-500
                    max-w-2xl
                  "

                >

                  {
                    metadata.description
                  }

                </p>

              </div>

            </div>

          </header>


          <section>

            <div
              className="
                grid
                md:grid-cols-3
                gap-8
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
                text-center
              "

            >

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                "

              >

                Have a different opinion?

              </h2>


              <p
                className="
                  mt-4
                  text-gray-300
                "

              >

                Create your own Top 7 in{" "}
                {category}.

              </p>


              <Link

                href={
                  `/create?category=${encodeURIComponent(
                    category
                  )}`
                }

                className="
                  inline-block
                  mt-8
                  bg-white
                  text-black
                  px-8
                  py-4
                  rounded-full
                  font-black
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