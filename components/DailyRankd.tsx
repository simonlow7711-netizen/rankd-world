import Link from "next/link"


type DailyRankdProps = {
  category?: string
  title?: string
  description?: string
  href?: string
}


type CategoryTheme = {
  bg: string
  text: string
  accent: string
  muted: string
  border: string
  label: string
}


const categoryThemes: Record<
  string,
  CategoryTheme
> = {
  "Food & Drink": {
    bg: "#F3E8D8",
    text: "#211A16",
    accent: "#D96B35",
    muted: "#6E5545",
    border: "#211A16/10",
    label: "MENU / 07"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    border: "#151515/10",
    label: "FRAME / 07"
  },

  "Music": {
    bg: "#EAE3EC",
    text: "#25152F",
    accent: "#A95BCB",
    muted: "#685C6D",
    border: "#25152F/10",
    label: "SIDE A / 07"
  },

  "Sport": {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    border: "#101510/10",
    label: "MATCH / 07"
  },

  "Gaming": {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    border: "#0E1416/10",
    label: "PLAYER 1 / 07"
  },

  "Travel": {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    border: "#123B36/10",
    label: "FIELD NOTES / 07"
  },

  "Technology": {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    border: "#111820/10",
    label: "SYSTEM / 07"
  },

  "Lifestyle": {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    border: "#29241E/10",
    label: "EDIT / 07"
  },

  "Books": {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    border: "#30251D/10",
    label: "PUBLISHING / 07"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    border: "#151515/10",
    label: "CATALOGUE / 07"
  },

  "Fashion": {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    border: "#231B22/10",
    label: "COLLECTION / 07"
  },

  "Beauty": {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    border: "#2C1C1F/10",
    label: "EDIT / 07"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    border: "#17251B/10",
    label: "ENERGY / 07"
  },

  "Business": {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    border: "#14202B/10",
    label: "BRIEFING / 07"
  },

  "Science": {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    border: "#14272C/10",
    label: "FIELD NOTES / 07"
  },

  "History": {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    border: "#2D2419/10",
    label: "ARCHIVE / 07"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    border: "#172418/10",
    label: "FIELD GUIDE / 07"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    border: "#141B20/10",
    label: "ROAD / 07"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    border: "#25251E/10",
    label: "LIVING / 07"
  },

  "General": {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#000000",
    border: "#000000/10",
    label: "TOP 7"
  }
}


function getTheme(
  category: string
) {
  return (
    categoryThemes[category] ??
    categoryThemes["General"]
  )
}


export default function DailyRankd({
  category = "Film & TV",
  title = "Top 7 films everyone should watch?",
  description = "Thousands of possible answers. One question.",
  href
}: DailyRankdProps) {

  const theme =
    getTheme(category)

  const createHref =
    href ??
    `/create?title=${encodeURIComponent(
      title
    )}&category=${encodeURIComponent(
      category
    )}`


  return (
    <section
      className="
        px-5
        py-14
        md:px-8
        md:py-20
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[32px]
            border
            p-7
            shadow-[0_24px_70px_rgba(0,0,0,0.10)]
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_30px_90px_rgba(0,0,0,0.14)]
            md:rounded-[40px]
            md:p-12
            lg:p-16
          "
          style={{
            backgroundColor:
              theme.bg,
            color:
              theme.text,
            borderColor:
              "rgba(0,0,0,0.10)"
          }}
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-4
              -top-16
              select-none
              text-[18rem]
              font-black
              leading-none
              tracking-[-0.16em]
              opacity-[0.07]
              md:-right-8
              md:-top-24
              md:text-[24rem]
            "
            style={{
              color:
                "#FF6B35"
            }}
            aria-hidden="true"
          >
            7
          </div>


          <div
            className="
              absolute
              bottom-0
              left-0
              top-0
              w-1.5
              md:w-2
            "
            style={{
              backgroundColor:
                theme.accent
            }}
            aria-hidden="true"
          />


          <div
            className="
              relative
              z-10
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                border-b
                pb-7
                md:flex-row
                md:items-start
                md:justify-between
              "
              style={{
                borderColor:
                  "rgba(0,0,0,0.10)"
              }}
            >

              <div>

                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.28em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >
                  RANKD OF THE DAY
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.22em]
                    opacity-60
                  "
                >
                  {theme.label}
                </p>

              </div>


              <div
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  opacity-50
                "
              >
                DAILY EDITION
              </div>

            </div>


            <div
              className="
                max-w-5xl
                py-10
                md:py-14
              "
            >

              <p
                className="
                  mb-5
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  opacity-55
                "
              >
                TOP 7
              </p>


              <h2
                className="
                  max-w-5xl
                  text-4xl
                  font-black
                  leading-[0.94]
                  tracking-[-0.055em]
                  md:text-6xl
                  lg:text-8xl
                "
              >
                {title}
              </h2>


              <div
                className="
                  mt-9
                  h-px
                  w-full
                "
                style={{
                  backgroundColor:
                    "rgba(0,0,0,0.10)"
                }}
              />


              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div
                  className="
                    max-w-2xl
                  "
                >

                  <p
                    className="
                      text-lg
                      leading-relaxed
                      md:text-xl
                    "
                    style={{
                      color:
                        theme.muted
                    }}
                  >
                    {description}
                  </p>

                  <p
                    className="
                      mt-3
                      text-lg
                      font-black
                      md:text-xl
                    "
                  >
                    How would you rank it?
                  </p>

                </div>


                <Link
                  href={createHref}
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-black
                    px-7
                    py-4
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:scale-[1.03]
                    hover:bg-black/85
                  "
                >

                  <span>
                    Rank it
                  </span>

                  <span
                    className="
                      text-lg
                      leading-none
                    "
                    style={{
                      color:
                        theme.accent
                    }}
                  >
                    →
                  </span>

                </Link>

              </div>

            </div>


            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                pt-5
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                opacity-55
                md:flex-row
                md:items-center
                md:justify-between
              "
              style={{
                borderColor:
                  "rgba(0,0,0,0.10)"
              }}
            >

              <span>
                {category}
              </span>

              <span>
                Would you rank it differently?
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}