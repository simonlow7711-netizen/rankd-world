import { discoveryUsers } from "@/data/discoveryUsers"


export function getDiscoverableUsers(rankings:any[]){


  return discoveryUsers.map(person => {


    return {

      ...person,

      rankings:

        person.rankings || []

    }


  })


}