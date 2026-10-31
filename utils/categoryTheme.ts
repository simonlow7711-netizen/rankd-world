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
  accent: string
  accentClass: string
  borderClass: string
  titleClass: string
}


const PAPER = "#FFFFFF"
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
      PAPER,
    ink:
      INK,
    accent:
      input.accent,
    muted:
      MUTED,
    line:
      input.accent,
    paperClass:
      "bg-white",
    inkClass:
      "text-black",
    accentClass:
      input.accentClass,
    mutedClass:
      "text-black/50",
    borderClass:
      input.borderClass,
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
      PAPER,
    text:
      INK,
    border:
      input.accent,
    background:
      "bg-white",
    secondaryLabel:
      input.label
  }

}


const themes: Record<string, CategoryTheme> = {

  "Food & Drink": makeTheme({
    name: "Food & Drink",
    index: "01",
    label: "MENU / 07",
    accent: "#E56A2A",
    accentClass: "text-[#E56A2A]",
    borderClass: "border-[#E56A2A]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  "Film & TV": makeTheme({
    name: "Film & TV",
    index: "02",
    label: "FRAME / 07",
    accent: "#FF6B35",
    accentClass: "text-[#FF6B35]",
    borderClass: "border-[#FF6B35]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Music: makeTheme({
    name: "Music",
    index: "03",
    label: "SIDE A / 07",
    accent: "#D4453A",
    accentClass: "text-[#D4453A]",
    borderClass: "border-[#D4453A]",
    titleClass: "leading-[0.82] tracking-[-0.06em]"
  }),

  Sport: makeTheme({
    name: "Sport",
    index: "04",
    label: "MATCH / 07",
    accent: "#FF4B2A",
    accentClass: "text-[#FF4B2A]",
    borderClass: "border-[#FF4B2A]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Gaming: makeTheme({
    name: "Gaming",
    index: "05",
    label: "PLAYER 1 / 07",
    accent: "#FF8C2A",
    accentClass: "text-[#FF8C2A]",
    borderClass: "border-[#FF8C2A]",
    titleClass: "leading-[0.9] tracking-[-0.05em]"
  }),

  Travel: makeTheme({
    name: "Travel",
    index: "06",
    label: "ITINERARY / 07",
    accent: "#E07A45",
    accentClass: "text-[#E07A45]",
    borderClass: "border-[#E07A45]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  Technology: makeTheme({
    name: "Technology",
    index: "07",
    label: "SYSTEM / 07",
    accent: "#FF5E3A",
    accentClass: "text-[#FF5E3A]",
    borderClass: "border-[#FF5E3A]",
    titleClass: "leading-[0.9] tracking-[-0.06em]"
  }),

  Lifestyle: makeTheme({
    name: "Lifestyle",
    index: "08",
    label: "RITUAL / 07",
    accent: "#D9784A",
    accentClass: "text-[#D9784A]",
    borderClass: "border-[#D9784A]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  Books: makeTheme({
    name: "Books",
    index: "09",
    label: "FOLIO / 07",
    accent: "#C45C3A",
    accentClass: "text-[#C45C3A]",
    borderClass: "border-[#C45C3A]",
    titleClass: "leading-[0.94] tracking-[-0.035em]"
  }),

  "Art & Design": makeTheme({
    name: "Art & Design",
    index: "10",
    label: "CATALOGUE / 07",
    accent: "#E0A020",
    accentClass: "text-[#E0A020]",
    borderClass: "border-[#E0A020]",
    titleClass: "leading-[0.82] tracking-[-0.07em]"
  }),

  Fashion: makeTheme({
    name: "Fashion",
    index: "11",
    label: "COLLECTION / 07",
    accent: "#E04A6A",
    accentClass: "text-[#E04A6A]",
    borderClass: "border-[#E04A6A]",
    titleClass: "leading-[0.78] tracking-[-0.07em]"
  }),

  Beauty: makeTheme({
    name: "Beauty",
    index: "12",
    label: "VANITY / 07",
    accent: "#F06A7A",
    accentClass: "text-[#F06A7A]",
    borderClass: "border-[#F06A7A]",
    titleClass: "leading-[0.88] tracking-[-0.05em]"
  }),

  "Health & Fitness": makeTheme({
    name: "Health & Fitness",
    index: "13",
    label: "ENERGY / 07",
    accent: "#E86B2E",
    accentClass: "text-[#E86B2E]",
    borderClass: "border-[#E86B2E]",
    titleClass: "leading-[0.86] tracking-[-0.06em]"
  }),

  Business: makeTheme({
    name: "Business",
    index: "14",
    label: "BRIEFING / 07",
    accent: "#C45A32",
    accentClass: "text-[#C45A32]",
    borderClass: "border-[#C45A32]",
    titleClass: "leading-[0.94] tracking-[-0.05em]"
  }),

  Science: makeTheme({
    name: "Science",
    index: "15",
    label: "JOURNAL / 07",
    accent: "#D46A48",
    accentClass: "text-[#D46A48]",
    borderClass: "border-[#D46A48]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  History: makeTheme({
    name: "History",
    index: "16",
    label: "ARCHIVE / 07",
    accent: "#C46A32",
    accentClass: "text-[#C46A32]",
    borderClass: "border-[#C46A32]",
    titleClass: "leading-[0.94] tracking-[-0.04em]"
  }),

  "Nature & Animals": makeTheme({
    name: "Nature & Animals",
    index: "17",
    label: "FIELD GUIDE / 07",
    accent: "#C47A2A",
    accentClass: "text-[#C47A2A]",
    borderClass: "border-[#C47A2A]",
    titleClass: "leading-[0.88] tracking-[-0.055em]"
  }),

  "Cars & Transport": makeTheme({
    name: "Cars & Transport",
    index: "18",
    label: "ROAD / 07",
    accent: "#FF3B20",
    accentClass: "text-[#FF3B20]",
    borderClass: "border-[#FF3B20]",
    titleClass: "leading-[0.8] tracking-[-0.065em]"
  }),

  "Home & Garden": makeTheme({
    name: "Home & Garden",
    index: "19",
    label: "LIVING / 07",
    accent: "#C48A40",
    accentClass: "text-[#C48A40]",
    borderClass: "border-[#C48A40]",
    titleClass: "leading-[0.92] tracking-[-0.05em]"
  }),

  General: makeTheme({
    name: "General",
    index: "20",
    label: "TOP 7",
    accent: "#FF6B35",
    accentClass: "text-[#FF6B35]",
    borderClass: "border-[#FF6B35]",
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
