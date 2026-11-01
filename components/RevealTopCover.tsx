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

  return (

    <div
      className="
        relative
        overflow-hidden
      "
      style={
        revealed
          ? undefined
          : {
              border:
                `2px solid ${accent}`,
              borderRadius:
                "20px"
            }
      }
    >

      <div
        className={
          revealed
            ? undefined
            : "invisible"
        }
      >
        {children}
      </div>


      {
        !revealed && (

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
              absolute
              inset-0
              z-10
              flex
              w-full
              items-center
              justify-center
              bg-transparent
              px-4
              py-3
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
                  md:text-2xl
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

        )
      }

    </div>

  )

}
