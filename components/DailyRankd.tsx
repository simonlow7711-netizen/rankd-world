import Link from "next/link"


type DailyRankdProps = {

  category?:string

  title?:string

  description?:string

  href?:string

}


type CategoryTheme = {

  background:string

  text:string

  accent:string

  muted:string

  border:string

  label:string

  titleClass:string

}


const categoryThemes:Record<string,CategoryTheme> = {

  "Food & Drink": {

    background:"#F3E8D8",

    text:"#211A16",

    accent:"#D96B35",

    muted:"#6E5545",

    border:"#211A16",

    label:"MENU / 07",

    titleClass:
      "leading-[0.88] tracking-[-0.05em]"

  },

  "Film & TV": {

    background:"#ECEAE5",

    text:"#151515",

    accent:"#FF6B35",

    muted:"#686560",

    border:"#151515",

    label:"FRAME / 07",

    titleClass:
      "leading-[0.84] tracking-[-0.055em]"

  },

  "Music": {

    background:"#EAE3EC",

    text:"#25152F",

    accent:"#A95BCB",

    muted:"#685C6D",

    border:"#25152F",

    label:"SIDE A / 07",

    titleClass:
      "leading-[0.8] tracking-[-0.055em]"

  },

  "Sport": {

    background:"#E7EBE5",

    text:"#101510",

    accent:"#E54B2F",

    muted:"#586058",

    border:"#101510",

    label:"MATCH / 07",

    titleClass:
      "leading-[0.76] tracking-[-0.06em] uppercase"

  },

  "Gaming": {

    background:"#E7ECE9",

    text:"#0E1416",

    accent:"#39A932",

    muted:"#59645F",

    border:"#0E1416",

    label:"PLAYER 1 / 07",

    titleClass:
      "leading-[0.88] tracking-[-0.045em]"

  },

  "Travel": {

    background:"#E0ECE8",

    text:"#123B36",

    accent:"#087D71",

    muted:"#58736F",

    border:"#123B36",

    label:"FIELD NOTES / 07",

    titleClass:
      "leading-[0.86] tracking-[-0.045em]"

  },

  "Technology": {

    background:"#E9EBE9",

    text:"#111820",

    accent:"#315AE8",

    muted:"#69737C",

    border:"#111820",

    label:"SYSTEM / 07",

    titleClass:
      "leading-[0.88] tracking-[-0.055em]"

  },

  "Lifestyle": {

    background:"#EEE8DE",

    text:"#29241E",

    accent:"#A45D3E",

    muted:"#766E64",

    border:"#29241E",

    label:"EDIT / 07",

    titleClass:
      "leading-[0.9] tracking-[-0.045em]"

  },

  "Books": {

    background:"#F1EBDD",

    text:"#30251D",

    accent:"#9B493D",

    muted:"#75695E",

    border:"#30251D",

    label:"PUBLISHING / 07",

    titleClass:
      "leading-[0.92] tracking-[-0.03em]"

  },

  "Art & Design": {

    background:"#E9E6DF",

    text:"#151515",

    accent:"#B58B18",

    muted:"#68645C",

    border:"#151515",

    label:"CATALOGUE / 07",

    titleClass:
      "leading-[0.8] tracking-[-0.06em]"

  },

  "Fashion": {

    background:"#ECE3E9",

    text:"#231B22",

    accent:"#A52F68",

    muted:"#786773",

    border:"#231B22",

    label:"COLLECTION / 07",

    titleClass:
      "leading-[0.76] tracking-[-0.06em] uppercase"

  },

  "Beauty": {

    background:"#F1E5E3",

    text:"#2C1C1F",

    accent:"#C34E68",

    muted:"#856B70",

    border:"#2C1C1F",

    label:"EDIT / 07",

    titleClass:
      "leading-[0.86] tracking-[-0.045em]"

  },

  "Health & Fitness": {

    background:"#E4EEE6",

    text:"#17251B",

    accent:"#16824D",

    muted:"#607467",

    border:"#17251B",

    label:"ENERGY / 07",

    titleClass:
      "leading-[0.84] tracking-[-0.055em]"

  },

  "Business": {

    background:"#E5E9EE",

    text:"#14202B",

    accent:"#245A91",

    muted:"#64717D",

    border:"#14202B",

    label:"BRIEFING / 07",

    titleClass:
      "leading-[0.92] tracking-[-0.045em]"

  },

  "Science": {

    background:"#E0EAEC",

    text:"#14272C",

    accent:"#157D8C",

    muted:"#61767C",

    border:"#14272C",

    label:"FIELD NOTES / 07",

    titleClass:
      "leading-[0.9] tracking-[-0.045em]"

  },

  "History": {

    background:"#E9E0CF",

    text:"#2D2419",

    accent:"#86502E",

    muted:"#766A5B",

    border:"#2D2419",

    label:"ARCHIVE / 07",

    titleClass:
      "leading-[0.92] tracking-[-0.035em]"

  },

  "Nature & Animals": {

    background:"#E0E9DC",

    text:"#172418",

    accent:"#4C7D3F",

    muted:"#62715E",

    border:"#172418",

    label:"FIELD GUIDE / 07",

    titleClass:
      "leading-[0.86] tracking-[-0.05em]"

  },

  "Cars & Transport": {

    background:"#E2E5E7",

    text:"#141B20",

    accent:"#C63D2E",

    muted:"#68737B",

    border:"#141B20",

    label:"ROAD / 07",

    titleClass:
      "leading-[0.78] tracking-[-0.06em] uppercase"

  },

  "Home & Garden": {

    background:"#E9E7DD",

    text:"#25251E",

    accent:"#6E7C45",

    muted:"#707064",

    border:"#25251E",

    label:"LIVING / 07",

    titleClass:
      "leading-[0.9] tracking-[-0.045em]"

  },

  "General": {

    background:"#F7F4EE",

    text:"#000000",

    accent:"#FF6B35",

    muted:"#000000",

    border:"#000000",

    label:"TOP 7",

    titleClass:
      "leading-[0.9] tracking-[-0.045em]"

  }

}


function getTheme(
  category:string
):CategoryTheme {

  return (
    categoryThemes[category] ??
    categoryThemes["General"]
  )

}


export default function DailyRankd({

  category = "Film & TV",

  title = "Top 7 films everyone should watch?",

  description =
    "Thousands of possible answers. One question.",

  href = "/create"

}:DailyRankdProps) {


  const theme =
    getTheme(category)


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
          max-w-7xl
          mx-auto
        "
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            md:rounded-[40px]
            border
            p-7
            md:p-12
            lg:p-16
            shadow-[0_24px_70px_rgba(0,0,0,0.10)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_30px_90px_rgba(0,0,0,0.13)]
          "
          style={{
            backgroundColor:
              theme.background,

            color:
              theme.text,

            borderColor:
              `${theme.border}1A`
          }}
        >

          <div
            className="
              absolute
              -right-10
              -top-24
              select-none
              pointer-events-none
              text-[18rem]
              md:text-[26rem]
              font-black
              leading-none
            "
            style={{
              color:"#FF6B35",
              opacity:0.075
            }}
          >

            7

          </div>


          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-1
              md:w-1.5
            "
            style={{
              backgroundColor:
                theme.accent
            }}
          />


          <div
            className="
              relative
              z-10
              max-w-5xl
              mx-auto
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-6
                mb-10
              "
            >

              <div>

                <p
                  className="
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    md:text-sm
                    font-black
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
                    uppercase
                    tracking-[0.2em]
                    text-[10px]
                    md:text-xs
                    font-black
                  "
                  style={{
                    color:
                      theme.muted,
                    opacity:0.8
                  }}
                >

                  {theme.label}

                </p>

              </div>


              <div
                className="
                  hidden
                  sm:block
                  text-right
                "
              >

                <p
                  className="
                    uppercase
                    tracking-[0.2em]
                    text-[10px]
                    font-black
                  "
                  style={{
                    color:
                      theme.muted,
                    opacity:0.75
                  }}
                >

                  DAILY EDITION

                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                  "
                  style={{
                    color:
                      theme.muted,
                    opacity:0.65
                  }}
                >

                  TOP 7

                </p>

              </div>

            </div>


            <div
              className="
                grid
                lg:grid-cols-[1fr_auto]
                gap-10
                lg:gap-16
                items-end
              "
            >

              <div>

                <h2
                  className={`
                    text-5xl
                    md:text-7xl
                    lg:text-8xl
                    font-black
                    ${theme.titleClass}
                  `}
                >

                  {title}

                </h2>


                <div
                  className="
                    mt-8
                    h-px
                    w-full
                    opacity-15
                  "
                  style={{
                    backgroundColor:
                      theme.text
                  }}
                />


                <p
                  className="
                    mt-6
                    text-base
                    md:text-lg
                    leading-relaxed
                    max-w-2xl
                  "
                  style={{
                    color:
                      theme.muted
                  }}
                >

                  {description}

                  <br />

                  <span
                    className="
                      font-black
                    "
                    style={{
                      color:
                        theme.text
                    }}
                  >

                    How would you rank it?

                  </span>

                </p>

              </div>


              <div
                className="
                  lg:min-w-[190px]
                "
              >

                <Link
                  href={href}
                  className="
                    group
                    inline-flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    rounded-full
                    px-6
                    py-4
                    md:px-7
                    md:py-5
                    text-sm
                    md:text-base
                    font-black
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                  "
                  style={{
                    backgroundColor:
                      theme.text,

                    color:
                      theme.background
                  }}
                >

                  <span>

                    Rank it

                  </span>

                  <span
                    className="
                      text-lg
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
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
                mt-10
                pt-5
                border-t
                flex
                items-center
                justify-between
                gap-4
              "
              style={{
                borderColor:
                  `${theme.border}1A`
              }}
            >

              <p
                className="
                  uppercase
                  tracking-[0.18em]
                  text-[10px]
                  md:text-xs
                  font-black
                "
                style={{
                  color:
                    theme.muted,
                  opacity:0.7
                }}
              >

                {category}

              </p>


              <p
                className="
                  uppercase
                  tracking-[0.18em]
                  text-[10px]
                  md:text-xs
                  font-black
                "
                style={{
                  color:
                    theme.muted,
                  opacity:0.7
                }}
              >

                Would you rank it differently?

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  )

}