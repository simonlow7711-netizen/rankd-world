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





    await supabase

      .from("analytics_events")

      .insert({

        event_name:eventName,

        user_id:user?.id ?? null,

        metadata

      })





    // Google Analytics hook will be added next

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