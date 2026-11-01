import type {
  Metadata
} from "next"

import Link from "next/link"

import {
  notFound
} from "next/navigation"

import RankingCard from "@/components/RankingCard"

import CategoryCover from "@/components/CategoryCover"

import EditionChrome from "@/components/EditionChrome"

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

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  sharePreviewImage,
  sharePreviewUrl
} from "@/utils/ogImage"


const SITE_URL =
  "https://rankd.world"


type Props = {

  params: Promise<{
    slug: string
  }>

}


function getTheme(
  category: RankingCategory
) {

  return getCategoryTheme(
    category
  )

}


function slugToCategory(
  slug: string
): RankingCategory | null {

  const match =
    categories.find(

      category =>

        categoryToSlug(
          category
        ) ===
        slug

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
        "Category Not Found | RANKD",

      robots: {

        index:
          false,

        follow:
          false

      }

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


  const pageTitle =
    `Top 7 ${category} Rankings | RANKD`


  return {

    title:
      pageTitle,

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
        pageTitle,

      description,

      locale:
        "en_GB",

      images: [

        sharePreviewImage(
          pageTitle,
          sharePreviewUrl({
            category,
            title: category
          })
        )

      ]

    },


    twitter: {

      card:
        "summary_large_image",

      title:
        pageTitle,

      description,

      images: [

        sharePreviewUrl({
          category,
          title: category
        })

      ]

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


  const pageTitle =
    `Top 7 ${category} Rankings | RANKD`


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
          pageTitle,

        description:
          metadata.description,

        isPartOf: {

          "@id":
            `${SITE_URL}/#website`

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
              rankd-edition
              relative
              mb-12
              overflow-hidden
              rounded-[28px]
              border
              px-6
              py-10
              text-center
              text-black
              md:mb-16
              md:px-12
              md:py-16
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

            <CategoryCover
              theme={theme}
              title={category}
              description={metadata.description}
              kicker={`${theme.index} · RANKD / ${theme.label}`}
              footer={`${rankings.length} RANKD${rankings.length === 1 ? "" : "s"} in this edition`}
              size="masthead"
            />

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
                    rankd-edition
                    rounded-[28px]
                    border
                    p-8
                    text-center
                    text-black
                    md:p-14
                  "
                  style={{
                    backgroundColor:
                      theme.paper,
                    borderColor:
                      "#111111"
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
                    rankd-edition
                    rounded-[28px]
                    border
                    px-7
                    py-12
                    text-center
                    text-black
                    md:px-12
                    md:py-14
                  "
                  style={{
                    backgroundColor:
                      theme.paper,
                    borderColor:
                      "#111111"
                  }}
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
                      text-black/50
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
                      border
                      border-black
                      bg-black
                      px-7
                      py-4
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-[#FF6B35]
                      hover:text-black
                      hover:border-[#FF6B35]
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