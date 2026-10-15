
import type {
  Metadata
} from "next"

import {
  notFound
} from "next/navigation"

import {
  getRankingsForLocation
} from "@/utils/supabaseRankings"

import {
  getGoogleMapsEmbedUrl
} from "@/utils/googleMaps"

import RankingCard from "@/components/RankingCard"

import {
  locations
} from "@/utils/locations"

const SITE_URL =
  "https://rankd.world"

export const dynamic =
  "force-dynamic"

type LocationPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params
}: LocationPageProps): Promise<Metadata> {

  const {
    slug
  } =
    await params

  const locationSlug =
    slug.toLowerCase()

  const location =
    locations[
      locationSlug
    ]

  if (
    !location
  ) {

    return {

      title:
        "Location Not Found | RANKD",

      robots: {

        index:
          false,

        follow:
          false

      }

    }

  }

  const title =
    `Top 7 ${location.name} Rankings | RANKD`

  const description =
    `Discover the Top 7 rankings from ${location.name}, ${location.city}. Explore local opinions across food, travel, culture, sport and more.`

  const canonical =
    `${SITE_URL}/location/${locationSlug}`

  return {

    title,

    description,

    alternates: {

      canonical

    },

    openGraph: {

      type:
        "website",

      url:
        canonical,

      siteName:
        "RANKD",

      title,

      description,

      locale:
        "en_GB"

    },

    twitter: {

      card:
        "summary_large_image",

      title,

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

export default async function LocationPage({
  params
}: LocationPageProps) {

  const {
    slug
  } =
    await params

  const locationSlug =
    slug.toLowerCase()

  const location =
    locations[
      locationSlug
    ]

  /*
   *
   * An unknown location slug is a genuine
   * 404. A known location with zero RANKDs
   * is NOT a 404.
   *
   */

  if (
    !location
  ) {

    notFound()

  }

  /*
   *
   * Query Supabase directly for this location.
   *
   * This avoids relying on the global rankings
   * query and then filtering the returned rows
   * in JavaScript.
   *
   */

  const locationRankings =
    await getRankingsForLocation(
      location
    )

  const categories = [
    ...new Set(
      locationRankings.map(
        ranking =>
          ranking.category
      )
    )
  ]

  const countryLabel =
    location.country ===
      "United Kingdom"
      ? "UK"
      : location.country ===
          "Philippines"
        ? "PH"
        : location.country

  /*
   *
   * Build a Google Maps search for the
   * general location using the existing
   * RANKD Maps integration.
   *
   */

  const mapQuery = [
    location.name,
    ...(location.city &&
    location.city.toLowerCase() !== location.name.toLowerCase()
      ? [location.city]
      : []),
    location.country
  ].join(", ")

  const mapsSearchUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  const locationMapUrl =
    getGoogleMapsEmbedUrl(
      mapsSearchUrl
    )

  const canonical =
    `${SITE_URL}/location/${locationSlug}`

  const title =
    `Top 7 rankings from ${location.name}`

  const description =
    `Discover local opinions, rankings and perspectives from ${location.name}, ${location.city}.`

  const structuredData = {

    "@context":
      "https://schema.org",

    "@graph": [

      {

        "@type":
          "CollectionPage",

        "@id":
          `${canonical}/#webpage`,

        url:
          canonical,

        name:
          `${title} | RANKD`,

        description,

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
          `${canonical}/#rankings`,

        name:
          `Top 7 rankings from ${location.name}`,

        url:
          canonical,

        numberOfItems:
          locationRankings.length,

        itemListElement:

          locationRankings.map(

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
          px-4
          py-8
          sm:px-6
          lg:px-8
        "

      >

        <div

          className="
            mx-auto
            max-w-7xl
          "

        >

          <header

            className="
              mb-8
            "

          >

            <div

              className="
                mb-3
                inline-flex
                items-center
                rounded-full
                border
                border-black/10
                bg-white
                px-3
                py-1
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-black/60
              "

            >

              {location.name}

              {

                !location.cityLevel &&

                location.city &&

                location.city.toLowerCase() !==
                  location.name.toLowerCase()

                  ? (

                    <>

                      <span

                        className="
                          mx-2
                          text-black/30
                        "

                      >

                        ·

                      </span>

                      {location.city}

                    </>

                  )

                  : null

              }

              {

                location.state

                  ? (

                    <>

                      <span

                        className="
                          mx-2
                          text-black/30
                        "

                      >

                        ·

                      </span>

                      {location.state}

                    </>

                  )

                  : null

              }

              <span

                className="
                  mx-2
                  text-black/30
                "

              >

                ·

              </span>

              {countryLabel}

            </div>

            <h1

              className="
                max-w-4xl
                text-4xl
                font-black
                tracking-tight
                text-black
                sm:text-5xl
                lg:text-6xl
              "

            >

              Top 7 rankings from{" "}

              {location.name}

            </h1>

            <p

              className="
                mt-4
                max-w-2xl
                text-base
                leading-7
                text-black/60
                sm:text-lg
              "

            >

              Discover local opinions,
              rankings and perspectives
              from {location.name},
              {" "}
              {location.city}.

            </p>

          </header>

          {locationMapUrl && (

            <section

              aria-label={`Map of ${location.name}`}

              className="
                mb-10
                overflow-hidden
                rounded-2xl
                border
                border-black/10
                bg-white
              "

            >

              <iframe

                src={locationMapUrl}

                title={`Map of ${location.name}`}

                className="
                  block
                  h-56
                  w-full
                  border-0
                  sm:h-64
                "

                loading="lazy"

                referrerPolicy="no-referrer-when-downgrade"

              />

              <a

                href={mapsSearchUrl}

                target="_blank"

                rel="noopener noreferrer"

                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition-colors
                  hover:bg-black/[0.03]
                "

              >

                <span>

                  Explore {location.name} on Google Maps

                </span>

                <span aria-hidden="true">

                  ↗

                </span>

              </a>

            </section>

          )}

          <section>

            <div

              className="
                mb-8
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "

            >

              <div>

                <h2

                  className="
                    text-xl
                    font-bold
                    text-black
                  "

                >

                  {locationRankings.length} RANKDs

                </h2>

                <p

                  className="
                    mt-1
                    text-sm
                    text-black/50
                  "

                >

                  {

                    locationRankings.length > 0

                      ? `Across ${categories.length} categories`

                      : "No RANKDs have been added here yet"

                  }

                </p>

              </div>

            </div>

            {

              locationRankings.length > 0 ? (

                <div

                  className="
                    grid
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "

                >

                  {locationRankings.map(
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
                  )}

                </div>

              ) : (

                <div

                  className="
                    rounded-2xl
                    border
                    border-black/10
                    bg-white
                    px-6
                    py-12
                    text-center
                  "

                >

                  <p

                    className="
                      text-lg
                      font-semibold
                      text-black
                    "

                  >

                    No RANKDs here yet.

                  </p>

                  <p

                    className="
                      mt-2
                      text-sm
                      text-black/50
                    "

                  >

                    Check back soon for
                    rankings from {location.name}.

                  </p>

                </div>

              )

            }

          </section>

        </div>

      </main>

    </>

  )

}
