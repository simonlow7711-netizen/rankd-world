"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react"

import {
  Check,
  Link2,
  Mail,
  MessageCircle,
  Share2
} from "lucide-react"

import {
  trackEvent
} from "@/utils/analytics"

type ShareButtonProps = {
  url?: string
  title: string
  text?: string
  eventName?: string
  eventProps?: Record<string, string>
  extra?: ReactNode
  align?: "start" | "center"
  compact?: boolean
}

function copyText(
  value: string
): Promise<void> {

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    return navigator.clipboard.writeText(value)
  }

  return new Promise((resolve, reject) => {
    const textarea =
      document.createElement("textarea")

    textarea.value = value
    textarea.style.position = "fixed"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    const copied =
      document.execCommand("copy")

    document.body.removeChild(textarea)

    if (copied) {
      resolve()
    } else {
      reject(new Error("Unable to copy"))
    }
  })

}

export default function ShareButton({
  url,
  title,
  text,
  eventName = "ranking_shared",
  eventProps,
  extra,
  align = "start",
  compact = false
}: ShareButtonProps) {

  const [
    open,
    setOpen
  ] = useState(false)

  const [
    copied,
    setCopied
  ] = useState(false)

  const [
    canNativeShare,
    setCanNativeShare
  ] = useState(false)

  const rootRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    )
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(
      event: MouseEvent
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      onPointerDown
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        onPointerDown
      )
    }
  }, [open])

  function shareUrl() {
    if (typeof window === "undefined") {
      return url ?? ""
    }

    if (!url) {
      return window.location.href
    }

    try {
      return new URL(
        url,
        window.location.origin
      ).toString()
    } catch {
      return url
    }
  }

  function shareText() {
    return text ?? `${title} — RANKD`
  }

  function track(
    method: string
  ) {
    trackEvent(
      eventName,
      {
        method,
        ...eventProps
      }
    )
  }

  async function shareNative() {
    const destination = shareUrl()

    try {
      await navigator.share({
        title,
        text: shareText(),
        url: destination
      })

      track("native")
      setOpen(false)
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return
      }

      await copyLink()
    }
  }

  async function copyLink() {
    try {
      await copyText(shareUrl())
      setCopied(true)
      track("clipboard")

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }

  function openChannel(
    method: string,
    destination: string
  ) {
    track(method)
    window.open(
      destination,
      "_blank",
      "noopener,noreferrer"
    )
    setOpen(false)
  }

  const destination = shareUrl()
  const encodedUrl =
    encodeURIComponent(destination)
  const encodedText =
    encodeURIComponent(shareText())

  return (
    <div
      ref={rootRef}
      className={`
        relative
        ${align === "center" ? "mx-auto" : ""}
      `}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onMouseDown={event => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <button
        type="button"
        onClick={() => {
          setOpen(current => !current)
        }}
        className={`
          group
          inline-flex
          items-center
          gap-2.5
          rounded-full
          border
          border-black/10
          bg-white
          text-black
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:border-black/20
          hover:shadow-md
          ${
            compact
              ? "px-3 py-2"
              : "px-4 py-2.5"
          }
        `}
        aria-expanded={open}
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
          {
            copied ? (
              <Check
                size={16}
                strokeWidth={3}
              />
            ) : (
              <Share2
                size={16}
                strokeWidth={2.4}
              />
            )
          }
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
              {copied ? "Link copied" : "Share"}
            </span>
          )
        }
      </button>

      {
        open && (
          <div
            className={`
              absolute
              z-40
              top-full
              mt-3
              w-[min(calc(100vw-2.5rem),20rem)]
              rounded-[24px]
              border
              border-black/10
              bg-white
              p-4
              text-left
              text-black
              shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              ${
                align === "center"
                  ? "left-1/2 -translate-x-1/2"
                  : "left-0"
              }
            `}
            role="dialog"
            aria-label="Share"
          >
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
                text-base
                font-black
                leading-tight
                tracking-[-0.03em]
              "
            >
              {title}
            </p>

            <div
              className="
                mt-4
                grid
                gap-2
              "
            >
              {
                canNativeShare && (
                  <button
                    type="button"
                    onClick={shareNative}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      bg-black
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-black/85
                    "
                  >
                    <span>Share</span>
                    <Share2 size={16} />
                  </button>
                )
              }

              <button
                type="button"
                onClick={copyLink}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#F7F4EE]
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-black
                  transition
                  hover:bg-black/[0.04]
                "
              >
                <span>
                  {copied ? "Link copied" : "Copy link"}
                </span>
                {
                  copied ? (
                    <Check size={16} />
                  ) : (
                    <Link2 size={16} />
                  )
                }
              </button>
            </div>

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                gap-2
              "
            >
              <button
                type="button"
                aria-label="Share on WhatsApp"
                onClick={() =>
                  openChannel(
                    "whatsapp",
                    `https://wa.me/?text=${encodedText}%20${encodedUrl}`
                  )
                }
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  text-sm
                  font-black
                  transition
                  hover:bg-black/[0.04]
                "
              >
                Wa
              </button>

              <button
                type="button"
                aria-label="Share on X"
                onClick={() =>
                  openChannel(
                    "x",
                    `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
                  )
                }
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  text-sm
                  font-black
                  transition
                  hover:bg-black/[0.04]
                "
              >
                𝕏
              </button>

              <button
                type="button"
                aria-label="Share by message"
                onClick={() =>
                  openChannel(
                    "messages",
                    `sms:?&body=${encodedText}%20${encodedUrl}`
                  )
                }
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  transition
                  hover:bg-black/[0.04]
                "
              >
                <MessageCircle size={16} />
              </button>

              <button
                type="button"
                aria-label="Share by email"
                onClick={() =>
                  openChannel(
                    "email",
                    `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`
                  )
                }
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  transition
                  hover:bg-black/[0.04]
                "
              >
                <Mail size={16} />
              </button>
            </div>

            {
              extra && (
                <div
                  className="mt-3"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  {extra}
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}
