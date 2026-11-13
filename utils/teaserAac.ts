type TeaserAacSample = {
  data: Uint8Array
  timestamp: number
  duration: number
}

export type TeaserAacClip = {
  sampleRate: number
  numberOfChannels: number
  description: Uint8Array
  samples: TeaserAacSample[]
}


function boxType(
  view: DataView,
  offset: number
) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}


function walkBoxes(
  view: DataView,
  start: number,
  end: number,
  onBox: (
    type: string,
    offset: number,
    header: number,
    size: number
  ) => void
) {
  let offset = start

  while (offset + 8 <= end) {
    let size = view.getUint32(offset)
    const type = boxType(view, offset + 4)
    let header = 8

    if (size === 1) {
      if (offset + 16 > end) {
        break
      }

      size =
        view.getUint32(offset + 8) * 4294967296 +
        view.getUint32(offset + 12)
      header = 16
    } else if (size === 0) {
      size = end - offset
    }

    if (size < header || offset + size > end) {
      break
    }

    onBox(type, offset, header, size)
    offset += size
  }
}


function findBoxes(
  view: DataView,
  start: number,
  end: number,
  wanted: string
) {
  const matches: {
    offset: number
    header: number
    size: number
  }[] = []

  walkBoxes(
    view,
    start,
    end,
    (type, offset, header, size) => {
      if (type === wanted) {
        matches.push({
          offset,
          header,
          size
        })
      }

      if (
        type === "moov" ||
        type === "trak" ||
        type === "mdia" ||
        type === "minf" ||
        type === "stbl" ||
        type === "dinf"
      ) {
        matches.push(
          ...findBoxes(
            view,
            offset + header,
            offset + size,
            wanted
          )
        )
      } else if (type === "stsd") {
        matches.push(
          ...findBoxes(
            view,
            offset + header + 8,
            offset + size,
            wanted
          )
        )
      } else if (type === "mp4a") {
        matches.push(
          ...findBoxes(
            view,
            offset + header + 28,
            offset + size,
            wanted
          )
        )
      }
    }
  )

  return matches
}


function readDescriptor(
  bytes: Uint8Array,
  index: number
) {
  const tag = bytes[index]
  let cursor = index + 1
  let length = 0
  let next = 0

  do {
    next = bytes[cursor]
    cursor += 1
    length = (length << 7) | (next & 0x7f)
  } while (next & 0x80)

  return {
    tag,
    start: cursor,
    length,
    end: cursor + length
  }
}


function parseAudioSpecificConfig(
  bytes: Uint8Array
): Uint8Array | null {
  let cursor = 0

  while (cursor < bytes.length) {
    const desc = readDescriptor(bytes, cursor)

    if (desc.tag === 5) {
      return bytes.slice(desc.start, desc.end)
    }

    if (desc.tag === 3) {
      let nestedStart = desc.start + 3
      const flags = bytes[desc.start + 2]

      if (flags & 0x80) {
        nestedStart += 2
      }

      if (flags & 0x40) {
        nestedStart += 1 + bytes[nestedStart]
      }

      if (flags & 0x20) {
        nestedStart += 2
      }

      const nested = parseAudioSpecificConfig(
        bytes.subarray(nestedStart, desc.end)
      )

      if (nested) {
        return nested
      }
    }

    if (desc.tag === 4) {
      const nested = parseAudioSpecificConfig(
        bytes.subarray(desc.start + 13, desc.end)
      )

      if (nested) {
        return nested
      }
    }

    cursor = desc.end
  }

  return null
}


export function extractTeaserAac(
  buffer: ArrayBuffer,
  startSec: number,
  durationSec: number
): TeaserAacClip {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  const traks = findBoxes(view, 0, buffer.byteLength, "trak")

  for (const trak of traks) {
    const trakStart = trak.offset + trak.header
    const trakEnd = trak.offset + trak.size
    const mp4a = findBoxes(view, trakStart, trakEnd, "mp4a")[0]

    if (!mp4a) {
      continue
    }

    const channels = view.getUint16(mp4a.offset + mp4a.header + 16)
    const sampleRate = view.getUint32(mp4a.offset + mp4a.header + 24) >>> 16
    const esds = findBoxes(
      view,
      mp4a.offset + mp4a.header + 28,
      mp4a.offset + mp4a.size,
      "esds"
    )[0]
    const description = esds
      ? parseAudioSpecificConfig(
          bytes.subarray(
            esds.offset + esds.header + 4,
            esds.offset + esds.size
          )
        )
      : null
    const mdhd = findBoxes(view, trakStart, trakEnd, "mdhd")[0]
    const stts = findBoxes(view, trakStart, trakEnd, "stts")[0]
    const stsc = findBoxes(view, trakStart, trakEnd, "stsc")[0]
    const stsz = findBoxes(view, trakStart, trakEnd, "stsz")[0]
    const stco = findBoxes(view, trakStart, trakEnd, "stco")[0]
    const co64 = findBoxes(view, trakStart, trakEnd, "co64")[0]

    if (!mdhd || !stts || !stsc || !stsz || (!stco && !co64)) {
      continue
    }

    const mdhdVersion = view.getUint8(mdhd.offset + mdhd.header)
    const timescale = view.getUint32(
      mdhd.offset + mdhd.header + (mdhdVersion === 1 ? 20 : 12)
    )
    const sampleCount = view.getUint32(stsz.offset + stsz.header + 8)
    const defaultSize = view.getUint32(stsz.offset + stsz.header + 4)
    const sizes: number[] = []

    for (let i = 0; i < sampleCount; i += 1) {
      sizes.push(
        defaultSize ||
        view.getUint32(stsz.offset + stsz.header + 12 + i * 4)
      )
    }

    const chunkOffsets: number[] = []

    if (stco) {
      const count = view.getUint32(stco.offset + stco.header + 4)

      for (let i = 0; i < count; i += 1) {
        chunkOffsets.push(
          view.getUint32(stco.offset + stco.header + 8 + i * 4)
        )
      }
    } else if (co64) {
      const count = view.getUint32(co64.offset + co64.header + 4)

      for (let i = 0; i < count; i += 1) {
        chunkOffsets.push(
          view.getUint32(co64.offset + co64.header + 8 + i * 8) * 4294967296 +
          view.getUint32(co64.offset + co64.header + 12 + i * 8)
        )
      }
    }

    const stscCount = view.getUint32(stsc.offset + stsc.header + 4)
    const stscEntries: {
      first: number
      samplesPerChunk: number
    }[] = []

    for (let i = 0; i < stscCount; i += 1) {
      stscEntries.push({
        first: view.getUint32(stsc.offset + stsc.header + 8 + i * 12),
        samplesPerChunk: view.getUint32(
          stsc.offset + stsc.header + 12 + i * 12
        )
      })
    }

    const offsets: number[] = []
    let sampleIndex = 0

    for (let entry = 0; entry < stscEntries.length; entry += 1) {
      const nextFirst =
        entry + 1 < stscEntries.length
          ? stscEntries[entry + 1].first
          : chunkOffsets.length + 1

      for (
        let chunkNumber = stscEntries[entry].first;
        chunkNumber < nextFirst;
        chunkNumber += 1
      ) {
        let offset = chunkOffsets[chunkNumber - 1]

        for (
          let sample = 0;
          sample < stscEntries[entry].samplesPerChunk;
          sample += 1
        ) {
          offsets.push(offset)
          offset += sizes[sampleIndex]
          sampleIndex += 1
        }
      }
    }

    const sttsCount = view.getUint32(stts.offset + stts.header + 4)
    const durations: number[] = []

    for (let i = 0; i < sttsCount; i += 1) {
      const runCount = view.getUint32(stts.offset + stts.header + 8 + i * 8)
      const delta = view.getUint32(stts.offset + stts.header + 12 + i * 8)

      for (let run = 0; run < runCount; run += 1) {
        durations.push(delta)
      }
    }

    if (!description || !sampleRate || offsets.length !== sizes.length) {
      continue
    }

    const samples: TeaserAacSample[] = []
    let timeUnits = 0
    const startUnits = startSec * timescale
    const endUnits = (startSec + durationSec) * timescale

    for (let i = 0; i < sizes.length; i += 1) {
      const durationUnits = durations[i] || durations[durations.length - 1] || 1024
      const nextTime = timeUnits + durationUnits

      if (nextTime > startUnits && timeUnits < endUnits) {
        samples.push({
          data: bytes.subarray(offsets[i], offsets[i] + sizes[i]),
          timestamp: Math.round(
            ((timeUnits - startUnits) / timescale) * 1_000_000
          ),
          duration: Math.round((durationUnits / timescale) * 1_000_000)
        })
      }

      timeUnits = nextTime

      if (timeUnits >= endUnits && samples.length) {
        break
      }
    }

    if (samples.length < 20) {
      throw new Error("The RANKD teaser track is too short to start 12 seconds in.")
    }

    const origin = samples[0].timestamp

    return {
      sampleRate,
      numberOfChannels: Math.max(1, channels || 2),
      description,
      samples: samples.map(sample => ({
        ...sample,
        timestamp: sample.timestamp - origin
      }))
    }
  }

  throw new Error("The RANKD teaser track could not be read.")
}


export function addTeaserAacToMuxer(
  muxer: {
    addAudioChunkRaw: (
      data: Uint8Array,
      type: "key" | "delta",
      timestamp: number,
      duration: number,
      meta?: {
        decoderConfig: {
          codec: string
          description: Uint8Array
          numberOfChannels: number
          sampleRate: number
        }
      }
    ) => void
  },
  clip: TeaserAacClip
) {
  clip.samples.forEach((sample, index) => {
    muxer.addAudioChunkRaw(
      new Uint8Array(sample.data),
      "key",
      Math.max(0, sample.timestamp),
      sample.duration,
      index === 0
        ? {
            decoderConfig: {
              codec: "mp4a.40.2",
              description: clip.description,
              numberOfChannels: clip.numberOfChannels,
              sampleRate: clip.sampleRate
            }
          }
        : undefined
    )
  })
}
