import {
  supabase
} from "@/utils/supabase"


import {
  calculateTasteDNA
} from "@/utils/tasteProfile"


import {
  calculateTasteMatch
} from "@/utils/tasteMatching"








export async function getDiscoverableUsers(

  currentUserId:string,

  currentRankings:any[] = []

){





  const {

    data:profiles,

    error

  } = await supabase

    .from("profiles")

    .select(

      `
      id,
      username,
      display_name
      `

    )

    .limit(50)







  if(error || !profiles){


    console.error(

      "Discoverable users error:",

      JSON.stringify(

        error,

        null,

        2

      )

    )


    return []

  }









  const currentTasteDNA =

    calculateTasteDNA(

      currentRankings

    )









  const users = await Promise.all(


    profiles

      .filter(

        profile =>

          profile.id !== currentUserId

      )


      .map(

        async(profile)=>{



          const {

            data:rankings,

            error:rankingError

          } = await supabase

            .from("rankings")

            .select(

              `
              id,
              title,
              category,
              description,
              created_at
              `

            )

            .eq(

              "user_id",

              profile.id

            )







          if(rankingError){


            console.error(

              "Ranking lookup error:",

              rankingError

            )


          }









          const userRankings =

            rankings ?? []









          const userTasteDNA =

            calculateTasteDNA(

              userRankings

            )








          const tasteMatch =

            calculateTasteMatch(

              currentTasteDNA,

              userTasteDNA

            )









          return {


            id:

              profile.id,



            username:

              profile.username,



            displayName:

              profile.display_name,



            rankings:

              userRankings,



            tasteDNA:

              userTasteDNA,



            tasteMatch



          }



        }


      )


  )









  return users

    .filter(

      user =>

        user.rankings.length > 0

    )

    .sort(

      (a,b)=>

        b.tasteMatch.score -

        a.tasteMatch.score

    )


}