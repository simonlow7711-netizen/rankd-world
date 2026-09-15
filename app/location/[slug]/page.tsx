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


        if (
          location.cityLevel
        ) {

          return (

            rankingCity ===
              location.city
                .trim()
                .toLowerCase()

            &&

            rankingCountry ===
              location.country
                .trim()
                .toLowerCase()

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
            rankingCountry ===
              location.country
                .trim()
                .toLowerCase()
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
        text-black
        px-6
        py-12
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >

        <section
          className="
            mb-16
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
            Local RANKD
          </p>


          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              mt-5
              leading-none
            "
          >
            Top 7
            <br />
            {location.name}
          </h1>


          <p
            className="
              mt-6
              text-xl
              rankd-muted
              max-w-2xl
              mx-auto
            "
          >
            The Top 7 opinions,
            rankings and debates
            from {location.name},
            {` ${location.city}`}.
          </p>


          <p
            className="
              mt-4
              text-sm
              uppercase
              tracking-[0.2em]
              font-black
              text-black/50
            "
          >
            {location.city}
            {" · "}
            {location.country}
          </p>

        </section>


        <section
          className="
            mb-16
          "
        >

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
            "
          >

            <div
              className="
                rankd-card
                p-6
              "
            >

              <p
                className="
                  text-3xl
                  font-black
                "
              >
                {locationRankings.length}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  rankd-muted
                "
              >
                Local RANKDs
              </p>

            </div>


            <div
              className="
                rankd-card
                p-6
              "
            >

              <p
                className="
                  text-3xl
                  font-black
                "
              >
                {categories.length}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  rankd-muted
                "
              >
                Categories
              </p>

            </div>

          </div>

        </section>


        {
          categories.map(
            category => {

              const categoryRankings =
                locationRankings.filter(
                  ranking =>
                    ranking.category ===
                    category
                )


              return (

                <section
                  key={category}
                  className="
                    mb-20
                  "
                >

                  <div
                    className="
                      mb-8
                    "
                  >

                    <p
                      className="
                        rankd-accent
                        uppercase
                        tracking-widest
                        text-sm
                        font-black
                      "
                    >
                      {location.name}
                    </p>


                    <h2
                      className="
                        text-4xl
                        md:text-5xl
                        font-black
                        mt-3
                      "
                    >
                      {category}
                    </h2>

                  </div>


                  <div
                    className="
                      grid
                      md:grid-cols-2
                      lg:grid-cols-3
                      gap-8
                    "
                  >

                    {
                      categoryRankings.map(
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

              )

            }
          )
        }

      </div>

    </main>

  )

}