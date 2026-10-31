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
}

export default function FitEmbed({
  children,
  width,
  height
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

      setScale(
        Math.min(1, available / width)
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
  }, [width])

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
          Math.ceil(height * scale)
      }}
    >
      <div
        className="
          absolute
          left-0
          top-0
        "
        style={{
          width,
          height,
          transform:
            `scale(${scale})`,
          transformOrigin:
            "top left"
        }}
      >
        {children}
      </div>
    </div>
  )
}
