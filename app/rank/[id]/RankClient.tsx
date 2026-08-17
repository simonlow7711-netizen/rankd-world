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
  trackEvent
} from "@/utils/analytics"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  supabase
} from "@/utils/supabase"


import {
  getStoredUserId
} from "@/utils/currentUser"


import ConversationTree from "@/components/ConversationTree"


import TasteInsightCard from "@/components/TasteInsightCard"


import RankingResponse from "@/components/RankingResponse"


import RankingEngagement from "@/components/RankingEngagement"


import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"


import {
  buildConversationTree,
  ConversationNode
} from "@/utils/conversationTree"


import {
  generateTasteInsight
} from "@/utils/tasteInsights"


import {
  generateTasteGraphSignal
} from "@/utils/tasteGraphSignal"


import {
  generateTasteIdentity
} from "@/utils/tasteIdentity"


import {
  buildTasteGraph
} from "@/utils/tasteGraph"


import {
  Ranking
} from "@/types/ranking"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


type RankClientProps = {

  id:string

  initialRanking?:Ranking

}


type PerspectiveRanking = {

  id:string

  title:string

  parentId:string | null

  rootId:string | null

  createdAt:string | null

}


export default function RankClient({

  id,

  initialRanking

}:RankClientProps) {


  const router =
    useRouter()


  const [
    ranking,
    setRanking
  ] =
    useState<Ranking | null>(
      initialRanking ??
      null
    )


  const [
    originalRanking,
    setOriginalRanking
  ] =
    useState<Ranking | null>(
      initialRanking ??
      null
    )


  const [
    perspectives,
    setPerspectives
  ] =
    useState<PerspectiveRanking[]>(
      []
    )


  const [
    conversationTree,
    setConversationTree
  ] =
    useState<ConversationNode[]>(
      []
    )


  const [
    tasteGraph,
    setTasteGraph
  ] =
    useState<
      ReturnType<
        typeof buildTasteGraph
      > | null
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


  const [
    loading,
    setLoading
  ] =
    useState(
      !initialRanking
    )


  useEffect(() => {

    if (!id) {

      return

    }


    async function load() {

      setLoading(
        !initialRanking
      )


      trackEvent(

        "ranking_viewed",

        {

          rankingId:id

        }

      )


      let currentRanking =
        initialRanking ??
        null


      if (!currentRanking) {

        currentRanking =
          await getSupabaseRanking(
            id
          )

      }


      if (!currentRanking) {

        setRanking(null)

        setLoading(false)

        return

      }


      setRanking(
        currentRanking
      )


      const rankingEngagement =
        await getRankingEngagement(

          currentRanking.id

        )


      setEngagement(
        rankingEngagement
      )


      const rootId =
        currentRanking.rootId ??
        currentRanking.id


      let rootRanking =
        currentRanking


      if (
        rootId !==
        currentRanking.id
      ) {

        const fetchedRoot =
          await getSupabaseRanking(
            rootId
          )


        if (fetchedRoot) {

          rootRanking =
            fetchedRoot

        }

      }


      setOriginalRanking(
        rootRanking
      )


      const storedUserId =
        getStoredUserId()


      if (storedUserId) {

        try {

          const {

            data:userRankingRows,

            error:userRankingError

          } =
            await supabase

              .from("rankings")

              .select(
                "id"
              )

              .eq(
                "user_id",
                storedUserId
              )


          if (userRankingError) {

            console.error(

              "TASTE GRAPH RANKING LOAD ERROR",

              userRankingError

            )

          }
          else if (

            userRankingRows &&

            userRankingRows.length > 0

          ) {

            const userRankings =

              (

                await Promise.all(

                  userRankingRows.map(

                    row =>
                      getSupabaseRanking(
                        row.id
                      )

                  )

                )

              )

                .filter(

                  (
                    userRanking
                  ):userRanking is Ranking =>

                    userRanking !== null

                )


            if (

              userRankings.length > 0

            ) {

              const graph =
                buildTasteGraph(

                  storedUserId,

                  userRankings

                )


              setTasteGraph(
                graph
              )

            }

          }

        }
        catch (
          tasteGraphError
        ) {

          console.error(

            "TASTE GRAPH LOAD ERROR",

            tasteGraphError

          )

        }

      }


      const {

        data:conversationRankings,

        error:conversationError

      } =
        await supabase

          .from("rankings")

          .select(

            `
              id,
              title,
              parent_id,
              root_id,
              user_id,
              created_at
            `

          )

          .eq(

            "root_id",

            rootId

          )

          .order(

            "created_at",

            {

              ascending:true

            }

          )


      if (conversationError) {

        console.error(

          "CONVERSATION LOAD ERROR",

          conversationError

        )

      }


      const conversationItems:

        Omit<
          ConversationNode,
          "children"
        >[] =

        (

          conversationRankings ??
          []

        )

          .map(

            (item:any) => ({

              id:
                item.id,

              title:
                item.title,

              parentId:
                item.parent_id ??
                null,

              rootId:
                item.root_id ??
                rootId,

              createdAt:
                item.created_at ??
                undefined

            })

          )


      const hasOriginal =
        conversationItems.some(

          item =>
            item.id ===
            rootRanking.id

        )


      if (!hasOriginal) {

        conversationItems.unshift(

          {

            id:
              rootRanking.id,

            title:
              rootRanking.title,

            parentId:
              null,

            rootId:
              rootId,

            createdAt:
              rootRanking.createdAt

          }

        )

      }


      const hasCurrent =
        conversationItems.some(

          item =>
            item.id ===
            currentRanking.id

        )


      if (!hasCurrent) {

        conversationItems.push(

          {

            id:
              currentRanking.id,

            title:
              currentRanking.title,

            parentId:
              currentRanking.parentId ??
              rootRanking.id,

            rootId:
              rootId,

            createdAt:
              currentRanking.createdAt

          }

        )

      }


      const parentId =
        currentRanking.parentId


      if (

        parentId &&

        !conversationItems.some(

          item =>
            item.id ===
            parentId

        )

      ) {

        const fetchedParent =
          await getSupabaseRanking(
            parentId
          )


        if (fetchedParent) {

          conversationItems.push(

            {

              id:
                fetchedParent.id,

              title:
                fetchedParent.title,

              parentId:
                fetchedParent.parentId ??
                null,

              rootId:
                fetchedParent.rootId ??
                rootId,

              createdAt:
                fetchedParent.createdAt

            }

          )

        }

      }


      const tree =
        buildConversationTree(

          conversationItems

        )


      setConversationTree(
        tree
      )


      const perspectiveItems:
        PerspectiveRanking[] =

        conversationItems

          .filter(

            item =>
              item.id !==
              rootRanking.id

          )

          .map(

            item => ({

              id:
                item.id,

              title:
                item.title,

              parentId:
                item.parentId,

              rootId:
                item.rootId,

              createdAt:
                item.createdAt ??
                null

            })

          )


      setPerspectives(
        perspectiveItems
      )


      setLoading(false)

    }


    load()


  }, [id, initialRanking])


  function rankIt() {

    if (!ranking) {

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

      [...ranking.items]

        .sort(

          (a,b) =>

            a.position -
            b.position

        )

        .map(

          item =>
            item.name

        )

        .join("|")


    const rootId =

      ranking.rootId ??
      ranking.id


    router.push(

      `/create?title=${encodeURIComponent(

        originalRanking?.title ??
        ranking.title

      )}&category=${encodeURIComponent(

        originalRanking?.category ??
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


  function handleRankd() {

    if (!ranking) {

      return

    }


    trackEvent(

      "ranking_rankd",

      {

        rankingId:
          ranking.id

      }

    )


    setEngagement(

      current => ({

        ...current,

        rankd:
          current.rankd + 1

      })

    )

  }


  if (loading) {

    return null

  }


  if (!ranking) {

    return (

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
            max-w-6xl
            mx-auto
            text-center
          "

        >

          <h1

            className="
              text-4xl
              font-black
            "

          >

            Ranking not found

          </h1>

        </div>

      </main>

    )

  }


  const isPerspective =

    originalRanking !== null &&

    originalRanking.id !==
    ranking.id


  const displayRanking =
    originalRanking ??
    ranking


  const displayTitle =
    formatRankingTitle(
      displayRanking.title
    )


  const displayDescription =
    displayRanking.description


  const sortedOriginalItems =

    [...displayRanking.items]

      .sort(

        (a,b) =>

          a.position -
          b.position

      )


  const sortedPerspectiveItems =

    [...ranking.items]

      .sort(

        (a,b) =>

          a.position -
          b.position

      )


  const tasteInsight =
    generateTasteInsight(
      ranking
    )


  const tasteSignal =
    generateTasteGraphSignal(
      ranking
    )


  const tasteIdentity =

    tasteGraph

      ?

      generateTasteIdentity(
        tasteGraph
      )

      :

      generateTasteIdentity(
        tasteSignal
      )


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
          max-w-6xl
          mx-auto
        "

      >

        {
          isPerspective && (

            <div

              className="
                mb-10
              "

            >

              <div

                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-end
                  md:justify-between
                  gap-4
                "

              >

                <div>

                  <p

                    className="
                      rankd-accent
                      uppercase
                      tracking-widest
                      text-sm
                      font-black
                    "

                  >

                    Different perspective

                  </p>


                  <h2

                    className="
                      text-4xl
                      md:text-5xl
                      font-black
                      leading-tight
                      mt-2
                    "

                  >

                    {
                      ranking.creatorDisplayName ||
                      ranking.creator ||
                      "RANKD user"
                    }{" "}

                    ranked this differently.

                  </h2>

                </div>


                <Link

                  href={
                    `/rank/${originalRanking?.id}`
                  }

                  className="
                    rankd-button
                    whitespace-nowrap
                    inline-block
                  "

                >

                  View original RANKD →

                </Link>

              </div>

            </div>

          )
        }


        {
          conversationTree.length > 0 && (

            <div

              className="
                mb-10
              "

            >

              <ConversationTree

                nodes={
                  conversationTree
                }

                currentId={
                  ranking.id
                }

              />

            </div>

          )
        }


        <div

          className="
            grid
            lg:grid-cols-3
            gap-10
          "

        >

          <section

            className="
              lg:col-span-2
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

              {
                displayRanking.category ||
                "General"
              }

            </p>


            <h1

              className="
                text-6xl
                md:text-8xl
                font-black
                leading-none
                mt-6
              "

            >

              {displayTitle}

            </h1>


            {
              displayDescription && (

                <p

                  className="
                    mt-8
                    text-xl
                    md:text-2xl
                    rankd-muted
                    leading-relaxed
                    max-w-3xl
                  "

                >

                  {displayDescription}

                </p>

              )
            }


            <p

              className="
                mt-6
                rankd-muted
                text-lg
              "

            >

              Ranked by{" "}

              {
                displayRanking.creatorDisplayName ||
                displayRanking.creator ||
                "RANKD user"
              }

            </p>


            <div

              className="
                mt-5
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


            <div

              className="
                mt-10
                space-y-4
              "

            >

              {
                sortedOriginalItems.map(

                  item => (

                    <div

                      key={
                        `original-${item.position}`
                      }

                      className="
                        rankd-card
                        p-6
                        flex
                        items-center
                        gap-6
                      "

                    >

                      <div

                        className="
                          text-4xl
                          font-black
                          rankd-accent
                        "

                      >

                        #{item.position}

                      </div>


                      <div

                        className="
                          text-2xl
                          md:text-3xl
                          font-black
                        "

                      >

                        {item.name}

                      </div>

                    </div>

                  )

                )
              }

            </div>


            {
              isPerspective && (

                <div

                  className="
                    mt-14
                    pt-12
                    border-t
                    border-black/10
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

                    This perspective

                  </p>


                  <h3

                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      mt-3
                    "

                  >

                    {
                      ranking.creatorDisplayName ||
                      ranking.creator ||
                      "RANKD user"
                    }{" "}

                    would rank it differently.

                  </h3>


                  <div

                    className="
                      mt-8
                      space-y-4
                    "

                  >

                    {
                      sortedPerspectiveItems.map(

                        item => (

                          <div

                            key={
                              `perspective-${item.position}`
                            }

                            className="
                              rounded-3xl
                              border
                              border-black/10
                              bg-white
                              p-6
                              flex
                              items-center
                              gap-6
                            "

                          >

                            <div

                              className="
                                text-4xl
                                font-black
                                rankd-accent
                              "

                            >

                              #{item.position}

                            </div>


                            <div

                              className="
                                text-2xl
                                font-black
                              "

                            >

                              {item.name}

                            </div>

                          </div>

                        )

                      )
                    }

                  </div>

                </div>

              )
            }


            <RankingResponse

              onRankd={
                handleRankd
              }

              onRerankd={
                rankIt
              }

            />


            <div

              className="
                mt-12
              "

            >

              <TasteInsightCard

                insight={
                  tasteInsight
                }

                signal={
                  tasteSignal
                }

                identity={
                  tasteIdentity
                }

              />

            </div>

          </section>


          <aside

            className="
              space-y-6
            "

          >

            <div

              className="
                rankd-card
                p-8
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

                {perspectives.length}

              </p>


              <h2

                className="
                  text-3xl
                  font-black
                  mt-1
                "

              >

                Perspectives

              </h2>


              <p

                className="
                  mt-4
                  rankd-muted
                "

              >

                {
                  perspectives.length === 0

                    ? `
                      Be the first person
                      to rank this differently.
                    `

                    : `
                      ${
                        perspectives.length
                      }
                      ${
                        perspectives.length === 1
                          ? "person has"
                          : "people have"
                      }
                      added a different perspective.
                    `
                }

              </p>


              <div

                className="
                  mt-6
                  space-y-3
                "

              >

                {
                  perspectives

                    .slice(
                      0,
                      7
                    )

                    .map(

                      perspective => (

                        <Link

                          key={
                            perspective.id
                          }

                          href={
                            `/rank/${perspective.id}`
                          }

                          className="
                            block
                            w-full
                            rounded-2xl
                            p-4
                            text-left
                            border
                            transition
                            bg-black/[0.04]
                            border-black/5
                            hover:bg-black/[0.07]
                          "

                        >

                          <p

                            className="
                              font-black
                            "

                          >

                            {
                              perspective.id ===
                              ranking.id

                                ? "Current perspective"

                                : "Different perspective"
                            }

                          </p>


                          <p

                            className="
                              mt-1
                              text-sm
                              rankd-muted
                            "

                          >

                            View this perspective →

                          </p>

                        </Link>

                      )

                    )

                }

              </div>


              {
                perspectives.length > 7 && (

                  <p

                    className="
                      mt-5
                      text-sm
                      font-bold
                      rankd-muted
                    "

                  >

                    +

                    {" "}

                    {
                      perspectives.length - 7
                    }

                    {" "}

                    more perspectives

                  </p>

                )
              }

            </div>


            <Link

              href="/explore"

              className="
                block
                rankd-card
                p-8
                hover:-translate-y-1
                transition
              "

            >

              <h2

                className="
                  text-2xl
                  font-black
                "

              >

                Find another debate →

              </h2>


              <p

                className="
                  mt-3
                  rankd-muted
                "

              >

                Discover more opinions
                worth ranking differently.

              </p>

            </Link>

          </aside>

        </div>

      </div>

    </main>

  )

}