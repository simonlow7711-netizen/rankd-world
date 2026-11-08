"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react"

type FitEmbedProps = {
  children: ReactNode
  width: number
  height: number
  fill?: boolean
  allowUpscale?: boolean
}

export default function FitEmbed({
  children,
  width,
  height,
  fill = false,
  allowUpscale = false
}: FitEmbedProps) {

  const ref =
    useRef<HTMLDivElement | null>(null)

  const [
    scale,
    setScale
  ] = useState(1)

  useEffect(() => {
    const el = ref.current

    if (!el) {
      return
    }

    const update = () => {
      const available = el.clientWidth

      if (available <= 0) {
        return
      }

      const nextScale =
        available / width

      setScale(
        allowUpscale
          ? nextScale
          : Math.min(1, nextScale)
      )
    }

    update()

    const observer =
      new ResizeObserver(update)

    observer.observe(el)

    window.addEventListener(
      "resize",
      update
    )

    window.addEventListener(
      "orientationchange",
      update
    )

    return () => {
      observer.disconnect()
      window.removeEventListener(
        "resize",
        update
      )
      window.removeEventListener(
        "orientationchange",
        update
      )
    }
  }, [allowUpscale, width])

  const fills =
    fill &&
    scale === 1

  return (
    <div
      ref={ref}
      className="
        relative
        w-full
        min-w-0
        max-w-full
        overflow-hidden
      "
      style={{
        height:
          fills
            ? height
            : Math.ceil(height * scale)
      }}
    >
      <div
        className={
          fills
            ? "absolute inset-0"
            : "absolute left-0 top-0"
        }
        style={
          fills
            ? undefined
            : {
                width,
                height,
                transform:
                  `scale(${scale})`,
                transformOrigin:
                  "top left"
              }
        }
      >
        {children}
      </div>
    </div>
  )
}
