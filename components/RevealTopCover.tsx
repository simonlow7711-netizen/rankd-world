"use client"

import {
  ReactNode
} from "react"


type RevealTopCoverProps = {
  revealed: boolean
  onReveal: () => void
  accent: string
  ink: string
  children: ReactNode
}


export default function RevealTopCover({
  revealed,
  onReveal,
  accent,
  ink,
  children
}: RevealTopCoverProps) {

  if (!revealed) {
    return (
      <div
        className="
          relative
          overflow-hidden
        "
        style={{
          border:
            `2px solid ${accent}`,
          borderRadius:
            "20px"
        }}
      >
        <button
          type="button"
          onClick={
            event => {
              event.preventDefault()
              event.stopPropagation()
              onReveal()
            }
          }
          className="
            flex
            min-h-[136px]
            w-full
            items-center
            justify-center
            bg-transparent
            px-4
            py-6
            text-center
          "
          aria-label="Reveal the number one ranked item"
        >
          <span
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <span
              className="
                text-base
                font-black
                leading-tight
                tracking-[-0.03em]
                md:text-xl
              "
              style={{
                color:
                  ink
              }}
            >
              Would you have RANKD this #1?
            </span>

            <span
              className="
                mt-3
                text-xs
                font-black
                uppercase
                tracking-[0.22em]
              "
              style={{
                color:
                  accent
              }}
            >
              Click to reveal →
            </span>
          </span>
        </button>
      </div>
    )
  }

  return <>{children}</>

}
