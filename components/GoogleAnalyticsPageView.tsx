"use client"

import {
  usePathname
} from "next/navigation"

import {
  useEffect
} from "react"





declare global {

  interface Window {

    gtag?: (

      ...args:any[]

    ) => void

  }

}







export default function GoogleAnalyticsPageView(){


  const pathname = usePathname()






  useEffect(()=>{


    if(

      typeof window === "undefined"

      ||

      !window.gtag

      ||

      !pathname

    ){

      return

    }







    window.gtag(

      "config",

      process.env.NEXT_PUBLIC_GA_ID,

      {

        page_path: pathname,

        page_title: document.title,

        page_location: window.location.href

      }

    )





  },[pathname])





  return null


}