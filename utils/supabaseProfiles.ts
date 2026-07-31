import { supabase } from "@/utils/supabase"



export type Profile = {

  id:string

  username:string

  display_name:string

}





export async function getProfileById(
  id:string
): Promise<Profile | null>{


  const {
    data,
    error

  } = await supabase

    .from("profiles")

    .select("*")

    .eq(
      "id",
      id
    )

    .maybeSingle()





  if(error){


    console.error(
      "PROFILE BY ID ERROR:",
      error
    )


    return null

  }





  return data

}







export async function getProfileByUsername(
  username:string
): Promise<Profile | null>{


  const {
    data,
    error

  } = await supabase

    .from("profiles")

    .select("*")

    .eq(
      "username",
      username
    )

    .maybeSingle()





  if(error){


    console.error(
      "PROFILE BY USERNAME ERROR:",
      error
    )


    return null

  }





  return data

}







export async function createProfile({

  id,

  username,

  displayName

}:{

  id:string

  username:string

  displayName:string

}): Promise<Profile | null>{





  const {
    data,
    error

  } = await supabase

    .from("profiles")

    .insert({

      id,

      username,

      display_name:
        displayName

    })

    .select()

    .single()







  if(error){


    console.error(
      "CREATE PROFILE ERROR:",
      error
    )


    return null

  }





  return data

}