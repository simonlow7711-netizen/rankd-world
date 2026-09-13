"use client"

import {
  useState
} from "react"


type RankingResponseProps = {

  onRankd: () => void

  onRerankd: () => void

}


type ResponseState =

  | "idle"

  | "rankd"

  | "rerankd"


export default function RankingResponse({

  onRankd,

  onRerankd

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
        className="
          mt-14
          border-t
          border-black/10
          pt-10
          md:pt-12
        "
      >

        <div
          className="
            max-w-4xl
          "
        >

          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.3em]
              text-[#FF6B35]
            "
          >
            YOUR CALL
          </p>


          <h2
            className="
              mt-3
              text-4xl
              font-black
              leading-[0.9]
              tracking-[-0.05em]
              md:text-6xl
            "
          >
            You RANKD it.
          </h2>


          <p
            className="
              mt-5
              max-w-2xl
              text-lg
              font-medium
              leading-relaxed
              text-black/50
              md:text-xl
            "
          >
            You agree with this ranking.
            Your opinion is now part of the
            conversation.
          </p>


          <div
            className="
              mt-10
              border-t
              border-black/10
              pt-7
            "
          >

            <p
              className="
                text-sm
                font-bold
                text-black/45
              "
            >
              Want to see another opinion?
            </p>


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
                gap-3
                text-left
                text-lg
                font-black
                tracking-[-0.02em]
                transition
                hover:gap-5
              "

            >

              <span
                className="
                  text-[#FF6B35]
                "
              >
                RE-RANKD
              </span>

              <span>
                it yourself
              </span>

              <span
                className="
                  text-[#FF6B35]
                "
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
        className="
          mt-14
          border-t
          border-black/10
          pt-10
          md:pt-12
        "
      >

        <div
          className="
            max-w-4xl
          "
        >

          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.3em]
              text-[#FF6B35]
            "
          >
            YOUR CALL
          </p>


          <h2
            className="
              mt-3
              text-4xl
              font-black
              leading-[0.9]
              tracking-[-0.05em]
              md:text-6xl
            "
          >
            You'd RE-RANKD it.
          </h2>


          <p
            className="
              mt-5
              max-w-2xl
              text-lg
              font-medium
              leading-relaxed
              text-black/50
              md:text-xl
            "
          >
            That's exactly what RANKD is
            about — making your own call.
          </p>


          <button

            type="button"

            onClick={
              onRerankd
            }

            className="
              group
              mt-9
              inline-flex
              items-center
              gap-3
              text-left
              text-xl
              font-black
              tracking-[-0.03em]
              transition
              hover:gap-5
              md:text-2xl
            "

          >

            <span
              className="
                text-[#FF6B35]
              "
            >
              RE-RANKD
            </span>

            <span>
              it
            </span>

            <span
              className="
                text-[#FF6B35]
              "
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
      className="
        mt-14
        border-t
        border-black/10
        pt-10
        md:pt-12
      "
    >

      <div
        className="
          max-w-4xl
        "
      >

        <p
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.3em]
            text-[#FF6B35]
          "
        >
          YOUR CALL
        </p>


        <h2
          className="
            mt-3
            max-w-3xl
            text-3xl
            font-black
            leading-[0.9]
            tracking-[-0.05em]
            md:text-5xl
          "
        >
          Would you rank it
          differently?
        </h2>


        <p
          className="
            mt-4
            max-w-xl
            text-base
            font-medium
            leading-relaxed
            text-black/50
            md:text-lg
          "
        >
          Agree with the ranking —
          or make it your own.
        </p>

      </div>


      <div
        className="
          mt-10
          grid
          border-y
          border-black/10
          md:grid-cols-2
        "
      >

        <button

          type="button"

          onClick={
            handleRankd
          }

          className="
            group
            relative
            text-left
            py-7
            pr-8
            transition
            md:py-9
            md:border-r
            md:border-black/10
            md:pr-10
            hover:bg-[#FF6B35]/[0.035]
          "

        >

          <span
            className="
              block
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-black/35
            "
          >
            KEEP IT
          </span>


          <span
            className="
              mt-2
              block
              text-4xl
              font-black
              leading-none
              tracking-[-0.06em]
              text-[#FF6B35]
              md:text-6xl
            "
          >
            RANKD
          </span>


          <span
            className="
              mt-3
              block
              text-sm
              font-bold
              text-black/50
              md:text-base
            "
          >
            I'd keep this ranking
          </span>


          <span
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              text-black
              transition
              group-hover:gap-4
            "
          >
            That's my ranking

            <span
              className="
                text-[#FF6B35]
              "
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

          className="
            group
            relative
            text-left
            border-t
            border-black/10
            py-7
            pl-0
            transition
            md:border-t-0
            md:py-9
            md:pl-10
            hover:bg-black/[0.025]
          "

        >

          <span
            className="
              block
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-black/35
            "
          >
            CHANGE IT
          </span>


          <span
            className="
              mt-2
              block
              text-4xl
              font-black
              leading-none
              tracking-[-0.06em]
              text-black
              md:text-6xl
            "
          >
            RE-RANKD
          </span>


          <span
            className="
              mt-3
              block
              text-sm
              font-bold
              text-black/50
              md:text-base
            "
          >
            I'd change the order
          </span>


          <span
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              text-black
              transition
              group-hover:gap-4
            "
          >
            Make it mine

            <span
              className="
                text-[#FF6B35]
              "
            >
              →
            </span>

          </span>

        </button>

      </div>


      <p
        className="
          mt-5
          text-sm
          text-black/40
        "
      >
        Your choice becomes part of the
        conversation around this RANKD.
      </p>

    </section>

  )

}