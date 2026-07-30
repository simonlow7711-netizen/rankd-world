import { user } from "@/data/user"

import { discoveryUsers } from "@/data/discoveryUsers"

import { rankings as allRankings } from "@/data/rankings"

import { calculateAchievements } from "@/utils/achievements"




export function getDiscoverableUsers(

  rankings:any[]

){



  const currentUser = {


    username: user.username,

    displayName: user.displayName,

    rankings,

    achievements:

      calculateAchievements(rankings)

  }





  const otherUsers = discoveryUsers.map(

    person => {



      const userRankings =

        allRankings.filter(

          ranking =>

            person.rankingIds.includes(

              ranking.id

            )

        )





      return {


        username: person.username,


        displayName: person.displayName,


        rankings: userRankings,


        achievements:

          calculateAchievements(

            userRankings

          )


      }


    }

  )





  return [

    currentUser,

    ...otherUsers

  ]



}