
"use client"

import {
  useRef,
  useState
} from "react"

import {
  toPng
} from "html-to-image"

import {
  ArrayBufferTarget,
  Muxer
} from "mp4-muxer"

type AnimatedRankPreviewProps = {
  title: string
  items: {
    position: number
    name: string
  }[]
  href: string
  onClose: () => void
}

const EXPORT_WIDTH = 1080
const EXPORT_HEIGHT = 1920
const EXPORT_FPS = 30
const FRAME_DURATION = Math.round(1_000_000 / EXPORT_FPS)
const VIDEO_FILENAME = "rankd-preview.mp4"

type EncoderConfig = {
  codec: string
  width: number
  height: number
  bitrate: number
  framerate: number
  latencyMode?: string
}

type EncoderSupport = {
  supported: boolean
  config: EncoderConfig
}

type EncodedFrame = {
  close: () => void
}

type VideoEncoderInstance = {
  encodeQueueSize: number
  state: string
  configure: (config: EncoderConfig) => void
  encode: (
    frame: EncodedFrame,
    options?: { keyFrame?: boolean }
  ) => void
  flush: () => Promise<void>
  close: () => void
}

type VideoEncoderOptions = {
  output: (chunk: any, metadata?: any) => void
  error: (error: Error) => void
}

type WebCodecsAPI = {
  VideoEncoder?: {
    new (options: VideoEncoderOptions): VideoEncoderInstance
    isConfigSupported?: (
      config: EncoderConfig
    ) => Promise<EncoderSupport>
  }
  VideoFrame?: new (
    source: CanvasImageSource,
    options: {
      timestamp: number
      duration?: number
    }
  ) => EncodedFrame
}

export default function AnimatedRankPreview({
  title,
  items,
  href,
  onClose
}: AnimatedRankPreviewProps) {
  const [replayKey, setReplayKey] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const teaserItems = [...items]
    .filter(item => item.position >= 4 && item.position <= 7)
    .sort((a, b) => b.position - a.position)

  function downloadBlob(blob: Blob) {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = objectUrl
    link.download = VIDEO_FILENAME

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
    }, 60000)
  }

  async function createVideoBlob(): Promise<Blob> {
    const card = cardRef.current

    if (!card) {
      throw new Error("The video preview is unavailable.")
    }

    const webCodecs = window as unknown as WebCodecsAPI
    const Encoder = webCodecs.VideoEncoder
    const Frame = webCodecs.VideoFrame

    if (
      typeof Encoder !== "function" ||
      typeof Frame !== "function"
    ) {
      throw new Error(
        "MP4 export is not supported by this browser. Please try the latest desktop version of Google Chrome."
      )
    }

    // Keep a narrowed constructor reference for nested functions.
    const VideoFrameConstructor = Frame

    await document.fonts.ready

    const exportWidth = 360
    const exportHeight = 640
    const exportRoot = document.createElement("div")

    Object.assign(exportRoot.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: `${exportWidth}px`,
      height: `${exportHeight}px`,
      overflow: "hidden",
      background: "#F7F4EE",
      zIndex: "-1"
    })

    let encoder: VideoEncoderInstance | null = null
    let encoderError: Error | null = null
    let frameTimestamp = 0

    try {
      const exportCard = card.cloneNode(true) as HTMLDivElement

      Object.assign(exportCard.style, {
        position: "relative",
        width: `${exportWidth}px`,
        minWidth: `${exportWidth}px`,
        maxWidth: `${exportWidth}px`,
        height: `${exportHeight}px`,
        minHeight: `${exportHeight}px`,
        maxHeight: `${exportHeight}px`,
        aspectRatio: "auto",
        boxSizing: "border-box",
        overflow: "hidden",
        opacity: "1",
        transform: "none"
      })

      exportCard.querySelectorAll<HTMLElement>("*").forEach(element => {
        element.style.animation = "none"
        element.style.transition = "none"
        element.style.transform = "none"
        element.style.opacity = "1"
      })

      const rows = Array.from(
        exportCard.querySelectorAll<HTMLElement>(
          ".rankd-teaser-item"
        )
      )

      const intro = exportCard.querySelector<HTMLElement>(
        ".rankd-teaser-intro"
      )

      const heading = exportCard.querySelector<HTMLElement>(
        ".rankd-teaser-title"
      )

      const verdict = exportCard.querySelector<HTMLElement>(
        ".rankd-teaser-reveal"
      )

      const cta = exportCard.querySelector<HTMLElement>(
        ".rankd-teaser-cta"
      )

      if (intro) {
        intro.style.opacity = "1"
      }

      if (heading) {
        heading.style.opacity = "1"
      }

      rows.forEach(row => {
        row.style.opacity = "0"
      })

      if (verdict) {
        verdict.style.opacity = "0"
      }

      if (cta) {
        cta.style.opacity = "0"
      }

      exportRoot.appendChild(exportCard)
      document.body.appendChild(exportRoot)

      const canvas = document.createElement("canvas")

      canvas.width = EXPORT_WIDTH
      canvas.height = EXPORT_HEIGHT

      const canvasContext = canvas.getContext("2d", {
        alpha: false
      })

      if (!canvasContext) {
        throw new Error(
          "Could not create the video rendering canvas."
        )
      }

      const context: CanvasRenderingContext2D = canvasContext

      context.fillStyle = "#F7F4EE"
      context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

      const target = new ArrayBufferTarget()

      const muxer = new Muxer({
        target,
        video: {
          codec: "avc",
          width: EXPORT_WIDTH,
          height: EXPORT_HEIGHT
        },
        fastStart: "in-memory"
      })

      encoder = new Encoder({
        output: (chunk: any, metadata?: any) => {
          muxer.addVideoChunk(chunk, metadata)
        },
        error: (error: Error) => {
          encoderError = error
        }
      })

      const encoderConfig: EncoderConfig = {
        codec: "avc1.420028",
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        bitrate: 8_000_000,
        framerate: EXPORT_FPS,
        latencyMode: "quality"
      }

      if (typeof Encoder.isConfigSupported === "function") {
        const support = await Encoder.isConfigSupported(
          encoderConfig
        )

        if (!support.supported) {
          throw new Error(
            "This browser cannot encode the required H.264 MP4 video. Please try the latest desktop version of Google Chrome."
          )
        }

        encoder.configure(support.config)
      } else {
        encoder.configure(encoderConfig)
      }

      async function wait(milliseconds: number) {
        return new Promise<void>(resolve => {
          window.setTimeout(resolve, milliseconds)
        })
      }

      async function captureFrame(duration: number) {
        if (encoderError) {
          throw encoderError
        }

        const imageUrl = await toPng(exportCard, {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: "#F7F4EE",
          width: exportWidth,
          height: exportHeight,
          style: {
            width: `${exportWidth}px`,
            height: `${exportHeight}px`,
            transform: "none"
          }
        })

        const image = new Image()

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve()

          image.onerror = () => reject(
            new Error("Could not render a video frame.")
          )

          image.src = imageUrl
        })

        context.clearRect(
          0,
          0,
          EXPORT_WIDTH,
          EXPORT_HEIGHT
        )

        context.drawImage(
          image,
          0,
          0,
          EXPORT_WIDTH,
          EXPORT_HEIGHT
        )

        const frameCount = Math.max(
          1,
          Math.round(duration * EXPORT_FPS / 1000)
        )

        for (let index = 0; index < frameCount; index++) {
          if (encoderError) {
            throw encoderError
          }

          const frame = new VideoFrameConstructor(canvas, {
            timestamp: frameTimestamp,
            duration: FRAME_DURATION
          })

          try {
            encoder!.encode(frame, {
              keyFrame: frameTimestamp === 0
            })
          } finally {
            frame.close()
          }

          frameTimestamp += FRAME_DURATION

          if (encoder!.encodeQueueSize > 8) {
            await encoder!.flush()
          }
        }

        await wait(0)
      }

      // Opening frame: RANKD branding and title.
      await captureFrame(700)

      // Reveal entries from #7 upwards to #4.
      for (const row of rows) {
        row.style.opacity = "1"
        row.style.transform = "none"

        await captureFrame(650)
      }

      // Reveal the verdict.
      if (verdict) {
        verdict.style.opacity = "1"
      }

      await captureFrame(700)

      // Finish with the call to action visible.
      if (cta) {
        cta.style.opacity = "1"
      }

      await captureFrame(1800)

      await encoder.flush()

      if (encoderError) {
        throw encoderError
      }

      encoder.close()
      encoder = null

      muxer.finalize()

      const blob = new Blob(
        [target.buffer],
        {
          type: "video/mp4"
        }
      )

      if (blob.size === 0) {
        throw new Error("The exported MP4 video was empty.")
      }

      return blob
    } catch (error) {
      if (encoder) {
        try {
          encoder.close()
        } catch {
          // The encoder may already be closed.
        }
      }

      throw error
    } finally {
      exportRoot.remove()
    }
  }

  async function downloadVideo() {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      const blob = await createVideoBlob()

      downloadBlob(blob)
    } catch (error) {
      console.error("RANKD MP4 export failed:", error)

      window.alert(
        error instanceof Error
          ? error.message
          : "The MP4 video could not be exported. Please try again."
      )
    } finally {
      setIsProcessing(false)
    }
  }

  async function shareVideo() {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      const blob = await createVideoBlob()

      const file = new File(
        [blob],
        VIDEO_FILENAME,
        {
          type: "video/mp4"
        }
      )

      const shareData: ShareData = {
        files: [file],
        title,
        text: `Would you rank it differently? See the full RANKD: ${new URL(
          href,
          window.location.origin
        ).href}`
      }

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare(shareData)
      ) {
        try {
          await navigator.share(shareData)
          return
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return
          }

          console.error(
            "RANKD native video sharing failed:",
            error
          )
        }
      }

      downloadBlob(blob)

      window.alert(
        "Your MP4 video is ready. Upload rankd-preview.mp4 to your preferred social platform."
      )
    } catch (error) {
      console.error("RANKD video sharing failed:", error)

      window.alert(
        error instanceof Error
          ? error.message
          : "The video could not be prepared. Please try again."
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-y-auto
        bg-black/70 p-3
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-label="Animated RANKD preview"
      onClick={onClose}
    >
      <div
        className="
          relative flex w-full max-w-[390px]
          min-h-0 flex-col items-center
          gap-3 py-2
        "
        onClick={event => event.stopPropagation()}
      >
        <div className="flex w-full shrink-0 items-center justify-between text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            Animated preview
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close animated preview"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full border border-white/25
              text-2xl transition hover:bg-white/10
            "
          >
            ×
          </button>
        </div>

        <div
          key={replayKey}
          ref={cardRef}
          className="
            rankd-teaser relative flex min-h-0
            max-w-full flex-col overflow-hidden
            rounded-[24px] bg-[#F7F4EE]
            p-4 sm:p-5 text-black shadow-2xl
          "
          style={{
            width: "min(100%, calc(min(68dvh, 700px) * 9 / 16))",
            height: "min(68dvh, 700px)"
          }}
        >
          <div className="flex shrink-0 items-center justify-between">
            <img
              src="/rankd-logo.png"
              alt="RANKD"
              className="h-auto w-[76px] object-contain"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">
              TOP 7
            </span>
          </div>

          <div className="mt-2 shrink-0">
            <p className="rankd-teaser-intro text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B35]">
              THE RANKD EDIT
            </p>

            <h2
              title={title}
              className="
                rankd-teaser-title mt-2
                line-clamp-3 break-words
                text-[clamp(18px,4.3vw,27px)]
                font-black leading-[0.94]
                tracking-[-0.055em]
              "
            >
              {title}
            </h2>

            <div className="mt-2 h-1 w-10 bg-[#FF6B35]" />
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
            {teaserItems.map(item => (
              <div
                key={`${item.position}-${item.name}`}
                className="
                  rankd-teaser-item flex min-h-0 flex-1
                  items-start gap-2 overflow-hidden
                  border-b border-black/10 pb-1.5
                "
                style={{
                  animationDelay: `${1.2 + (7 - item.position) * 1.15}s`
                }}
              >
                <span className="shrink-0 text-[21px] font-black leading-none tracking-[-0.06em] text-[#FF6B35]">
                  {String(item.position).padStart(2, "0")}
                </span>

                <p
                  title={item.name}
                  className="
                    min-w-0 overflow-hidden break-words
                    text-[clamp(11px,3.1vw,14px)]
                    font-black leading-[1.08]
                    tracking-[-0.035em]
                    [display:-webkit-box]
                    [-webkit-box-orient:vertical]
                    [-webkit-line-clamp:3]
                  "
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          <div
            className="
              rankd-teaser-reveal mt-2 shrink-0
              border-t-2 border-black pt-2
            "
            style={{
              animationDelay: "6.05s"
            }}
          >
            <p className="text-[8px] font-black uppercase tracking-[0.17em] text-[#FF6B35]">
              THE VERDICT?
            </p>

            <p className="mt-1 text-[clamp(16px,4.5vw,22px)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
              These didn’t make the top 3.
            </p>
          </div>

          <a
            href={href}
            className="
              rankd-teaser-cta mt-2 flex shrink-0
              items-center justify-between gap-2
              rounded-full bg-[#FF6B35] px-4 py-2
              text-[11px] font-black text-black no-underline
            "
            style={{
              animationDelay: "7.15s"
            }}
          >
            <span>DISCOVER THE TOP 3</span>
            <span className="text-lg">→</span>
          </a>

          <div className="mt-2 flex shrink-0 items-center justify-between gap-2 text-[8px] font-black uppercase tracking-[0.12em] text-black/35">
            <span>RANKD.WORLD</span>
            <span className="text-right">
              WOULD YOU RANK IT DIFFERENTLY?
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-white/65">
            Preview only. The top three stay hidden.
          </p>

          <button
            type="button"
            onClick={() => setReplayKey(current => current + 1)}
            className="
              shrink-0 rounded-full border border-white/30
              px-4 py-2.5 text-xs font-black text-white
              transition hover:bg-white/10
            "
          >
            Replay ↻
          </button>
        </div>

        <button
          type="button"
          onClick={shareVideo}
          disabled={isProcessing}
          className="
            flex w-full shrink-0 items-center justify-center gap-2
            rounded-full bg-[#FF6B35]
            px-5 py-3 text-sm font-black text-black
            transition hover:bg-[#ff8256]
            disabled:cursor-wait disabled:opacity-60
          "
        >
          {isProcessing ? (
            <>
              <span className="animate-spin" aria-hidden="true">
                ↻
              </span>
              Preparing MP4…
            </>
          ) : (
            <>
              <span aria-hidden="true">↗</span>
              Share video
            </>
          )}
        </button>

        <button
          type="button"
          onClick={downloadVideo}
          disabled={isProcessing}
          className="
            flex w-full shrink-0 items-center justify-center gap-2
            rounded-full border border-white/30
            px-5 py-3 text-sm font-bold text-white
            transition hover:bg-white/10
            disabled:cursor-wait disabled:opacity-60
          "
        >
          <span aria-hidden="true">↓</span>
          Download MP4
        </button>

        <a
          href={href}
          className="
            flex w-full shrink-0 items-center justify-center
            rounded-full border border-white/30
            px-5 py-3 text-sm font-bold text-white
            transition hover:bg-white/10
          "
        >
          View full RANKD →
        </a>
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
