import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"









export async function getCurrentUserId(){

  const supabase =

    await createSupabaseServerClient()





  const {

    data:{

      user

    }

  } = await supabase.auth.getUser()





  return user?.id ?? null


}