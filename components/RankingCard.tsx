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

  cardColor: string

  text: string

  textColor: string

  accent: string

  accentColor: string

  muted: string

  mutedColor: string

  border: string

  borderColor: string

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

    cardColor:
      "#F3E8D8",

    text:
      "text-[#211A16]",

    textColor:
      "#211A16",

    accent:
      "text-[#D96B35]",

    accentColor:
      "#D96B35",

    muted:
      "text-[#6E5545]",

    mutedColor:
      "#6E5545",

    border:
      "border-[#211A16]/10",

    borderColor:
      "#211A16",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Film & TV": {

    card:
      "bg-[#ECEAE5]",

    cardColor:
      "#ECEAE5",

    text:
      "text-[#151515]",

    textColor:
      "#151515",

    accent:
      "text-[#FF6B35]",

    accentColor:
      "#FF6B35",

    muted:
      "text-[#686560]",

    mutedColor:
      "#686560",

    border:
      "border-[#151515]/10",

    borderColor:
      "#151515",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Music": {

    card:
      "bg-[#E9E3DE]",

    cardColor:
      "#E9E3DE",

    text:
      "text-[#211A1A]",

    textColor:
      "#211A1A",

    accent:
      "text-[#C43D35]",

    accentColor:
      "#C43D35",

    muted:
      "text-[#746562]",

    mutedColor:
      "#746562",

    border:
      "border-[#211A1A]/10",

    borderColor:
      "#211A1A",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Sport": {

    card:
      "bg-[#E7EBE5]",

    cardColor:
      "#E7EBE5",

    text:
      "text-[#101510]",

    textColor:
      "#101510",

    accent:
      "text-[#E54B2F]",

    accentColor:
      "#E54B2F",

    muted:
      "text-[#586058]",

    mutedColor:
      "#586058",

    border:
      "border-[#101510]/10",

    borderColor:
      "#101510",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.06em] uppercase",

    item:
      "text-base md:text-lg uppercase"

  },


  "Gaming": {

    card:
      "bg-[#E7ECE9]",

    cardColor:
      "#E7ECE9",

    text:
      "text-[#0E1416]",

    textColor:
      "#0E1416",

    accent:
      "text-[#39A932]",

    accentColor:
      "#39A932",

    muted:
      "text-[#59645F]",

    mutedColor:
      "#59645F",

    border:
      "border-[#0E1416]/10",

    borderColor:
      "#0E1416",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Travel": {

    card:
      "bg-[#E0ECE8]",

    cardColor:
      "#E0ECE8",

    text:
      "text-[#123B36]",

    textColor:
      "#123B36",

    accent:
      "text-[#087D71]",

    accentColor:
      "#087D71",

    muted:
      "text-[#58736F]",

    mutedColor:
      "#58736F",

    border:
      "border-[#123B36]/10",

    borderColor:
      "#123B36",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Technology": {

    card:
      "bg-[#E9EBE9]",

    cardColor:
      "#E9EBE9",

    text:
      "text-[#111820]",

    textColor:
      "#111820",

    accent:
      "text-[#315AE8]",

    accentColor:
      "#315AE8",

    muted:
      "text-[#69737C]",

    mutedColor:
      "#69737C",

    border:
      "border-[#111820]/10",

    borderColor:
      "#111820",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Lifestyle": {

    card:
      "bg-[#EEE8DE]",

    cardColor:
      "#EEE8DE",

    text:
      "text-[#29241E]",

    textColor:
      "#29241E",

    accent:
      "text-[#A45D3E]",

    accentColor:
      "#A45D3E",

    muted:
      "text-[#766E64]",

    mutedColor:
      "#766E64",

    border:
      "border-[#29241E]/10",

    borderColor:
      "#29241E",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Books": {

    card:
      "bg-[#F1EBDD]",

    cardColor:
      "#F1EBDD",

    text:
      "text-[#30251D]",

    textColor:
      "#30251D",

    accent:
      "text-[#9B493D]",

    accentColor:
      "#9B493D",

    muted:
      "text-[#75695E]",

    mutedColor:
      "#75695E",

    border:
      "border-[#30251D]/10",

    borderColor:
      "#30251D",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.025em]",

    item:
      "text-base md:text-lg"

  },


  "Art & Design": {

    card:
      "bg-[#E9E6DF]",

    cardColor:
      "#E9E6DF",

    text:
      "text-[#151515]",

    textColor:
      "#151515",

    accent:
      "text-[#B58B18]",

    accentColor:
      "#B58B18",

    muted:
      "text-[#68645C]",

    mutedColor:
      "#68645C",

    border:
      "border-[#151515]/10",

    borderColor:
      "#151515",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.06em]",

    item:
      "text-base md:text-lg"

  },


  "Fashion": {

    card:
      "bg-[#ECE3E9]",

    cardColor:
      "#ECE3E9",

    text:
      "text-[#231B22]",

    textColor:
      "#231B22",

    accent:
      "text-[#A52F68]",

    accentColor:
      "#A52F68",

    muted:
      "text-[#786773]",

    mutedColor:
      "#786773",

    border:
      "border-[#231B22]/10",

    borderColor:
      "#231B22",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.06em] uppercase",

    item:
      "text-base md:text-lg uppercase"

  },


  "Beauty": {

    card:
      "bg-[#F1E5E3]",

    cardColor:
      "#F1E5E3",

    text:
      "text-[#2C1C1F]",

    textColor:
      "#2C1C1F",

    accent:
      "text-[#C34E68]",

    accentColor:
      "#C34E68",

    muted:
      "text-[#856B70]",

    mutedColor:
      "#856B70",

    border:
      "border-[#2C1C1F]/10",

    borderColor:
      "#2C1C1F",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Health & Fitness": {

    card:
      "bg-[#E4EEE6]",

    cardColor:
      "#E4EEE6",

    text:
      "text-[#17251B]",

    textColor:
      "#17251B",

    accent:
      "text-[#16824D]",

    accentColor:
      "#16824D",

    muted:
      "text-[#607467]",

    mutedColor:
      "#607467",

    border:
      "border-[#17251B]/10",

    borderColor:
      "#17251B",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.05em]",

    item:
      "text-base md:text-lg"

  },


  "Business": {

    card:
      "bg-[#E5E9EE]",

    cardColor:
      "#E5E9EE",

    text:
      "text-[#14202B]",

    textColor:
      "#14202B",

    accent:
      "text-[#245A91]",

    accentColor:
      "#245A91",

    muted:
      "text-[#64717D]",

    mutedColor:
      "#64717D",

    border:
      "border-[#14202B]/10",

    borderColor:
      "#14202B",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "Science": {

    card:
      "bg-[#E0EAEC]",

    cardColor:
      "#E0EAEC",

    text:
      "text-[#14272C]",

    textColor:
      "#14272C",

    accent:
      "text-[#157D8C]",

    accentColor:
      "#157D8C",

    muted:
      "text-[#61767C]",

    mutedColor:
      "#61767C",

    border:
      "border-[#14272C]/10",

    borderColor:
      "#14272C",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "History": {

    card:
      "bg-[#E9E0CF]",

    cardColor:
      "#E9E0CF",

    text:
      "text-[#2D2419]",

    textColor:
      "#2D2419",

    accent:
      "text-[#86502E]",

    accentColor:
      "#86502E",

    muted:
      "text-[#766A5B]",

    mutedColor:
      "#766A5B",

    border:
      "border-[#2D2419]/10",

    borderColor:
      "#2D2419",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.035em]",

    item:
      "text-base md:text-lg"

  },


  "Nature & Animals": {

    card:
      "bg-[#E0E9DC]",

    cardColor:
      "#E0E9DC",

    text:
      "text-[#172418]",

    textColor:
      "#172418",

    accent:
      "text-[#4C7D3F]",

    accentColor:
      "#4C7D3F",

    muted:
      "text-[#62715E]",

    mutedColor:
      "#62715E",

    border:
      "border-[#172418]/10",

    borderColor:
      "#172418",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.045em]",

    item:
      "text-base md:text-lg"

  },


  "Cars & Transport": {

    card:
      "bg-[#E2E5E7]",

    cardColor:
      "#E2E5E7",

    text:
      "text-[#141B20]",

    textColor:
      "#141B20",

    accent:
      "text-[#C63D2E]",

    accentColor:
      "#C63D2E",

    muted:
      "text-[#68737B]",

    mutedColor:
      "#68737B",

    border:
      "border-[#141B20]/10",

    borderColor:
      "#141B20",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.055em] uppercase",

    item:
      "text-base md:text-lg"

  },


  "Home & Garden": {

    card:
      "bg-[#E9E7DD]",

    cardColor:
      "#E9E7DD",

    text:
      "text-[#25251E]",

    textColor:
      "#25251E",

    accent:
      "text-[#6E7C45]",

    accentColor:
      "#6E7C45",

    muted:
      "text-[#707064]",

    mutedColor:
      "#707064",

    border:
      "border-[#25251E]/10",

    borderColor:
      "#25251E",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

    item:
      "text-base md:text-lg"

  },


  "General": {

    card:
      "bg-[#F7F4EE]",

    cardColor:
      "#F7F4EE",

    text:
      "text-black",

    textColor:
      "#000000",

    accent:
      "text-[#FF6B35]",

    accentColor:
      "#FF6B35",

    muted:
      "text-black/50",

    mutedColor:
      "#66615B",

    border:
      "border-black/10",

    borderColor:
      "#000000",

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
      "text-3xl md:text-4xl leading-[1.05] tracking-[-0.04em]",

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


function formatLocationCountry(
  country?: string
): string {

  const countryCodes: Record<string, string> = {

    "United Kingdom":
      "UK",

    "Philippines":
      "PH"

  }


  return (
    countryCodes[country ?? ""] ??
    country ??
    ""
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


  const locationName =
    ranking.location?.name?.trim() ??
    ""

  const locationCity =
    ranking.location?.city?.trim() ??
    ""

  const locationState =
    ranking.location?.state?.trim() ??
    ""

  const showLocationCity =
    Boolean(
      locationCity
    ) &&
    locationCity.toLowerCase() !==
      locationName.toLowerCase()


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
        min-w-0
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
        "

        style={{

          color:
            `${theme.accentColor}14`

        }}

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

            className={`
              ${theme.accent}
              uppercase
              tracking-[0.25em]
              text-[10px]
              font-black
            `}

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


        {
          ranking.location && (

            <div

              className="
                mt-3
                inline-flex
                max-w-full
                min-w-0
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]
              "

              style={{

                borderColor:
                  `${theme.borderColor}1A`,

                backgroundColor:
                  `${theme.textColor}08`,

                color:
                  `${theme.mutedColor}`

              }}

            >

              <span

                className="
                  relative
                  flex
                  h-2.5
                  w-2.5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                "

                style={{

                  borderColor:
                    theme.accentColor

                }}

                aria-hidden="true"

              >

                <span

                  className="
                    h-1
                    w-1
                    rounded-full
                  "

                  style={{

                    backgroundColor:
                      theme.accentColor

                  }}

                />

              </span>


              <span
                className="
                  min-w-0
                  break-words
                "
              >

                {
                  [
                    locationName,
                    showLocationCity
                      ? locationCity
                      : "",
                    locationState,
                    formatLocationCountry(
                      ranking.location.country
                    )
                  ]
                    .filter(Boolean)
                    .join(" · ")
                }

              </span>

            </div>

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

              accentColor={
                theme.accentColor
              }

              textColor={
                theme.textColor
              }

              mutedColor={
                theme.mutedColor
              }

              borderColor={
                theme.borderColor
              }

              cardColor={
                theme.cardColor
              }

            />

          </div>

        </div>


      </Link>


      <div

        className={`
          relative
          z-10
          mt-5
          pt-5
          border-t
          ${theme.border}
        `}

      >

        <RankingResponse

          onRankd={
            handleRankd
          }

          onRerankd={
            handleRerankd
          }

          accent={
            theme.accent
          }

          text={
            theme.text
          }

          muted={
            theme.muted
          }

          border={
            theme.border
          }

          card={
            theme.card
          }

          accentColor={
            theme.accentColor
          }

          textColor={
            theme.textColor
          }

          mutedColor={
            theme.mutedColor
          }

          borderColor={
            theme.borderColor
          }

          cardColor={
            theme.cardColor
          }

        />

      </div>

    </article>

  )

}