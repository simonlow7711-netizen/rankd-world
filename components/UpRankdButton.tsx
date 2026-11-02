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

  const color =
    mine ? accent : ink

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
        border
        border-black
        bg-transparent
        transition
        hover:border-[color:var(--uprankd-accent,#FF6B35)]
        ${
          compact
            ? "mt-1 gap-1 rounded-full px-2 py-1"
            : "mt-4 gap-1.5 rounded-full px-3 py-1.5"
        }
      `}
      style={{
        ["--uprankd-accent" as string]: accent,
        color
      }}
    >
      <RankdMark
        variant="uprankd"
        size="sm"
        color={color}
        playKey={playKey}
      />

      <span
        className={`
          font-black
          leading-none
          tracking-[-0.04em]
          ${compact ? "text-[11px]" : "text-sm"}
        `}
      >
        {count}
      </span>
    </button>
  )
}
