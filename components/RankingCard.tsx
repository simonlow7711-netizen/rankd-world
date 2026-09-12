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

  discoveryReason?: string

}


type RankingTheme = {

  card: string

  text: string

  accent: string

  muted: string

  border: string

  itemBorder: string

  numberBackground: string

  numberText: string

  buttonPrimary: string

  buttonSecondary: string

  buttonSecondaryText: string

  categoryLabel: string

  secondaryLabel: string

  title: string

  item: string

}


const themes: Record<string, RankingTheme> = {

  "Food & Drink": {

    card:
      "bg-[#F3E8D8]",

    text:
      "text-[#211A16]",

    accent:
      "text-[#D96B35]",

    muted:
      "text-[#6E5545]",

    border:
      "border-[#211A16]/10",

    itemBorder:
      "divide-[#211A16]/10",

    numberBackground:
      "bg-[#211A16]",

    numberText:
      "text-[#F3E8D8]",

    buttonPrimary:
      "bg-[#211A16] text-[#F3E8D8]",

    buttonSecondary:
      "bg-transparent border-[#211A16]/30",

    buttonSecondaryText:
      "text-[#211A16]",

    categoryLabel:
      "Food & Drink",

    secondaryLabel:
      "MENU / 07",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Film & TV": {

    card:
      "bg-[#ECEAE5]",

    text:
      "text-[#151515]",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-[#686560]",

    border:
      "border-[#151515]/10",

    itemBorder:
      "divide-[#151515]/10",

    numberBackground:
      "bg-[#151515]",

    numberText:
      "text-[#ECEAE5]",

    buttonPrimary:
      "bg-[#151515] text-[#ECEAE5]",

    buttonSecondary:
      "bg-transparent border-[#151515]/30",

    buttonSecondaryText:
      "text-[#151515]",

    categoryLabel:
      "Film & TV",

    secondaryLabel:
      "FRAME / 07",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Music": {

    card:
      "bg-[#E9E3DE]",

    text:
      "text-[#211A1A]",

    accent:
      "text-[#C43D35]",

    muted:
      "text-[#746562]",

    border:
      "border-[#211A1A]/10",

    itemBorder:
      "divide-[#211A1A]/10",

    numberBackground:
      "bg-[#211A1A]",

    numberText:
      "text-[#E9E3DE]",

    buttonPrimary:
      "bg-[#211A1A] text-[#E9E3DE]",

    buttonSecondary:
      "bg-transparent border-[#211A1A]/30",

    buttonSecondaryText:
      "text-[#211A1A]",

    categoryLabel:
      "Music",

    secondaryLabel:
      "SIDE A / 07",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Sport": {

    card:
      "bg-[#E7EBE5]",

    text:
      "text-[#101510]",

    accent:
      "text-[#E54B2F]",

    muted:
      "text-[#586058]",

    border:
      "border-[#101510]/10",

    itemBorder:
      "divide-[#101510]/10",

    numberBackground:
      "bg-[#101510]",

    numberText:
      "text-[#E7EBE5]",

    buttonPrimary:
      "bg-[#101510] text-white",

    buttonSecondary:
      "bg-transparent border-[#101510]/30",

    buttonSecondaryText:
      "text-[#101510]",

    categoryLabel:
      "Sport",

    secondaryLabel:
      "MATCH / 07",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    item:
      "text-base md:text-lg uppercase"

  },


  "Gaming": {

    card:
      "bg-[#E7ECE9]",

    text:
      "text-[#0E1416]",

    accent:
      "text-[#39A932]",

    muted:
      "text-[#59645F]",

    border:
      "border-[#0E1416]/10",

    itemBorder:
      "divide-[#0E1416]/10",

    numberBackground:
      "bg-[#0E1416]",

    numberText:
      "text-[#E7ECE9]",

    buttonPrimary:
      "bg-[#0E1416] text-[#E7ECE9]",

    buttonSecondary:
      "bg-transparent border-[#0E1416]/30",

    buttonSecondaryText:
      "text-[#0E1416]",

    categoryLabel:
      "Gaming",

    secondaryLabel:
      "PLAYER 1 / 07",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Travel": {

    card:
      "bg-[#E0ECE8]",

    text:
      "text-[#123B36]",

    accent:
      "text-[#087D71]",

    muted:
      "text-[#58736F]",

    border:
      "border-[#123B36]/10",

    itemBorder:
      "divide-[#123B36]/10",

    numberBackground:
      "bg-[#123B36]",

    numberText:
      "text-[#E0ECE8]",

    buttonPrimary:
      "bg-[#123B36] text-white",

    buttonSecondary:
      "bg-transparent border-[#123B36]/30",

    buttonSecondaryText:
      "text-[#123B36]",

    categoryLabel:
      "Travel",

    secondaryLabel:
      "FIELD NOTES / 07",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Technology": {

    card:
      "bg-[#E9EBE9]",

    text:
      "text-[#111820]",

    accent:
      "text-[#315AE8]",

    muted:
      "text-[#69737C]",

    border:
      "border-[#111820]/10",

    itemBorder:
      "divide-[#111820]/10",

    numberBackground:
      "bg-[#111820]",

    numberText:
      "text-[#E9EBE9]",

    buttonPrimary:
      "bg-[#111820] text-white",

    buttonSecondary:
      "bg-transparent border-[#111820]/30",

    buttonSecondaryText:
      "text-[#111820]",

    categoryLabel:
      "Technology",

    secondaryLabel:
      "SYSTEM / 07",

    title:
      "text-3xl md:text-4xl leading-[0.9] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Lifestyle": {

    card:
      "bg-[#EEE8DE]",

    text:
      "text-[#29241E]",

    accent:
      "text-[#A45D3E]",

    muted:
      "text-[#766E64]",

    border:
      "border-[#29241E]/10",

    itemBorder:
      "divide-[#29241E]/10",

    numberBackground:
      "bg-[#29241E]",

    numberText:
      "text-[#EEE8DE]",

    buttonPrimary:
      "bg-[#29241E] text-white",

    buttonSecondary:
      "bg-transparent border-[#29241E]/30",

    buttonSecondaryText:
      "text-[#29241E]",

    categoryLabel:
      "Lifestyle",

    secondaryLabel:
      "EDIT / 07",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Books": {

    card:
      "bg-[#F1EBDD]",

    text:
      "text-[#30251D]",

    accent:
      "text-[#9B493D]",

    muted:
      "text-[#75695E]",

    border:
      "border-[#30251D]/10",

    itemBorder:
      "divide-[#30251D]/10",

    numberBackground:
      "bg-[#30251D]",

    numberText:
      "text-[#F1EBDD]",

    buttonPrimary:
      "bg-[#30251D] text-white",

    buttonSecondary:
      "bg-transparent border-[#30251D]/30",

    buttonSecondaryText:
      "text-[#30251D]",

    categoryLabel:
      "Books",

    secondaryLabel:
      "PUBLISHING / 07",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.025em]",

    item:
      "text-base md:text-lg"

  },


  "Art & Design": {

    card:
      "bg-[#E9E6DF]",

    text:
      "text-[#151515]",

    accent:
      "text-[#B58B18]",

    muted:
      "text-[#68645C]",

    border:
      "border-[#151515]/10",

    itemBorder:
      "divide-[#151515]/10",

    numberBackground:
      "bg-[#151515]",

    numberText:
      "text-[#E9E6DF]",

    buttonPrimary:
      "bg-[#151515] text-white",

    buttonSecondary:
      "bg-transparent border-[#151515]/30",

    buttonSecondaryText:
      "text-[#151515]",

    categoryLabel:
      "Art & Design",

    secondaryLabel:
      "CATALOGUE / 07",

    title:
      "text-3xl md:text-4xl leading-[0.82] tracking-[-0.06em]",

    item:
      "text-base md:text-lg"

  },


  "Fashion": {

    card:
      "bg-[#ECE3E9]",

    text:
      "text-[#231B22]",

    accent:
      "text-[#A52F68]",

    muted:
      "text-[#786773]",

    border:
      "border-[#231B22]/10",

    itemBorder:
      "divide-[#231B22]/10",

    numberBackground:
      "bg-[#231B22]",

    numberText:
      "text-[#ECE3E9]",

    buttonPrimary:
      "bg-[#231B22] text-white",

    buttonSecondary:
      "bg-transparent border-[#231B22]/30",

    buttonSecondaryText:
      "text-[#231B22]",

    categoryLabel:
      "Fashion",

    secondaryLabel:
      "COLLECTION / 07",

    title:
      "text-3xl md:text-4xl leading-[0.78] tracking-[-0.06em] uppercase",

    item:
      "text-base md:text-lg"

  },


  "Beauty": {

    card:
      "bg-[#F1E5E3]",

    text:
      "text-[#2C1C1F]",

    accent:
      "text-[#C34E68]",

    muted:
      "text-[#856B70]",

    border:
      "border-[#2C1C1F]/10",

    itemBorder:
      "divide-[#2C1C1F]/10",

    numberBackground:
      "bg-[#2C1C1F]",

    numberText:
      "text-[#F1E5E3]",

    buttonPrimary:
      "bg-[#2C1C1F] text-white",

    buttonSecondary:
      "bg-transparent border-[#2C1C1F]/30",

    buttonSecondaryText:
      "text-[#2C1C1F]",

    categoryLabel:
      "Beauty",

    secondaryLabel:
      "EDIT / 07",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Health & Fitness": {

    card:
      "bg-[#E4EEE6]",

    text:
      "text-[#17251B]",

    accent:
      "text-[#16824D]",

    muted:
      "text-[#607467]",

    border:
      "border-[#17251B]/10",

    itemBorder:
      "divide-[#17251B]/10",

    numberBackground:
      "bg-[#17251B]",

    numberText:
      "text-[#E4EEE6]",

    buttonPrimary:
      "bg-[#17251B] text-white",

    buttonSecondary:
      "bg-transparent border-[#17251B]/30",

    buttonSecondaryText:
      "text-[#17251B]",

    categoryLabel:
      "Health & Fitness",

    secondaryLabel:
      "ENERGY / 07",

    title:
      "text-3xl md:text-4xl leading-[0.86] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Business": {

    card:
      "bg-[#E5E9EE]",

    text:
      "text-[#14202B]",

    accent:
      "text-[#245A91]",

    muted:
      "text-[#64717D]",

    border:
      "border-[#14202B]/10",

    itemBorder:
      "divide-[#14202B]/10",

    numberBackground:
      "bg-[#14202B]",

    numberText:
      "text-[#E5E9EE]",

    buttonPrimary:
      "bg-[#14202B] text-white",

    buttonSecondary:
      "bg-transparent border-[#14202B]/30",

    buttonSecondaryText:
      "text-[#14202B]",

    categoryLabel:
      "Business",

    secondaryLabel:
      "BRIEFING / 07",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Science": {

    card:
      "bg-[#E0EAEC]",

    text:
      "text-[#14272C]",

    accent:
      "text-[#157D8C]",

    muted:
      "text-[#61767C]",

    border:
      "border-[#14272C]/10",

    itemBorder:
      "divide-[#14272C]/10",

    numberBackground:
      "bg-[#14272C]",

    numberText:
      "text-[#E0EAEC]",

    buttonPrimary:
      "bg-[#14272C] text-white",

    buttonSecondary:
      "bg-transparent border-[#14272C]/30",

    buttonSecondaryText:
      "text-[#14272C]",

    categoryLabel:
      "Science",

    secondaryLabel:
      "FIELD NOTES / 07",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "History": {

    card:
      "bg-[#E9E0CF]",

    text:
      "text-[#2D2419]",

    accent:
      "text-[#86502E]",

    muted:
      "text-[#766A5B]",

    border:
      "border-[#2D2419]/10",

    itemBorder:
      "divide-[#2D2419]/10",

    numberBackground:
      "bg-[#2D2419]",

    numberText:
      "text-[#E9E0CF]",

    buttonPrimary:
      "bg-[#2D2419] text-white",

    buttonSecondary:
      "bg-transparent border-[#2D2419]/30",

    buttonSecondaryText:
      "text-[#2D2419]",

    categoryLabel:
      "History",

    secondaryLabel:
      "ARCHIVE / 07",

    title:
      "text-3xl md:text-4xl leading-[0.94] tracking-[-0.035em]",

    item:
      "text-base md:text-lg"

  },


  "Nature & Animals": {

    card:
      "bg-[#E0E9DC]",

    text:
      "text-[#172418]",

    accent:
      "text-[#4C7D3F]",

    muted:
      "text-[#62715E]",

    border:
      "border-[#172418]/10",

    itemBorder:
      "divide-[#172418]/10",

    numberBackground:
      "bg-[#172418]",

    numberText:
      "text-[#E0E9DC]",

    buttonPrimary:
      "bg-[#172418] text-white",

    buttonSecondary:
      "bg-transparent border-[#172418]/30",

    buttonSecondaryText:
      "text-[#172418]",

    categoryLabel:
      "Nature & Animals",

    secondaryLabel:
      "FIELD GUIDE / 07",

    title:
      "text-3xl md:text-4xl leading-[0.88] tracking-[-0.045em]",

    item:
      "text-base md:text-lg"

  },


  "Cars & Transport": {

    card:
      "bg-[#E2E5E7]",

    text:
      "text-[#141B20]",

    accent:
      "text-[#C63D2E]",

    muted:
      "text-[#68737B]",

    border:
      "border-[#141B20]/10",

    itemBorder:
      "divide-[#141B20]/10",

    numberBackground:
      "bg-[#141B20]",

    numberText:
      "text-[#E2E5E7]",

    buttonPrimary:
      "bg-[#141B20] text-white",

    buttonSecondary:
      "bg-transparent border-[#141B20]/30",

    buttonSecondaryText:
      "text-[#141B20]",

    categoryLabel:
      "Cars & Transport",

    secondaryLabel:
      "ROAD / 07",

    title:
      "text-3xl md:text-4xl leading-[0.8] tracking-[-0.055em] uppercase",

    item:
      "text-base md:text-lg"

  },


  "Home & Garden": {

    card:
      "bg-[#E9E7DD]",

    text:
      "text-[#25251E]",

    accent:
      "text-[#6E7C45]",

    muted:
      "text-[#707064]",

    border:
      "border-[#25251E]/10",

    itemBorder:
      "divide-[#25251E]/10",

    numberBackground:
      "bg-[#25251E]",

    numberText:
      "text-[#E9E7DD]",

    buttonPrimary:
      "bg-[#25251E] text-white",

    buttonSecondary:
      "bg-transparent border-[#25251E]/30",

    buttonSecondaryText:
      "text-[#25251E]",

    categoryLabel:
      "Home & Garden",

    secondaryLabel:
      "LIVING / 07",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "General": {

    card:
      "bg-[#F7F4EE]",

    text:
      "text-black",

    accent:
      "text-[#FF6B35]",

    muted:
      "text-black/50",

    border:
      "border-black/10",

    itemBorder:
      "divide-black/10",

    numberBackground:
      "bg-black",

    numberText:
      "text-[#F7F4EE]",

    buttonPrimary:
      "bg-black text-white",

    buttonSecondary:
      "bg-transparent border-black/30",

    buttonSecondaryText:
      "text-black",

    categoryLabel:
      "General",

    secondaryLabel:
      "TOP 7",

    title:
      "text-3xl md:text-4xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  }

}


function getTheme(
  category?: string
): RankingTheme {

  return (
    themes[category || "General"] ??
    themes["General"]
  )

}


export default function RankingCard({

  ranking,

  discoveryReason

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

      views: 0,

      rankd: 0,

      rerankd: 0

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


  const theme =
    getTheme(
      ranking.category
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

      className={`
        group
        relative
        overflow-hidden
        h-full
        p-7
        md:p-8
        rounded-[28px]
        border
        ${theme.card}
        ${theme.text}
        ${theme.border}
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]
      `}

    >

      <div

        className="
          pointer-events-none
          absolute
          right-5
          top-3
          z-0
          select-none
          text-[8rem]
          md:text-[9rem]
          leading-none
          font-black
          tracking-[-0.1em]
          text-[#FF6B35]/[0.08]
        "

      >

        7

      </div>


      <Link

        href={
          `/rank/${ranking.id}`
        }

        className="
          relative
          z-10
          block
        "

      >

        {
          discoveryReason && (

            <p

              className={`
                ${theme.accent}
                uppercase
                tracking-[0.25em]
                text-[10px]
                font-black
                mb-5
              `}

            >

              {
                discoveryReason
              }

            </p>

          )
        }


        <div

          className={`
            flex
            items-center
            justify-between
            gap-4
            pb-5
            border-b
            ${theme.border}
          `}

        >

          <p

            className="
              text-[#FF6B35]
              uppercase
              tracking-[0.25em]
              text-[10px]
              font-black
            "

          >

            RANKD

          </p>


          <span

            className={`
              ${theme.accent}
              text-[9px]
              uppercase
              tracking-[0.2em]
              font-black
            `}

          >

            {
              theme.secondaryLabel
            }

          </span>

        </div>


        <p

          className={`
            mt-5
            ${theme.accent}
            uppercase
            tracking-[0.2em]
            text-[9px]
            font-black
          `}

        >

          {
            theme.categoryLabel
          }

        </p>


        <h3

          className={`
            mt-3
            font-black
            max-w-full
            overflow-hidden
            break-words
            ${theme.title}
          `}

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

              className={`
                mt-5
                max-w-xl
                leading-relaxed
                ${theme.muted}
              `}

            >

              {
                ranking.description
              }

            </p>

          )
        }


        <div

          className={`
            mt-8
            pt-6
            border-t
            ${theme.border}
          `}

        >

          <div

            className="
              flex
              items-center
              justify-between
              gap-4
              mb-4
            "

          >

            <p

              className={`
                ${theme.accent}
                uppercase
                tracking-[0.25em]
                text-[10px]
                font-black
              `}

            >

              TOP 7

            </p>


            <span

              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                font-black
                opacity-40
              "

            >

              In order

            </span>

          </div>


          <div

            className={`
              divide-y
              ${theme.itemBorder}
            `}

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
                      py-3.5
                    "

                  >

                    <span

                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[11px]
                        font-black
                        ${theme.numberBackground}
                        ${theme.numberText}
                      `}

                    >

                      {
                        item.position
                      }

                    </span>


                    <span

                      className={`
                        min-w-0
                        font-black
                        leading-tight
                        ${theme.item}
                      `}

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


          <div

            className={`
              mt-5
              pt-5
              border-t
              ${theme.border}
            `}

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

        className={`
          relative
          z-10
          mt-7
          pt-6
          border-t
          ${theme.border}
        `}

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
                    text-lg
                    md:text-xl
                    tracking-[-0.02em]
                  "

                >

                  Would you rank this
                  the same?

                </p>


                <p

                  className={`
                    mt-2
                    text-sm
                    ${theme.muted}
                  `}

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

                  className={`
                    rounded-2xl
                    px-4
                    py-5
                    text-center
                    hover:-translate-y-1
                    transition-all
                    duration-200
                    ${theme.buttonPrimary}
                  `}

                >

                  <span

                    className="
                      block
                      text-lg
                      md:text-xl
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
                      opacity-60
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

                  className={`
                    rounded-2xl
                    px-4
                    py-5
                    text-center
                    border-2
                    hover:-translate-y-1
                    transition-all
                    duration-200
                    ${theme.buttonSecondary}
                    ${theme.buttonSecondaryText}
                  `}

                >

                  <span

                    className="
                      block
                      text-lg
                      md:text-xl
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

    </article>

  )

}