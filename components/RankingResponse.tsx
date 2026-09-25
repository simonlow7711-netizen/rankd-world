"use client"


import {
  useState
} from "react"


type RankingResponseProps = {

  onRankd: () => void

  onRerankd: () => void

  accent?: string

  text?: string

  muted?: string

  border?: string

  card?: string

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
    "border-black/10",

  card =
    "bg-[#F7F4EE]"

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
      >

        <div
          className="
            max-w-2xl
          "
        >

          <p
            className={`
              text-[9px]
              font-black
              uppercase
              tracking-[0.24em]
              ${accent}
            `}
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
          >
            You agree with this ranking.
            Your opinion is now part of the conversation.
          </p>


          <div
            className={`
              mt-4
              border-t
              pt-4
              ${border}
            `}
          >

            <p
              className={`
                text-xs
                font-bold
                ${muted}
              `}
            >
              Want to see another opinion?
            </p>


            <button
              type="button"
              onClick={
                onRerankd
              }
              className={`
                group
                mt-2
                inline-flex
                items-center
                gap-2
                text-left
                text-sm
                font-black
                tracking-[-0.02em]
                ${text}
                transition-all
                duration-300
                hover:gap-3
                focus:outline-none
                focus-visible:rounded-lg
                focus-visible:ring-2
                focus-visible:ring-[#FF6B35]/40
              `}
            >

              <span
                className={
                  accent
                }
              >
                RE-RANKD
              </span>


              <span>
                it yourself
              </span>


              <span
                className={`
                  ${accent}
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                `}
              >
                →
              </span>

            </button>

          </div>

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
      >

        <div
          className="
            max-w-2xl
          "
        >

          <p
            className={`
              text-[9px]
              font-black
              uppercase
              tracking-[0.24em]
              ${accent}
            `}
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
          >
            That's exactly what RANKD is about —
            making your own call.
          </p>


          <button
            type="button"
            onClick={
              onRerankd
            }
            className={`
              group
              mt-4
              inline-flex
              items-center
              gap-2
              text-left
              text-sm
              font-black
              tracking-[-0.02em]
              ${text}
              transition-all
              duration-300
              hover:gap-3
              focus:outline-none
              focus-visible:rounded-lg
              focus-visible:ring-2
              focus-visible:ring-[#FF6B35]/40
            `}
          >

            <span
              className={
                accent
              }
            >
              RE-RANKD
            </span>


            <span>
              it
            </span>


            <span
              className={`
                ${accent}
                transition-transform
                duration-300
                group-hover:translate-x-1
              `}
            >
              →
            </span>

          </button>

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
    >

      <div
        className="
          text-center
        "
      >

        <p
          className={`
            text-sm
            font-black
            leading-tight
            tracking-[-0.02em]
            sm:text-base
            ${text}
          `}
        >
          Would you rank this the same?
        </p>


        <p
          className={`
            mt-1
            text-xs
            ${muted}
          `}
        >
          Make your call.
        </p>

      </div>


      <div
        className="
          mt-5
          grid
          min-w-0
          grid-cols-2
          gap-2
        "
      >

        <button
          type="button"
          onClick={
            handleRankd
          }
          aria-label="RANKD this ranking"
          className={`
            group/reaction
            relative
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            px-3
            py-3.5
            text-left
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-[#FF6B35]/45
            hover:shadow-[0_8px_24px_rgba(255,107,53,0.07)]
            active:translate-y-0
            active:scale-[0.985]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#FF6B35]/40
            ${border}
            ${card}
          `}
        >

          <span
            className="
              absolute
              inset-x-3
              top-0
              h-px
              bg-[#FF6B35]/20
              transition-all
              duration-300
              group-hover/reaction:bg-[#FF6B35]/60
            "
          />


          <span
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                relative
                flex
                w-7
                shrink-0
                items-center
              "
              aria-hidden="true"
            >

              <span
                className="
                  h-px
                  w-7
                  bg-[#FF6B35]/35
                  transition-all
                  duration-300
                  group-hover/reaction:w-5
                  group-hover/reaction:bg-[#FF6B35]/70
                "
              />


              <span
                className="
                  absolute
                  left-0
                  h-2
                  w-2
                  rounded-full
                  bg-[#FF6B35]
                  shadow-[0_0_0_3px_rgba(255,107,53,0.08)]
                  transition-all
                  duration-300
                  group-hover/reaction:left-5
                  group-hover/reaction:shadow-[0_0_0_4px_rgba(255,107,53,0.12)]
                  group-active/reaction:left-6
                "
              />

            </span>


            <span
              className={`
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                opacity-50
                transition-colors
                duration-300
                group-hover/reaction:opacity-100
                ${text}
              `}
            >
              KEEP IT
            </span>

          </span>


          <span
            className={`
              mt-2.5
              block
              text-lg
              font-black
              leading-none
              tracking-[-0.05em]
              transition-transform
              duration-300
              group-hover/reaction:translate-x-1
              ${accent}
            `}
          >
            RANKD
          </span>


          <span
            className={`
              mt-1.5
              block
              text-[10px]
              font-medium
              opacity-55
              ${text}
            `}
          >
            I'd keep this ranking
          </span>


          <span
            className={`
              mt-3
              flex
              items-center
              gap-1
              text-[9px]
              font-black
              opacity-60
              transition-all
              duration-300
              group-hover/reaction:gap-2
              group-hover/reaction:opacity-100
              ${text}
            `}
          >

            That's my ranking


            <span
              className={`
                ${accent}
                transition-transform
                duration-300
                group-hover/reaction:translate-x-1
              `}
            >
              →
            </span>

          </span>

        </button>


        <button
          type="button"
          onClick={
            handleRerankd
          }
          aria-label="RE-RANKD this ranking"
          className={`
            group/reaction
            relative
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            px-3
            py-3.5
            text-left
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-[#FF6B35]/45
            hover:shadow-[0_8px_24px_rgba(255,107,53,0.07)]
            active:translate-y-0
            active:scale-[0.985]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#FF6B35]/40
            ${border}
            ${card}
          `}
        >

          <span
            className="
              absolute
              inset-x-3
              top-0
              h-px
              bg-[#FF6B35]/20
              transition-all
              duration-300
              group-hover/reaction:bg-[#FF6B35]/60
            "
          />


          <span
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                relative
                flex
                w-7
                shrink-0
                items-center
              "
              aria-hidden="true"
            >

              <span
                className="
                  h-px
                  w-7
                  bg-[#FF6B35]/35
                  transition-all
                  duration-300
                  group-hover/reaction:w-5
                  group-hover/reaction:bg-[#FF6B35]/70
                "
              />


              <span
                className="
                  absolute
                  left-0
                  h-2
                  w-2
                  rounded-full
                  border-2
                  border-[#FF6B35]
                  transition-all
                  duration-300
                  group-hover/reaction:left-5
                  group-hover/reaction:bg-[#FF6B35]
                  group-active/reaction:left-6
                "
              />

            </span>


            <span
              className={`
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                opacity-50
                transition-colors
                duration-300
                group-hover/reaction:opacity-100
                ${text}
              `}
            >
              CHANGE IT
            </span>

          </span>


          <span
            className={`
              mt-2.5
              block
              text-lg
              font-black
              leading-none
              tracking-[-0.05em]
              transition-transform
              duration-300
              group-hover/reaction:translate-x-1
              ${accent}
            `}
          >
            RE-RANKD
          </span>


          <span
            className={`
              mt-1.5
              block
              text-[10px]
              font-medium
              opacity-55
              ${text}
            `}
          >
            I'd change the order
          </span>


          <span
            className={`
              mt-3
              flex
              items-center
              gap-1
              text-[9px]
              font-black
              opacity-60
              transition-all
              duration-300
              group-hover/reaction:gap-2
              group-hover/reaction:opacity-100
              ${text}
            `}
          >

            Make it mine


            <span
              className={`
                ${accent}
                transition-transform
                duration-300
                group-hover/reaction:translate-x-1
              `}
            >
              →
            </span>

          </span>

        </button>

      </div>


      <p
        className={`
          mt-4
          text-center
          text-[10px]
          ${muted}
          opacity-60
        `}
      >
        Your choice becomes part of the conversation around this RANKD.
      </p>

    </section>

  )

}