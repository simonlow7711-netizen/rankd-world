"use client"

import { useState } from "react"

import { Share2 } from "lucide-react"

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

        w-full

        rounded-2xl

        border-2

        border-black

        bg-white

        px-5

        py-4

        flex

        items-center

        justify-center

        gap-3

        font-black

        hover:-translate-y-1

        transition

      "

    >

      <Share2

        size={20}

      />

      {

        copied

          ? "Link copied!"

          : "Share"

      }

    </button>

  )

}