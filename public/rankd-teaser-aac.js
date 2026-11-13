function boxType(view, offset) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}

function walkBoxes(view, start, end, onBox) {
  var offset = start

  while (offset + 8 <= end) {
    var size = view.getUint32(offset)
    var type = boxType(view, offset + 4)
    var header = 8

    if (size === 1) {
      if (offset + 16 > end) {
        break
      }
      size = view.getUint32(offset + 8) * 4294967296 + view.getUint32(offset + 12)
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

function findBoxes(view, start, end, wanted) {
  var matches = []

  walkBoxes(view, start, end, function (type, offset, header, size) {
    if (type === wanted) {
      matches.push({ offset: offset, header: header, size: size })
    }

    if (
      type === "moov" ||
      type === "trak" ||
      type === "mdia" ||
      type === "minf" ||
      type === "stbl" ||
      type === "dinf"
    ) {
      matches = matches.concat(findBoxes(view, offset + header, offset + size, wanted))
    } else if (type === "stsd") {
      matches = matches.concat(findBoxes(view, offset + header + 8, offset + size, wanted))
    } else if (type === "mp4a") {
      matches = matches.concat(findBoxes(view, offset + header + 28, offset + size, wanted))
    }
  })

  return matches
}

function readDescriptor(bytes, index) {
  var tag = bytes[index]
  var cursor = index + 1
  var length = 0
  var next = 0

  do {
    next = bytes[cursor]
    cursor += 1
    length = (length << 7) | (next & 0x7f)
  } while (next & 0x80)

  return {
    tag: tag,
    start: cursor,
    length: length,
    end: cursor + length
  }
}

function parseAudioSpecificConfig(bytes) {
  var cursor = 0

  while (cursor < bytes.length) {
    var desc = readDescriptor(bytes, cursor)

    if (desc.tag === 5) {
      return bytes.slice(desc.start, desc.end)
    }

    if (desc.tag === 3) {
      var nestedStart = desc.start + 3
      var flags = bytes[desc.start + 2]
      if (flags & 0x80) nestedStart += 2
      if (flags & 0x40) nestedStart += 1 + bytes[nestedStart]
      if (flags & 0x20) nestedStart += 2
      var nested3 = parseAudioSpecificConfig(bytes.subarray(nestedStart, desc.end))
      if (nested3) return nested3
    }

    if (desc.tag === 4) {
      var nested4 = parseAudioSpecificConfig(bytes.subarray(desc.start + 13, desc.end))
      if (nested4) return nested4
    }

    cursor = desc.end
  }

  return null
}

export function extractTeaserAac(buffer, startSec, durationSec) {
  var view = new DataView(buffer)
  var bytes = new Uint8Array(buffer)
  var traks = findBoxes(view, 0, buffer.byteLength, "trak")

  for (var t = 0; t < traks.length; t++) {
    var trak = traks[t]
    var trakStart = trak.offset + trak.header
    var trakEnd = trak.offset + trak.size
    var mp4a = findBoxes(view, trakStart, trakEnd, "mp4a")[0]
    if (!mp4a) continue

    var channels = view.getUint16(mp4a.offset + mp4a.header + 16)
    var sampleRate = view.getUint32(mp4a.offset + mp4a.header + 24) >>> 16
    var esds = findBoxes(view, mp4a.offset + mp4a.header + 28, mp4a.offset + mp4a.size, "esds")[0]
    var description = esds
      ? parseAudioSpecificConfig(
          bytes.subarray(esds.offset + esds.header + 4, esds.offset + esds.size)
        )
      : null
    var mdhd = findBoxes(view, trakStart, trakEnd, "mdhd")[0]
    var stts = findBoxes(view, trakStart, trakEnd, "stts")[0]
    var stsc = findBoxes(view, trakStart, trakEnd, "stsc")[0]
    var stsz = findBoxes(view, trakStart, trakEnd, "stsz")[0]
    var stco = findBoxes(view, trakStart, trakEnd, "stco")[0]
    var co64 = findBoxes(view, trakStart, trakEnd, "co64")[0]

    if (!mdhd || !stts || !stsc || !stsz || (!stco && !co64)) continue

    var mdhdVersion = view.getUint8(mdhd.offset + mdhd.header)
    var timescale = view.getUint32(
      mdhd.offset + mdhd.header + (mdhdVersion === 1 ? 20 : 12)
    )
    var sampleCount = view.getUint32(stsz.offset + stsz.header + 8)
    var defaultSize = view.getUint32(stsz.offset + stsz.header + 4)
    var sizes = []
    var i

    for (i = 0; i < sampleCount; i++) {
      sizes.push(defaultSize || view.getUint32(stsz.offset + stsz.header + 12 + i * 4))
    }

    var chunkOffsets = []
    if (stco) {
      var chunkCount = view.getUint32(stco.offset + stco.header + 4)
      for (i = 0; i < chunkCount; i++) {
        chunkOffsets.push(view.getUint32(stco.offset + stco.header + 8 + i * 4))
      }
    } else {
      var chunkCount64 = view.getUint32(co64.offset + co64.header + 4)
      for (i = 0; i < chunkCount64; i++) {
        chunkOffsets.push(
          view.getUint32(co64.offset + co64.header + 8 + i * 8) * 4294967296 +
            view.getUint32(co64.offset + co64.header + 12 + i * 8)
        )
      }
    }

    var stscCount = view.getUint32(stsc.offset + stsc.header + 4)
    var stscEntries = []
    for (i = 0; i < stscCount; i++) {
      stscEntries.push({
        first: view.getUint32(stsc.offset + stsc.header + 8 + i * 12),
        samplesPerChunk: view.getUint32(stsc.offset + stsc.header + 12 + i * 12)
      })
    }

    var offsets = []
    var sampleIndex = 0
    var entry
    for (entry = 0; entry < stscEntries.length; entry++) {
      var nextFirst =
        entry + 1 < stscEntries.length
          ? stscEntries[entry + 1].first
          : chunkOffsets.length + 1
      var chunkNumber
      for (chunkNumber = stscEntries[entry].first; chunkNumber < nextFirst; chunkNumber++) {
        var offset = chunkOffsets[chunkNumber - 1]
        var sample
        for (sample = 0; sample < stscEntries[entry].samplesPerChunk; sample++) {
          offsets.push(offset)
          offset += sizes[sampleIndex]
          sampleIndex += 1
        }
      }
    }

    var sttsCount = view.getUint32(stts.offset + stts.header + 4)
    var durations = []
    for (i = 0; i < sttsCount; i++) {
      var runCount = view.getUint32(stts.offset + stts.header + 8 + i * 8)
      var delta = view.getUint32(stts.offset + stts.header + 12 + i * 8)
      var run
      for (run = 0; run < runCount; run++) {
        durations.push(delta)
      }
    }

    if (!description || !sampleRate || offsets.length !== sizes.length) continue

    var samples = []
    var timeUnits = 0
    var startUnits = startSec * timescale
    var endUnits = (startSec + durationSec) * timescale

    for (i = 0; i < sizes.length; i++) {
      var durationUnits = durations[i] || durations[durations.length - 1] || 1024
      var nextTime = timeUnits + durationUnits
      if (nextTime > startUnits && timeUnits < endUnits) {
        samples.push({
          data: bytes.subarray(offsets[i], offsets[i] + sizes[i]),
          timestamp: Math.round(((timeUnits - startUnits) / timescale) * 1000000),
          duration: Math.round((durationUnits / timescale) * 1000000)
        })
      }
      timeUnits = nextTime
      if (timeUnits >= endUnits && samples.length) break
    }

    if (samples.length < 20) {
      throw new Error("The RANKD teaser track is too short to start 12 seconds in.")
    }

    var origin = samples[0].timestamp
    return {
      sampleRate: sampleRate,
      numberOfChannels: Math.max(1, channels || 2),
      description: description,
      samples: samples.map(function (sample) {
        return {
          data: sample.data,
          timestamp: sample.timestamp - origin,
          duration: sample.duration
        }
      })
    }
  }

  throw new Error("The RANKD teaser track could not be read.")
}

export function addTeaserAacToMuxer(muxer, clip) {
  clip.samples.forEach(function (sample, index) {
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
