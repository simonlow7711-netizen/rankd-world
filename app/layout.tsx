import type {
  Metadata
} from "next"


import {
  GeistSans
} from "geist/font/sans"


import Script from "next/script"


import "./globals.css"


import Navbar from "@/components/Navbar"


import GoogleAnalytics from "@/components/GoogleAnalytics"


import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView"

import TeaserEncodeBoot from "@/components/TeaserEncodeBoot"

import {
  sharePreviewImage,
  sharePreviewUrl
} from "@/utils/ogImage"


import {
  SITE_URL
} from "@/utils/siteUrl"


const SITE_NAME =
  "RANKD"


const SITE_TITLE =
  "RANKD — The World's Top 7 Everything"


const SITE_DESCRIPTION =
  "Discover, create and debate the world's Top 7. Compare opinions, explore different perspectives and rank it differently."


const SITE_LOGO =
  `${SITE_URL}/rankd-logo.png`


export const metadata: Metadata = {

  metadataBase:
    new URL(
      SITE_URL
    ),


  title: {

    default:
      SITE_TITLE,

    template:
      "%s | RANKD"

  },


  description:
    SITE_DESCRIPTION,


  applicationName:
    SITE_NAME,


  keywords: [

    "RANKD",

    "Top 7",

    "Top 7 rankings",

    "rankings",

    "ranking",

    "opinions",

    "compare rankings",

    "community rankings",

    "create a ranking",

    "rank it differently"

  ],


  authors: [

    {

      name:
        SITE_NAME,

      url:
        SITE_URL

    }

  ],


  creator:
    SITE_NAME,


  publisher:
    SITE_NAME,


  icons: {

    icon:
      "/favicon.png",

    shortcut:
      "/favicon.png",

    apple:
      "/favicon.png"

  },


  openGraph: {

    type:
      "website",

    siteName:
      SITE_NAME,

    title:
      SITE_TITLE,

    description:
      SITE_DESCRIPTION,

    locale:
      "en_GB",

    images: [

      sharePreviewImage(
        "RANKD — The World's Top 7 Everything"
      )

    ]

  },


  twitter: {

    card:
      "summary_large_image",

    title:
      SITE_TITLE,

    description:
      SITE_DESCRIPTION,

    images: [

      sharePreviewUrl()

    ]

  },


  robots: {

    index:
      false,

    follow:
      true,

    googleBot: {

      index:
        false,

      follow:
        true

    }

  }

}


export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode

}>) {


  return (

    <html

      lang="en"

      data-scroll-behavior="smooth"

      className="
        overflow-x-hidden
      "

    >


      <body

        className={`
          ${GeistSans.className}
          overflow-x-hidden
          bg-[#F7F4EE]
          text-black
          antialiased
        `}

      >


        <GoogleAnalytics />


        <GoogleAnalyticsPageView />

        <TeaserEncodeBoot />

        <script
          type="module"
          src="/rankd-teaser-encode.js?v=8"
        />

        <script
          src="/rankd-share.js?v=11"
          defer
        />


        <Script

          src="
            https://s.skimresources.com/js/310317X1798789.skimlinks.js
          "

          strategy="afterInteractive"

        />


        <script

          type="application/ld+json"

          dangerouslySetInnerHTML={{

            __html:
              JSON.stringify({

                "@context":
                  "https://schema.org",

                "@graph": [

                  {

                    "@type":
                      "WebSite",

                    "@id":
                      `${SITE_URL}/#website`,

                    url:
                      SITE_URL,

                    name:
                      SITE_NAME,

                    description:
                      SITE_DESCRIPTION,

                    inLanguage:
                      "en-GB",

                    publisher: {

                      "@id":
                        `${SITE_URL}/#organization`

                    }

                  },


                  {

                    "@type":
                      "Organization",

                    "@id":
                      `${SITE_URL}/#organization`,

                    name:
                      SITE_NAME,

                    url:
                      SITE_URL,

                    logo: {

                      "@type":
                        "ImageObject",

                      url:
                        SITE_LOGO

                    }

                  }

                ]

              })

          }}

        />


        <Navbar />


        {children}


      </body>

    </html>

  )

}