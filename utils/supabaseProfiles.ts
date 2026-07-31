import { supabase } from "@/utils/supabase"


export async function getProfileByUsername(
  username:string
){


  const { data, error } = await supabase

    .from("profiles")

    .select("*")

    .eq("username", username)

    .single()



  if(error){

    console.error(error)

    return null

  }


  return data

}