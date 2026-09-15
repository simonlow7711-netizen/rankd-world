import {
  notFound
} from "next/navigation"

import {
  getAllRankings
} from "@/utils/supabaseRankings"

import RankingCard from "@/components/RankingCard"


type LocationConfig = {

  name:string

  city:string

  country:string

  cityLevel?:boolean

}


const locations:Record<
  string,
  LocationConfig
> = {

  poblacion: {

    name:
      "Poblacion",

    city:
      "Makati",

    country:
      "Philippines"

  },

  islington: {

    name:
      "Islington",

    city:
      "London",

    country:
      "United Kingdom"

  },

  williamsburg: {

    name:
      "Williamsburg",

    city:
      "New York",

    country:
      "United States"

  },

  leeds: {

    name:
      "Leeds",

    city:
      "Leeds",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  sheffield: {

    name:
      "Sheffield",

    city:
      "Sheffield",

    country:
      "United Kingdom",

    cityLevel:
      true

  }

}


type LocationPageProps = {

  params:Promise<{
    slug:string
  }>

}


export async function generateMetadata({
  params
}:LocationPageProps) {

  const {
    slug
  } =
    await params

  const location =
    locations[
      slug.toLowerCase()
    ]

  if (!location) {

    return {}

  }

  return {

    title:
      `Top 7 ${location.name} Rankings | RANKD`,

    description:
      `Discover the Top 7 rankings from ${location.name}, ${location.city}. Explore local opinions across food, travel, culture, sport and more.`,

    alternates: {

      canonical:
        `/location/${slug.toLowerCase()}`

    },

    openGraph: {

      title:
        `Top 7 ${location.name} Rankings | RANKD`,

      description:
        `Discover the Top 7 rankings from ${location.name}, ${location.city}. Explore local opinions across food, travel, culture, sport and more.`,

      url:
        `/location/${slug.toLowerCase()}`,

      type:
        "website"

    }

  }

}


export default async function LocationPage({
  params
}:LocationPageProps) {

  const {
    slug
  } =
    await params

  const location =
    locations[
      slug.toLowerCase()
    ]

  if (!location) {

    notFound()

  }


  const allRankings =
    await getAllRankings()


  const locationRankings =
    allRankings.filter(
      ranking => {

        if (!ranking.location) {

          return false

        }


        const rankingName =
          ranking.location.name
            ?.trim()
            .toLowerCase()

        const rankingCity =
          ranking.location.city
            ?.trim()
            .toLowerCase()

        const rankingCountry =
          ranking.location.country
            ?.trim()
            .toLowerCase()

        const normalisedRankingCountry =
          rankingCountry ===
            "uk"
            ? "united kingdom"
            : rankingCountry

        const normalisedLocationCountry =
          location.country
            .trim()
            .toLowerCase()


        if (
          location.cityLevel
        ) {

          return (

            rankingCity ===
              location.city
                .trim()
                .toLowerCase()

            &&

            normalisedRankingCountry ===
              normalisedLocationCountry

          )

        }


        return (

          rankingName ===
            location.name
              .trim()
              .toLowerCase()

          &&

          (
            !ranking.location.city
            ||
            rankingCity ===
              location.city
                .trim()
                .toLowerCase()
          )

          &&

          (
            !ranking.location.country
            ||
            normalisedRankingCountry ===
              normalisedLocationCountry
          )

        )

      }
    )


  if (
    locationRankings.length === 0
  ) {

    notFound()

  }


  const categories = [
    ...new Set(
      locationRankings.map(
        ranking =>
          ranking.category
      )
    )
  ]


  return (

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
            mb-10
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

            <span
              className="
                mx-2
                text-black/30
              "
            >
              ·
            </span>

            {location.city}

            <span
              className="
                mx-2
                text-black/30
              "
            >
              ·
            </span>

            {
              location.country ===
                "United Kingdom"
                ? "UK"
                : location.country ===
                    "United States"
                  ? "US"
                  : location.country ===
                      "Philippines"
                    ? "PH"
                    : location.country
            }

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
            {` `}
            {location.city}.

          </p>

        </header>


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

                Across {categories.length} categories

              </p>

            </div>

          </div>


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

        </section>

      </div>

    </main>

  )

}