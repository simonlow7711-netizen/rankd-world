export type CategoryTheme = {
  name: string
  index: string
  label: string
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
    paper: "#E8C9A0",
    paperClass: "bg-[#E8C9A0]",
    accent: "#C45A24",
    accentClass: "text-[#C45A24]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  "Film & TV": makeTheme({
    name: "Film & TV",
    index: "02",
    label: "FRAME / 07",
    paper: "#DDD6C8",
    paperClass: "bg-[#DDD6C8]",
    accent: "#FF6B35",
    accentClass: "text-[#FF6B35]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Music: makeTheme({
    name: "Music",
    index: "03",
    label: "SIDE A / 07",
    paper: "#E0C4BC",
    paperClass: "bg-[#E0C4BC]",
    accent: "#C43D35",
    accentClass: "text-[#C43D35]",
    titleClass: "leading-[0.82] tracking-[-0.06em]"
  }),

  Sport: makeTheme({
    name: "Sport",
    index: "04",
    label: "MATCH / 07",
    paper: "#D4DEC8",
    paperClass: "bg-[#D4DEC8]",
    accent: "#E54B2F",
    accentClass: "text-[#E54B2F]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Gaming: makeTheme({
    name: "Gaming",
    index: "05",
    label: "PLAYER 1 / 07",
    paper: "#CDE0D4",
    paperClass: "bg-[#CDE0D4]",
    accent: "#1F9A48",
    accentClass: "text-[#1F9A48]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  Travel: makeTheme({
    name: "Travel",
    index: "06",
    label: "ITINERARY / 07",
    paper: "#C5DDD6",
    paperClass: "bg-[#C5DDD6]",
    accent: "#0A7A6E",
    accentClass: "text-[#0A7A6E]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  Technology: makeTheme({
    name: "Technology",
    index: "07",
    label: "SYSTEM / 07",
    paper: "#D4DAE4",
    paperClass: "bg-[#D4DAE4]",
    accent: "#315AE8",
    accentClass: "text-[#315AE8]",
    titleClass: "leading-[0.9] tracking-[-0.06em]"
  }),

  Lifestyle: makeTheme({
    name: "Lifestyle",
    index: "08",
    label: "RITUAL / 07",
    paper: "#E6D4B8",
    paperClass: "bg-[#E6D4B8]",
    accent: "#A45D3E",
    accentClass: "text-[#A45D3E]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  Books: makeTheme({
    name: "Books",
    index: "09",
    label: "FOLIO / 07",
    paper: "#E6D2A8",
    paperClass: "bg-[#E6D2A8]",
    accent: "#8A342C",
    accentClass: "text-[#8A342C]",
    titleClass: "leading-[0.94] tracking-[-0.035em]"
  }),

  "Art & Design": makeTheme({
    name: "Art & Design",
    index: "10",
    label: "CATALOGUE / 07",
    paper: "#E2D8C0",
    paperClass: "bg-[#E2D8C0]",
    accent: "#B58B18",
    accentClass: "text-[#B58B18]",
    titleClass: "leading-[0.82] tracking-[-0.07em]"
  }),

  Fashion: makeTheme({
    name: "Fashion",
    index: "11",
    label: "COLLECTION / 07",
    paper: "#E4C8D4",
    paperClass: "bg-[#E4C8D4]",
    accent: "#A52F68",
    accentClass: "text-[#A52F68]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Beauty: makeTheme({
    name: "Beauty",
    index: "12",
    label: "VANITY / 07",
    paper: "#F0D0CC",
    paperClass: "bg-[#F0D0CC]",
    accent: "#C34E68",
    accentClass: "text-[#C34E68]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  "Health & Fitness": makeTheme({
    name: "Health & Fitness",
    index: "13",
    label: "ENERGY / 07",
    paper: "#C8E0D0",
    paperClass: "bg-[#C8E0D0]",
    accent: "#16824D",
    accentClass: "text-[#16824D]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Business: makeTheme({
    name: "Business",
    index: "14",
    label: "BRIEFING / 07",
    paper: "#D0D8E4",
    paperClass: "bg-[#D0D8E4]",
    accent: "#245A91",
    accentClass: "text-[#245A91]",
    titleClass: "leading-[0.94] tracking-[-0.05em]"
  }),

  Science: makeTheme({
    name: "Science",
    index: "15",
    label: "JOURNAL / 07",
    paper: "#C8DCE4",
    paperClass: "bg-[#C8DCE4]",
    accent: "#157D8C",
    accentClass: "text-[#157D8C]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  History: makeTheme({
    name: "History",
    index: "16",
    label: "ARCHIVE / 07",
    paper: "#E4D0A8",
    paperClass: "bg-[#E4D0A8]",
    accent: "#86502E",
    accentClass: "text-[#86502E]",
    titleClass: "leading-[0.94] tracking-[-0.04em]"
  }),

  "Nature & Animals": makeTheme({
    name: "Nature & Animals",
    index: "17",
    label: "FIELD GUIDE / 07",
    paper: "#C8D8B8",
    paperClass: "bg-[#C8D8B8]",
    accent: "#4C7D3F",
    accentClass: "text-[#4C7D3F]",
    titleClass: "leading-[0.88] tracking-[-0.055em]"
  }),

  "Cars & Transport": makeTheme({
    name: "Cars & Transport",
    index: "18",
    label: "ROAD / 07",
    paper: "#D4D8DC",
    paperClass: "bg-[#D4D8DC]",
    accent: "#C63D2E",
    accentClass: "text-[#C63D2E]",
    titleClass: "leading-[0.8] tracking-[-0.065em]"
  }),

  "Home & Garden": makeTheme({
    name: "Home & Garden",
    index: "19",
    label: "LIVING / 07",
    paper: "#DED8C0",
    paperClass: "bg-[#DED8C0]",
    accent: "#6E7C45",
    accentClass: "text-[#6E7C45]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  General: makeTheme({
    name: "General",
    index: "20",
    label: "TOP 7",
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


export const categoryThemes =
  themes
