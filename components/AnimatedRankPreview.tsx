
"use client"

import {
  useState
} from "react"

type AnimatedRankPreviewProps = {
  title: string
  items: {
    position: number
    name: string
  }[]
  href: string
  onClose: () => void
}

export default function AnimatedRankPreview({
  title,
  items,
  href,
  onClose
}: AnimatedRankPreviewProps) {

  const [replayKey, setReplayKey] = useState(0)

  const teaserItems = [...items]
    .filter(item => item.position >= 4 && item.position <= 7)
    .sort((a, b) => b.position - a.position)

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-label="Animated RANKD preview"
      onClick={onClose}
    >
      <div
        className="
          relative
          flex
          w-full
          max-w-[390px]
          flex-col
          items-center
          py-5
        "
        onClick={event => event.stopPropagation()}
      >
        <div
          className="
            mb-4
            flex
            w-full
            items-center
            justify-between
            text-white
          "
        >
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            Animated preview
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close animated preview"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/25
              text-2xl
              transition
              hover:bg-white/10
            "
          >
            ×
          </button>
        </div>

        <div
          key={replayKey}
          className="
            rankd-teaser
            relative
            flex
            w-full
            flex-col
            overflow-hidden
            rounded-[28px]
            bg-[#F7F4EE]
            p-7
            text-black
            shadow-2xl
          "
          style={{
            aspectRatio: "9 / 16"
          }}
        >
          <div className="flex items-center justify-between">
            <img
              src="/rankd-logo.png"
              alt="RANKD"
              className="h-auto w-[76px] object-contain"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">
              TOP 7
            </span>
          </div>

          <div className="mt-10">
            <p className="rankd-teaser-intro text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6B35]">
              THE RANKD EDIT
            </p>

            <h2 className="rankd-teaser-title mt-4 break-words text-[clamp(30px,8vw,42px)] font-black leading-[0.91] tracking-[-0.055em]">
              {title}
            </h2>

            <div className="mt-5 h-1 w-12 bg-[#FF6B35]" />
          </div>

          <div className="mt-8 flex flex-1 flex-col gap-4">
            {teaserItems.map((item, index) => (
              <div
                key={`${item.position}-${item.name}`}
                className="rankd-teaser-item flex items-start gap-4 border-b border-black/10 pb-4"
                style={{
                  animationDelay: `${1.2 + index * 1.15}s`
                }}
              >
                <span className="shrink-0 text-[30px] font-black leading-none tracking-[-0.06em] text-[#FF6B35]">
                  {String(item.position).padStart(2, "0")}
                </span>

                <p className="min-w-0 break-words pt-0.5 text-[19px] font-black leading-[1.05] tracking-[-0.035em]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          <div
            className="
              rankd-teaser-reveal
              mt-7
              border-t-2
              border-black
              pt-5
            "
            style={{
              animationDelay: "6.05s"
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#FF6B35]">
              THE VERDICT?
            </p>

            <p className="mt-3 text-[clamp(23px,6vw,30px)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
              These didn’t make the top 3.
            </p>
          </div>

          <a
            href={href}
            className="
              rankd-teaser-cta
              mt-5
              flex
              items-center
              justify-between
              gap-3
              rounded-full
              bg-[#FF6B35]
              px-5
              py-4
              text-sm
              font-black
              text-black
              no-underline
            "
            style={{
              animationDelay: "7.15s"
            }}
          >
            <span>DISCOVER THE TOP 3</span>
            <span className="text-xl">→</span>
          </a>

          <div className="mt-5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.18em] text-black/35">
            <span>RANKD.WORLD</span>
            <span>WOULD YOU RANK IT DIFFERENTLY?</span>
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-white/65">
            Preview only. The top three stay hidden.
          </p>

          <button
            type="button"
            onClick={() => setReplayKey(current => current + 1)}
            className="
              shrink-0
              rounded-full
              border
              border-white/30
              px-4
              py-2.5
              text-xs
              font-black
              text-white
              transition
              hover:bg-white/10
            "
          >
            Replay ↻
          </button>
        </div>
      </div>

      <style>{`
        .rankd-teaser-intro {
          opacity: 0;
          animation: rankdTeaserIn 650ms ease-out 250ms forwards;
        }

        .rankd-teaser-title {
          opacity: 0;
          animation: rankdTeaserIn 750ms ease-out 500ms forwards;
        }

        .rankd-teaser-item {
          opacity: 0;
          transform: translateY(12px);
          animation: rankdTeaserIn 650ms ease-out forwards;
        }

        .rankd-teaser-reveal,
        .rankd-teaser-cta {
          opacity: 0;
          transform: translateY(10px);
          animation: rankdTeaserIn 650ms ease-out forwards;
        }

        @keyframes rankdTeaserIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rankd-teaser-intro,
          .rankd-teaser-title,
          .rankd-teaser-item,
          .rankd-teaser-reveal,
          .rankd-teaser-cta {
            animation-duration: 1ms;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </div>
  )
}
