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

import PlatformMark from "@/components/share/PlatformMark"

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
    items-center
    justify-center
    rounded-full
    border
    border-[#111]
    px-2.5
    py-1
    text-[10px]
    font-black
    tracking-tight
    text-[#111]
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
        ? "Video ready."
        : "Building the 9:16 video takes about 20 seconds."
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
            "Video ready."
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
          "Building the 9:16 video…"
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
            "Video ready."
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
            "Could not build the MP4. Use Link, or try Chrome."
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
      id: "instagram",
      label: "Instagram",
      video: canShareVideo
    },
    {
      id: "tiktok",
      label: "TikTok",
      video: canShareVideo
    },
    {
      id: "facebook",
      label: "Facebook",
      video: canShareVideo,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      video: canShareVideo,
      href: `https://wa.me/?text=${encodedCaption}%20${encodedUrl}`
    },
    {
      id: "x",
      label: "X",
      video: canShareVideo,
      href: `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}`
    },
    {
      id: "email",
      label: "Email",
      video: canShareVideo,
      href: `mailto:?subject=${encodeURIComponent(`${title} | RANKD`)}&body=${encodedCaption}%0A%0A${encodedUrl}`
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
          w-[min(calc(100vw-1.5rem),20.5rem)]
          max-h-[min(92dvh,100%)]
          overflow-y-auto
          rounded-[20px]
          border
          border-[#111]
          bg-[#F7F4EE]
          p-3.5
          text-left
          text-[#111]
        "
      >
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <p
            className="
              min-w-0
              truncate
              text-sm
              font-black
              tracking-[-0.04em]
            "
          >
            {title}
          </p>

          <button
            type="button"
            aria-label="Close share options"
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#111]
            "
          >
            <X size={14} />
          </button>
        </div>

        <div
          data-share-channels=""
        >
        <div
          className="
            grid
            gap-1.5
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
                    gap-2.5
                    rounded-full
                    border
                    border-[#111]
                    px-2
                    py-1.5
                  "
                >
                  <PlatformMark id={channel.id} />

                  <span
                    className="
                      min-w-0
                      flex-1
                      truncate
                      text-[13px]
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
                      gap-1
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
            mt-2
            flex
            w-full
            items-center
            justify-center
            rounded-full
            border
            border-[#111]
            bg-transparent
            px-3
            py-2
            text-[12px]
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
          className="sr-only"
        />

        <p
          data-share-status=""
          className="
            mt-2
            min-h-[1rem]
            text-[11px]
            font-bold
            leading-snug
            text-[#111]/55
          "
        >
          {status}
        </p>

        {
          extra && (
            <div className="mt-2">
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
              mb-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]
              text-[#111]/45
            "
          >
            ← Back
          </button>

          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                w-[108px]
                shrink-0
                overflow-hidden
                rounded-[14px]
                border
                border-[#111]
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
                  p-2.5
                "
              >
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-[#111]/35
                  "
                >
                  RANKD
                </p>
                <p
                  className="
                    mt-1
                    line-clamp-4
                    text-[11px]
                    font-black
                    leading-tight
                    tracking-[-0.04em]
                  "
                >
                  {title}
                </p>
              </div>
            </div>

            <div
              className="
                min-w-0
                flex-1
                pt-0.5
              "
            >
              <p
                data-share-video-note=""
                className="
                  text-[12px]
                  leading-snug
                  text-[#111]/55
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
                    border-[#111]
                    bg-[#FF6B35]
                    px-3
                    py-2
                    text-[12px]
                    font-black
                  "
                >
                  Open platform
                </button>
                <button
                  type="button"
                  data-share-action="video-download"
                  className="
                    mt-1.5
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#111]
                    bg-transparent
                    px-3
                    py-2
                    text-[12px]
                    font-black
                  "
                >
                  Download MP4
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}
