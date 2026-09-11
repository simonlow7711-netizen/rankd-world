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

  accentBackground: string

  muted: string

  border: string

  itemBorder: string

  numberBackground: string

  numberText: string

  decoration: string

  buttonPrimary: string

  buttonSecondary: string

  buttonSecondaryText: string

  categoryLabel: string

  secondaryLabel: string

  title: string

  item: string

  listStyle: string

  shape: "circle" | "square" | "line" | "corner" | "none"

}


const themes: Record<string, RankingTheme> = {

  "Food & Drink": {

    card:
      "bg-[#F1E4D1] shadow-[0_24px_70px_rgba(90,55,30,0.14)]",

    text:
      "text-[#211A16]",

    accent:
      "text-[#D96B35]",

    accentBackground:
      "bg-[#D96B35]",

    muted:
      "text-[#6E5545]",

    border:
      "border-[#8A5A3C]/20",

    itemBorder:
      "divide-[#8A5A3C]/15",

    numberBackground:
      "bg-[#D96B35]",

    numberText:
      "text-[#F7F1E7]",

    decoration:
      "text-[#D96B35]/[0.07]",

    buttonPrimary:
      "bg-[#211A16] text-[#F7F1E7]",

    buttonSecondary:
      "bg-[#F7F1E7] border-[#211A16]",

    buttonSecondaryText:
      "text-[#211A16]",

    categoryLabel:
      "Food & Drink",

    secondaryLabel:
      "MENU / 07",

    title:
      "text-4xl md:text-5xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "rounded-xl",

    shape:
      "circle"

  },


  "Film & TV": {

    card:
      "bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.28)]",

    text:
      "text-[#F7F4EE]",

    accent:
      "text-[#FF6B35]",

    accentBackground:
      "bg-[#FF6B35]",

    muted:
      "text-white/55",

    border:
      "border-white/15",

    itemBorder:
      "divide-white/10",

    numberBackground:
      "bg-transparent",

    numberText:
      "text-[#FF6B35]",

    decoration:
      "text-white/[0.025]",

    buttonPrimary:
      "bg-[#F7F4EE] text-[#111111]",

    buttonSecondary:
      "bg-transparent border-white/60",

    buttonSecondaryText:
      "text-[#F7F4EE]",

    categoryLabel:
      "Film & TV",

    secondaryLabel:
      "FRAME / 07",

    title:
      "text-4xl md:text-5xl leading-[0.86] tracking-[-0.055em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "uppercase",

    shape:
      "line"

  },


  "Music": {

    card:
      "bg-[#25152F] shadow-[0_25px_70px_rgba(50,20,65,0.2)]",

    text:
      "text-[#F7EFF8]",

    accent:
      "text-[#E7A8FF]",

    accentBackground:
      "bg-[#E7A8FF]",

    muted:
      "text-[#C8B7CC]",

    border:
      "border-[#E7A8FF]/20",

    itemBorder:
      "divide-[#E7A8FF]/15",

    numberBackground:
      "bg-[#E7A8FF]",

    numberText:
      "text-[#25152F]",

    decoration:
      "text-[#E7A8FF]/[0.04]",

    buttonPrimary:
      "bg-[#E7A8FF] text-[#25152F]",

    buttonSecondary:
      "bg-transparent border-[#E7A8FF]",

    buttonSecondaryText:
      "text-[#F7EFF8]",

    categoryLabel:
      "Music",

    secondaryLabel:
      "SIDE A / 07",

    title:
      "text-4xl md:text-5xl leading-[0.82] tracking-[-0.06em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "rounded-full",

    shape:
      "circle"

  },


  "Sport": {

    card:
      "bg-[#E9ECE7] shadow-[0_20px_55px_rgba(30,45,30,0.14)]",

    text:
      "text-[#101510]",

    accent:
      "text-[#E54B2F]",

    accentBackground:
      "bg-[#101510]",

    muted:
      "text-[#586058]",

    border:
      "border-[#101510]/15",

    itemBorder:
      "divide-[#101510]/10",

    numberBackground:
      "bg-[#101510]",

    numberText:
      "text-[#E9ECE7]",

    decoration:
      "text-[#E54B2F]/[0.05]",

    buttonPrimary:
      "bg-[#101510] text-white",

    buttonSecondary:
      "bg-[#E54B2F] border-[#E54B2F]",

    buttonSecondaryText:
      "text-white",

    categoryLabel:
      "Sport",

    secondaryLabel:
      "MATCH / 07",

    title:
      "text-4xl md:text-5xl leading-[0.78] tracking-[-0.065em] uppercase",

    item:
      "text-lg md:text-xl uppercase",

    listStyle:
      "skew",

    shape:
      "line"

  },


  "Gaming": {

    card:
      "bg-[#0E1416] shadow-[0_25px_75px_rgba(0,0,0,0.3)]",

    text:
      "text-[#EAF5EE]",

    accent:
      "text-[#72F36A]",

    accentBackground:
      "bg-[#72F36A]",

    muted:
      "text-[#8DA098]",

    border:
      "border-[#72F36A]/20",

    itemBorder:
      "divide-[#72F36A]/10",

    numberBackground:
      "bg-[#72F36A]",

    numberText:
      "text-[#0E1416]",

    decoration:
      "text-[#72F36A]/[0.035]",

    buttonPrimary:
      "bg-[#72F36A] text-[#0E1416]",

    buttonSecondary:
      "bg-transparent border-[#72F36A]",

    buttonSecondaryText:
      "text-[#EAF5EE]",

    categoryLabel:
      "Gaming",

    secondaryLabel:
      "PLAYER 1 / 07",

    title:
      "text-4xl md:text-5xl leading-[0.9] tracking-[-0.045em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "square",

    shape:
      "square"

  },


  "Travel": {

    card:
      "bg-[#D9EEE9] shadow-[0_25px_65px_rgba(25,90,80,0.12)]",

    text:
      "text-[#123B36]",

    accent:
      "text-[#087D71]",

    accentBackground:
      "bg-[#087D71]",

    muted:
      "text-[#58736F]",

    border:
      "border-[#123B36]/15",

    itemBorder:
      "divide-[#123B36]/10",

    numberBackground:
      "bg-[#123B36]",

    numberText:
      "text-[#D9EEE9]",

    decoration:
      "text-[#087D71]/[0.05]",

    buttonPrimary:
      "bg-[#123B36] text-white",

    buttonSecondary:
      "bg-[#087D71] border-[#087D71]",

    buttonSecondaryText:
      "text-white",

    categoryLabel:
      "Travel",

    secondaryLabel:
      "FIELD NOTES / 07",

    title:
      "text-4xl md:text-5xl leading-[0.88] tracking-[-0.045em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "bordered",

    shape:
      "circle"

  },


  "Technology": {

    card:
      "bg-[#ECEDEA] shadow-[0_20px_60px_rgba(20,25,30,0.12)]",

    text:
      "text-[#111820]",

    accent:
      "text-[#315AE8]",

    accentBackground:
      "bg-[#315AE8]",

    muted:
      "text-[#69737C]",

    border:
      "border-[#111820]/15",

    itemBorder:
      "divide-[#111820]/10",

    numberBackground:
      "bg-transparent",

    numberText:
      "text-[#315AE8]",

    decoration:
      "text-[#315AE8]/[0.035]",

    buttonPrimary:
      "bg-[#111820] text-white",

    buttonSecondary:
      "bg-transparent border-[#111820]",

    buttonSecondaryText:
      "text-[#111820]",

    categoryLabel:
      "Technology",

    secondaryLabel:
      "SYSTEM / 07",

    title:
      "text-4xl md:text-5xl leading-[0.9] tracking-[-0.055em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "numbered",

    shape:
      "square"

  },


  "Lifestyle": {

    card:
      "bg-[#EFE8DC] shadow-[0_25px_65px_rgba(80,65,45,0.12)]",

    text:
      "text-[#29241E]",

    accent:
      "text-[#A45D3E]",

    accentBackground:
      "bg-[#A45D3E]",

    muted:
      "text-[#766E64]",

    border:
      "border-[#29241E]/15",

    itemBorder:
      "divide-[#29241E]/10",

    numberBackground:
      "bg-[#29241E]",

    numberText:
      "text-[#EFE8DC]",

    decoration:
      "text-[#A45D3E]/[0.04]",

    buttonPrimary:
      "bg-[#29241E] text-white",

    buttonSecondary:
      "bg-transparent border-[#29241E]",

    buttonSecondaryText:
      "text-[#29241E]",

    categoryLabel:
      "Lifestyle",

    secondaryLabel:
      "EDIT / 07",

    title:
      "text-4xl md:text-5xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "minimal",

    shape:
      "circle"

  },


  "Books": {

    card:
      "bg-[#F3EDE0] shadow-[0_20px_55px_rgba(65,50,35,0.1)]",

    text:
      "text-[#30251D]",

    accent:
      "text-[#9B493D]",

    accentBackground:
      "bg-[#9B493D]",

    muted:
      "text-[#75695E]",

    border:
      "border-[#30251D]/15",

    itemBorder:
      "divide-[#30251D]/10",

    numberBackground:
      "bg-transparent",

    numberText:
      "text-[#9B493D]",

    decoration:
      "text-[#9B493D]/[0.035]",

    buttonPrimary:
      "bg-[#30251D] text-white",

    buttonSecondary:
      "bg-transparent border-[#30251D]",

    buttonSecondaryText:
      "text-[#30251D]",

    categoryLabel:
      "Books",

    secondaryLabel:
      "PUBLISHING / 07",

    title:
      "text-4xl md:text-5xl leading-[0.94] tracking-[-0.025em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "literary",

    shape:
      "line"

  },


  "Art & Design": {

    card:
      "bg-[#151515] shadow-[0_25px_75px_rgba(0,0,0,0.2)]",

    text:
      "text-[#F5F1EA]",

    accent:
      "text-[#F2C14E]",

    accentBackground:
      "bg-[#F2C14E]",

    muted:
      "text-[#A8A39B]",

    border:
      "border-white/15",

    itemBorder:
      "divide-white/10",

    numberBackground:
      "bg-[#F2C14E]",

    numberText:
      "text-[#151515]",

    decoration:
      "text-[#F2C14E]/[0.025]",

    buttonPrimary:
      "bg-[#F2C14E] text-[#151515]",

    buttonSecondary:
      "bg-transparent border-[#F2C14E]",

    buttonSecondaryText:
      "text-[#F5F1EA]",

    categoryLabel:
      "Art & Design",

    secondaryLabel:
      "CATALOGUE / 07",

    title:
      "text-4xl md:text-5xl leading-[0.82] tracking-[-0.07em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "gallery",

    shape:
      "square"

  },


  "Fashion": {

    card:
      "bg-[#E9DFE7] shadow-[0_25px_70px_rgba(80,45,70,0.14)]",

    text:
      "text-[#231B22]",

    accent:
      "text-[#A52F68]",

    accentBackground:
      "bg-[#A52F68]",

    muted:
      "text-[#786773]",

    border:
      "border-[#231B22]/15",

    itemBorder:
      "divide-[#231B22]/10",

    numberBackground:
      "bg-[#231B22]",

    numberText:
      "text-[#E9DFE7]",

    decoration:
      "text-[#A52F68]/[0.045]",

    buttonPrimary:
      "bg-[#231B22] text-white",

    buttonSecondary:
      "bg-[#A52F68] border-[#A52F68]",

    buttonSecondaryText:
      "text-white",

    categoryLabel:
      "Fashion",

    secondaryLabel:
      "COLLECTION / 07",

    title:
      "text-4xl md:text-5xl leading-[0.78] tracking-[-0.07em] uppercase",

    item:
      "text-lg md:text-xl",

    listStyle:
      "editorial",

    shape:
      "line"

  },


  "Beauty": {

    card:
      "bg-[#F4E2E1] shadow-[0_25px_65px_rgba(110,55,60,0.12)]",

    text:
      "text-[#2C1C1F]",

    accent:
      "text-[#C34E68]",

    accentBackground:
      "bg-[#C34E68]",

    muted:
      "text-[#856B70]",

    border:
      "border-[#6F454A]/15",

    itemBorder:
      "divide-[#6F454A]/10",

    numberBackground:
      "bg-[#C34E68]",

    numberText:
      "text-white",

    decoration:
      "text-[#C34E68]/[0.045]",

    buttonPrimary:
      "bg-[#2C1C1F] text-white",

    buttonSecondary:
      "bg-transparent border-[#2C1C1F]",

    buttonSecondaryText:
      "text-[#2C1C1F]",

    categoryLabel:
      "Beauty",

    secondaryLabel:
      "EDIT / 07",

    title:
      "text-4xl md:text-5xl leading-[0.88] tracking-[-0.045em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "soft",

    shape:
      "circle"

  },


  "Health & Fitness": {

    card:
      "bg-[#E2F0E5] shadow-[0_20px_60px_rgba(40,90,55,0.12)]",

    text:
      "text-[#17251B]",

    accent:
      "text-[#16824D]",

    accentBackground:
      "bg-[#16824D]",

    muted:
      "text-[#607467]",

    border:
      "border-[#244A35]/15",

    itemBorder:
      "divide-[#244A35]/10",

    numberBackground:
      "bg-[#16824D]",

    numberText:
      "text-white",

    decoration:
      "text-[#16824D]/[0.045]",

    buttonPrimary:
      "bg-[#17251B] text-white",

    buttonSecondary:
      "bg-[#16824D] border-[#16824D]",

    buttonSecondaryText:
      "text-white",

    categoryLabel:
      "Health & Fitness",

    secondaryLabel:
      "ENERGY / 07",

    title:
      "text-4xl md:text-5xl leading-[0.86] tracking-[-0.055em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "strong",

    shape:
      "circle"

  },


  "Business": {

    card:
      "bg-[#E4E9EF] shadow-[0_20px_60px_rgba(35,55,75,0.12)]",

    text:
      "text-[#14202B]",

    accent:
      "text-[#245A91]",

    accentBackground:
      "bg-[#245A91]",

    muted:
      "text-[#64717D]",

    border:
      "border-[#14202B]/15",

    itemBorder:
      "divide-[#14202B]/10",

    numberBackground:
      "bg-[#14202B]",

    numberText:
      "text-[#E4E9EF]",

    decoration:
      "text-[#245A91]/[0.04]",

    buttonPrimary:
      "bg-[#14202B] text-white",

    buttonSecondary:
      "bg-transparent border-[#14202B]",

    buttonSecondaryText:
      "text-[#14202B]",

    categoryLabel:
      "Business",

    secondaryLabel:
      "BRIEFING / 07",

    title:
      "text-4xl md:text-5xl leading-[0.94] tracking-[-0.04em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "financial",

    shape:
      "square"

  },


  "Science": {

    card:
      "bg-[#DDECEF] shadow-[0_20px_60px_rgba(35,80,90,0.12)]",

    text:
      "text-[#14272C]",

    accent:
      "text-[#157D8C]",

    accentBackground:
      "bg-[#157D8C]",

    muted:
      "text-[#61767C]",

    border:
      "border-[#29525A]/15",

    itemBorder:
      "divide-[#29525A]/10",

    numberBackground:
      "bg-transparent",

    numberText:
      "text-[#157D8C]",

    decoration:
      "text-[#157D8C]/[0.04]",

    buttonPrimary:
      "bg-[#14272C] text-white",

    buttonSecondary:
      "bg-transparent border-[#157D8C]",

    buttonSecondaryText:
      "text-[#14272C]",

    categoryLabel:
      "Science",

    secondaryLabel:
      "FIELD NOTES / 07",

    title:
      "text-4xl md:text-5xl leading-[0.92] tracking-[-0.045em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "scientific",

    shape:
      "circle"

  },


  "History": {

    card:
      "bg-[#E8DDC8] shadow-[0_20px_60px_rgba(75,55,35,0.12)]",

    text:
      "text-[#2D2419]",

    accent:
      "text-[#86502E]",

    accentBackground:
      "bg-[#86502E]",

    muted:
      "text-[#766A5B]",

    border:
      "border-[#574735]/15",

    itemBorder:
      "divide-[#574735]/10",

    numberBackground:
      "bg-[#86502E]",

    numberText:
      "text-[#E8DDC8]",

    decoration:
      "text-[#86502E]/[0.045]",

    buttonPrimary:
      "bg-[#2D2419] text-white",

    buttonSecondary:
      "bg-transparent border-[#2D2419]",

    buttonSecondaryText:
      "text-[#2D2419]",

    categoryLabel:
      "History",

    secondaryLabel:
      "ARCHIVE / 07",

    title:
      "text-4xl md:text-5xl leading-[0.94] tracking-[-0.035em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "archival",

    shape:
      "line"

  },


  "Nature & Animals": {

    card:
      "bg-[#DDE9D8] shadow-[0_25px_65px_rgba(40,80,40,0.12)]",

    text:
      "text-[#172418]",

    accent:
      "text-[#4C7D3F]",

    accentBackground:
      "bg-[#4C7D3F]",

    muted:
      "text-[#62715E]",

    border:
      "border-[#31482E]/15",

    itemBorder:
      "divide-[#31482E]/10",

    numberBackground:
      "bg-[#4C7D3F]",

    numberText:
      "text-white",

    decoration:
      "text-[#4C7D3F]/[0.045]",

    buttonPrimary:
      "bg-[#172418] text-white",

    buttonSecondary:
      "bg-transparent border-[#4C7D3F]",

    buttonSecondaryText:
      "text-[#172418]",

    categoryLabel:
      "Nature & Animals",

    secondaryLabel:
      "FIELD GUIDE / 07",

    title:
      "text-4xl md:text-5xl leading-[0.88] tracking-[-0.05em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "organic",

    shape:
      "circle"

  },


  "Cars & Transport": {

    card:
      "bg-[#DCE1E5] shadow-[0_25px_70px_rgba(30,40,50,0.14)]",

    text:
      "text-[#141B20]",

    accent:
      "text-[#C63D2E]",

    accentBackground:
      "bg-[#141B20]",

    muted:
      "text-[#68737B]",

    border:
      "border-[#141B20]/15",

    itemBorder:
      "divide-[#141B20]/10",

    numberBackground:
      "bg-[#C63D2E]",

    numberText:
      "text-white",

    decoration:
      "text-[#C63D2E]/[0.045]",

    buttonPrimary:
      "bg-[#141B20] text-white",

    buttonSecondary:
      "bg-[#C63D2E] border-[#C63D2E]",

    buttonSecondaryText:
      "text-white",

    categoryLabel:
      "Cars & Transport",

    secondaryLabel:
      "ROAD / 07",

    title:
      "text-4xl md:text-5xl leading-[0.8] tracking-[-0.065em] uppercase",

    item:
      "text-lg md:text-xl",

    listStyle:
      "automotive",

    shape:
      "line"

  },


  "Home & Garden": {

    card:
      "bg-[#E8E5D7] shadow-[0_25px_65px_rgba(65,60,45,0.11)]",

    text:
      "text-[#25251E]",

    accent:
      "text-[#6E7C45]",

    accentBackground:
      "bg-[#6E7C45]",

    muted:
      "text-[#707064]",

    border:
      "border-[#4F503E]/15",

    itemBorder:
      "divide-[#4F503E]/10",

    numberBackground:
      "bg-[#6E7C45]",

    numberText:
      "text-white",

    decoration:
      "text-[#6E7C45]/[0.045]",

    buttonPrimary:
      "bg-[#25251E] text-white",

    buttonSecondary:
      "bg-transparent border-[#6E7C45]",

    buttonSecondaryText:
      "text-[#25251E]",

    categoryLabel:
      "Home & Garden",

    secondaryLabel:
      "LIVING / 07",

    title:
      "text-4xl md:text-5xl leading-[0.92] tracking-[-0.04em]",

    item:
      "text-lg md:text-xl",

    listStyle:
      "interior",

    shape:
      "square"

  },


  "General": {

    card:
      "rankd-card",

    text:
      "text-black",

    accent:
      "rankd-accent",

    accentBackground:
      "bg-black",

    muted:
      "rankd-muted",

    border:
      "border-black/10",

    itemBorder:
      "divide-black/5",

    numberBackground:
      "bg-transparent",

    numberText:
      "rankd-accent",

    decoration:
      "text-black/[0.02]",

    buttonPrimary:
      "bg-black text-white",

    buttonSecondary:
      "bg-white border-black",

    buttonSecondaryText:
      "text-black",

    categoryLabel:
      "General",

    secondaryLabel:
      "Top 7",

    title:
      "text-3xl leading-tight",

    item:
      "text-lg",

    listStyle:
      "minimal",

    shape:
      "none"

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


  const isGeneral =
    !ranking.category ||
    ranking.category === "General"


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
        relative
        overflow-hidden
        h-full
        p-8
        rounded-[2rem]
        transition
        ${theme.card}
        ${theme.text}
      `}

    >

      {
        !isGeneral && (

          <div

            className={`
              pointer-events-none
              absolute
              -right-12
              -top-20
              text-[18rem]
              leading-none
              font-black
              select-none
              ${theme.decoration}
            `}

          >

            7

          </div>

        )
      }


      {
        theme.shape === "circle" && (

          <div

            className={`
              pointer-events-none
              absolute
              -left-20
              -bottom-20
              h-56
              w-56
              rounded-full
              opacity-30
              ${theme.accentBackground}
            `}

          />

        )
      }


      {
        theme.shape === "square" && (

          <div

            className={`
              pointer-events-none
              absolute
              right-[-45px]
              bottom-[-45px]
              h-40
              w-40
              rotate-12
              opacity-10
              ${theme.accentBackground}
            `}

          />

        )
      }


      {
        theme.shape === "line" && (

          <div

            className={`
              pointer-events-none
              absolute
              right-8
              top-8
              h-32
              w-px
              opacity-30
              ${theme.accentBackground}
            `}

          />

        )
      }


      <Link

        href={
          `/rank/${ranking.id}`
        }

        className="
          relative
          z-10
          block
          hover:-translate-y-1
          transition
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

            {
              theme.categoryLabel
            }

          </p>


          <span

            className="
              text-[9px]
              uppercase
              tracking-[0.2em]
              font-black
              opacity-60
            "

          >

            {
              theme.secondaryLabel
            }

          </span>

        </div>


        <h3

          className={`
            mt-7
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
            border-t
            ${theme.border}
          `}

        >

          <div

            className="
              pt-5
            "

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

                Top 7

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
                        py-4
                      "

                    >

                      {
                        theme.numberBackground ===
                        "bg-transparent" ? (

                          <span

                            className={`
                              w-9
                              shrink-0
                              text-sm
                              font-black
                              ${theme.numberText}
                            `}

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

                        ) : (

                          <span

                            className={`
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              text-xs
                              font-black
                              ${theme.numberBackground}
                              ${theme.numberText}
                            `}

                          >

                            {
                              item.position
                            }

                          </span>

                        )
                      }


                      <span

                        className={`
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

          </div>


          <div

            className={`
              mt-6
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
          mt-8
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
                    text-xl
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
                    transition
                    ${theme.buttonPrimary}
                  `}

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
                    transition
                    ${theme.buttonSecondary}
                    ${theme.buttonSecondaryText}
                  `}

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

    </article>

  )

}