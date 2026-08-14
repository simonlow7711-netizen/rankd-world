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
          rounded-[36px]
          bg-black
          text-white
          p-7
          md:p-10
        "
      >

        <p
          className="
            rankd-accent
            uppercase
            tracking-[0.25em]
            text-xs
            md:text-sm
            font-black
          "
        >

          Your call

        </p>


        <h2
          className="
            mt-4
            text-4xl
            md:text-6xl
            font-black
            leading-none
          "
        >

          You RANKD it.

        </h2>


        <p
          className="
            mt-5
            text-lg
            md:text-xl
            text-white/65
            max-w-2xl
          "
        >

          You agree with this ranking.
          Your opinion is now part of the
          conversation.

        </p>


        <div
          className="
            mt-8
            rounded-[28px]
            bg-white/10
            p-6
          "
        >

          <p
            className="
              text-sm
              md:text-base
              font-bold
              text-white/70
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
              mt-4
              w-full
              rounded-[22px]
              bg-white
              text-black
              px-6
              py-5
              text-lg
              md:text-xl
              font-black
              hover:-translate-y-1
              transition
            "

          >

            Re-RANKD it yourself →

          </button>

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
          rounded-[36px]
          bg-white
          border-2
          border-black
          p-7
          md:p-10
        "
      >

        <p
          className="
            rankd-accent
            uppercase
            tracking-[0.25em]
            text-xs
            md:text-sm
            font-black
          "
        >

          Your call

        </p>


        <h2
          className="
            mt-4
            text-4xl
            md:text-6xl
            font-black
            leading-none
          "
        >

          You'd RE-RANKD it.

        </h2>


        <p
          className="
            mt-5
            text-lg
            md:text-xl
            rankd-muted
            max-w-2xl
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
            mt-8
            w-full
            rounded-[24px]
            bg-black
            text-white
            px-6
            py-6
            text-xl
            md:text-2xl
            font-black
            hover:-translate-y-1
            transition
          "

        >

          Build your RE-RANKD →

        </button>

      </section>

    )

  }


  return (

    <section
      className="
        mt-14
        pt-12
        border-t
        border-black/10
      "
    >

      <div
        className="
          text-center
        "
      >

        <p
          className="
            rankd-accent
            uppercase
            tracking-[0.25em]
            text-xs
            md:text-sm
            font-black
          "
        >

          Your call

        </p>


        <h2
          className="
            mt-3
            text-3xl
            md:text-5xl
            font-black
            leading-tight
          "
        >

          Would you rank it
          differently?

        </h2>


        <p
          className="
            mt-4
            text-base
            md:text-lg
            rankd-muted
            max-w-xl
            mx-auto
          "
        >

          Agree with the ranking —
          or make it your own.

        </p>

      </div>


      <div
        className="
          mt-8
          grid
          md:grid-cols-2
          gap-4
        "
      >

        <button

          type="button"

          onClick={
            handleRankd
          }

          className="
            group
            rounded-[28px]
            bg-black
            text-white
            px-6
            py-7
            md:py-9
            text-center
            hover:-translate-y-1
            transition
          "

        >

          <span
            className="
              block
              text-3xl
              md:text-5xl
              font-black
            "
          >

            RANKD

          </span>


          <span
            className="
              block
              mt-2
              text-sm
              md:text-base
              font-bold
              text-white/60
            "
          >

            I'd keep this ranking

          </span>


          <span
            className="
              block
              mt-6
              text-base
              font-black
              text-white/50
              group-hover:text-white
              transition
            "
          >

            That's my ranking →

          </span>

        </button>


        <button

          type="button"

          onClick={
            handleRerankd
          }

          className="
            group
            rounded-[28px]
            bg-white
            text-black
            border-2
            border-black
            px-6
            py-7
            md:py-9
            text-center
            hover:-translate-y-1
            transition
          "

        >

          <span
            className="
              block
              text-3xl
              md:text-5xl
              font-black
            "
          >

            RE-RANKD

          </span>


          <span
            className="
              block
              mt-2
              text-sm
              md:text-base
              font-bold
              opacity-60
            "
          >

            I'd change the order

          </span>


          <span
            className="
              block
              mt-6
              text-base
              font-black
              opacity-50
              group-hover:opacity-100
              transition
            "
          >

            Make it mine →

          </span>

        </button>

      </div>


      <p
        className="
          mt-5
          text-center
          text-sm
          rankd-muted
        "
      >

        Your choice becomes part of the
        conversation around this RANKD.

      </p>

    </section>

  )

}