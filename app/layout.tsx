import type {
  Metadata
} from "next"


import {
  GeistSans
} from "geist/font/sans"


import "./globals.css"


import Navbar from "@/components/Navbar"


import GoogleAnalytics from "@/components/GoogleAnalytics"


import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView"


const SITE_URL =
  "https://rankd.world"


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


  alternates: {

    canonical:
      SITE_URL

  },


  openGraph: {

    type:
      "website",

    url:
      SITE_URL,

    siteName:
      SITE_NAME,

    title:
      SITE_TITLE,

    description:
      SITE_DESCRIPTION,

    locale:
      "en_GB",

    images: [

      {

        url:
          SITE_LOGO,

        alt:
          "RANKD — The World's Top 7 Everything"

      }

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

      SITE_LOGO

    ]

  },


  robots: {

    index:
      true,

    follow:
      true,

    googleBot: {

      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1

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

    >


      <body

        className={`
          ${GeistSans.className}
          bg-[#F7F4EE]
          text-black
          antialiased
        `}

      >


        <GoogleAnalytics />


        <GoogleAnalyticsPageView />


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