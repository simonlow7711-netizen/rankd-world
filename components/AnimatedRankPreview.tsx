"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"

import {
  createPortal
} from "react-dom"

import {
  downloadTeaserFile,
  fetchTeaserFile,
  publishRankingTeaser,
  rankingVideoCaption,
  shareRankingVideoFile,
  teaserFileName
} from "@/utils/teaser"

import {
  addTeaserAacToMuxer,
  extractTeaserAac
} from "@/utils/teaserAac"


type AnimatedRankPreviewProps = {
  title: string
  items: {
    position: number
    name: string
  }[]
  href: string
  rankingId?: string
  teaserUrl?: string | null
  category?: string
  paper?: string
  accent?: string
  onClose: () => void
}


const EXPORT_WIDTH = 1080
const EXPORT_HEIGHT = 1920
const EXPORT_FPS = 30
const FRAME_DURATION = Math.round(1_000_000 / EXPORT_FPS)
const TRACK_URL = "/rankd-track.m4a"
const MUSIC_START_SEC = 12
const DURATION_SEC = 8.4
const CREAM = "#F7F4EE"
const INK = "#111111"
const FONT = '"Geist Sans", Geist, ui-sans-serif, system-ui, sans-serif'


function rankingIdFromHref(
  href: string,
  rankingId?: string
) {
  if (rankingId) {
    return rankingId
  }

  try {
    const pathname =
      new URL(
        href,
        window.location.origin
      ).pathname

    const match =
      pathname.match(
        /\/rank\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
      )

    return match?.[1] ?? null
  } catch {
    return null
  }
}


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
  output: (chunk: unknown, metadata?: unknown) => void
  error: (error: Error) => void
}

type AudioEncoderConfig = {
  codec: string
  sampleRate: number
  numberOfChannels: number
  bitrate: number
}

type AudioEncoderInstance = {
  configure: (config: AudioEncoderConfig) => void
  encode: (data: AudioData) => void
  flush: () => Promise<void>
  close: () => void
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
  AudioEncoder?: {
    new (options: {
      output: (chunk: unknown, metadata?: unknown) => void
      error: (error: Error) => void
    }): AudioEncoderInstance
    isConfigSupported?: (
      config: AudioEncoderConfig
    ) => Promise<{ supported: boolean; config: AudioEncoderConfig }>
  }
}


type TeaserAssets = {
  logo: HTMLImageElement | null
  title: string
  category: string
  items: {
    position: number
    name: string
  }[]
  paper: string
  accent: string
  hrefHost: string
}


function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}


function appear(
  time: number,
  start: number,
  duration: number
) {
  if (time <= start) {
    return 0
  }

  if (time >= start + duration) {
    return 1
  }

  return easeOutCubic((time - start) / duration)
}


function fadeInOut(
  time: number,
  inStart: number,
  inDur: number,
  outStart: number,
  outDur: number
) {
  return appear(time, inStart, inDur) * (1 - appear(time, outStart, outDur))
}


function setType(
  context: CanvasRenderingContext2D,
  weight: string,
  sizePx: number,
  trackingEm: number
) {
  context.font = `${weight} ${sizePx}px ${FONT}`

  if ("letterSpacing" in context) {
    context.letterSpacing = `${sizePx * trackingEm}px`
  }
}


function drawRankdLockup(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sevenSize: number,
  accent: string,
  sevenAlpha: number,
  wordAlpha: number
) {
  const wordSize = sevenSize * 0.26

  context.save()
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.globalAlpha = sevenAlpha
  context.fillStyle = accent
  setType(context, "900", sevenSize, -0.16)
  context.fillText("7", cx, cy)
  context.globalAlpha = wordAlpha
  context.fillStyle = INK
  setType(context, "900", wordSize, -0.065)
  context.fillText("RANKD", cx, cy)
  context.restore()
}


function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word

    if (context.measureText(next).width <= maxWidth) {
      current = next
      continue
    }

    if (current) {
      lines.push(current)
    }

    current = word
  }

  if (current) {
    lines.push(current)
  }

  return lines
}


function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(
      new Error("Could not load RANKD branding for the teaser.")
    )
    image.src = src
  })
}


async function loadTeaserAacClip() {
  const response = await fetch(TRACK_URL)

  if (!response.ok) {
    throw new Error("The RANKD teaser track could not be loaded.")
  }

  const data = await response.arrayBuffer()

  if (data.byteLength < 1024) {
    throw new Error("The RANKD teaser track is missing. Add rankd-track.m4a to public/.")
  }

  return extractTeaserAac(
    data,
    MUSIC_START_SEC,
    DURATION_SEC
  )
}


function drawTeaserFrame(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  assets: TeaserAssets
) {
  const pad = width * 0.074
  const inner = width - pad * 2
  const paper = assets.paper || CREAM
  const accent = assets.accent || "#FF6B35"

  context.fillStyle = paper
  context.fillRect(0, 0, width, height)

  const ghostProgress = fadeInOut(time, 0.2, 0.7, 5.15, 0.9)
  const revealedCount = assets.items.reduce((count, item, index) => {
    const start = 1.05 + index * 0.95

    return count + (time >= start ? 1 : 0)
  }, 0)
  const ghostItem = assets.items[
    Math.max(0, Math.min(assets.items.length, revealedCount) - 1)
  ]
  const ghostLabel = String(
    ghostItem?.position ?? 7
  ).padStart(2, "0")

  context.save()
  context.globalAlpha = 0.05 * ghostProgress
  context.fillStyle = INK
  context.font = `900 ${width * 0.42}px ${FONT}`
  context.textAlign = "right"
  context.textBaseline = "alphabetic"
  context.fillText(
    ghostLabel,
    width - pad * 0.15,
    height * 0.93
  )
  context.restore()

  context.fillStyle = INK
  context.fillRect(0, 0, 4, height)

  context.fillStyle = accent
  context.fillRect(0, pad, 4, width * 0.18)

  const logoProgress = appear(time, 0, 0.45)
  const logoHeight = width * 0.072

  if (assets.logo && logoProgress > 0) {
    const ratio = assets.logo.naturalWidth / Math.max(
      1,
      assets.logo.naturalHeight
    )
    const logoWidth = logoHeight * ratio

    context.save()
    context.globalAlpha = logoProgress
    context.drawImage(
      assets.logo,
      pad,
      pad,
      logoWidth,
      logoHeight
    )
    context.restore()
  }

  context.save()
  context.globalAlpha = logoProgress
  context.fillStyle = accent
  setType(context, "900", width * 0.022, 0.16)
  context.textAlign = "right"
  context.textBaseline = "middle"
  context.fillText(
    (assets.category || "TOP 7").toUpperCase(),
    width - pad,
    pad + logoHeight / 2
  )
  context.restore()

  const titleProgress = appear(time, 0.22, 0.55)
  const titleSize = width * 0.064

  context.save()
  context.globalAlpha = titleProgress
  context.translate(0, (1 - titleProgress) * 18)
  context.fillStyle = INK
  setType(context, "900", titleSize, -0.04)
  context.textAlign = "left"
  context.textBaseline = "top"
  const titleLines = wrapText(
    context,
    assets.title,
    inner
  ).slice(0, 4)

  titleLines.forEach((line, index) => {
    context.fillText(
      line,
      pad,
      pad + logoHeight + width * 0.046 + index * titleSize * 0.94
    )
  })
  context.restore()

  const titleBlock = titleLines.length * titleSize * 0.94
  const listTop = pad + logoHeight + width * 0.08 + titleBlock
  const rowHeight = width * 0.118

  assets.items.forEach((item, index) => {
    const start = 1.05 + index * 0.95
    const progress = appear(time, start, 0.42)
    const y = listTop + index * rowHeight

    if (progress <= 0) {
      return
    }

    context.save()
    context.globalAlpha = progress
    context.translate(0, (1 - progress) * 28)

    context.strokeStyle = "rgba(17,17,17,0.18)"
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(pad, y + rowHeight - 10)
    context.lineTo(width - pad, y + rowHeight - 10)
    context.stroke()

    const rank = String(item.position).padStart(2, "0")
    const stamp = appear(time, start, 0.28)

    context.fillStyle = accent
    setType(context, "900", width * 0.07, -0.04)
    context.textAlign = "left"
    context.textBaseline = "top"
    context.save()
    context.translate(pad, y)
    context.scale(1 + (1 - stamp) * 0.18, 1 + (1 - stamp) * 0.18)
    context.fillText(rank, 0, 0)
    context.restore()

    context.fillStyle = INK
    setType(context, "900", width * 0.04, -0.03)
    const nameLines = wrapText(
      context,
      item.name,
      inner - width * 0.15
    ).slice(0, 2)

    nameLines.forEach((line, lineIndex) => {
      context.fillText(
        line,
        pad + width * 0.14,
        y + 10 + lineIndex * width * 0.046
      )
    })
    context.restore()
  })

  const hookProgress = appear(time, 4.55, 0.55)
  const hookTop = listTop + assets.items.length * rowHeight + width * 0.085
  const brandSize = width * 0.084
  const brandLeading = brandSize * 1.08
  const footerY = height - pad
  const sevenSize = width * 0.44
  const lockupX = width - pad - sevenSize * 0.45
  const lockupY = footerY - sevenSize * 0.38
  const markProgress = appear(time, 5.2, 0.7)
  const wordProgress = appear(time, 5.55, 0.5)

  if (markProgress > 0) {
    context.save()
    context.translate(0, (1 - markProgress) * 14)
    drawRankdLockup(
      context,
      lockupX,
      lockupY,
      sevenSize,
      accent,
      markProgress * 0.22,
      wordProgress
    )
    context.restore()
  }

  context.save()
  context.globalAlpha = hookProgress
  context.translate(0, (1 - hookProgress) * 22)

  context.fillStyle = INK
  context.fillRect(pad, hookTop, inner * 0.58, 1)

  context.fillStyle = accent
  setType(context, "900", width * 0.02, 0.16)
  context.textAlign = "left"
  context.textBaseline = "top"
  context.fillText(
    "WOULD YOU RANK IT DIFFERENTLY?",
    pad,
    hookTop + width * 0.052
  )

  context.fillStyle = INK
  setType(context, "900", brandSize, -0.04)
  const brandLines = wrapText(
    context,
    "The world's Top 7 everything.",
    inner * 0.56
  ).slice(0, 4)

  brandLines.forEach((line, index) => {
    context.fillText(
      line,
      pad,
      hookTop + width * 0.125 + index * brandLeading
    )
  })

  context.fillStyle = "rgba(17,17,17,0.55)"
  setType(context, "900", width * 0.032, -0.065)
  context.fillText(
    "Search RANKD.",
    pad,
    hookTop + width * 0.125 + brandLines.length * brandLeading + width * 0.055
  )
  context.restore()

  const footerProgress = appear(time, 6.35, 0.4)

  context.save()
  context.globalAlpha = footerProgress
  context.fillStyle = "rgba(17,17,17,0.42)"
  setType(context, "900", width * 0.02, 0.04)
  context.textAlign = "center"
  context.textBaseline = "alphabetic"
  context.fillText(
    assets.hrefHost,
    width / 2,
    footerY
  )
  context.restore()
}


export async function encodeRankingTeaser(
  options: {
    title: string
    category?: string
    items: {
      position: number
      name: string
    }[]
    paper?: string
    accent?: string
  }
): Promise<Blob> {
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

  const VideoFrameConstructor = Frame

  await Promise.race([
    document.fonts.ready,
    new Promise(
      resolve => {
        window.setTimeout(
          resolve,
          800
        )
      }
    )
  ])

  const logo = await loadImage("/rankd-logo.png").catch(() => null)
  const audioClip = await loadTeaserAacClip()
  const sampleRate = audioClip.sampleRate
  const numberOfChannels = audioClip.numberOfChannels

  const canvas = document.createElement("canvas")

  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT

  const canvasContext = canvas.getContext("2d", {
    alpha: false
  })

  if (!canvasContext) {
    throw new Error("Could not create the video rendering canvas.")
  }

  const teaserItems = options.items
    .filter(item => item.position >= 4 && item.position <= 7)
    .sort((a, b) => b.position - a.position)

  const assets: TeaserAssets = {
    logo,
    title: options.title,
    category: options.category || "Top 7",
    items: teaserItems,
    paper: options.paper || CREAM,
    accent: options.accent || "#FF6B35",
    hrefHost: "rankd.world"
  }

  let encoder: VideoEncoderInstance | null = null
  let encoderError: Error | null = null
  let frameTimestamp = 0

  const {
    ArrayBufferTarget,
    Muxer
  } = await import(
    "mp4-muxer"
  )

  const target = new ArrayBufferTarget()

  const muxer = new Muxer({
    target,
    video: {
      codec: "avc",
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      frameRate: EXPORT_FPS
    },
    audio: {
      codec: "aac",
      numberOfChannels,
      sampleRate
    },
    fastStart: "in-memory",
    firstTimestampBehavior: "offset"
  })

  try {
    encoder = new Encoder({
      output: (chunk, metadata) => {
        muxer.addVideoChunk(
          chunk as EncodedVideoChunk,
          metadata as EncodedVideoChunkMetadata
        )
      },
      error: error => {
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

    addTeaserAacToMuxer(
      muxer,
      audioClip
    )

    const totalFrames = Math.round(DURATION_SEC * EXPORT_FPS)

    for (let index = 0; index < totalFrames; index += 1) {
      if (encoderError) {
        throw encoderError
      }

      const time = index / EXPORT_FPS

      drawTeaserFrame(
        canvasContext,
        EXPORT_WIDTH,
        EXPORT_HEIGHT,
        time,
        assets
      )

      const frame = new VideoFrameConstructor(canvas, {
        timestamp: frameTimestamp,
        duration: FRAME_DURATION
      })

      try {
        encoder.encode(frame, {
          keyFrame: index % EXPORT_FPS === 0
        })
      } finally {
        frame.close()
      }

      frameTimestamp += FRAME_DURATION

      if (encoder.encodeQueueSize > 8) {
        await encoder.flush()
      }
    }

    await encoder.flush()

    if (encoderError) {
      throw encoderError
    }

    encoder.close()
    encoder = null

    muxer.finalize()

    const blob = new Blob(
      [
        target.buffer
      ],
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
  }
}


export default function AnimatedRankPreview({
  title,
  items,
  href,
  rankingId,
  teaserUrl,
  category = "Top 7",
  paper = CREAM,
  accent = "#FF6B35",
  onClose
}: AnimatedRankPreviewProps) {
  const [replayKey, setReplayKey] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPreparing, setIsPreparing] = useState(true)
  const [needsSoundTap, setNeedsSoundTap] = useState(false)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const onCloseRef = useRef(onClose)
  const videoPromiseRef = useRef<Promise<Blob> | null>(null)
  const publishPromiseRef = useRef<Promise<string | null> | null>(null)

  onCloseRef.current = onClose

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const teaserSignature = JSON.stringify(
    items.map(item => ({
      position: item.position,
      name: item.name
    }))
  )

  const teaserItems = useMemo(
    () => {
      const parsed = JSON.parse(teaserSignature) as {
        position: number
        name: string
      }[]

      return parsed
        .filter(item => item.position >= 4 && item.position <= 7)
        .sort((a, b) => b.position - a.position)
    },
    [teaserSignature]
  )

  const hrefHost = "rankd.world"

  useEffect(() => {
    let cancelled = false
    let animationFrame = 0
    const startedAt = performance.now()
    const canvas = previewRef.current

    if (!canvas) {
      return
    }

    const previewCanvas = canvas
    const previewWidth = previewCanvas.width
    const previewHeight = previewCanvas.height

    const context = previewCanvas.getContext("2d", {
      alpha: false
    })

    if (!context) {
      return
    }

    const audio = audioRef.current

    function startAudio() {
      if (!audio || cancelled) {
        return
      }

      function playFromCue() {
        if (!audio || cancelled) {
          return
        }

        audio.currentTime = MUSIC_START_SEC

        void audio.play().then(() => {
          if (!cancelled) {
            setNeedsSoundTap(false)
          }
        }).catch(() => {
          if (!cancelled) {
            setNeedsSoundTap(true)
          }
        })
      }

      if (audio.readyState >= 1) {
        playFromCue()
        return
      }

      audio.addEventListener("loadedmetadata", playFromCue, {
        once: true
      })
    }

    const stopAt = MUSIC_START_SEC + DURATION_SEC

    function onTimeUpdate() {
      if (audio && audio.currentTime >= stopAt) {
        audio.pause()
      }
    }

    if (audio) {
      audio.addEventListener("timeupdate", onTimeUpdate)
    }

    let logo: HTMLImageElement | null = null

    function tick(now: number) {
      if (cancelled || !context) {
        return
      }

      const time = Math.min(
        DURATION_SEC,
        (now - startedAt) / 1000
      )

      drawTeaserFrame(
        context,
        previewWidth,
        previewHeight,
        time,
        {
          logo,
          title,
          category,
          items: teaserItems,
          paper,
          accent,
          hrefHost
        }
      )

      if (time < DURATION_SEC) {
        animationFrame = window.requestAnimationFrame(tick)
      }
    }

    void Promise.all([
      document.fonts.ready,
      loadImage("/rankd-logo.png").catch(() => null)
    ]).then(([_, image]) => {
      if (cancelled) {
        return
      }

      logo = image
      startAudio()
      animationFrame = window.requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(animationFrame)

      if (audio) {
        audio.pause()
        audio.removeEventListener("timeupdate", onTimeUpdate)
        audio.removeEventListener("loadedmetadata", startAudio)
      }
    }
  }, [
    accent,
    category,
    paper,
    replayKey,
    teaserItems,
    title
  ])

  function playHeldAudio() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = MUSIC_START_SEC
    void audio.play().then(() => {
      setNeedsSoundTap(false)
    })
  }

  function fileFromBlob(
    blob: Blob
  ) {
    return blob instanceof File
      ? blob
      : new File(
          [
            blob
          ],
          teaserFileName(),
          {
            type: "video/mp4"
          }
        )
  }

  async function createVideoBlob(): Promise<Blob> {
    return encodeRankingTeaser({
      title,
      category,
      items: teaserItems,
      paper,
      accent
    })
  }

  function ensureVideoBlob() {
    if (!videoPromiseRef.current) {
      videoPromiseRef.current =
        (
          teaserUrl
            ? fetchTeaserFile(
                teaserUrl
              )
            : createVideoBlob()
        ).catch(error => {
          videoPromiseRef.current = null
          throw error
        })
    }

    return videoPromiseRef.current
  }

  function ensurePublishedTeaser(
    blob: Blob
  ) {
    const id =
      rankingIdFromHref(
        href,
        rankingId
      )

    if (!id) {
      return Promise.resolve(null)
    }

    if (!publishPromiseRef.current) {
      publishPromiseRef.current =
        publishRankingTeaser(
          id,
          blob
        ).catch(error => {
          publishPromiseRef.current = null
          console.error(
            "RANKD teaser publish failed:",
            error
          )
          return null
        })
    }

    return publishPromiseRef.current
  }

  useEffect(() => {
    videoPromiseRef.current = null
    publishPromiseRef.current = null

    if (teaserUrl) {
      setIsPreparing(false)
      videoPromiseRef.current =
        fetchTeaserFile(
          teaserUrl
        ).catch(error => {
          videoPromiseRef.current = null
          throw error
        })
      return
    }

    setIsPreparing(true)

    const prepare =
      createVideoBlob()

    videoPromiseRef.current =
      prepare.catch(error => {
        videoPromiseRef.current = null
        throw error
      })

    void prepare
      .then(blob => {
        setIsPreparing(false)
        void ensurePublishedTeaser(blob)
      })
      .catch(error => {
        console.error(
          "RANKD teaser prepare failed:",
          error
        )
        setIsPreparing(false)
      })
  }, [
    accent,
    category,
    href,
    hrefHost,
    paper,
    rankingId,
    teaserItems,
    teaserUrl,
    title
  ])

  async function downloadVideo() {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      const blob = await ensureVideoBlob()

      downloadTeaserFile(
        fileFromBlob(
          blob
        )
      )
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

  async function shareVideo(
    destination?: "facebook" | "whatsapp"
  ) {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      const blob = await ensureVideoBlob()
      const file =
        fileFromBlob(
          blob
        )

      if (!teaserUrl) {
        void ensurePublishedTeaser(
          blob
        )
      }

      const shared =
        await shareRankingVideoFile(
          file,
          title,
          href
        )

      if (shared) {
        return
      }

      if (destination === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            rankingVideoCaption(title, href)
          )}`,
          "_blank",
          "noopener,noreferrer"
        )
        return
      }

      downloadTeaserFile(
        file
      )

      window.alert(
        "Your MP4 is ready. Attach it to Instagram, Facebook or another app."
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

  if (typeof document === "undefined") {
    return null
  }

  return createPortal(
    <div
      className="
        fixed inset-0 z-[300]
        flex items-start justify-center
        overflow-y-auto
        bg-black/70 p-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
        sm:items-center
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
          gap-2.5 py-2
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
              rounded-full border border-white
              text-2xl transition hover:bg-white/10
            "
          >
            ×
          </button>
        </div>

        <div className="relative w-full" key={replayKey}>
          <audio
            ref={audioRef}
            src={TRACK_URL}
            preload="auto"
          />
          <canvas
            ref={previewRef}
            width={540}
            height={960}
            className="mx-auto block bg-[#F7F4EE]"
            style={{
              aspectRatio: "9 / 16",
              border: "1px solid #111",
              width: "min(100%, calc(52dvh * 9 / 16))",
              height: "auto"
            }}
          />

          {needsSoundTap && (
            <button
              type="button"
              onClick={playHeldAudio}
              className="
                absolute inset-0 flex items-center justify-center
                bg-[#111]/35 text-sm font-black uppercase tracking-[0.16em]
                text-white
              "
            >
              Tap for music
            </button>
          )}
        </div>

        <div className="flex w-full shrink-0 items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-white/65">
            Preview only. The top three stay hidden. Share the video, not a link.
          </p>

          <button
            type="button"
            onClick={() => setReplayKey(current => current + 1)}
            className="
              shrink-0 rounded-full border border-white
              px-4 py-2.5 text-xs font-black text-white
              transition hover:bg-white/10
            "
          >
            Replay ↻
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            void shareVideo()
          }}
          disabled={isProcessing}
          className="
            flex w-full shrink-0 items-center justify-center gap-2
            rounded-full bg-[#FF6B35]
            px-5 py-3 text-sm font-black text-black
            transition hover:bg-[#ff8256]
            disabled:cursor-wait disabled:opacity-60
          "
        >
          {isProcessing || isPreparing ? (
            <>
              <span className="animate-spin" aria-hidden="true">
                ↻
              </span>
              {isProcessing ? "Sharing video…" : "Preparing video…"}
            </>
          ) : (
            <>
              <span aria-hidden="true">↗</span>
              Share video
            </>
          )}
        </button>

        <div className="grid w-full shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              void shareVideo("facebook")
            }}
            disabled={isProcessing}
            className="
              rounded-full border border-white
              px-4 py-2.5 text-xs font-black text-white
              transition hover:bg-white/10
              disabled:cursor-wait disabled:opacity-60
            "
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={() => {
              void shareVideo("whatsapp")
            }}
            disabled={isProcessing}
            className="
              rounded-full border border-white
              px-4 py-2.5 text-xs font-black text-white
              transition hover:bg-white/10
              disabled:cursor-wait disabled:opacity-60
            "
          >
            WhatsApp
          </button>
        </div>

        <button
          type="button"
          onClick={downloadVideo}
          disabled={isProcessing}
          className="
            flex w-full shrink-0 items-center justify-center gap-2
            rounded-full border border-white
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
            rounded-full border border-white
            px-5 py-3 text-sm font-bold text-white
            transition hover:bg-white/10
          "
        >
          View full RANKD →
        </a>
      </div>
    </div>,
    document.body
  )
}
