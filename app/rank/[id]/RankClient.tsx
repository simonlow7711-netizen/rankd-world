
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
  createRankNotification
} from "@/utils/notifications"

import ConversationTree from "@/components/ConversationTree"

import RankingResponse from "@/components/RankingResponse"

import RankingEngagement from "@/components/RankingEngagement"

import AnimatedRankPreview from "@/components/AnimatedRankPreview"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"

import {
  buildConversationTree,
  ConversationNode
} from "@/utils/conversationTree"

import {
  Ranking
} from "@/types/ranking"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import EntryEmbeds from "@/components/EntryEmbeds"

import ShareButton from "@/components/ShareButton"


type RankClientProps = {
  id:string
  initialRanking:Ranking
}


type PerspectiveRanking = {
  id:string
  title:string
  parentId:string | null
  rootId:string | null
  createdAt:string | null
}

function getTheme(
  category:string
) {

  const theme =
    getCategoryTheme(
      category
    )

  return {
    background:
      theme.paperClass,
    text:
      "text-black",
    accent:
      theme.accentClass,
    muted:
      "text-black/50",
    border:
      "border-black",
    title:
      theme.titleClass,
    secondaryLabel:
      theme.label,
    paper:
      theme.paper,
    ink:
      theme.ink,
    accentHex:
      theme.accent,
    mutedHex:
      theme.muted,
    index:
      theme.index
  }

}



export default function RankClient({
  id,
  initialRanking
}: RankClientProps) {
  const router =
    useRouter()

  const [
    ranking,
    setRanking
  ] =
    useState<Ranking | null>(
      initialRanking
    )

  const [
    originalRanking,
    setOriginalRanking
  ] =
    useState<Ranking | null>(
      initialRanking
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
    useState(false)


  const [
    animatedPreviewOpen,
    setAnimatedPreviewOpen
  ] =
    useState(false)


  useEffect(() => {

    if(!id){
      return
    }


    async function load(){

      const currentRanking:Ranking =
        initialRanking


      trackEvent(
        "ranking_viewed",
        {
          rankingId:
            currentRanking.id
        }
      )


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


      let rootRanking:Ranking =
        currentRanking


      if(
        rootId !==
        currentRanking.id
      ){

        const fetchedRoot =
          await getSupabaseRanking(
            rootId
          )


        if(fetchedRoot){

          rootRanking =
            fetchedRoot

        }

      }


      setOriginalRanking(
        rootRanking
      )


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


      if(conversationError){

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


      if(!hasOriginal){

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


      if(!hasCurrent){

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


      if(
        parentId &&
        !conversationItems.some(
          item =>
            item.id ===
            parentId
        )
      ){

        const fetchedParent =
          await getSupabaseRanking(
            parentId
          )


        if(fetchedParent){

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


      setLoading(
        false
      )

    }


    load()

  },[
    id,
    initialRanking
  ])


  function rankIt(){

    if(!ranking){
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
          item => ({
            name:
              item.name,

            externalUrl:
              item.externalUrl ??
              null,

            commentary:
              item.commentary ??
              null
          })
        )


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
        JSON.stringify(
          items
        )
      )}&parentId=${encodeURIComponent(
        ranking.id
      )}&rootId=${encodeURIComponent(
        rootId
      )}`
    )

  }


  async function handleRankd(){

    if(!ranking){
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


    try {

      const {
        data:{
          user
        }
      } =
        await supabase.auth.getUser()


      if(!user){
        return
      }


      const currentRanking =
        await getSupabaseRanking(
          ranking.id
        )


      const creatorId =
        currentRanking?.creatorId


      if(
        creatorId
        &&
        creatorId !==
        user.id
      ){

        await createRankNotification({
          recipientUserId:
            creatorId,

          actorUserId:
            user.id,

          rankingId:
            ranking.id
        })

      }

    }
    catch(notificationError){

      console.error(
        "RANK NOTIFICATION ERROR",
        notificationError
      )

    }

  }


  if(loading){

    return null

  }


  if(!ranking){

    return (

      <main
        className="
          min-h-screen
          overflow-x-hidden
          bg-[#F7F4EE]
          px-4
          py-12
          text-black
          md:px-8
          md:py-20
        "
      >

        <div
          className="
            max-w-3xl
            mx-auto
            text-center
          "
        >

          <div
            className="
              rounded-[28px]
              border
              border-black
              bg-[#F7F4EE]
              p-8
              md:p-12
            "
          >

            <p
              className="
                text-[#FF6B35]
                uppercase
                tracking-[0.3em]
                text-[11px]
                font-black
              "
            >
              RANKD / 07
            </p>


            <h1
              className="
                mt-5
                text-5xl
                md:text-7xl
                font-black
                leading-[0.85]
                tracking-[-0.06em]
              "
            >
              Ranking not found
            </h1>

          </div>

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


  const category =
    displayRanking.category ||
    "General"


  const theme =
    getTheme(
      category
    )


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


  const creatorName =
    ranking.creatorDisplayName ||
    ranking.creatorUsername ||
    ranking.creator ||
    "Anonymous"


  return (

    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#F7F4EE]
        px-3
        py-10
        text-black
        md:px-8
        md:py-20
      "
    >

      <div
        className="
          mx-auto
          w-full
          min-w-0
          max-w-3xl
          text-center
        "
      >

        {
          isPerspective && (

            <section
              className={`
                relative
                overflow-hidden
                rounded-[28px]
                border
                p-7
                md:p-10
                mb-6
                ${theme.background}
                ${theme.text}
                ${theme.border}
              `}
            >

              <div
                className="
                  absolute
                  right-4
                  top-0
                  text-[9rem]
                  md:text-[13rem]
                  leading-none
                  font-black
                  tracking-[-0.1em]
                  text-[#FF6B35]/[0.08]
                  select-none
                  pointer-events-none
                "
              >
                7
              </div>


              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  gap-8
                  text-center
                "
              >

                <div
                  className="
                    flex
                    w-full
                    flex-col
                    items-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-[11px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                    "
                  >

                    <span
                      className="
                        text-[#FF6B35]
                      "
                    >
                      RANKD
                    </span>


                    <span
                      className="
                        opacity-30
                      "
                    >
                      /
                    </span>


                    <span
                      className={theme.accent}
                    >
                      {theme.secondaryLabel}
                    </span>

                  </div>


                  <p
                    className={`
                      mt-10
                      text-[11px]
                      uppercase
                      tracking-[0.25em]
                      font-black
                      ${theme.accent}
                    `}
                  >
                    Different perspective
                  </p>


                  <h2
                    className="
                      mt-3
                      text-4xl
                      md:text-6xl
                      font-black
                      leading-[0.88]
                      tracking-[-0.06em]
                      max-w-4xl
                    "
                  >
                    {creatorName} ranked this differently.
                  </h2>

                </div>


                <Link
                  href={
                    `/rank/${originalRanking?.id}`
                  }
                  className="
                    shrink-0
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:-translate-y-0.5
                  "
                >
                  View original RANKD →
                </Link>

              </div>

            </section>

          )
        }


        {
          conversationTree.length > 0 && (

            <div
              className="
                mb-6
              "
            >

              <ConversationTree
                nodes={
                  conversationTree
                }
                currentId={
                  ranking.id
                }
                paper={
                  theme.paper
                }
              />

            </div>

          )
        }


        <section
          className={`
            rankd-edition
            relative
            min-w-0
            max-w-full
            overflow-hidden
            rounded-[28px]
            border
            px-3
            py-6
            md:p-10
            lg:p-12
            ${theme.background}
            ${theme.text}
            ${theme.border}
          `}
        >

          <div
            className="
              relative
              z-10
            "
          >

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                text-center
              "
            >

              <span
                className={`
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  font-black
                  ${theme.accent}
                `}
              >
                {theme.index} · RANKD / {theme.secondaryLabel}
              </span>

            </div>


            <div
              className="
                mx-auto
                mt-16
                max-w-3xl
                text-center
                md:mt-24
              "
            >

              <p
                className={`
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  font-black
                  ${theme.accent}
                `}
              >
                {category}
              </p>


              <h1
                className={`
                  mt-5
                  text-4xl
                  sm:text-5xl
                  md:text-8xl
                  lg:text-9xl
                  font-black
                  ${theme.title}
                  w-full
                  max-w-full
                  min-w-0
                  break-words
                  [overflow-wrap:anywhere]
                `}
              >
                {displayTitle}
              </h1>


              {
                displayDescription && (

                  <p
                    className={`
                      mx-auto
                      mt-7
                      max-w-2xl
                      text-xl
                      leading-relaxed
                      md:text-2xl
                      ${theme.muted}
                    `}
                  >
                    {displayDescription}
                  </p>

                )
              }


              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-5
                  gap-y-2
                  text-sm
                "
              >

                <span
                  className={theme.muted}
                >
                  Ranked by{" "}
                  <strong
                    className={theme.text}
                  >
                    {
                      displayRanking.creatorDisplayName ||
                      displayRanking.creatorUsername ||
                      displayRanking.creator ||
                      "RANKD user"
                    }
                  </strong>
                </span>

              </div>


              <div
                className="
                  mt-5
                  flex
                  justify-center
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
                  relative
                  mt-6
                "
              >

                <div
                  className="
                    flex
                    justify-center
                  "
                >
                  <ShareButton
                    url={
                      `/rank/${displayRanking.id}`
                    }
                    title={displayTitle}
                    text={
                      `Would you rank this the same?\n\n${displayTitle}\n\nDo you agree, or would you RE-RANK it?`
                    }
                    eventProps={{
                      rankingId:
                        displayRanking.id
                    }}
                    align="center"
                    extra={
                      <button
                        type="button"
                        onClick={() => {
                          setAnimatedPreviewOpen(true)
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-3
                          rounded-full
                          border
                          border-black
                          bg-transparent
                          px-4
                          py-3
                          text-center
                          text-sm
                          font-black
                          text-black
                          transition
                          hover:border-[#FF6B35]
                        "
                      >
                        <span>Preview animated teaser</span>
                        <span className="text-[#FF6B35]">↗</span>
                      </button>
                    }
                  />
                </div>


                {
                  animatedPreviewOpen && (
                    <AnimatedRankPreview
                      title={displayTitle}
                      items={
                        sortedOriginalItems.map(item => ({
                          position: item.position,
                          name: item.name
                        }))
                      }
                      href={`/rank/${displayRanking.id}`}
                      onClose={() => {
                        setAnimatedPreviewOpen(false)
                      }}
                    />
                  )
                }

              </div>

            </div>


            <div
              className="
                mt-12
                space-y-4
              "
            >

              {
                sortedOriginalItems.map(
                  item => {

                    return (

                      <div
                        key={
                          `original-${item.position}`
                        }
                        className="
                          rankd-edition
                          group
                          relative
                          min-w-0
                          max-w-full
                          overflow-hidden
                          rounded-[24px]
                          border
                          p-3
                          md:p-6
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
                            flex
                            w-full
                            min-w-0
                            flex-col
                            items-center
                            text-center
                          "
                        >

                          <div
                            className={`
                              text-3xl
                              font-black
                              md:text-4xl
                              ${theme.accent}
                            `}
                          >
                            {String(
                              item.position
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>


                          <div
                            className="
                              mt-3
                              min-w-0
                              w-full
                            "
                          >

                            {
                              (
                                ranking.id ===
                                "da31e636-d2b4-495a-a38c-fd755e7f689b"
                                ||
                                ranking.id ===
                                "c3950c12-3929-42e6-ae79-1983bc2ccbce"
                              )
                                ? (
                                    <div
                                      className="
                                        min-w-0
                                      "
                                    >

                                      {
                                        item.name
                                          .split(
                                            /\r?\n\s*\r?\n|\s{2,}/
                                          )
                                          .map(
                                            (
                                              paragraph,
                                              index
                                            ) => (

                                              <p
                                                key={
                                                  `${item.position}-${index}`
                                                }
                                                className={`
                                                  ${
                                                    index === 0
                                                      ? `
                                                          text-2xl
                                                          md:text-3xl
                                                          font-black
                                                          leading-[0.95]
                                                          tracking-[-0.035em]
                                                        `
                                                      : `
                                                          mt-4
                                                          text-base
                                                          md:text-lg
                                                          font-normal
                                                          leading-relaxed
                                                          text-black/60
                                                        `
                                                  }
                                                `}
                                              >
                                                {paragraph}
                                              </p>

                                            )
                                          )
                                      }

                                    </div>
                                  )
                                : (
                                    <div
                                      className="
                                        text-2xl
                                        md:text-3xl
                                        font-black
                                        leading-[0.95]
                                        tracking-[-0.035em]
                                      "
                                    >
                                      {
                                        item.externalUrl
                                          ? (
                                              <a
                                                href={
                                                  item.externalUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                  transition-colors
                                                  hover:text-[#FF6B35]
                                                "
                                              >
                                                {item.name}
                                              </a>
                                            )
                                          : (
                                              item.name
                                            )
                                      }

                                    </div>
                                  )
                            }


                            {
                              item.commentary?.trim() && (
                                <p
                                  className="
                                    mt-3
                                    text-sm
                                    md:text-base
                                    leading-relaxed
                                    text-black/65
                                    whitespace-pre-wrap
                                  "
                                >
                                  {item.commentary}
                                </p>
                              )
                            }


                            <EntryEmbeds
                              url={
                                item.externalUrl
                              }
                              name={
                                item.name
                              }
                            />

                          </div>

                        </div>

                      </div>

                    )

                  }
                )
              }

            </div>


            {
              ranking.id ===
              "324b0dd3-c7ef-4c3f-bce0-fac08262be72" && (

                <div
                  className="
                    mt-6
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-black
                  "
                >
                  <div
                    className="
                      relative
                      h-[260px]
                      overflow-hidden
                      bg-[#EAE3EC]
                    "
                  >

                    <iframe
                      title="Map of the seven Holloway pubs"
                      src="https://www.google.com/maps?q=Holloway+Road,+London&output=embed"
                      className="
                        h-full
                        w-full
                        border-0
                      "
                      loading="lazy"
                    />

                  </div>
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-4
                      md:px-6
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.2em]
                          font-black
                          text-[#FF6B35]
                        "
                      >
                        Holloway
                      </p>


                      <p
                        className="
                          mt-1
                          text-sm
                          font-bold
                          text-black
                        "
                      >
                        Seven pubs, one map.
                      </p>

                    </div>


                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=The+George+Pub,+Holloway,+London&waypoints=The+Swimmer+at+the+Grafton+Arms,+Holloway,+London%7COwl+%26+Hitchhiker,+Holloway,+London%7CHercules,+Holloway,+London%7CVictoria+Tavern,+Holloway,+London%7CLamb,+Holloway,+London%7CThe+Horatia,+Holloway,+London"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-2
                        border-b
                        border-[#FF6B35]
                        pb-1
                        text-sm
                        font-bold
                        text-black
                        transition
                        hover:text-[#FF6B35]
                      "
                    >

                      <span
                        className="
                          text-[#FF6B35]
                        "
                      >
                        ↗
                      </span>

                      <span>
                        View all 7
                      </span>

                    </a>

                  </div>

                </div>

              )
            }


            {
              ranking.id ===
              "1b31e5d9-f505-4406-bf14-e6dcc1296eb6" && (

                <div
                  className="
                    mt-6
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-black
                  "
                >

                  <div
                    className="
                      relative
                      h-[260px]
                      overflow-hidden
                      bg-[#EAE3EC]
                    "
                  >

                    <iframe
                      title="Map of the seven Sheffield vegetarian places"
                      src="https://www.google.com/maps?q=Sheffield+city+centre&output=embed"
                      className="
                        h-full
                        w-full
                        border-0
                      "
                      loading="lazy"
                    />

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-4
                      md:px-6
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.2em]
                          font-black
                          text-[#FF6B35]
                        "
                      >
                        Sheffield
                      </p>


                      <p
                        className="
                          mt-1
                          text-sm
                          font-bold
                          text-black
                        "
                      >
                        Seven vegetarian places, one map.
                      </p>

                    </div>


                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Blue+Moon+Cafe,+Sheffield&waypoints=Church+-+Temple+of+Fun,+Sheffield%7CPom+Kitchen,+Sheffield%7CSouth+Street+Kitchen,+Sheffield%7CThe+Old+Workshop,+Sheffield%7CThe+Chakra+Lounge,+Sheffield%7C5Tara,+Sheffield"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-2
                        border-b
                        border-[#FF6B35]
                        pb-1
                        text-sm
                        font-bold
                        text-black
                        transition
                        hover:text-[#FF6B35]
                      "
                    >

                      <span
                        className="
                          text-[#FF6B35]
                        "
                      >
                        ↗
                      </span>

                      <span>
                        View all 7
                      </span>

                    </a>

                  </div>

                </div>

              )
            }


            <div
              className="
                mt-8
              "
            >

              <RankingResponse
                onRankd={
                  handleRankd
                }
                onRerankd={
                  rankIt
                }
                card="bg-transparent"
                cardColor="transparent"
                border="border-black"
                accentColor={theme.accentHex}
                textColor={theme.ink}
                mutedColor={theme.mutedHex}
                borderColor="#111111"
              />

            </div>


            {
              isPerspective && (

                <div
                  className="
                    mt-14
                    border-t
                    border-black/10
                    pt-12
                    text-center
                  "
                >

                  <p
                    className={`
                      text-[11px]
                      uppercase
                      tracking-[0.25em]
                      font-black
                      ${theme.accent}
                    `}
                  >
                    This perspective
                  </p>


                  <h3
                    className="
                      mx-auto
                      mt-3
                      max-w-2xl
                      text-4xl
                      font-black
                      leading-[0.9]
                      tracking-[-0.05em]
                      md:text-5xl
                    "
                  >
                    {creatorName} would rank it differently.
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
                              flex
                              w-full
                              min-w-0
                              max-w-full
                              flex-col
                              items-center
                              overflow-hidden
                              rounded-[24px]
                              border
                              p-4
                              text-center
                              md:p-6
                            "
                            style={{
                              backgroundColor:
                                theme.paper,
                                borderColor:
                                "#111111"
                            }}
                          >

                            <div
                              className={`
                                text-3xl
                                font-black
                                ${theme.accent}
                              `}
                            >
                              {String(
                                item.position
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>


                            <div
                              className="
                                mt-3
                                min-w-0
                                w-full
                              "
                            >

                              <div
                                className="
                                  text-2xl
                                  md:text-3xl
                                  font-black
                                  leading-[0.95]
                                  tracking-[-0.035em]
                                "
                              >
                                {item.name}
                              </div>


                              {
                                item.commentary?.trim() && (
                                  <p
                                    className="
                                      mt-3
                                      text-sm
                                      md:text-base
                                      leading-relaxed
                                      text-black/65
                                      whitespace-pre-wrap
                                    "
                                  >
                                    {item.commentary}
                                  </p>
                                )
                              }


                              <EntryEmbeds
                                url={
                                  item.externalUrl
                                }
                                name={
                                  item.name
                                }
                              />

                            </div>

                          </div>

                        )
                      )
                    }

                  </div>

                </div>

              )
            }

          </div>

        </section>


        <div
          className="
            mt-6
            grid
            lg:grid-cols-3
            gap-5
            md:gap-6
          "
        >

          <aside
            className="
              lg:col-span-2
              grid
              md:grid-cols-2
              gap-5
              md:gap-6
            "
          >

            <div
              className="
                rounded-[28px]
                border
                border-black
                p-7
                text-center
                md:p-8
              "
              style={{
                backgroundColor:
                  theme.paper
              }}
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    font-black
                    text-[#FF6B35]
                  "
                >
                  Perspectives
                </span>


                <span
                  className="
                    text-4xl
                    font-black
                    tracking-[-0.06em]
                    text-black/10
                  "
                >
                  {String(
                    perspectives.length
                  ).padStart(
                    2
                  )}
                </span>

              </div>


              <h2
                className="
                  mx-auto
                  mt-8
                  text-3xl
                  md:text-4xl
                  font-black
                  leading-[0.9]
                  tracking-[-0.05em]
                "
              >
                Different ways to rank it.
              </h2>


              <p
                className="
                  mt-4
                  text-black/50
                  leading-relaxed
                "
              >
                {
                  perspectives.length === 0
                    ? "Be the first person to rank this differently."
                    : `
                      ${perspectives.length}
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
                            group
                            block
                            rounded-2xl
                            border
                            border-black
                            bg-transparent
                            p-4
                            transition-all
                            hover:-translate-y-0.5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-4
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


                            <span
                              className="
                                text-[#FF6B35]
                                font-black
                                transition-transform
                                group-hover:translate-x-1
                              "
                            >
                              →
                            </span>

                          </div>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-black/45
                            "
                          >
                            View this perspective
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
                      text-black/40
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
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-black
                p-7
                md:p-8
                text-center
                text-black
              "
              style={{
                backgroundColor:
                  theme.paper
              }}
            >

              <div
                className="
                  relative
                  z-10
                "
              >

                <div
                  className="
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    font-black
                    text-[#FF6B35]
                  "
                >
                  RANKD / EXPLORE
                </span>


                  <span
                    className="
                      text-xl
                      font-black
                      text-[#A95BCB]
                      transition-transform
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>

                </div>


                <div
                  className="
                    mt-20
                  "
                >

                  <h2
                    className="
                      text-4xl
                      md:text-5xl
                      font-black
                      leading-[0.85]
                      tracking-[-0.06em]
                    "
                  >
                    Find another debate.
                  </h2>


                  <p
                    className="
                      mx-auto
                      mt-5
                      max-w-md
                      leading-relaxed
                      text-[#685C6D]
                    "
                  >
                    Discover more opinions worth ranking differently.
                  </p>

                </div>


                <div
                  className="
                    mt-8
                    border-t
                    border-black/10
                    pt-5
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    font-black
                    text-[#FF6B35]
                  "
                >
                  Explore rankings
                </div>

              </div>

            </Link>

          </aside>


          <div
            className="
              hidden
              lg:block
            "
          >

            <div
              className="
                relative
                h-full
                min-h-[280px]
                overflow-hidden
                rounded-[28px]
                border
                border-black
                p-8
              "
              style={{
                backgroundColor:
                  theme.paper
              }}
            >

              <div
                className="
                  absolute
                  right-[-1rem]
                  bottom-[-3rem]
                  text-[15rem]
                  leading-none
                  font-black
                  tracking-[-0.12em]
                  text-[#FF6B35]/[0.08]
                  select-none
                "
              >
                7
              </div>


              <div
                className="
                  relative
                  z-10
                "
              >

                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    font-black
                    text-[#FF6B35]
                  "
                >
                  RANKD
                </p>


                <p
                  className="
                    mt-4
                    text-5xl
                    font-black
                    leading-[0.85]
                    tracking-[-0.07em]
                  "
                >
                  Opinion<br />
                  worth<br />
                  ranking.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>

  )

}
