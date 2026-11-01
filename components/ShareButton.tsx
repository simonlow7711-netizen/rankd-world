"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react"

import {
  createPortal
} from "react-dom"

import {
  Check,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  X
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
  onTeaser?: () => void
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

function isDesktopShare() {
  if (typeof window === "undefined") {
    return true
  }

  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

  const mobileAgent =
    /Android|iPhone|iPod/i.test(
      navigator.userAgent
    )

  return finePointer && !mobileAgent
}

function canUseNativeShare() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    !isDesktopShare()
  )
}

function canUseSmsShare() {
  return !isDesktopShare()
}

export default function ShareButton({
  url,
  title,
  text,
  eventName = "ranking_shared",
  eventProps,
  extra,
  onTeaser,
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
    mounted,
    setMounted
  ] = useState(false)

  const rootRef =
    useRef<HTMLDivElement | null>(null)

  const teaserLock =
    useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = "hidden"

    function onKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener(
      "keydown",
      onKeyDown
    )

    return () => {
      document.body.style.overflow =
        previousOverflow
      document.removeEventListener(
        "keydown",
        onKeyDown
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
    try {
      await navigator.share({
        title,
        text: shareText(),
        url: shareUrl()
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

      setOpen(true)
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

  function handleShareClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault()
    event.stopPropagation()
    setOpen(current => !current)
  }

  function launchTeaser(
    event: React.SyntheticEvent
  ) {
    event.preventDefault()
    event.stopPropagation()

    const now = Date.now()

    if (now - teaserLock.current < 400) {
      return
    }

    teaserLock.current = now
    onTeaser?.()
    setOpen(false)
  }

  const destination = shareUrl()
  const encodedUrl =
    encodeURIComponent(destination)
  const encodedText =
    encodeURIComponent(shareText())

  const sheet = open && mounted
    ? createPortal(
        <div
          className="
            fixed
            inset-0
            z-[80]
            flex
            items-end
            justify-center
            sm:items-center
          "
          onClick={() => {
            setOpen(false)
          }}
        >
          <div
            className="
              absolute
              inset-0
              bg-black/40
            "
          />

          <div
            className="
              relative
              z-10
              w-full
              max-w-md
              max-h-[min(92dvh,100%)]
              overflow-y-auto
              rounded-t-[28px]
              border
              border-black
              bg-[#F7F4EE]
              p-5
              pb-[max(1.25rem,env(safe-area-inset-bottom))]
              text-left
              text-black
              sm:mb-0
              sm:rounded-[28px]
            "
            role="dialog"
            aria-label="Share"
            onClick={event => {
              event.stopPropagation()
            }}
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
                onClick={() => {
                  setOpen(false)
                }}
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
              className="
                grid
                gap-2
              "
            >
              {
                onTeaser && (
                  <button
                    type="button"
                    onPointerUp={launchTeaser}
                    onClick={launchTeaser}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-full
                      border
                      border-black
                      bg-[#FF6B35]
                      px-4
                      py-3.5
                      text-left
                      text-sm
                      font-black
                      text-black
                    "
                  >
                    <span>Animated teaser</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                )
              }

              {
                canUseNativeShare() && (
                  <button
                    type="button"
                    onClick={shareNative}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-full
                      border
                      border-black
                      bg-transparent
                      px-4
                      py-3.5
                      text-left
                      text-sm
                      font-black
                      text-black
                    "
                  >
                    <span>Share to apps</span>
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
                  rounded-full
                  border
                  border-black
                  bg-transparent
                  px-4
                  py-3.5
                  text-left
                  text-sm
                  font-black
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

            {
              extra && (
                <div className="mt-3">
                  {extra}
                </div>
              )
            }

            <div
              className={`
                mt-3
                grid
                gap-2
                ${
                  canUseSmsShare()
                    ? "grid-cols-5"
                    : "grid-cols-4"
                }
              `}
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
                  h-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  px-2
                  text-xs
                  font-black
                "
              >
                WhatsApp
              </button>

              <button
                type="button"
                aria-label="Share on Facebook"
                onClick={() =>
                  openChannel(
                    "facebook",
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                  )
                }
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  px-2
                  text-xs
                  font-black
                "
              >
                Facebook
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
                  h-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                  text-sm
                  font-black
                "
              >
                𝕏
              </button>

              {
                canUseSmsShare() && (
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
                      h-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-black/10
                    "
                  >
                    <MessageCircle size={16} />
                  </button>
                )
              }

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
                  h-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-black/10
                "
              >
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div
      ref={rootRef}
      className={`
        relative
        ${align === "center" ? "mx-auto" : ""}
      `}
      onClick={event => {
        event.stopPropagation()
      }}
    >
      <button
        type="button"
        onClick={handleShareClick}
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
          transition
          hover:-translate-y-0.5
          hover:border-black
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

      {sheet}
    </div>
  )
}
