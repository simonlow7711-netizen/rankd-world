import {
  getAllRankings
} from "@/utils/supabaseRankings"

import RankingCard from "@/components/RankingCard"


export const dynamic =
  "force-dynamic"


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

  },

  dundee: {

    name:
      "Dundee",

    city:
      "Dundee",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  middlesbrough: {

    name:
      "Middlesbrough",

    city:
      "Middlesbrough",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  "stoke-on-trent": {

    name:
      "Stoke-on-Trent",

    city:
      "Stoke-on-Trent",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  derry: {

    name:
      "Derry",

    city:
      "Derry",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  swansea: {

    name:
      "Swansea",

    city:
      "Swansea",

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


function normalise(
  value:string | null | undefined
):string{

  return (
    value ??
    ""
  )
    .trim()
    .toLowerCase()

}


function normaliseCountry(
  value:string | null | undefined
):string{

  const country =
    normalise(
      value
    )


  if(
    country === "uk"
  ){

    return "united kingdom"

  }


  if(
    country === "us"
  ){

    return "united states"

  }


  return country

}


function locationMatches(
  ranking:any,
  location:LocationConfig
):boolean{

  if(
    !ranking.location
  ){

    return false

  }


  const rankingName =
    normalise(
      ranking.location.name
    )

  const rankingCity =
    normalise(
      ranking.location.city
    )

  const rankingCountry =
    normaliseCountry(
      ranking.location.country
    )

  const locationName =
    normalise(
      location.name
    )

  const locationCity =
    normalise(
      location.city
    )

  const locationCountry =
    normaliseCountry(
      location.country
    )


  /*
   *
   * City-level locations:
   *
   * Leeds, Sheffield, Dundee etc.
   * match against the city rather than
   * requiring a particular location_name.
   *
   */
  if(
    location.cityLevel
  ){

    return (

      rankingCity ===
        locationCity

      &&

      rankingCountry ===
        locationCountry

    )

  }


  /*
   *
   * Neighbourhood / district locations:
   *
   * Match the location name and, where
   * available, the associated city/country.
   *
   */
  if(
    rankingName !==
      locationName
  ){

    return false

  }


  if(
    rankingCity &&
    rankingCity !==
      locationCity
  ){

    return false

  }


  if(
    rankingCountry &&
    rankingCountry !==
      locationCountry
  ){

    return false

  }


  return true

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


  if(
    !location
  ){

    return {}

  }


  const title =
    `Top 7 ${location.name} Rankings | RANKD`

  const description =
    `Discover the Top 7 rankings from ${location.name}, ${location.city}. Explore local opinions across food, travel, culture, sport and more.`

  const canonical =
    `/location/${slug.toLowerCase()}`


  return {

    title,

    description,

    alternates: {

      canonical

    },

    openGraph: {

      title,

      description,

      url:
        canonical,

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


  /*
   *
   * An unknown location slug is a genuine
   * 404. A known location with zero RANKDs
   * is NOT a 404.
   *
   */
  if(
    !location
  ){

    return null

  }


  const allRankings =
    await getAllRankings()


  const locationRankings =
    allRankings.filter(
      ranking =>
        locationMatches(
          ranking,
          location
        )
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
          "United States"
        ? "US"
        : location.country ===
            "Philippines"
          ? "PH"
          : location.country


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

  )

}