"use client"

import {
  ReactNode,
  useState
} from "react"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type ProfileIdentityProps = {
  displayName: string
  username: string
  rankingCount: number
  kicker?: string
  tagline: string
  actions?: ReactNode
  shareable?: boolean
}


export default function ProfileIdentity({
  displayName,
  username,
  rankingCount,
  kicker = "RANKD / IDENTITY",
  tagline,
  actions,
  shareable = false
}: ProfileIdentityProps) {

  const theme =
    getCategoryTheme("General")

  const [
    copied,
    setCopied
  ] =
    useState(false)

  async function shareProfile() {

    const url =
      `${window.location.origin}/profile/${username}`

    const shareText =
      `Check out my RANKD — my Top 7 everything.`

    const isMobile =
      /Android|iPhone|iPad/i.test(
        navigator.userAgent
      )

    if (
      navigator.share &&
      isMobile
    ) {
      try {
        await navigator.share({
          title:
            `${username}'s RANKD`,
          text:
            shareText,
          url
        })
      } catch {
        return
      }

      return
    }

    await navigator.clipboard.writeText(
      `${shareText} ${url}`
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

  }

  return (
    <section
      className="
        rankd-edition
        relative
        overflow-hidden
        rounded-[28px]
        border
        px-6
        py-10
        text-center
        text-black
        md:px-12
        md:py-16
      "
      style={{
        backgroundColor:
          theme.paper,
        borderColor:
          "#111111"
      }}
    >

      <EditionChrome
        theme={theme}
      />

      <div
        className="
          relative
          z-10
        "
      >

        <EditionHeader
          theme={theme}
          category="General"
          bleed="page"
        >

          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.22em]
            "
            style={{
              color:
                theme.accent
            }}
          >
            <EditionMark
              theme={theme}
            >
              {kicker}
            </EditionMark>
          </p>

          <h1
            className={`
              mx-auto
              mt-5
              max-w-4xl
              text-4xl
              font-black
              text-balance
              hyphens-none
              md:text-6xl
              ${theme.titleClass}
            `}
          >
            <EditionTitle
              theme={theme}
            >
              {displayName}
            </EditionTitle>
          </h1>

          <p
            className="
              mt-4
              text-lg
              font-black
              tracking-[-0.02em]
              md:text-xl
            "
            style={{
              color:
                theme.accent
            }}
          >
            <EditionMark
              theme={theme}
            >
              @{username}
            </EditionMark>
          </p>

          <p
            className="
              mt-4
              text-[11px]
              font-black
              uppercase
              tracking-[0.18em]
            "
            style={{
              color:
                theme.accent
            }}
          >
            <EditionMark
              theme={theme}
            >
              {rankingCount}
              {" "}
              {rankingCount === 1 ? "RANKD" : "RANKDs"}
            </EditionMark>
          </p>

        </EditionHeader>

        <p
          className="
            relative
            z-10
            mx-auto
            mt-4
            max-w-md
            px-6
            pb-2
            text-center
            text-lg
            leading-relaxed
            text-black/50
            md:text-xl
          "
        >
          {tagline}
        </p>

        {
          (shareable || actions) && (
            <div
              className="
                relative
                z-10
                mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                border-t
                border-black
                pt-8
              "
            >

              {
                shareable && (
                  <button
                    type="button"
                    onClick={shareProfile}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      bg-black
                      px-7
                      py-3.5
                      text-sm
                      font-black
                      text-white
                    "
                  >
                    {
                      copied
                        ? "Copied ✓"
                        : "Share My RANKD →"
                    }
                  </button>
                )
              }

              {actions}

            </div>
          )
        }

      </div>

    </section>
  )

}
