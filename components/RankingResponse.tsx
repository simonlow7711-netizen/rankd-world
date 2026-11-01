"use client"


import {
  useState
} from "react"

import RankdMark from "@/components/RankdMark"


type RankingResponseProps = {

  onRankd: () => void

  onRerankd: () => void

  accent?: string

  text?: string

  muted?: string

  border?: string

  card?: string

  accentColor?: string

  textColor?: string

  mutedColor?: string

  borderColor?: string

  cardColor?: string

}


type ResponseState =

  | "idle"

  | "rankd"

  | "rerankd"


export default function RankingResponse({

  onRankd,

  onRerankd,

  accent =
    "text-[#FF6B35]",

  text =
    "text-black",

  muted =
    "text-black/50",

  border =
    "border-black",

  accentColor,

  textColor,

  mutedColor,

  borderColor

}: RankingResponseProps) {


  const [
    response,
    setResponse
  ] =
    useState<ResponseState>(
      "idle"
    )


  function handleRankd() {

    setResponse(
      "rankd"
    )

    onRankd()

  }


  function handleRerankd() {

    setResponse(
      "rerankd"
    )

    onRerankd()

  }


  const accentStyle =
    accentColor
      ? {
          color:
            accentColor
        }
      : undefined


  const textStyle =
    textColor
      ? {
          color:
            textColor
        }
      : undefined


  const mutedStyle =
    mutedColor
      ? {
          color:
            mutedColor
        }
      : undefined


  const borderStyle =
    borderColor
      ? {
          borderColor:
            borderColor
        }
      : {
          borderColor:
            "#111111"
        }


  const continueButton =
    (
      <button
        type="button"
        onClick={
          onRerankd
        }
        className="
          group
          mt-5
          inline-flex
          items-center
          justify-center
          gap-3
          rounded-full
          border
          border-black
          bg-black
          px-7
          py-3.5
          text-sm
          font-black
          uppercase
          tracking-[0.16em]
          text-white
          transition
          hover:bg-black/85
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-black/20
        "
      >

        <span
          className={
            accent
          }
          style={
            accentStyle
          }
        >
          RE-RANKD
        </span>


        <span>
          it yourself
        </span>


        <span
          className={
            accent
          }
          style={
            accentStyle
          }
        >
          →
        </span>

      </button>
    )


  if (
    response === "rankd"
  ) {

    return (

      <section
        className={`
          mt-5
          border-t
          pt-5
          ${border}
        `}
        style={
          borderStyle
        }
      >

        <div
          className="
            mx-auto
            max-w-2xl
            text-center
          "
        >

          <p
            className={`
              text-[10px]
              font-black
              uppercase
              tracking-[0.24em]
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            YOUR CALL
          </p>


          <h2
            className={`
              mt-2
              text-xl
              font-black
              leading-none
              tracking-[-0.04em]
              sm:text-2xl
              ${text}
            `}
            style={
              textStyle
            }
          >
            You RANKD it.
          </h2>


          <p
            className={`
              mt-2
              max-w-lg
              text-xs
              font-medium
              leading-relaxed
              sm:text-sm
              ${muted}
            `}
            style={
              mutedStyle
            }
          >
            You agree with this ranking.
            Your opinion is now part of the conversation.
          </p>


          {continueButton}

        </div>

      </section>

    )

  }


  if (
    response === "rerankd"
  ) {

    return (

      <section
        className={`
          mt-5
          border-t
          pt-5
          ${border}
        `}
        style={
          borderStyle
        }
      >

        <div
          className="
            mx-auto
            max-w-2xl
            text-center
          "
        >

          <p
            className={`
              text-[10px]
              font-black
              uppercase
              tracking-[0.24em]
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            YOUR CALL
          </p>


          <h2
            className={`
              mt-2
              text-xl
              font-black
              leading-none
              tracking-[-0.04em]
              sm:text-2xl
              ${text}
            `}
            style={
              textStyle
            }
          >
            You'd RE-RANKD it.
          </h2>


          <p
            className={`
              mt-2
              max-w-lg
              text-xs
              font-medium
              leading-relaxed
              sm:text-sm
              ${muted}
            `}
            style={
              mutedStyle
            }
          >
            That's exactly what RANKD is about —
            making your own call.
          </p>


          {continueButton}

        </div>

      </section>

    )

  }


  return (

    <section
      className={`
        mt-6
        border-t
        pt-5
        ${border}
      `}
      style={
        borderStyle
      }
    >

      <div
        className="
          text-center
        "
      >

        <p
          className={`
            text-base
            font-black
            leading-tight
            tracking-[-0.03em]
            sm:text-lg
            ${text}
          `}
          style={
            textStyle
          }
        >
          Would you rank this the same?
        </p>


        <p
          className={`
            mt-1.5
            text-sm
            font-medium
            ${muted}
          `}
          style={
            mutedStyle
          }
        >
          Make your call.
        </p>

      </div>


      <div
        className="
          mt-5
          grid
          w-full
          min-w-0
          grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
          gap-3
        "
      >

        <button
          type="button"
          onClick={
            handleRankd
          }
          aria-label="RANKD this ranking"
          className="
            group
            flex
            w-full
            min-w-0
            flex-col
            items-center
            justify-center
            rounded-[22px]
            border
            border-black
            bg-transparent
            px-3
            py-5
            text-center
            transition
            hover:border-[var(--response-accent,#FF6B35)]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-black/20
            sm:px-4
            sm:py-6
          "
          style={{
            ...borderStyle,
            ["--response-accent" as string]:
              accentColor || "#FF6B35"
          }}
        >

          <RankdMark
            variant="rankd"
            color={
              accentColor || "#FF6B35"
            }
          />


          <span
            className={`
              mt-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              sm:text-[11px]
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            Keep it
          </span>


          <span
            className={`
              mt-2
              text-[1.65rem]
              font-black
              leading-none
              tracking-[-0.06em]
              sm:text-3xl
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            RANKD
          </span>


          <span
            className={`
              mt-2.5
              text-[11px]
              font-medium
              leading-snug
              sm:text-xs
              ${text}
            `}
            style={
              textStyle
            }
          >
            This is my ranking
          </span>

        </button>


        <button
          type="button"
          onClick={
            handleRerankd
          }
          aria-label="RE-RANKD this ranking"
          className="
            group
            flex
            w-full
            min-w-0
            flex-col
            items-center
            justify-center
            rounded-[22px]
            border
            border-black
            bg-transparent
            px-3
            py-5
            text-center
            transition
            hover:border-[var(--response-accent,#FF6B35)]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-black/20
            sm:px-4
            sm:py-6
          "
          style={{
            ...borderStyle,
            ["--response-accent" as string]:
              accentColor || "#FF6B35"
          }}
        >

          <RankdMark
            variant="rerankd"
            color={
              accentColor || "#FF6B35"
            }
          />


          <span
            className={`
              mt-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              sm:text-[11px]
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            Change it
          </span>


          <span
            className={`
              mt-2
              text-[1.45rem]
              font-black
              leading-none
              tracking-[-0.06em]
              sm:text-[1.7rem]
              ${accent}
            `}
            style={
              accentStyle
            }
          >
            RE-RANKD
          </span>


          <span
            className={`
              mt-2.5
              text-[11px]
              font-medium
              leading-snug
              sm:text-xs
              ${text}
            `}
            style={
              textStyle
            }
          >
            I'd change the order
          </span>

        </button>

      </div>


      <p
        className={`
          mt-4
          text-center
          text-[11px]
          ${muted}
        `}
        style={
          mutedStyle
        }
      >
        Your choice becomes part of the conversation around this RANKD.
      </p>

    </section>

  )

}
