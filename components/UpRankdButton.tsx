"use client"

import {
  useState
} from "react"

import RankdMark from "@/components/RankdMark"

type UpRankdButtonProps = {
  count: number
  mine: boolean
  accent?: string
  ink?: string
  compact?: boolean
  onToggle: () => void
}

export default function UpRankdButton({
  count,
  mine,
  accent = "#FF6B35",
  ink = "#111111",
  compact = false,
  onToggle
}: UpRankdButtonProps) {

  const [
    playKey,
    setPlayKey
  ] = useState(
    0
  )

  return (
    <button
      type="button"
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()

        if (!mine) {
          setPlayKey(
            key => key + 1
          )
        }

        onToggle()
      }}
      aria-pressed={mine}
      aria-label={
        mine
          ? `Remove your upRANKD. ${count} so far.`
          : `upRANKD this entry. ${count} so far.`
      }
      title="upRANKD"
      className={`
        inline-flex
        items-center
        justify-center
        border-0
        bg-transparent
        p-0
        ${
          compact
            ? "mt-1 gap-1.5"
            : "mt-4 gap-2"
        }
      `}
    >
      <RankdMark
        variant="uprankd"
        size="sm"
        color={accent}
        playKey={playKey}
      />

      <span
        className={`
          font-black
          leading-none
          tracking-[-0.065em]
          ${compact ? "text-[11px]" : "text-[12px]"}
        `}
        style={{
          color: ink
        }}
      >
        {count}
      </span>
    </button>
  )
}
