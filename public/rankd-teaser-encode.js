import {
  ArrayBufferTarget,
  Muxer
} from "/mp4-muxer.mjs"
import {
  addTeaserAacToMuxer,
  extractTeaserAac
} from "/rankd-teaser-aac.js"

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

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3)
}

function appear(time, start, duration) {
  if (time <= start) {
    return 0
  }

  return easeOutCubic(
    Math.min(1, (time - start) / duration)
  )
}

function fadeInOut(time, inStart, inDur, outStart, outDur) {
  return appear(time, inStart, inDur) * (1 - appear(time, outStart, outDur))
}

function setType(context, weight, sizePx, trackingEm) {
  context.font = weight + " " + sizePx + "px " + FONT
  if ("letterSpacing" in context) {
    context.letterSpacing = sizePx * trackingEm + "px"
  }
}

function drawRankdLockup(context, cx, cy, sevenSize, accent, sevenAlpha, wordAlpha) {
  var wordSize = sevenSize * 0.26
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

function wrapText(context, text, maxWidth) {
  const words = String(text || "").trim().split(/\s+/)
  const lines = []
  let current = ""

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const next = current ? current + " " + word : word

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

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image()
    image.onload = function () {
      resolve(image)
    }
    image.onerror = function () {
      reject(new Error("logo"))
    }
    image.src = src
  })
}

async function loadTeaserAacClip() {
  var response = await fetch(TRACK_URL)

  if (!response.ok) {
    throw new Error("The RANKD teaser track could not be loaded.")
  }

  var data = await response.arrayBuffer()

  if (data.byteLength < 1024) {
    throw new Error("The RANKD teaser track is missing. Add rankd-track.m4a to public/.")
  }

  return extractTeaserAac(data, MUSIC_START_SEC, DURATION_SEC)
}

function drawTeaserFrame(context, width, height, time, assets) {
  var pad = width * 0.074
  var inner = width - pad * 2
  var paper = assets.paper || CREAM
  var accent = assets.accent || "#FF6B35"

  context.fillStyle = paper
  context.fillRect(0, 0, width, height)

  var ghostProgress = fadeInOut(time, 0.2, 0.7, 5.15, 0.9)
  var revealedCount = assets.items.reduce(function (count, item, index) {
    var start = 1.05 + index * 0.95
    return count + (time >= start ? 1 : 0)
  }, 0)
  var ghostItem = assets.items[
    Math.max(0, Math.min(assets.items.length, revealedCount) - 1)
  ]
  var ghostLabel = String(ghostItem && ghostItem.position ? ghostItem.position : 7).padStart(2, "0")

  context.save()
  context.globalAlpha = 0.05 * ghostProgress
  context.fillStyle = INK
  context.font = "900 " + width * 0.42 + "px " + FONT
  context.textAlign = "right"
  context.textBaseline = "alphabetic"
  context.fillText(ghostLabel, width - pad * 0.15, height * 0.93)
  context.restore()

  context.fillStyle = INK
  context.fillRect(0, 0, 4, height)
  context.fillStyle = accent
  context.fillRect(0, pad, 4, width * 0.18)

  var logoProgress = appear(time, 0, 0.45)
  var logoHeight = width * 0.072

  if (assets.logo && logoProgress > 0) {
    var ratio = assets.logo.naturalWidth / Math.max(1, assets.logo.naturalHeight)
    var logoWidth = logoHeight * ratio
    context.save()
    context.globalAlpha = logoProgress
    context.drawImage(assets.logo, pad, pad, logoWidth, logoHeight)
    context.restore()
  }

  context.save()
  context.globalAlpha = logoProgress
  context.fillStyle = accent
  setType(context, "900", width * 0.022, 0.16)
  context.textAlign = "right"
  context.textBaseline = "middle"
  context.fillText((assets.category || "TOP 7").toUpperCase(), width - pad, pad + logoHeight / 2)
  context.restore()

  var titleProgress = appear(time, 0.22, 0.55)
  var titleSize = width * 0.064

  context.save()
  context.globalAlpha = titleProgress
  context.translate(0, (1 - titleProgress) * 18)
  context.fillStyle = INK
  setType(context, "900", titleSize, -0.04)
  context.textAlign = "left"
  context.textBaseline = "top"
  var titleLines = wrapText(context, assets.title, inner).slice(0, 4)
  titleLines.forEach(function (line, index) {
    context.fillText(
      line,
      pad,
      pad + logoHeight + width * 0.046 + index * titleSize * 0.94
    )
  })
  context.restore()

  var titleBlock = titleLines.length * titleSize * 0.94
  var listTop = pad + logoHeight + width * 0.08 + titleBlock
  var rowHeight = width * 0.118

  assets.items.forEach(function (item, index) {
    var start = 1.05 + index * 0.95
    var progress = appear(time, start, 0.42)
    var y = listTop + index * rowHeight

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

    var rank = String(item.position).padStart(2, "0")
    var stamp = appear(time, start, 0.28)

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
    var nameLines = wrapText(context, item.name, inner - width * 0.15).slice(0, 2)
    nameLines.forEach(function (line, lineIndex) {
      context.fillText(line, pad + width * 0.14, y + 10 + lineIndex * width * 0.046)
    })
    context.restore()
  })

  var hookProgress = appear(time, 4.55, 0.55)
  var hookTop = listTop + assets.items.length * rowHeight + width * 0.085
  var brandSize = width * 0.084
  var brandLeading = brandSize * 1.08
  var footerY = height - pad
  var sevenSize = width * 0.44
  var lockupX = width - pad - sevenSize * 0.45
  var lockupY = footerY - sevenSize * 0.38
  var markProgress = appear(time, 5.2, 0.7)
  var wordProgress = appear(time, 5.55, 0.5)

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
  context.fillText("WOULD YOU RANK IT DIFFERENTLY?", pad, hookTop + width * 0.052)
  context.fillStyle = INK
  setType(context, "900", brandSize, -0.04)
  var brandLines = wrapText(
    context,
    "The world's Top 7 everything.",
    inner * 0.56
  ).slice(0, 4)
  brandLines.forEach(function (line, index) {
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

  var footerProgress = appear(time, 6.35, 0.4)

  context.save()
  context.globalAlpha = footerProgress
  context.fillStyle = "rgba(17,17,17,0.42)"
  setType(context, "900", width * 0.02, 0.04)
  context.textAlign = "center"
  context.textBaseline = "alphabetic"
  context.fillText(assets.hrefHost, width / 2, footerY)
  context.restore()
}

async function encodeRankingTeaser(options) {
  var Encoder = window.VideoEncoder
  var Frame = window.VideoFrame

  if (typeof Encoder !== "function" || typeof Frame !== "function") {
    throw new Error(
      "MP4 export is not supported by this browser. Please try the latest desktop version of Google Chrome."
    )
  }

  await Promise.race([
    document.fonts.ready,
    new Promise(function (resolve) {
      window.setTimeout(resolve, 800)
    })
  ])

  var logo = await loadImage("/rankd-logo.png").catch(function () {
    return null
  })
  var audioClip = await loadTeaserAacClip()
  var sampleRate = audioClip.sampleRate
  var numberOfChannels = audioClip.numberOfChannels

  var canvas = document.createElement("canvas")
  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT
  var canvasContext = canvas.getContext("2d", { alpha: false })

  if (!canvasContext) {
    throw new Error("Could not create the video rendering canvas.")
  }

  var teaserItems = (options.items || [])
    .filter(function (item) {
      return item.position >= 4 && item.position <= 7
    })
    .sort(function (a, b) {
      return b.position - a.position
    })

  var assets = {
    logo: logo,
    title: options.title || "RANKD",
    category: options.category || "Top 7",
    items: teaserItems,
    paper: options.paper || CREAM,
    accent: options.accent || "#FF6B35",
    hrefHost: "rankd.world"
  }

  var encoder = null
  var encoderError = null
  var frameTimestamp = 0
  var target = new ArrayBufferTarget()
  var muxer = new Muxer({
    target: target,
    video: {
      codec: "avc",
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      frameRate: EXPORT_FPS
    },
    audio: {
      codec: "aac",
      numberOfChannels: numberOfChannels,
      sampleRate: sampleRate
    },
    fastStart: "in-memory",
    firstTimestampBehavior: "offset"
  })

  try {
    encoder = new Encoder({
      output: function (chunk, metadata) {
        muxer.addVideoChunk(chunk, metadata)
      },
      error: function (error) {
        encoderError = error
      }
    })

    var encoderConfig = {
      codec: "avc1.420028",
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      bitrate: 8000000,
      framerate: EXPORT_FPS,
      latencyMode: "quality"
    }

    if (typeof Encoder.isConfigSupported === "function") {
      var support = await Encoder.isConfigSupported(encoderConfig)
      if (!support.supported) {
        throw new Error(
          "This browser cannot encode the required H.264 MP4 video. Please try the latest desktop version of Google Chrome."
        )
      }
      encoder.configure(support.config)
    } else {
      encoder.configure(encoderConfig)
    }

    addTeaserAacToMuxer(muxer, audioClip)

    var totalFrames = Math.round(DURATION_SEC * EXPORT_FPS)

    for (var index = 0; index < totalFrames; index++) {
      if (encoderError) {
        throw encoderError
      }

      drawTeaserFrame(
        canvasContext,
        EXPORT_WIDTH,
        EXPORT_HEIGHT,
        index / EXPORT_FPS,
        assets
      )

      var frame = new Frame(canvas, {
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

    var blob = new Blob([target.buffer], { type: "video/mp4" })

    if (!blob.size) {
      throw new Error("The exported MP4 video was empty.")
    }

    return blob
  } catch (error) {
    if (encoder) {
      try {
        encoder.close()
      } catch (closeError) {}
    }
    throw error
  }
}

window.__rankdEncode = encodeRankingTeaser
