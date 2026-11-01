"use client"

import {
  useEffect,
  useState
} from "react"

import {
  getAmazonAsin,
  getAmazonImageFallbacks,
  getAmazonImageUrl,
  getAmazonUrl,
  type AmazonPreview
} from "@/utils/amazon"

type AmazonTreatmentProps = {
  url?: string | null
  name: string
}

export default function AmazonTreatment({
  url,
  name
}: AmazonTreatmentProps) {

  const amazonUrl =
    getAmazonUrl(url)

  const initialAsin =
    getAmazonAsin(amazonUrl)

  const [
    preview,
    setPreview
  ] =
    useState<AmazonPreview | null>(
      amazonUrl
        ? {
            url: amazonUrl,
            asin: initialAsin,
            title: null,
            image:
              initialAsin
                ? getAmazonImageUrl(initialAsin)
                : null
          }
        : null
    )

  const [
    imageFailed,
    setImageFailed
  ] =
    useState(false)

  const [
    imageIndex,
    setImageIndex
  ] =
    useState(0)

  useEffect(() => {
    if (!amazonUrl) {
      setPreview(null)
      return
    }

    const asin =
      getAmazonAsin(amazonUrl)

    setPreview({
      url: amazonUrl,
      asin,
      title: null,
      image:
        asin
          ? getAmazonImageUrl(asin)
          : null
    })
    setImageFailed(false)
    setImageIndex(0)

    let cancelled = false

    async function loadPreview() {
      try {
        const response =
          await fetch(
            `/api/amazon?url=${encodeURIComponent(amazonUrl as string)}`,
            {
              signal:
                AbortSignal.timeout(10000)
            }
          )

        if (!response.ok) {
          return
        }

        const data =
          await response.json() as AmazonPreview

        if (cancelled) {
          return
        }

        setPreview({
          url:
            data.url ||
            amazonUrl as string,
          asin:
            data.asin,
          title:
            data.title,
          image:
            data.image ||
            (
              data.asin
                ? getAmazonImageUrl(data.asin)
                : null
            )
        })
        setImageFailed(false)
        setImageIndex(0)
      } catch {
        // Keep the local ASIN preview if the lookup fails.
      }
    }

    loadPreview()

    return () => {
      cancelled = true
    }
  }, [amazonUrl])

  if (!amazonUrl || !preview) {
    return null
  }

  const imageCandidates =
    preview.asin
      ? [
          preview.image,
          ...getAmazonImageFallbacks(preview.asin)
        ].filter(
          (value, index, list): value is string =>
            Boolean(value) &&
            list.indexOf(value) === index
        )
      : preview.image
        ? [preview.image]
        : []

  const imageSrc =
    !imageFailed
      ? imageCandidates[imageIndex] ?? null
      : null

  const title =
    preview.title ||
    name

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        mx-auto
        mt-5
        flex
        w-full
        min-w-0
        max-w-full
        items-center
        gap-4
        overflow-hidden
        rounded-[22px]
        border
        border-black
        bg-[#F7F4EE]
        p-3.5
        pr-5
        text-left
        text-black
      "
    >
      <div
        className="
          flex
          h-[7.5rem]
          w-[7.5rem]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-black/10
          bg-[#F7F4EE]
        "
      >
        {
          imageSrc ? (
            <img
              src={imageSrc}
              alt={`Amazon product image for ${title}`}
              className="
                h-full
                w-full
                object-contain
              "
              loading="lazy"
              onError={() => {
                if (
                  imageIndex <
                  imageCandidates.length - 1
                ) {
                  setImageIndex(
                    imageIndex + 1
                  )
                  return
                }

                setImageFailed(true)
              }}
            />
          ) : (
            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-black/35
              "
            >
              Amazon
            </span>
          )
        }
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-black/40
          "
        >
          Amazon
        </p>

        <p
          className="
            mt-1.5
            text-lg
            font-black
            leading-tight
            tracking-[-0.03em]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-2
            text-sm
            font-bold
            text-[#FF6B35]
          "
        >
          View on Amazon ↗
        </p>
      </div>
    </a>
  )
}
