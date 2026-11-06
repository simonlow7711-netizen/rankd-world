import type {
  Metadata
} from "next"


import {
  sharePreviewImage,
  sharePreviewUrl
} from "@/utils/ogImage"


import {
  SITE_URL,
  indexableRobots
} from "@/utils/siteUrl"


export const metadata: Metadata = {

  title:
    "Photo RANKD | See it. Rank it differently. | RANKD",

  description:
    "Photo RANKD turns photographs into Top 7 choices. Explore an image, discover the seven things hidden within it, and make your own order.",

  alternates: {

    canonical:
      `${SITE_URL}/photo-rankd`

  },

  openGraph: {

    type:
      "website",

    url:
      `${SITE_URL}/photo-rankd`,

    siteName:
      "RANKD",

    title:
      "Photo RANKD | See it. Rank it differently. | RANKD",

    description:
      "Photo RANKD turns photographs into Top 7 choices. Explore an image, discover the seven things hidden within it, and make your own order.",

    locale:
      "en_GB",

    images: [

      sharePreviewImage(
        "Photo RANKD | See it. Rank it differently."
      )

    ]

  },

  twitter: {

    card:
      "summary_large_image",

    title:
      "Photo RANKD | See it. Rank it differently. | RANKD",

    description:
      "Photo RANKD turns photographs into Top 7 choices. Explore an image, discover the seven things hidden within it, and make your own order.",

    images: [

      sharePreviewUrl()

    ]

  },

  robots:
    indexableRobots

}


export default function PhotoRankdLayout({

  children

}: Readonly<{

  children: React.ReactNode

}>) {

  return children

}