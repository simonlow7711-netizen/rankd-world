import type { Metadata } from "next"

import "./globals.css"

import Navbar from "@/components/Navbar"

import GoogleAnalytics from "@/components/GoogleAnalytics"

import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView"





export const metadata: Metadata = {

  title:
    "RANKD — The world's Top 7 everything",

  description:
    "Discover, create and debate the world's Top 7 rankings."

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



        <Navbar />



        {children}



      </body>


    </html>

  )

}