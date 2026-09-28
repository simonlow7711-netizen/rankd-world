import type {
  Metadata
} from "next"

import {
  supabase
} from "@/utils/supabase"


const SITE_URL =
  "https://rankd.world"


type PhotoRankdMetadata = {

  title: string

  description: string | null

  image_url: string

}


export async function generateMetadata({

  params

}: {

  params: Promise<{
    id: string
  }>

}): Promise<Metadata> {

  const {
    id
  } =
    await params


  const {
    data
  } =
    await supabase
      .from("photo_rankds")
      .select(
        `
          title,
          description,
          image_url
        `
      )
      .eq(
        "id",
        id
      )
      .maybeSingle()


  const photoRankd =
    data as PhotoRankdMetadata | null


  if (
    !photoRankd
  ) {

    return {

      title:
        "Photo RANKD | RANKD",

      description:
        "Explore Photo RANKD on RANKD.",

      alternates: {

        canonical:
          `${SITE_URL}/photo-rankd/${id}`

      }

    }

  }


  const title =
    `${photoRankd.title} | Photo RANKD | RANKD`


  const description =
    photoRankd.description
      ??
      "Explore a Photo RANKD and discover the seven RANKDs hidden within the image."


  const canonicalUrl =
    `${SITE_URL}/photo-rankd/${id}`


  return {

    title,

    description,

    alternates: {

      canonical:
        canonicalUrl

    },

    openGraph: {

      type:
        "website",

      url:
        canonicalUrl,

      siteName:
        "RANKD",

      title,

      description,

      locale:
        "en_GB",

      images: [

        {

          url:
            photoRankd.image_url,

          alt:
            photoRankd.title

        }

      ]

    },

    twitter: {

      card:
        "summary_large_image",

      title,

      description,

      images: [

        photoRankd.image_url

      ]

    },

    robots: {

      index:
        true,

      follow:
        true

    }

  }

}


export default function PhotoRankdLayout({

  children

}: Readonly<{

  children: React.ReactNode

}>) {

  return children

}