import type {
  Metadata
} from "next"

import ProfileClient from "./ProfileClient"


const SITE_URL =
  "https://rankd.world"


type Props = {
  params: Promise<{
    username: string
  }>
}


export async function generateMetadata({
  params
}: Props): Promise<Metadata> {

  const {
    username
  } = await params

  const profileUrl =
    `${SITE_URL}/profile/${encodeURIComponent(username)}`

  const title =
    `${username}'s RANKD Profile | RANKD`

  const description =
    `Discover ${username}'s Top 7 rankings and taste profile.`

  return {

    title,

    description,

    alternates: {
      canonical: profileUrl
    },

    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "RANKD",
      type: "profile",
      locale: "en_GB"
    },

    twitter: {
      card: "summary_large_image",
      title,
      description
    },

    robots: {
      index: true,
      follow: true
    }

  }

}


export default async function PublicProfilePage({
  params
}: Props) {

  const {
    username
  } = await params

  const profileUrl =
    `${SITE_URL}/profile/${encodeURIComponent(username)}`

  const profileStructuredData = {

    "@context": "https://schema.org",

    "@type": "ProfilePage",

    "@id": profileUrl,

    url: profileUrl,

    name:
      `${username}'s RANKD Profile`,

    description:
      `Discover ${username}'s Top 7 rankings and taste profile.`,

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "RANKD"
    },

    mainEntity: {
      "@type": "Person",
      name: username,
      url: profileUrl
    }

  }


  return (

    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(profileStructuredData)
        }}
      />

      <ProfileClient
        username={username}
      />

    </>

  )

}