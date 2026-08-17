"use client"


import {
  useEffect,
  useState
} from "react"


import {
  useRouter
} from "next/navigation"


import Link from "next/link"


import {
  Ranking
} from "@/types/ranking"


import RankdExplanation from "@/components/RankdExplanation"


import DiscoveryReason from "@/components/DiscoveryReason"


import RankingResponse from "@/components/RankingResponse"


import RankingEngagement from "@/components/RankingEngagement"


import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"


import {
  trackEvent
} from "@/utils/analytics"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


type RankingCardProps = {

  ranking: Ranking

}


export default function RankingCard({

  ranking

}: RankingCardProps) {


  const router =
    useRouter()


  const [
    response,
    setResponse
  ] =
    useState<
      "rankd" |
      "rerankd" |
      null
    >(
      null
    )


  const [
    engagement,
    setEngagement
  ] =
    useState<RankingEngagementData>({

      views:0,

      rankd:0,

      rerankd:0

    })


  useEffect(() => {

    let cancelled = false


    async function loadEngagement() {

      const data =
        await getRankingEngagement(

          ranking.id

        )


      if (!cancelled) {

        setEngagement(
          data
        )

      }

    }


    loadEngagement()


    return () => {

      cancelled = true

    }

  }, [ranking.id])


  const sortedItems =

    [...ranking.items]

      .sort(

        (a, b) =>

          a.position -
          b.position

      )


  function handleRankd() {

    if (response !== null) {

      return

    }


    trackEvent(

      "ranking_rankd",

      {

        rankingId:
          ranking.id

      }

    )


    setResponse(
      "rankd"
    )


    setEngagement(

      current => ({

        ...current,

        rankd:
          current.rankd + 1

      })

    )

  }


  function handleRerankd() {

    if (response !== null) {

      return

    }


    trackEvent(

      "ranking_rerank_started",

      {

        rankingId:
          ranking.id

      }

    )


    const items =

      sortedItems

        .map(

          item =>
            item.name

        )

        .join(
          "|"
        )


    const rootId =

      ranking.rootId ??
      ranking.id


    router.push(

      `/create?title=${encodeURIComponent(

        ranking.title

      )}&category=${encodeURIComponent(

        ranking.category

      )}&items=${encodeURIComponent(

        items

      )}&parentId=${encodeURIComponent(

        ranking.id

      )}&rootId=${encodeURIComponent(

        rootId

      )}`

    )

  }


  return (

    <article

      className="
        rankd-card
        p-8
        h-full
        transition
      "

    >

      <Link

        href={
          `/rank/${ranking.id}`
        }

        className="
          block
          hover:-translate-y-1
          transition
        "

      >

        <p

          className="
            rankd-accent
            uppercase
            tracking-widest
            text-xs
            font-black
          "

        >

          {
            ranking.category ||
            "General"
          }

        </p>


        <h3

          className="
            text-3xl
            font-black
            mt-5
            leading-tight
          "

        >

          {
            formatRankingTitle(
              ranking.title
            )
          }

        </h3>


        {
          ranking.description && (

            <p

              className="
                mt-4
                rankd-muted
                leading-relaxed
              "

            >

              {
                ranking.description
              }

            </p>

          )
        }


        <div

          className="
            mt-8
            border-t
            border-black/10
          "

        >

          <div

            className="
              pt-6
            "

          >

            <p

              className="
                rankd-accent
                uppercase
                tracking-widest
                text-xs
                font-black
              "

            >

              Top 7

            </p>


            <div

              className="
                mt-4
                space-y-2
              "

            >

              {
                sortedItems.map(

                  item => (

                    <div

                      key={
                        `${ranking.id}-${item.position}`
                      }

                      className="
                        flex
                        items-center
                        gap-4
                        py-2
                      "

                    >

                      <span

                        className="
                          w-8
                          shrink-0
                          text-sm
                          font-black
                          rankd-accent
                        "

                      >

                        {
                          String(
                            item.position
                          ).padStart(
                            2,
                            "0"
                          )
                        }

                      </span>


                      <span

                        className="
                          text-lg
                          font-black
                          leading-tight
                        "

                      >

                        {
                          item.name
                        }

                      </span>

                    </div>

                  )

                )
              }

            </div>

          </div>


          <div

            className="
              mt-6
              pt-5
              border-t
              border-black/5
            "

          >

            <RankingEngagement

              views={
                engagement.views
              }

              rankd={
                engagement.rankd
              }

              rerankd={
                engagement.rerankd
              }

            />

          </div>

        </div>

      </Link>


      <div

        className="
          mt-8
          pt-6
          border-t
          border-black/10
        "

      >

        {
          response === null && (

            <>

              <div

                className="
                  text-center
                "

              >

                <p

                  className="
                    font-black
                    text-xl
                  "

                >

                  Would you rank this
                  the same?

                </p>


                <p

                  className="
                    mt-2
                    text-sm
                    rankd-muted
                  "

                >

                  Make your call.

                </p>

              </div>


              <div

                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                "

              >

                <button

                  type="button"

                  onClick={
                    handleRankd
                  }

                  className="
                    rounded-2xl
                    bg-black
                    text-white
                    px-4
                    py-5
                    text-center
                    hover:-translate-y-1
                    transition
                  "

                >

                  <span

                    className="
                      block
                      text-xl
                      font-black
                    "

                  >

                    RANKD

                  </span>


                  <span

                    className="
                      block
                      mt-1
                      text-xs
                      opacity-70
                    "

                  >

                    I'd keep this

                  </span>

                </button>


                <button

                  type="button"

                  onClick={
                    handleRerankd
                  }

                  className="
                    rounded-2xl
                    bg-white
                    text-black
                    border-2
                    border-black
                    px-4
                    py-5
                    text-center
                    hover:-translate-y-1
                    transition
                  "

                >

                  <span

                    className="
                      block
                      text-xl
                      font-black
                    "

                  >

                    RE-RANKD

                  </span>


                  <span

                    className="
                      block
                      mt-1
                      text-xs
                      opacity-60
                    "

                  >

                    I'd change it

                  </span>

                </button>

              </div>

            </>

          )
        }


        {
          response !== null && (

            <RankingResponse

              onRankd={
                handleRankd
              }

              onRerankd={
                handleRerankd
              }

            />

          )
        }

      </div>


      <RankdExplanation

        ranking={
          ranking
        }

      />


      <DiscoveryReason

        ranking={
          ranking
        }

      />

    </article>

  )

}