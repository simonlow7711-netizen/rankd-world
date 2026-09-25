"use client"

import {
  Suspense,
  useEffect,
  useState
} from "react"


import {
  useSearchParams
} from "next/navigation"


import {
  Search
} from "lucide-react"


import RankingCard from "@/components/RankingCard"


import {
  searchSupabaseRankings
} from "@/utils/supabaseRankings"


import {
  Ranking
} from "@/types/ranking"


function SearchResults() {

  const searchParams =
    useSearchParams()


  const query =
    searchParams.get(
      "q"
    )?.trim() ?? ""


  const [
    rankings,
    setRankings
  ] = useState<Ranking[]>([])


  const [
    loading,
    setLoading
  ] = useState(false)


  useEffect(
    () => {

      let cancelled =
        false


      const search =
        async () => {

          if(!query){

            setRankings([])

            setLoading(false)

            return

          }


          setLoading(true)


          const results =
            await searchSupabaseRankings(
              query
            )


          if(!cancelled){

            setRankings(
              results
            )

            setLoading(false)

          }

        }


      search()


      return () => {

        cancelled = true

      }

    },
    [
      query
    ]
  )


  return (

    <main
      className="
        min-h-[calc(100vh-7rem)]
        bg-[#F7F4EE]
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          py-10
          md:px-6
          md:py-14
        "
      >

        <div
          className="
            mb-10
          "
        >

          <div
            className="
              mb-3
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-black/50
            "
          >

            <Search
              className="h-4 w-4"
            />

            Search RANKD

          </div>


          {query ? (

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                md:text-5xl
              "
            >
              Results for “{query}”
            </h1>

          ) : (

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                md:text-5xl
              "
            >
              Search RANKD
            </h1>

          )}

        </div>


        {loading && (

          <div
            className="
              py-10
              text-center
              text-sm
              font-medium
              text-black/50
            "
          >
            Searching RANKD…
          </div>

        )}


        {!loading &&
          query &&
          rankings.length === 0 && (

            <div
              className="
                rounded-3xl
                border
                border-black/[0.07]
                bg-white/60
                px-6
                py-12
                text-center
              "
            >

              <p
                className="
                  text-lg
                  font-bold
                "
              >
                Nothing found.
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-black/50
                "
              >
                Try another word or phrase.
              </p>

            </div>

          )}


        {!loading &&
          rankings.length > 0 && (

            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >

              {rankings.map(
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

          )}

      </div>

    </main>

  )

}


export default function SearchPage() {

  return (

    <Suspense
      fallback={

        <main
          className="
            min-h-[calc(100vh-7rem)]
            bg-[#F7F4EE]
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-5xl
              px-4
              py-10
              md:px-6
              md:py-14
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-black/50
              "
            >

              <Search
                className="h-4 w-4"
              />

              Search RANKD

            </div>

          </div>

        </main>

      }
    >

      <SearchResults />

    </Suspense>

  )

}