import type {
  Metadata
} from "next"

import "./globals.css"

import Navbar from "@/components/Navbar"

import GoogleAnalytics from "@/components/GoogleAnalytics"

import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView"


const SITE_URL =
  "https://rankd.world"


export const metadata: Metadata = {

  metadataBase:
    new URL(
      SITE_URL
    ),


  title: {

    default:
      "RANKD — The World's Top 7 Everything",

    template:
      "%s | RANKD"

  },


  description:
    "Discover, create and debate the world's Top 7 rankings. Explore opinions, compare perspectives and create your own Top 7.",


  applicationName:
    "RANKD",


  keywords: [

    "RANKD",

    "Top 7",

    "rankings",

    "Top 7 rankings",

    "best of",

    "opinions",

    "rankings and opinions",

    "community rankings",

    "compare rankings",

    "create a ranking"

  ],


  authors: [

    {

      name:
        "RANKD"

    }

  ],


  creator:
    "RANKD",


  publisher:
    "RANKD",


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
      "RANKD",

    title:
      "RANKD — The World's Top 7 Everything",

    description:
      "Discover, create and debate the world's Top 7 rankings.",

    locale:
      "en_GB"

  },


  twitter: {

    card:
      "summary_large_image",

    title:
      "RANKD — The World's Top 7 Everything",

    description:
      "Discover, create and debate the world's Top 7 rankings."

  },


  robots: {

    index:
      true,

    follow:
      true

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

        className="
          bg-[#F7F4EE]
          text-black
          antialiased
        "

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
                      "RANKD",

                    description:
                      "Discover, create and debate the world's Top 7 rankings.",

                    inLanguage:
                      "en-GB"

                  },


                  {

                    "@type":
                      "Organization",

                    "@id":
                      `${SITE_URL}/#organization`,

                    name:
                      "RANKD",

                    url:
                      SITE_URL

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