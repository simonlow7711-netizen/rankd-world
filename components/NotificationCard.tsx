import Link from "next/link"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"


export type NotificationCardData = {
  id: string
  type: string
  read: boolean
  createdAt: string
  actorName: string
  originalRankingId: string | null
  originalRankingTitle: string | null
  originalRankingCategory: string | null
  remixRankingId: string | null
  remixRankingTitle: string | null
  remixRankingCategory: string | null
}


function formatNotificationDate(
  value: string
) {

  const date =
    new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  )

}


function pillClass(
  filled = false
) {

  return filled
    ? `
        inline-flex
        items-center
        justify-center
        rounded-full
        bg-black
        px-5
        py-3
        text-sm
        font-black
        text-white
      `
    : `
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        border-black
        px-5
        py-3
        text-sm
        font-black
      `

}


export default function NotificationCard({
  notification,
  markReadAction
}: {
  notification: NotificationCardData
  markReadAction?: () => Promise<void>
}) {

  const isRemix =
    notification.type ===
    "remix"

  const isRank =
    notification.type ===
    "rank"

  const theme =
    getCategoryTheme(
      notification.originalRankingCategory ||
      notification.remixRankingCategory
    )

  const kicker =
    isRemix
      ? "RANKD / REMIX"
      : isRank
        ? "RANKD / RANKD"
        : "RANKD / ACTIVITY"

  const headline =
    isRemix
      ? `${notification.actorName} remixed your RANKD.`
      : isRank
        ? `${notification.actorName} ranked your RANKD.`
        : "You have a new notification."

  return (
    <article
      className="
        rankd-edition
        relative
        overflow-hidden
        rounded-[28px]
        border
        p-6
        text-center
        text-black
        md:p-8
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
          category={
            notification.originalRankingCategory ||
            notification.remixRankingCategory ||
            theme.name
          }
          bleed="tile"
        >

          <p
            className="
              text-[10px]
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

          {
            !notification.read && (
              <p
                className="
                  mt-3
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color:
                    theme.accent
                }}
              >
                <EditionMark
                  theme={theme}
                >
                  New
                </EditionMark>
              </p>
            )
          }

          <h2
            className={`
              mx-auto
              mt-4
              max-w-2xl
              text-2xl
              font-black
              text-balance
              hyphens-none
              md:text-3xl
              ${theme.titleClass}
            `}
          >
            <EditionTitle
              theme={theme}
            >
              {headline}
            </EditionTitle>
          </h2>

        </EditionHeader>

        <div
          className="
            relative
            z-10
            -mt-8
            space-y-4
            px-1
            pb-1
            md:-mt-10
          "
        >

          {
            notification.originalRankingTitle && (
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-black/40
                  "
                >
                  {
                    isRemix
                      ? "Your original RANKD"
                      : "Your RANKD"
                  }
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-xl
                    text-lg
                    font-black
                    leading-tight
                    tracking-[-0.03em]
                    text-balance
                  "
                >
                  {
                    formatRankingTitle(
                      notification.originalRankingTitle
                    )
                  }
                </p>

                {
                  notification.originalRankingId && (
                    <Link
                      href={
                        `/rank/${notification.originalRankingId}`
                      }
                      className={`
                        mt-4
                        ${pillClass(!isRemix)}
                      `}
                    >
                      {
                        isRemix
                          ? "View original →"
                          : "View RANKD →"
                      }
                    </Link>
                  )
                }
              </div>
            )
          }

          {
            isRemix &&
            notification.remixRankingTitle && (
              <div
                className="
                  border-t
                  border-black
                  pt-5
                "
              >
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >
                  Their remix
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-xl
                    text-lg
                    font-black
                    leading-tight
                    tracking-[-0.03em]
                    text-balance
                  "
                >
                  {
                    formatRankingTitle(
                      notification.remixRankingTitle
                    )
                  }
                </p>
              </div>
            )
          }

          {
            isRemix &&
            notification.remixRankingId && (
              <Link
                href={
                  `/rank/${notification.remixRankingId}`
                }
                className={pillClass(true)}
              >
                View Remix →
              </Link>
            )
          }

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-3
              border-t
              border-black
              pt-5
              text-xs
              text-black/45
              sm:flex-row
              sm:justify-between
            "
          >

            <span
              className="
                font-bold
              "
            >
              {
                formatNotificationDate(
                  notification.createdAt
                )
              }
            </span>

            {
              !notification.read &&
              markReadAction && (
                <form action={markReadAction}>
                  <button
                    type="submit"
                    className="
                      font-black
                      text-black
                    "
                  >
                    Mark as read
                  </button>
                </form>
              )
            }

          </div>

        </div>

      </div>

    </article>
  )

}
