"use client"

import { useState } from "react"

import {
  Check,
  Share2
} from "lucide-react"

import { trackEvent } from "@/utils/analytics"


type ShareRankingButtonProps = {

  rankingId: string

  title: string

}


export default function ShareRankingButton({

  rankingId,

  title

}: ShareRankingButtonProps) {


  const [

    copied,

    setCopied

  ] = useState(false)


  async function handleShare() {

    const url =

      `${window.location.origin}/rank/${rankingId}`


    const shareData = {

      title:

        "Would you rank this the same?",

      text:

        `Check out this RANKD:\n\n${title}\n\nDo you agree, or would you RE-RANK it?`,

      url

    }


    try {

      if (

        navigator.share

      ) {

        await navigator.share(

          shareData

        )

      }

      else {

        await navigator.clipboard.writeText(

          url

        )

        setCopied(true)

        setTimeout(

          () =>

            setCopied(false),

          2000

        )

      }


      trackEvent(

        "ranking_shared",

        {

          rankingId

        }

      )

    }

    catch (

      error

    ) {

      console.error(

        error

      )

    }

  }


  return (

    <button

      type="button"

      onClick={handleShare}

      className="

        group

        relative

        w-full

        overflow-hidden

        rounded-2xl

        border

        border-black/10

        bg-[#F7F4EE]

        px-5

        py-4

        text-black

        shadow-sm

        transition-all

        duration-200

        hover:-translate-y-0.5

        hover:border-black/20

        hover:shadow-md

        active:translate-y-0

      "

    >

      <span

        className="

          relative

          z-10

          flex

          items-center

          justify-center

          gap-3

        "

      >

        <span

          className="

            flex

            h-9

            w-9

            items-center

            justify-center

            rounded-full

            bg-[#FF6B35]

            text-white

            transition-transform

            duration-200

            group-hover:scale-105

          "

        >

          {

            copied

              ? (

                <Check

                  size={18}

                  strokeWidth={3}

                />

              )

              : (

                <Share2

                  size={18}

                  strokeWidth={2.5}

                />

              )

          }

        </span>


        <span

          className="

            flex

            flex-col

            items-start

            text-left

            leading-none

          "

        >

          <span

            className="

              text-[11px]

              font-black

              uppercase

              tracking-[0.18em]

              text-black/45

            "

          >

            {

              copied

                ? "READY TO SHARE"

                : "SHARE THIS RANKING"

            }

          </span>


          <span

            className="

              mt-1

              text-base

              font-black

              tracking-tight

            "

          >

            {

              copied

                ? "Link copied!"

                : "Share your RANKD →"

            }

          </span>

        </span>

      </span>


      <span

        className="

          absolute

          bottom-0

          left-0

          h-1

          w-0

          bg-[#FF6B35]

          transition-all

          duration-300

          group-hover:w-full

        "

      />

    </button>

  )

}