import { supabase } from "@/utils/supabase"



export async function getCommandCentreMetrics(){


  const {

    data:events,

    error

  } = await supabase

    .from("analytics_events")

    .select(
      `
      event_name,
      ranking_id,
      user_id
      `
    )




  if(error){

    console.error(
      "COMMAND CENTRE ERROR",
      error
    )

    return {

      views:0,
      uniqueUsers:0,
      created:0,
      published:0,
      remixes:0,
      opinionRate:0,
      publishRate:0,
      healthScore:0

    }

  }




  const rows = events ?? []





  const views =

    rows.filter(

      e =>

        e.event_name === "ranking_viewed"

    ).length





  const created =

    rows.filter(

      e =>

        e.event_name === "rank_started"

    ).length





  const published =

    rows.filter(

      e =>

        e.event_name === "rankd_published"

    ).length





  const remixes =

    rows.filter(

      e =>

        e.event_name === "remix_created"

    ).length






  const users =

    new Set(

      rows

      .map(

        e => e.user_id

      )

      .filter(Boolean)

    )






  const opinionRate =

    views > 0

    ?

    Math.round(

      (

        created /

        views

      )

      *

      100

    )

    :

    0






  const publishRate =

    created > 0

    ?

    Math.round(

      (

        published /

        created

      )

      *

      100

    )

    :

    0






  const healthScore =

    Math.round(

      (

        opinionRate +

        publishRate

      )

      /

      2

    )







  return {


    views,


    uniqueUsers:

      users.size,


    created,


    published,


    remixes,


    opinionRate,


    publishRate,


    healthScore



  }


}