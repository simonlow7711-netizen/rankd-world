(function () {
  if (window.__rankdShareBound) {
    return
  }

  window.__rankdShareBound = true

  function elementFromEvent(event) {
    var node = event.target
    if (node && node.nodeType !== 1) {
      node = node.parentElement
    }
    return node
  }

  function copyFallback(value) {
    var textarea = document.createElement("textarea")
    textarea.value = value
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()
    var ok = false
    try {
      ok = document.execCommand("copy")
    } catch (error) {}
    textarea.remove()
    return ok
  }

  async function copyLink(root, destination) {
    var status = root.querySelector("[data-share-status]")
    var field = root.querySelector("[data-share-url-field]")
    if (field) {
      field.focus()
      field.select()
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(destination)
      } else if (!copyFallback(destination)) {
        throw new Error("copy failed")
      }
      if (status) {
        status.textContent = "Link copied."
      }
    } catch (error) {
      if (status) {
        status.textContent = "Select the link below and copy it."
      }
    }
  }

  function channelMeta(id, destination, caption, title) {
    var encodedCaption = encodeURIComponent(caption)
    var encodedUrl = encodeURIComponent(destination)
    var encodedTitle = encodeURIComponent(title + " | RANKD")

    if (id === "facebook") {
      return {
        label: "Facebook",
        href: "",
        fileShare: true
      }
    }
    if (id === "x") {
      return {
        label: "X",
        href: "https://x.com/compose/post?text=" + encodedCaption
      }
    }
    if (id === "whatsapp") {
      return {
        label: "WhatsApp",
        href: "https://wa.me/?text=" + encodedCaption + "%20" + encodedUrl,
        fileShare: true
      }
    }
    if (id === "email") {
      return {
        label: "Email",
        href:
          "mailto:?subject=" +
          encodedTitle +
          "&body=" +
          encodedCaption +
          "%0A%0A" +
          encodedUrl
      }
    }
    if (id === "instagram") {
      return {
        label: "Instagram",
        href: "https://www.instagram.com/",
        fileShare: true
      }
    }
    if (id === "tiktok") {
      return {
        label: "TikTok",
        href: "https://www.tiktok.com/tiktokstudio/upload",
        fileShare: true
      }
    }

    return {
      label: "the platform",
      href: destination
    }
  }

  function setShareButtonLabel(root) {
    var button = root.querySelector("[data-share-action='video-file']")
    var channel = root.getAttribute("data-share-channel") || ""
    var meta = channelMeta(
      channel,
      root.getAttribute("data-share-url") || "",
      root.getAttribute("data-share-caption") || "",
      root.getAttribute("data-share-title") || "RANKD"
    )
    if (button) {
      button.textContent = meta.fileShare
        ? "Share to " + meta.label
        : "Open " + meta.label
    }
  }

  async function loadTeaserFile(root) {
    var rankingId = root.getAttribute("data-ranking-id") || ""
    if (rankingId && teaserStore()[rankingId]) {
      return teaserStore()[rankingId]
    }
    var teaserUrl = root.getAttribute("data-teaser-url") || ""
    if (!teaserUrl) {
      return null
    }
    var response = await fetch(teaserUrl, { mode: "cors" })
    if (!response.ok) {
      throw new Error("fetch")
    }
    var blob = await response.blob()
    if (!blob.size) {
      throw new Error("empty")
    }
    var file = new File([blob], "rankd-preview.mp4", { type: "video/mp4" })
    if (rankingId) {
      teaserStore()[rankingId] = file
    }
    return file
  }

  async function shareFileToApp(file, title, caption) {
    if (typeof navigator.share !== "function") {
      return false
    }

    var attempts = [
      {
        files: [file],
        title: title + " | RANKD",
        text: caption
      },
      {
        files: [file]
      }
    ]

    for (var i = 0; i < attempts.length; i++) {
      var data = attempts[i]
      if (typeof navigator.canShare === "function" && !navigator.canShare(data)) {
        continue
      }
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        if (error && error.name === "AbortError") {
          return true
        }
      }
    }

    return false
  }

  async function openChosenPlatform(root) {
    var status = root.querySelector("[data-share-status]")
    var note = root.querySelector("[data-share-video-note]")
    var destination = root.getAttribute("data-share-url") || ""
    var title = root.getAttribute("data-share-title") || "RANKD"
    var caption = root.getAttribute("data-share-caption") || ""
    var channel = root.getAttribute("data-share-channel") || ""
    var meta = channelMeta(channel, destination, caption, title)

    function setStatus(message) {
      if (status) {
        status.textContent = message
      }
      if (note) {
        note.textContent = message
      }
    }

    try {
      var file = await loadTeaserFile(root)
      if (!file) {
        setStatus("This RANKD does not have a video file yet.")
        return
      }
      if (navigator.clipboard && window.isSecureContext && caption) {
        try {
          await navigator.clipboard.writeText(caption)
        } catch (error) {}
      }
      if (meta.fileShare) {
        var shared = await shareFileToApp(file, title, caption)
        if (shared) {
          setStatus("Pick " + meta.label + " in the share sheet.")
          return
        }
        downloadFile(file)
        setStatus(
          "Saved the RANKD MP4. Open " +
            meta.label +
            " and upload it as a Reel or video."
        )
        return
      }
      downloadFile(file)
      if (meta.href && meta.href.indexOf("mailto:") === 0) {
        window.location.href = meta.href
      } else if (meta.href) {
        window.open(meta.href, "_blank", "noopener,noreferrer")
      }
      setStatus(
        "Opening " +
          meta.label +
          ". Attach the downloaded RANKD MP4."
      )
    } catch (error) {
      setStatus("Could not open " + meta.label + ". Download the MP4 and upload it there.")
    }
  }

  async function downloadVideo(root) {
    var status = root.querySelector("[data-share-status]")
    var note = root.querySelector("[data-share-video-note]")

    function setStatus(message) {
      if (status) {
        status.textContent = message
      }
      if (note) {
        note.textContent = message
      }
    }

    try {
      var file = await loadTeaserFile(root)
      if (!file) {
        setStatus("This RANKD does not have a video file yet.")
        return
      }
      downloadFile(file)
      setStatus("Video downloaded.")
    } catch (error) {
      setStatus("Could not download the video. Try again.")
    }
  }

  function downloadFile(file) {
    var objectUrl = URL.createObjectURL(file)
    var link = document.createElement("a")
    link.href = objectUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(function () {
      URL.revokeObjectURL(objectUrl)
    }, 60000)
  }

  function teaserStore() {
    if (!window.__rankdTeaserBlobs) {
      window.__rankdTeaserBlobs = {}
    }
    return window.__rankdTeaserBlobs
  }

  function showVideoPanel(root) {
    root.setAttribute("data-view", "video")
  }

  function waitForEncode(timeoutMs) {
    return new Promise(function (resolve, reject) {
      if (typeof window.__rankdEncode === "function") {
        resolve(window.__rankdEncode)
        return
      }
      var started = Date.now()
      var timer = window.setInterval(function () {
        if (typeof window.__rankdEncode === "function") {
          window.clearInterval(timer)
          resolve(window.__rankdEncode)
          return
        }
        if (Date.now() - started > timeoutMs) {
          window.clearInterval(timer)
          reject(
            new Error(
              "The video encoder did not load. Refresh and try Video again in Chrome."
            )
          )
        }
      }, 200)
    })
  }

  async function createTeaserFromSheet(root) {
    var status = root.querySelector("[data-share-status]")
    var note = root.querySelector("[data-share-video-note]")
    var video = root.querySelector("[data-share-video]")
    var still = root.querySelector("[data-share-still]")
    var actions = root.querySelector("[data-share-video-actions]")

    function setStatus(message) {
      if (status) {
        status.textContent = message
      }
      if (note) {
        note.textContent = message
      }
    }

    var rankingId = root.getAttribute("data-ranking-id") || ""
    var cached = rankingId && teaserStore()[rankingId]
    if (cached) {
      var cachedUrl = URL.createObjectURL(cached)
      root.setAttribute("data-teaser-url", cachedUrl)
      if (video) {
        video.src = cachedUrl
        video.hidden = false
      }
      if (still) {
        still.hidden = true
      }
      if (actions) {
        actions.hidden = false
      }
      setStatus("Video ready.")
      return cachedUrl
    }

    var existingUrl = root.getAttribute("data-teaser-url") || ""
    if (existingUrl.indexOf("blob:") === 0) {
      return existingUrl
    }

    if (root.getAttribute("data-creating") === "1") {
      return null
    }

    root.setAttribute("data-creating", "1")
    setStatus("Creating the 9:16 video…")

    try {
      var encode = await waitForEncode(15000)
      var items = []
      try {
        items = JSON.parse(root.getAttribute("data-share-items") || "[]")
      } catch (error) {}
      var blob = await encode({
        title: root.getAttribute("data-share-title") || "RANKD",
        category: root.getAttribute("data-share-category") || "Top 7",
        items: items,
        paper: root.getAttribute("data-share-paper") || "#F7F4EE",
        accent: root.getAttribute("data-share-accent") || "#FF6B35"
      })
      var file = new File([blob], "rankd-preview.mp4", { type: "video/mp4" })
      var objectUrl = URL.createObjectURL(file)
      var rankingId = root.getAttribute("data-ranking-id") || objectUrl
      teaserStore()[rankingId] = file
      root.setAttribute("data-teaser-url", objectUrl)
      if (video) {
        video.src = objectUrl
        video.hidden = false
      }
      if (still) {
        still.hidden = true
      }
      if (actions) {
        actions.hidden = false
      }
      setStatus("Video ready.")
      if (rankingId && typeof window.__rankdPublishTeaser === "function") {
        try {
          await window.__rankdPublishTeaser(rankingId, blob)
        } catch (error) {}
      }
      return objectUrl
    } catch (error) {
      setStatus(
        error && error.message
          ? error.message
          : "Could not create the video. Try Chrome on desktop."
      )
      return null
    } finally {
      root.setAttribute("data-creating", "0")
    }
  }

  function showChannels(root) {
    root.removeAttribute("data-view")
  }

  document.addEventListener(
    "click",
    function (event) {
      var node = elementFromEvent(event)
      var action =
        node && node.closest
          ? node.closest("[data-share-action]")
          : null
      if (!action) {
        return
      }
      var root = action.closest("[data-rankd-share]")
      if (!root) {
        return
      }
      var kind = action.getAttribute("data-share-action")
      var destination = root.getAttribute("data-share-url") || ""
      if (kind === "copy") {
        event.preventDefault()
        copyLink(root, destination)
      }
      if (kind === "video") {
        event.preventDefault()
        event.stopPropagation()
        root.setAttribute(
          "data-share-channel",
          action.getAttribute("data-channel") || ""
        )
        setShareButtonLabel(root)
        showVideoPanel(root)
        createTeaserFromSheet(root)
      }
      if (kind === "video-back") {
        event.preventDefault()
        showChannels(root)
      }
      if (kind === "video-file") {
        event.preventDefault()
        openChosenPlatform(root)
      }
      if (kind === "video-download") {
        event.preventDefault()
        downloadVideo(root)
      }
    },
    true
  )
})()
