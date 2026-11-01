export type CategoryCover =
  | "menu"
  | "frame"
  | "sideA"
  | "match"
  | "player"
  | "itinerary"
  | "system"
  | "ritual"
  | "folio"
  | "catalogue"
  | "collection"
  | "vanity"
  | "energy"
  | "briefing"
  | "journal"
  | "archive"
  | "field"
  | "road"
  | "living"
  | "top7"


export type CategoryTheme = {
  name: string
  index: string
  label: string
  cover: CategoryCover
  paper: string
  ink: string
  accent: string
  muted: string
  line: string
  paperClass: string
  inkClass: string
  accentClass: string
  mutedClass: string
  borderClass: string
  itemBorderClass: string
  numberBgClass: string
  numberTextClass: string
  buttonPrimaryClass: string
  buttonSecondaryClass: string
  buttonSecondaryTextClass: string
  titleClass: string
  bg: string
  text: string
  border: string
  background: string
  secondaryLabel: string
}


type ThemeInput = {
  name: string
  index: string
  label: string
  cover: CategoryCover
  paper: string
  paperClass: string
  accent: string
  accentClass: string
  titleClass: string
}


const INK = "#111111"
const MUTED = "#6B6B6B"


function makeTheme(
  input: ThemeInput
): CategoryTheme {

  return {
    name:
      input.name,
    index:
      input.index,
    label:
      input.label,
    cover:
      input.cover,
    paper:
      input.paper,
    ink:
      INK,
    accent:
      input.accent,
    muted:
      MUTED,
    line:
      input.accent,
    paperClass:
      input.paperClass,
    inkClass:
      "text-black",
    accentClass:
      input.accentClass,
    mutedClass:
      "text-black/50",
    borderClass:
      "border-black",
    itemBorderClass:
      "divide-black/10",
    numberBgClass:
      "bg-transparent",
    numberTextClass:
      "text-black",
    buttonPrimaryClass:
      "bg-black text-white",
    buttonSecondaryClass:
      "bg-transparent border-black/25",
    buttonSecondaryTextClass:
      "text-black",
    titleClass:
      input.titleClass,
    bg:
      input.paper,
    text:
      INK,
    border:
      INK,
    background:
      input.paperClass,
    secondaryLabel:
      input.label
  }

}


const themes: Record<string, CategoryTheme> = {

  "Food & Drink": makeTheme({
    name: "Food & Drink",
    index: "01",
    label: "MENU / 07",
    cover: "menu",
    paper: "#F3E6D4",
    paperClass: "bg-[#F3E6D4]",
    accent: "#C45A24",
    accentClass: "text-[#C45A24]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  "Film & TV": makeTheme({
    name: "Film & TV",
    index: "02",
    label: "FRAME / 07",
    cover: "frame",
    paper: "#EFEBE3",
    paperClass: "bg-[#EFEBE3]",
    accent: "#FF6B35",
    accentClass: "text-[#FF6B35]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Music: makeTheme({
    name: "Music",
    index: "03",
    label: "SIDE A / 07",
    cover: "sideA",
    paper: "#F2E6E2",
    paperClass: "bg-[#F2E6E2]",
    accent: "#C43D35",
    accentClass: "text-[#C43D35]",
    titleClass: "leading-[0.82] tracking-[-0.06em]"
  }),

  Sport: makeTheme({
    name: "Sport",
    index: "04",
    label: "MATCH / 07",
    cover: "match",
    paper: "#EAF0E4",
    paperClass: "bg-[#EAF0E4]",
    accent: "#E54B2F",
    accentClass: "text-[#E54B2F]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Gaming: makeTheme({
    name: "Gaming",
    index: "05",
    label: "PLAYER 1 / 07",
    cover: "player",
    paper: "#E6EEE9",
    paperClass: "bg-[#E6EEE9]",
    accent: "#1F9A48",
    accentClass: "text-[#1F9A48]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  Travel: makeTheme({
    name: "Travel",
    index: "06",
    label: "ITINERARY / 07",
    cover: "itinerary",
    paper: "#E6EEEC",
    paperClass: "bg-[#E6EEEC]",
    accent: "#0A7A6E",
    accentClass: "text-[#0A7A6E]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  Technology: makeTheme({
    name: "Technology",
    index: "07",
    label: "SYSTEM / 07",
    cover: "system",
    paper: "#E8EBF0",
    paperClass: "bg-[#E8EBF0]",
    accent: "#315AE8",
    accentClass: "text-[#315AE8]",
    titleClass: "leading-[0.9] tracking-[-0.06em]"
  }),

  Lifestyle: makeTheme({
    name: "Lifestyle",
    index: "08",
    label: "RITUAL / 07",
    cover: "ritual",
    paper: "#F2E9DD",
    paperClass: "bg-[#F2E9DD]",
    accent: "#A45D3E",
    accentClass: "text-[#A45D3E]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  Books: makeTheme({
    name: "Books",
    index: "09",
    label: "FOLIO / 07",
    cover: "folio",
    paper: "#F2E9D6",
    paperClass: "bg-[#F2E9D6]",
    accent: "#8A342C",
    accentClass: "text-[#8A342C]",
    titleClass: "leading-[0.94] tracking-[-0.035em]"
  }),

  "Art & Design": makeTheme({
    name: "Art & Design",
    index: "10",
    label: "CATALOGUE / 07",
    cover: "catalogue",
    paper: "#EFE9DC",
    paperClass: "bg-[#EFE9DC]",
    accent: "#B58B18",
    accentClass: "text-[#B58B18]",
    titleClass: "leading-[0.82] tracking-[-0.07em]"
  }),

  Fashion: makeTheme({
    name: "Fashion",
    index: "11",
    label: "COLLECTION / 07",
    cover: "collection",
    paper: "#F1E6EC",
    paperClass: "bg-[#F1E6EC]",
    accent: "#A52F68",
    accentClass: "text-[#A52F68]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Beauty: makeTheme({
    name: "Beauty",
    index: "12",
    label: "VANITY / 07",
    cover: "vanity",
    paper: "#F5EAE8",
    paperClass: "bg-[#F5EAE8]",
    accent: "#C34E68",
    accentClass: "text-[#C34E68]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  "Health & Fitness": makeTheme({
    name: "Health & Fitness",
    index: "13",
    label: "ENERGY / 07",
    cover: "energy",
    paper: "#E6EEE8",
    paperClass: "bg-[#E6EEE8]",
    accent: "#16824D",
    accentClass: "text-[#16824D]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Business: makeTheme({
    name: "Business",
    index: "14",
    label: "BRIEFING / 07",
    cover: "briefing",
    paper: "#E7ECF1",
    paperClass: "bg-[#E7ECF1]",
    accent: "#245A91",
    accentClass: "text-[#245A91]",
    titleClass: "leading-[0.94] tracking-[-0.05em]"
  }),

  Science: makeTheme({
    name: "Science",
    index: "15",
    label: "JOURNAL / 07",
    cover: "journal",
    paper: "#E6EEF0",
    paperClass: "bg-[#E6EEF0]",
    accent: "#157D8C",
    accentClass: "text-[#157D8C]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  History: makeTheme({
    name: "History",
    index: "16",
    label: "ARCHIVE / 07",
    cover: "archive",
    paper: "#F1E7D8",
    paperClass: "bg-[#F1E7D8]",
    accent: "#86502E",
    accentClass: "text-[#86502E]",
    titleClass: "leading-[0.94] tracking-[-0.04em]"
  }),

  "Nature & Animals": makeTheme({
    name: "Nature & Animals",
    index: "17",
    label: "FIELD GUIDE / 07",
    cover: "field",
    paper: "#E8EDDF",
    paperClass: "bg-[#E8EDDF]",
    accent: "#4C7D3F",
    accentClass: "text-[#4C7D3F]",
    titleClass: "leading-[0.88] tracking-[-0.055em]"
  }),

  "Cars & Transport": makeTheme({
    name: "Cars & Transport",
    index: "18",
    label: "ROAD / 07",
    cover: "road",
    paper: "#EAECEA",
    paperClass: "bg-[#EAECEA]",
    accent: "#C63D2E",
    accentClass: "text-[#C63D2E]",
    titleClass: "leading-[0.8] tracking-[-0.065em]"
  }),

  "Home & Garden": makeTheme({
    name: "Home & Garden",
    index: "19",
    label: "LIVING / 07",
    cover: "living",
    paper: "#EEE9DC",
    paperClass: "bg-[#EEE9DC]",
    accent: "#6E7C45",
    accentClass: "text-[#6E7C45]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  General: makeTheme({
    name: "General",
    index: "20",
    label: "TOP 7",
    cover: "top7",
    paper: "#F7F4EE",
    paperClass: "bg-[#F7F4EE]",
    accent: "#FF6B35",
    accentClass: "text-[#FF6B35]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  })

}


export function getCategoryTheme(
  category?: string | null
): CategoryTheme {

  return (
    themes[category || "General"] ??
    themes.General
  )

}
