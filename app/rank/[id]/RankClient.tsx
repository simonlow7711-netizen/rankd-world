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

import ConversationTree from "@/components/ConversationTree"

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
  Ranking
} from "@/types/ranking"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"


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


type ShareMethod =
  | "clipboard"
  | "whatsapp"
  | "x"
  | "facebook"
  | "messages"
  | "email"


type CategoryTheme = {

  background:string
  text:string
  accent:string
  muted:string
  border:string
  title:string
  secondaryLabel:string

}


const categoryThemes:Record<
  string,
  CategoryTheme
> = {

  "Food & Drink": {

    background:
      "bg-[#F3E8D8]",

    text:
      "text-[#211A16]",

    accent:
      "text-[#D96B35]",

    muted:
      "text-[#6E5545]",

    border:
      "border-[#211A16]/10",

    title:
      "leading-[0.9] tracking-[-0.05em]",

    secondaryLabel:
      "MENU / 07"

  },

  "Film & TV": {

    background:
      "bg-[#ECEAE5]",

    text:
      "text-[#151515]",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-[#686560]",

    border:
      "border-[#151515]/10",

    title:
      "leading-[0.86] tracking-[-0.06em]",

    secondaryLabel:
      "FRAME / 07"

  },

  "Music": {

    background:
      "bg-[#E9E3DE]",

    text:
      "text-[#211A1A]",

    accent:
      "text-[#C43D35]",

    muted:
      "text-[#746562]",

    border:
      "border-[#211A1A]/10",

    title:
      "leading-[0.82] tracking-[-0.06em]",

    secondaryLabel:
      "SIDE A / 07"

  },

  "Sport": {

    background:
      "bg-[#E7EBE5]",

    text:
      "text-[#101510]",

    accent:
      "text-[#E54B2F]",

    muted:
      "text-[#586058]",

    border:
      "border-[#101510]/10",

    title:
      "leading-[0.78] tracking-[-0.07em] uppercase",

    secondaryLabel:
      "MATCH / 07"

  },

  "Gaming": {

    background:
      "bg-[#E7ECE9]",

    text:
      "text-[#0E1416]",

    accent:
      "text-[#39A932]",

    muted:
      "text-[#59645F]",

    border:
      "border-[#0E1416]/10",

    title:
      "leading-[0.9] tracking-[-0.05em]",

    secondaryLabel:
      "PLAYER 1 / 07"

  },

  "Travel": {

    background:
      "bg-[#E0ECE8]",

    text:
      "text-[#123B36]",

    accent:
      "text-[#087D71]",

    muted:
      "text-[#58736F]",

    border:
      "border-[#123B36]/10",

    title:
      "leading-[0.88] tracking-[-0.05em]",

    secondaryLabel:
      "FIELD NOTES / 07"

  },

  "Technology": {

    background:
      "bg-[#E9EBE9]",

    text:
      "text-[#111820]",

    accent:
      "text-[#315AE8]",

    muted:
      "text-[#69737C]",

    border:
      "border-[#111820]/10",

    title:
      "leading-[0.9] tracking-[-0.06em]",

    secondaryLabel:
      "SYSTEM / 07"

  },

  "Lifestyle": {

    background:
      "bg-[#EEE8DE]",

    text:
      "text-[#29241E]",

    accent:
      "text-[#A45D3E]",

    muted:
      "text-[#766E64]",

    border:
      "border-[#29241E]/10",

    title:
      "leading-[0.92] tracking-[-0.05em]",

    secondaryLabel:
      "EDIT / 07"

  },

  "Books": {

    background:
      "bg-[#F1EBDD]",

    text:
      "text-[#30251D]",

    accent:
      "text-[#9B493D]",

    muted:
      "text-[#75695E]",

    border:
      "border-[#30251D]/10",

    title:
      "leading-[0.94] tracking-[-0.035em]",

    secondaryLabel:
      "PUBLISHING / 07"

  },

  "Art & Design": {

    background:
      "bg-[#E9E6DF]",

    text:
      "text-[#151515]",

    accent:
      "text-[#B58B18]",

    muted:
      "text-[#68645C]",

    border:
      "border-[#151515]/10",

    title:
      "leading-[0.82] tracking-[-0.07em]",

    secondaryLabel:
      "CATALOGUE / 07"

  },

  "Fashion": {

    background:
      "bg-[#ECE3E9]",

    text:
      "text-[#231B22]",

    accent:
      "text-[#A52F68]",

    muted:
      "text-[#786773]",

    border:
      "border-[#231B22]/10",

    title:
      "leading-[0.78] tracking-[-0.07em] uppercase",

    secondaryLabel:
      "COLLECTION / 07"

  },

  "Beauty": {

    background:
      "bg-[#F1E5E3]",

    text:
      "text-[#2C1C1F]",

    accent:
      "text-[#C34E68]",

    muted:
      "text-[#856B70]",

    border:
      "border-[#2C1C1F]/10",

    title:
      "leading-[0.88] tracking-[-0.05em]",

    secondaryLabel:
      "EDIT / 07"

  },

  "Health & Fitness": {

    background:
      "bg-[#E4EEE6]",

    text:
      "text-[#17251B]",

    accent:
      "text-[#16824D]",

    muted:
      "text-[#607467]",

    border:
      "border-[#17251B]/10",

    title:
      "leading-[0.86] tracking-[-0.06em]",

    secondaryLabel:
      "ENERGY / 07"

  },

  "Business": {

    background:
      "bg-[#E5E9EE]",

    text:
      "text-[#14202B]",

    accent:
      "text-[#245A91]",

    muted:
      "text-[#64717D]",

    border:
      "border-[#14202B]/10",

    title:
      "leading-[0.94] tracking-[-0.05em]",

    secondaryLabel:
      "BRIEFING / 07"

  },

  "Science": {

    background:
      "bg-[#E0EAEC]",

    text:
      "text-[#14272C]",

    accent:
      "text-[#157D8C]",

    muted:
      "text-[#61767C]",

    border:
      "border-[#14272C]/10",

    title:
      "leading-[0.92] tracking-[-0.05em]",

    secondaryLabel:
      "FIELD NOTES / 07"

  },

  "History": {

    background:
      "bg-[#E9E0CF]",

    text:
      "text-[#2D2419]",

    accent:
      "text-[#86502E]",

    muted:
      "text-[#766A5B]",

    border:
      "border-[#2D2419]/10",

    title:
      "leading-[0.94] tracking-[-0.04em]",

    secondaryLabel:
      "ARCHIVE / 07"

  },

  "Nature & Animals": {

    background:
      "bg-[#E0E9DC]",

    text:
      "text-[#172418]",

    accent:
      "text-[#4C7D3F]",

    muted:
      "text-[#62715E]",

    border:
      "border-[#172418]/10",

    title:
      "leading-[0.88] tracking-[-0.055em]",

    secondaryLabel:
      "FIELD GUIDE / 07"

  },

  "Cars & Transport": {

    background:
      "bg-[#E2E5E7]",

    text:
      "text-[#141B20]",

    accent:
      "text-[#C63D2E]",

    muted:
      "text-[#68737B]",

    border:
      "border-[#141B20]/10",

    title:
      "leading-[0.8] tracking-[-0.065em] uppercase",

    secondaryLabel:
      "ROAD / 07"

  },

  "Home & Garden": {

    background:
      "bg-[#E9E7DD]",

    text:
      "text-[#25251E]",

    accent:
      "text-[#6E7C45]",

    muted:
      "text-[#707064]",

    border:
      "border-[#25251E]/10",

    title:
      "leading-[0.92] tracking-[-0.05em]",

    secondaryLabel:
      "LIVING / 07"

  },

  "General": {

    background:
      "bg-[#F7F4EE]",

    text:
      "text-black",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-black/50",

    border:
      "border-black/10",

    title:
      "leading-[0.9] tracking-[-0.05em]",

    secondaryLabel:
      "TOP 7"

  }

}


function getTheme(
  category:string
):CategoryTheme {

  return (
    categoryThemes[category] ??
    categoryThemes.General
  )

}


export default function RankClient({
  id,
  initialRanking
}:RankClientProps){

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
    shareOpen,
    setShareOpen
  ] =
    useState(false)


  const [
    shareComplete,
    setShareComplete
  ] =
    useState(false)


  const [
    sharing,
    setSharing
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


  function handleRankd(){

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

  }


  async function copyRankingLink(){

    if(!ranking){
      return false
    }


    const shareUrl =
      `${window.location.origin}/rank/${ranking.id}`


    try{

      if(
        navigator.clipboard &&
        window.isSecureContext
      ){

        await navigator.clipboard.writeText(
          shareUrl
        )

      }
      else{

        const textarea =
          document.createElement(
            "textarea"
          )


        textarea.value =
          shareUrl


        textarea.style.position =
          "fixed"


        textarea.style.left =
          "-9999px"


        document.body.appendChild(
          textarea
        )


        textarea.focus()

        textarea.select()


        const copied =
          document.execCommand(
            "copy"
          )


        document.body.removeChild(
          textarea
        )


        if(!copied){

          throw new Error(
            "Unable to copy link"
          )

        }

      }


      trackEvent(
        "ranking_shared",
        {
          rankingId:
            ranking.id,

          method:
            "clipboard"
        }
      )


      setShareComplete(
        true
      )


      window.setTimeout(
        () => {

          setShareComplete(
            false
          )

        },
        2000
      )


      return true

    }
    catch(error){

      console.error(
        "RANKD COPY LINK ERROR",
        error
      )


      return false

    }

  }


  function shareRanking(
    method:ShareMethod
  ){

    if(
      !ranking ||
      sharing
    ){

      return

    }


    if(
      method ===
      "clipboard"
    ){

      copyRankingLink()

      return

    }


    const shareUrl =
      `${window.location.origin}/rank/${ranking.id}`


    const shareTitle =
      formatRankingTitle(
        ranking.title
      )


    const shareText =
      `${shareTitle} — RANKD`


    const encodedUrl =
      encodeURIComponent(
        shareUrl
      )


    const encodedText =
      encodeURIComponent(
        shareText
      )


    let destination = ""


    switch(method){

      case "whatsapp":

        destination =
          `https://wa.me/?text=${encodedText}%20${encodedUrl}`

        break


      case "x":

        destination =
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`

        break


      case "facebook":

        destination =
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

        break


      case "messages":

        destination =
          `sms:?&body=${encodedText}%20${encodedUrl}`

        break


      case "email":

        destination =
          `mailto:?subject=${encodeURIComponent(
            `${shareTitle} — RANKD`
          )}&body=${encodedText}%0A%0A${encodedUrl}`

        break

    }


    if(!destination){
      return
    }


    trackEvent(
      "ranking_shared",
      {
        rankingId:
          ranking.id,

        method
      }
    )


    setSharing(
      true
    )


    window.open(
      destination,
      "_blank",
      "noopener,noreferrer"
    )


    setShareOpen(
      false
    )


    window.setTimeout(
      () => {

        setSharing(
          false
        )

      },
      500
    )

  }


  if(loading){

    return null

  }


  if(!ranking){

    return (

      <main
        className="
          min-h-screen
          bg-[#F7F4EE]
          text-black
          px-5
          py-12
          md:px-8
          md:py-20
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
          "
        >

          <div
            className="
              rounded-[28px]
              border
              border-black/10
              bg-white
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
        bg-[#F7F4EE]
        text-black
        px-5
        py-12
        md:px-8
        md:py-20
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
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
                  md:flex-row
                  md:items-end
                  md:justify-between
                  gap-8
                "
              >

                <div>

                  <div
                    className="
                      flex
                      items-center
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
              />

            </div>

          )
        }


        <section
          className={`
            relative
            overflow-hidden
            rounded-[28px]
            border
            p-7
            md:p-10
            lg:p-12
            ${theme.background}
            ${theme.text}
            ${theme.border}
          `}
        >

          <div
            className="
              absolute
              right-2
              top-0
              text-[12rem]
              md:text-[18rem]
              leading-none
              font-black
              tracking-[-0.1em]
              text-[#FF6B35]/[0.08]
              select-none
              pointer-events-none
              transition-transform
              duration-500
              hover:scale-105
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

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <span
                className="
                  inline-flex
                  items-center
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

              </span>


              <span
                className={`
                  text-xl
                  font-black
                  ${theme.accent}
                  opacity-50
                `}
              >
                07
              </span>

            </div>


            <div
              className="
                mt-16
                md:mt-24
                max-w-5xl
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
                  text-6xl
                  md:text-8xl
                  lg:text-9xl
                  font-black
                  ${theme.title}
                  max-w-6xl
                `}
              >
                {displayTitle}
              </h1>


              {
                displayDescription && (

                  <p
                    className={`
                      mt-7
                      max-w-3xl
                      text-xl
                      md:text-2xl
                      leading-relaxed
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

                <button
                  type="button"
                  onClick={() => {

                    setShareOpen(
                      current =>
                        !current
                    )

                    setShareComplete(
                      false
                    )

                  }}
                  className="
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
                  Share RANKD
                </button>


                {
                  shareOpen && (

                    <div
                      className="
                        absolute
                        z-30
                        left-0
                        top-full
                        mt-3
                        w-full
                        max-w-sm
                        rounded-[28px]
                        border
                        border-black/10
                        bg-white
                        p-5
                        text-black
                        shadow-[0_20px_50px_rgba(0,0,0,0.12)]
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

                        <div>

                          <p
                            className="
                              text-lg
                              font-black
                            "
                          >
                            Share this RANKD
                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-black/50
                            "
                          >
                            Choose where you want to share it.
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() => {

                            setShareOpen(
                              false
                            )

                            setShareComplete(
                              false
                            )

                          }}
                          className="
                            h-9
                            w-9
                            rounded-full
                            bg-black/[0.05]
                            font-black
                            transition
                            hover:bg-black/[0.1]
                          "
                          aria-label="Close sharing options"
                        >
                          ×
                        </button>

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
                          onClick={() =>
                            shareRanking(
                              "clipboard"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            🔗
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            {
                              shareComplete
                                ? "Link copied ✓"
                                : "Copy link"
                            }
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            shareRanking(
                              "whatsapp"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            💬
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            WhatsApp
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            shareRanking(
                              "x"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            𝕏
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            X
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            shareRanking(
                              "facebook"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            f
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            Facebook
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            shareRanking(
                              "messages"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            💬
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            Messages
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            shareRanking(
                              "email"
                            )
                          }
                          disabled={
                            sharing
                          }
                          className="
                            rounded-2xl
                            border
                            border-black/10
                            bg-[#F7F4EE]
                            px-4
                            py-4
                            text-left
                            font-black
                            transition
                            hover:bg-black/[0.05]
                            disabled:opacity-50
                          "
                        >

                          <span
                            className="
                              block
                              text-xl
                            "
                          >
                            ✉
                          </span>

                          <span
                            className="
                              mt-1
                              block
                            "
                          >
                            Email
                          </span>

                        </button>

                      </div>

                    </div>

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
                  item => (

                    <div
                      key={
                        `original-${item.position}`
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-black/10
                        bg-white/55
                        p-5
                        md:p-6
                        flex
                        items-center
                        gap-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                      "
                    >

                      <div
                        className={`
                          shrink-0
                          text-3xl
                          md:text-4xl
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
                          min-w-0
                          text-2xl
                          md:text-3xl
                          font-black
                          leading-[0.95]
                          tracking-[-0.035em]
                        "
                      >
                        {item.name}
                      </div>

                    </div>

                  )
                )
              }

            </div>


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
                      mt-3
                      text-4xl
                      md:text-5xl
                      font-black
                      leading-[0.9]
                      tracking-[-0.05em]
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
                              rounded-[24px]
                              border
                              border-black/10
                              bg-white/55
                              p-5
                              md:p-6
                              flex
                              items-center
                              gap-5
                            "
                          >

                            <div
                              className={`
                                shrink-0
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
                                text-2xl
                                md:text-3xl
                                font-black
                                leading-[0.95]
                                tracking-[-0.035em]
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
                border-black/10
                bg-white
                p-7
                md:p-8
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
                    2,
                    "0"
                  )}
                </span>

              </div>


              <h2
                className="
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
                            border-black/10
                            bg-[#F7F4EE]
                            p-4
                            transition-all
                            hover:-translate-y-0.5
                            hover:bg-black/[0.03]
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
                border-black/10
                bg-[#EAE3EC]
                p-7
                md:p-8
                text-[#25152F]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]
              "
            >

              <div
                className="
                  absolute
                  right-0
                  top-0
                  text-[10rem]
                  leading-none
                  font-black
                  tracking-[-0.1em]
                  text-[#FF6B35]/[0.08]
                  transition-transform
                  duration-500
                  group-hover:scale-110
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

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
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
                h-full
                min-h-[280px]
                rounded-[28px]
                border
                border-black/10
                bg-[#F7F4EE]
                p-8
                relative
                overflow-hidden
              "
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