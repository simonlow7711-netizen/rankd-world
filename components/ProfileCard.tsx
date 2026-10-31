"use client"

import {
  useState
} from "react"

type Props = {
  username:string
  rankings:any[]
}

export default function ProfileCard({
  username,
  rankings
}:Props){

  const [copied,setCopied] =
    useState(false)

  async function shareProfile(){

    const url =
      `${window.location.origin}/profile/${username}`

    const shareText =
      `Check out my RANKD — my Top 7 everything.`

    const isMobile =
      /Android|iPhone|iPad/i.test(
        navigator.userAgent
      )

    if(
      navigator.share &&
      isMobile
    ){

      try{

        await navigator.share({
          title:
            `${username}'s RANKD`,
          text:
            shareText,
          url
        })

      }
      catch{
        return
      }

    }

    else{

      await navigator.clipboard.writeText(
        `${shareText} ${url}`
      )

      setCopied(true)

      setTimeout(()=>{
        setCopied(false)
      },2000)

    }
  }

  return (
    <div
      className="
        rankd-edition
        mb-12
        rounded-[28px]
        border
        border-black
        bg-[#F7F4EE]
        p-8
        text-center
        text-black
      "
    >
      <h2 className="
        text-4xl
        font-black
        tracking-[-0.04em]
      ">
        @{username}
      </h2>

      <p className="
        mt-3
        text-black/50
      ">
        My RANKD identity
      </p>

      <div className="
        mx-auto
        mt-8
        max-w-xs
        rounded-2xl
        border
        border-black
        bg-[#F7F4EE]
        p-5
      ">
        <p className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.18em]
          text-black/40
        ">
          RANKDs
        </p>

        <p className="
          mt-2
          text-3xl
          font-black
        ">
          {rankings.length}
        </p>
      </div>

      <button
        onClick={shareProfile}
        className="
          mt-8
          rounded-full
          border
          border-black
          bg-black
          px-8
          py-4
          font-black
          text-white
          transition
          hover:bg-[#FF6B35]
          hover:text-black
        "
      >
        {copied
          ? "Copied ✓"
          : "Share My RANKD →"
        }
      </button>
    </div>
  )
}
