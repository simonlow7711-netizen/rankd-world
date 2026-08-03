import { supabase } from "@/utils/supabase"





export async function trackEvent(

  eventName:string,

  metadata:any = {}

){


  try {


    const {

      data:{
        user

      }

    } = await supabase.auth.getUser()






    const rankingId =

      metadata?.rankingId

      ??

      metadata?.ranking_id

      ??

      null







    const {

      error

    } = await supabase

      .from("analytics_events")

      .insert({

        event_name:eventName,

        user_id:

          user?.id

          ??

          null,


        ranking_id:

          rankingId,


        metadata



      })








    if(error){


      console.error(

        "Analytics insert error:",

        error

      )


    }








    // Google Analytics hook

    if(

      typeof window !== "undefined"

      &&

      window.gtag

    ){


      window.gtag(

        "event",

        eventName,

        metadata

      )


    }



  }


  catch(error){


    console.error(

      "Analytics error:",

      error

    )


  }


}