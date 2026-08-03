import { supabase } from "@/utils/supabase"





export async function getMostViewedRankings(){


  const {

    data,

    error

  } = await supabase

    .from("analytics_events")

    .select(

      `
      ranking_id
      `

    )

    .eq(

      "event_name",

      "ranking_viewed"

    )







  if(error){

    console.error(
      "MOST VIEWED ERROR",
      error
    )

    return []

  }







  const counts:any = {}







  ;(data ?? []).forEach(

    event=>{


      if(!event.ranking_id){

        return

      }





      if(!counts[event.ranking_id]){

        counts[event.ranking_id]=0

      }




      counts[event.ranking_id]++



    }

  )








  const ids = Object.keys(counts)







  if(ids.length===0){

    return []

  }







  const {

    data:rankings,

    error:rankingError

  } = await supabase

    .from("rankings")

    .select(

      `
      id,
      title,
      category
      `

    )

    .in(

      "id",

      ids

    )








  if(rankingError){

    console.error(

      "RANKING LOOKUP ERROR",

      rankingError

    )

    return []

  }








  return (

    rankings ?? []

  )

  .map(

    ranking=>({


      ...ranking,


      views:

        counts[ranking.id] ?? 0



    })

  )

  .sort(

    (a,b)=>

      b.views-a.views

  )

  .slice(

    0,

    10

  )



}









export async function getBiggestDebates(){



  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select(

      `
      id,
      title,
      parent_id,
      root_id
      `

    )








  if(error){

    console.error(

      "DEBATES ERROR",

      error

    )

    return []

  }







  const debates:any={}







  ;(data ?? []).forEach(

    ranking=>{


      if(!ranking.parent_id){

        return

      }






      const root =

        ranking.root_id ??

        ranking.id






      if(!debates[root]){


        debates[root]={


          id:root,

          title:ranking.title,

          replies:0


        }


      }






      debates[root].replies++



    }

  )








  return Object.values(debates)

    .sort(

      (a:any,b:any)=>

        b.replies-a.replies

    )

    .slice(

      0,

      10

    )



}









export async function getCategoryIntelligence(){



  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select(

      "category"

    )








  if(error){

    return []

  }







  const categories:any={}







  ;(data ?? []).forEach(

    ranking=>{


      const category =

        ranking.category ??

        "General"






      if(!categories[category]){

        categories[category]=0

      }




      categories[category]++



    }

  )








  return Object.entries(categories)

    .map(

      ([name,count])=>({


        name,

        count


      })

    )

    .sort(

      (a:any,b:any)=>

        b.count-a.count

    )



}









export async function getTrendingRankings(){



  const {

    data,

    error

  } = await supabase

    .from("analytics_events")

    .select(

      `
      ranking_id,
      created_at
      `

    )

    .eq(

      "event_name",

      "ranking_viewed"

    )

    .order(

      "created_at",

      {

        ascending:false

      }

    )

    .limit(50)







  if(error){

    return []

  }







  const counts:any={}







  ;(data ?? []).forEach(

    event=>{


      if(!event.ranking_id){

        return

      }




      counts[event.ranking_id] =

        (

          counts[event.ranking_id] ??

          0

        )

        +

        1



    }

  )







  const ids = Object.keys(counts)







  const {

    data:rankings

  } = await supabase

    .from("rankings")

    .select(

      `
      id,
      title,
      category
      `

    )

    .in(

      "id",

      ids

    )







  return (

    rankings ?? []

  )

  .map(

    ranking=>({


      ...ranking,


      momentum:

        counts[ranking.id]



    })

  )

  .sort(

    (a,b)=>

      b.momentum-a.momentum

  )

  .slice(

    0,

    10

  )


}