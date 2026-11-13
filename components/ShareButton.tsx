"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react"

import {
  Share2,
  X
} from "lucide-react"

import {
  SITE_URL
} from "@/utils/siteUrl"

import {
  encodeRankingTeaser
} from "@/components/AnimatedRankPreview"

import {
  publishRankingTeaser,
  teaserFileName
} from "@/utils/teaser"


type ShareButtonProps = {
  url?: string
  title: string
  text?: string
  eventName?: string
  eventProps?: Record<string, string>
  extra?: ReactNode
  onTeaser?: () => void
  teaserUrl?: string | null
  rankingId?: string
  category?: string
  paper?: string
  accent?: string
  items?: {
    position: number
    name: string
  }[]
  align?: "start" | "center"
  compact?: boolean
}


function shareDestination(
  url?: string
) {
  if (!url) {
    return SITE_URL
  }

  if (
    /^https?:\/\//i.test(
      url
    )
  ) {
    return url
  }

  return `${SITE_URL}${
    url.startsWith("/")
      ? url
      : `/${url}`
  }`
}


function channelButtonClass(
  kind: "video" | "link"
) {
  return `
    inline-flex
    min-w-[4.5rem]
    items-center
    justify-center
    rounded-full
    border
    border-black
    px-3
    py-1.5
    text-[11px]
    font-black
    tracking-tight
    text-black
    no-underline
    ${
      kind === "video"
        ? "bg-[#FF6B35]"
        : "bg-transparent"
    }
  `
}


export default function ShareButton({
  url,
  title,
  text,
  extra,
  onTeaser,
  teaserUrl,
  rankingId,
  category,
  paper,
  accent,
  items = [],
  align = "start",
  compact = false
}: ShareButtonProps) {

  const destination =
    shareDestination(
      url
    )

  const popoverId =
    `rankd-share-${
      (url || title)
        .replace(
          /[^a-zA-Z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        )
        .slice(
          0,
          48
        ) || "ranking"
    }`

  const canShareVideo = true

  const [
    view,
    setView
  ] =
    useState<
      "channels" | "video"
    >(
      "channels"
    )

  const [
    readyUrl,
    setReadyUrl
  ] =
    useState(
      teaserUrl ||
      ""
    )

  const [
    note,
    setNote
  ] =
    useState(
      teaserUrl
        ? "Share this MP4 to Instagram, TikTok, WhatsApp or Facebook."
        : "First share builds the 9:16 video. That can take about 20 seconds."
    )

  const [
    status,
    setStatus
  ] =
    useState(
      ""
    )

  const creatingRef =
    useRef(
      false
    )

  const optionsRef =
    useRef({
      title,
      category,
      items,
      paper,
      accent,
      rankingId,
      teaserUrl
    })

  optionsRef.current = {
    title,
    category,
    items,
    paper,
    accent,
    rankingId,
    teaserUrl
  }

  useEffect(
    () => {
      const root =
        document.getElementById(
          popoverId
        )

      if (
        root &&
        teaserUrl &&
        teaserUrl.indexOf("blob:") === 0 &&
        !root.getAttribute(
          "data-teaser-url"
        )
      ) {
        root.setAttribute(
          "data-teaser-url",
          teaserUrl
        )
      }
    },
    [
      popoverId,
      teaserUrl
    ]
  )

  useEffect(
    () => {
      async function ensureTeaser() {
        if (
          creatingRef.current
        ) {
          return
        }

        const root =
          document.getElementById(
            popoverId
          )

        if (!root) {
          return
        }

        const options =
          optionsRef.current

        const currentUrl =
          root.getAttribute(
            "data-teaser-url"
          ) || ""

        if (currentUrl.indexOf("blob:") === 0) {
          setReadyUrl(
            currentUrl
          )
          setNote(
            "Share this MP4 to Instagram, TikTok, WhatsApp or Facebook."
          )
          setStatus(
            ""
          )
          return
        }

        creatingRef.current =
          true
        setStatus(
          "Creating the 9:16 video…"
        )
        setNote(
          "Building the MP4. Keep this window open — about 20 seconds."
        )

        try {
          const blob =
            await encodeRankingTeaser({
              title:
                options.title,
              category:
                options.category,
              items:
                options.items,
              paper:
                options.paper,
              accent:
                options.accent
            })

          const file =
            new File(
              [
                blob
              ],
              teaserFileName(),
              {
                type:
                  "video/mp4"
              }
            )

          const objectUrl =
            URL.createObjectURL(
              file
            )

          root.setAttribute(
            "data-teaser-url",
            objectUrl
          )
          setReadyUrl(
            objectUrl
          )
          setNote(
            "Share this MP4 to Instagram, TikTok, WhatsApp or Facebook."
          )
          setStatus(
            "Video ready."
          )

          if (options.rankingId) {
            await publishRankingTeaser(
              options.rankingId,
              blob
            )
          }
        } catch (error) {
          console.error(
            error
          )
          setStatus(
            error instanceof Error
              ? error.message
              : "Could not create the video. Try Chrome on desktop."
          )
          setNote(
            "This browser could not build the MP4. Use Link, or try Video in Chrome."
          )
        } finally {
          creatingRef.current =
            false
        }
      }

      function onNeedTeaser() {
        const root =
          document.getElementById(
            popoverId
          ) as (HTMLElement & {
            showPopover?: () => void
          }) | null

        if (root) {
          root.setAttribute(
            "data-need-teaser",
            "0"
          )

          try {
            root.showPopover?.()
          } catch {
            // Already open.
          }
        }

        setView(
          "video"
        )
        void ensureTeaser()
      }

      ;(
        window as Window & {
          __rankdEnsureTeaser?: () => void
        }
      ).__rankdEnsureTeaser =
        onNeedTeaser

      window.addEventListener(
        "rankd:need-teaser",
        onNeedTeaser
      )

      const interval =
        window.setInterval(
          () => {
            const root =
              document.getElementById(
                popoverId
              )

            if (
              root?.getAttribute(
                "data-need-teaser"
              ) === "1"
            ) {
              onNeedTeaser()
            }
          },
          250
        )

      const root =
        document.getElementById(
          popoverId
        )

      function onRootClick(
        event: Event
      ) {
        const node =
          event.target as HTMLElement | null
        const action =
          node?.closest?.(
            "[data-share-action]"
          )

        if (
          action?.getAttribute(
            "data-share-action"
          ) === "video-back"
        ) {
          setView(
            "channels"
          )
        }
      }

      root?.addEventListener(
        "click",
        onRootClick
      )

      if (
        root?.getAttribute(
          "data-need-teaser"
        ) === "1"
      ) {
        onNeedTeaser()
      }

      return () => {
        window.clearInterval(
          interval
        )
        root?.removeEventListener(
          "click",
          onRootClick
        )
        window.removeEventListener(
          "rankd:need-teaser",
          onNeedTeaser
        )

        const current =
          window as Window & {
            __rankdEnsureTeaser?: () => void
          }

        if (
          current.__rankdEnsureTeaser ===
          onNeedTeaser
        ) {
          delete current.__rankdEnsureTeaser
        }
      }
    },
    [
      popoverId
    ]
  )

  const caption =
    [
      "Would you rank it differently?",
      "",
      `${title} | RANKD`
    ].join(
      "\n"
    )

  const encodedUrl =
    encodeURIComponent(
      destination
    )

  const encodedText =
    encodeURIComponent(
      text ?? `${title} — RANKD`
    )

  const encodedCaption =
    encodeURIComponent(
      caption
    )

  const channels: {
    id: string
    label: string
    video: boolean
    href?: string
  }[] = [
    {
      id: "facebook",
      label: "Facebook",
      video: canShareVideo,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      id: "x",
      label: "X",
      video: canShareVideo,
      href: `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}`
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      video: canShareVideo,
      href: `https://wa.me/?text=${encodedCaption}%20${encodedUrl}`
    },
    {
      id: "email",
      label: "Email",
      video: canShareVideo,
      href: `mailto:?subject=${encodeURIComponent(`${title} | RANKD`)}&body=${encodedCaption}%0A%0A${encodedUrl}`
    },
    {
      id: "instagram",
      label: "Instagram",
      video: canShareVideo
    },
    {
      id: "tiktok",
      label: "TikTok",
      video: canShareVideo
    }
  ]

  return (
    <div
      className={
        align === "center"
          ? "relative mx-auto"
          : "relative"
      }
    >
      <style>
        {`
          [data-rankd-share]::backdrop {
            background: rgb(0 0 0 / 0.4);
          }

          [data-rankd-share][data-view="video"] [data-share-channels] {
            display: none;
          }

          [data-rankd-share]:not([data-view="video"]) [data-share-video-panel] {
            display: none;
          }

          [data-rankd-share]:not([data-teaser-url]) [data-share-video-actions],
          [data-rankd-share][data-teaser-url=""] [data-share-video-actions],
          [data-rankd-share]:not([data-teaser-url]) [data-share-video],
          [data-rankd-share][data-teaser-url=""] [data-share-video] {
            display: none;
          }

          [data-rankd-share][data-teaser-url]:not([data-teaser-url=""]) [data-share-still] {
            display: none;
          }
        `}
      </style>

      <button
        type="button"
        popoverTarget={popoverId}
        popoverTargetAction="toggle"
        className={`
          group
          inline-flex
          items-center
          gap-2.5
          rounded-full
          border
          border-black
          bg-[#F7F4EE]
          text-black
          ${
            compact
              ? "px-3 py-2"
              : "px-4 py-2.5"
          }
        `}
        aria-haspopup="dialog"
      >
        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#FF6B35]
            text-white
          "
        >
          <Share2
            size={16}
            strokeWidth={2.4}
          />
        </span>

        {
          !compact && (
            <span
              className="
                pr-1
                text-sm
                font-black
                tracking-tight
              "
            >
              Share
            </span>
          )
        }
      </button>

      <div
        id={popoverId}
        popover="manual"
        data-rankd-share=""
        data-share-url={destination}
        data-share-title={title}
        data-share-caption={caption}
        data-ranking-id={rankingId || ""}
        data-share-paper={paper || "#F7F4EE"}
        data-share-accent={accent || "#FF6B35"}
        data-share-category={category || "Top 7"}
        data-share-items={JSON.stringify(items || [])}
        role="dialog"
        aria-label="Share"
        className="
          w-[calc(100vw-1.5rem)]
          max-w-md
          max-h-[min(92dvh,100%)]
          overflow-y-auto
          rounded-[28px]
          border
          border-black
          bg-[#F7F4EE]
          p-5
          text-left
          text-black
        "
      >
        <div
          className="
            mb-4
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              Share this RANKD
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                leading-tight
                tracking-[-0.03em]
              "
            >
              {title}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close share options"
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-black/[0.06]
            "
          >
            <X size={16} />
          </button>
        </div>

        <div
          data-share-channels=""
        >
        <p
          className="
            mb-3
            text-sm
            leading-snug
            text-black/55
          "
        >
          Video is the 9:16 RANKD. Link is the page. Instagram and TikTok take video only.
        </p>

        <div
          className="
            grid
            gap-2
          "
        >
          {
            channels.map(
              channel => (
                <div
                  key={channel.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-2xl
                    border
                    border-black
                    bg-transparent
                    px-3
                    py-2.5
                  "
                >
                  <span
                    className="
                      text-sm
                      font-black
                      tracking-tight
                    "
                  >
                    {channel.label}
                  </span>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                    "
                  >
                    {
                      channel.video && (
                        <button
                          type="button"
                          data-share-action="video"
                          data-channel={channel.id}
                          className={channelButtonClass("video")}
                        >
                          Video
                        </button>
                      )
                    }

                    {
                      channel.href && (
                        <a
                          href={channel.href}
                          target={
                            channel.id === "email"
                              ? undefined
                              : "_blank"
                          }
                          rel="noopener noreferrer"
                          className={channelButtonClass("link")}
                        >
                          Link
                        </a>
                      )
                    }
                  </div>
                </div>
              )
            )
          }
        </div>

        <button
          type="button"
          data-share-action="copy"
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            rounded-full
            border
            border-black
            bg-transparent
            px-4
            py-3
            text-sm
            font-black
          "
        >
          Copy link
        </button>

        <input
          readOnly
          value={destination}
          data-share-url-field=""
          aria-label="RANKD link"
          className="
            mt-2
            w-full
            rounded-full
            border
            border-black/15
            bg-transparent
            px-4
            py-2
            text-[11px]
            text-black/60
            outline-none
          "
        />

        <p
          data-share-status=""
          className="
            mt-3
            min-h-[1.25rem]
            text-xs
            font-bold
            leading-snug
            text-black/55
          "
        >
          {status}
        </p>

        {
          extra && (
            <div className="mt-3">
              {extra}
            </div>
          )
        }
        </div>

        <div
          data-share-video-panel=""
        >
          <button
            type="button"
            data-share-action="video-back"
            className="
              mb-4
              text-xs
              font-black
              uppercase
              tracking-[0.16em]
              text-black/45
            "
          >
            ← Destinations
          </button>

          <div
            className="
              mx-auto
              w-full
              max-w-[220px]
              overflow-hidden
              rounded-[22px]
              border
              border-black
              bg-[#F7F4EE]
            "
            style={{
              aspectRatio: "9 / 16"
            }}
          >
            <video
              data-share-video=""
              autoPlay
              muted
              loop
              playsInline
              className="
                h-full
                w-full
                object-cover
              "
            />
            <div
              data-share-still=""
              className="
                flex
                h-full
                flex-col
                justify-end
                gap-2
                p-4
              "
            >
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-black/35
                "
              >
                RANKD
              </p>
              <p
                className="
                  text-lg
                  font-black
                  leading-tight
                  tracking-[-0.04em]
                "
              >
                {title}
              </p>
              <div
                className="
                  mt-2
                  grid
                  gap-1.5
                "
              >
                {
                  items
                    .filter(
                      item =>
                        item.position >= 4 &&
                        item.position <= 7
                    )
                    .sort(
                      (a, b) =>
                        b.position -
                        a.position
                    )
                    .map(
                      item => (
                        <p
                          key={item.position}
                          className="
                            text-sm
                            font-black
                            tracking-tight
                          "
                        >
                          <span
                            className="
                              mr-2
                              text-black/35
                            "
                          >
                            {String(item.position).padStart(2, "0")}
                          </span>
                          {item.name}
                        </p>
                      )
                    )
                }
              </div>
            </div>
          </div>

          <p
            data-share-video-note=""
            className="
              mt-3
              text-sm
              leading-snug
              text-black/55
            "
          >
            {note}
          </p>

          <div
            data-share-video-actions=""
          >
            <button
              type="button"
              data-share-action="video-file"
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-black
                bg-[#FF6B35]
                px-4
                py-3
                text-sm
                font-black
              "
            >
              Open platform
            </button>
            <button
              type="button"
              data-share-action="video-download"
              className="
                mt-2
                flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-black
                bg-transparent
                px-4
                py-3
                text-sm
                font-black
              "
            >
              Download MP4
            </button>
          </div>
        </div>
      </div>
    </div>
  )

}
