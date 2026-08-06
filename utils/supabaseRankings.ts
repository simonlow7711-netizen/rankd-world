import { supabase } from "@/utils/supabase"

import {
  Ranking,
  RankingItem
} from "@/types/ranking"

import {
  rankings as seedRankings
} from "@/data/rankings"

import {
  getRankingSignals
} from "@/utils/rankingSignals"





type RankingRow = {

  id:string

  title:string

  category:string | null

  description:string | null

  user_id:string

  views:number | null

  created_at:string | null

  parent_id:string | null

  root_id:string | null

}





type ProfileRow = {

  id:string

  username:string | null

  display_name:string | null

}





type RankingItemRow = {

  id:string

  ranking_id:string

  position:number

  name:string

  votes:number | null

}









function mapRanking(

  row:RankingRow,

  items:RankingItem[],

  profile?:ProfileRow

):Ranking {


  const ranking:Ranking = {


    id:

      row.id,



    title:

      row.title,



    category:

      row.category ?? "General",



    creator:

      profile?.display_name ?? "Anonymous",



    creatorId:

      row.user_id,



    creatorUsername:

      profile?.username ?? undefined,



    creatorDisplayName:

      profile?.display_name ?? undefined,



    description:

      row.description ?? "",



    items,



    createdAt:

      row.created_at ?? undefined,



    views:

      row.views ?? 0,



    source:

      "community",



    parentId:

      row.parent_id ?? undefined,



    rootId:

      row.root_id ?? undefined


  }







  return {


    ...ranking,


    signals:

      getRankingSignals(

        ranking

      )


  }


}









async function getItemsForRankings(

  rankingIds:string[]

){


  const {

    data,

    error

  } = await supabase

    .from("ranking_items")

    .select("*")

    .in(

      "ranking_id",

      rankingIds

    )

    .order(

      "position",

      {

        ascending:true

      }

    )





  if(error){


    console.error(

      "ITEM LOAD ERROR",

      error

    )


  }







  const map =

    new Map<string,RankingItem[]>()





  ;(data ?? [])

  .forEach((item:RankingItemRow)=>{


    if(!map.has(item.ranking_id)){


      map.set(

        item.ranking_id,

        []

      )


    }







    map

      .get(item.ranking_id)!

      .push({

        position:

          item.position,



        name:

          item.name,



        votes:

          item.votes ?? 0

      })


  })







  return map


}









async function getProfiles(

  userIds:string[]

){


  const {

    data

  } = await supabase

    .from("profiles")

    .select(

      "id, username, display_name"

    )

    .in(

      "id",

      userIds

    )







  const map =

    new Map<string,ProfileRow>()





  ;(data ?? [])

  .forEach(profile=>{


    map.set(

      profile.id,

      profile as ProfileRow

    )


  })







  return map


}









export async function getSupabaseRanking(

  id:string

):Promise<Ranking | null>{


  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select("*")

    .eq(

      "id",

      id

    )

    .single()






  if(error || !data){


    console.error(

      "RANKING NOT FOUND",

      error

    )


    return null


  }







  const itemMap =

    await getItemsForRankings(

      [id]

    )







  const profiles =

    await getProfiles(

      [data.user_id]

    )







  return mapRanking(

    data as RankingRow,

    itemMap.get(id) ?? [],

    profiles.get(data.user_id)

  )


}









export async function getAllSupabaseRankings():Promise<Ranking[]>{


  const {

    data,

    error

  } = await supabase

    .from("rankings")

    .select("*")

    .order(

      "created_at",

      {

        ascending:false

      }

    )








  if(error || !data){


    console.error(

      "LOAD RANKINGS ERROR",

      error

    )


    return []

  }








  const rows =

    data as RankingRow[]





  const itemMap =

    await getItemsForRankings(

      rows.map(

        row=>row.id

      )

    )







  const profiles =

    await getProfiles(

      rows.map(

        row=>row.user_id

      )

    )








  return rows.map(row=>

    mapRanking(

      row,

      itemMap.get(row.id) ?? [],

      profiles.get(row.user_id)

    )

  )


}









export async function getAllRankings():Promise<Ranking[]>{


  const community =

    await getAllSupabaseRankings()





  const combined = [

    ...community,

    ...seedRankings

  ]








  return combined

    .filter(

      (ranking,index,array)=>

        array.findIndex(

          item =>

            item.id === ranking.id

        ) === index

    )

    .map(ranking=>({


      ...ranking,


      signals:

        getRankingSignals(

          ranking

        )


    }))


}









export async function getUserRankings(

  userId:string

):Promise<Ranking[]>{


  const rankings =

    await getAllSupabaseRankings()





  return rankings.filter(

    ranking =>

      ranking.creatorId === userId

  )


}









export async function createSupabaseRanking(

  ranking:Ranking,

  userId:string

){


  const {

    error

  } = await supabase

    .from("rankings")

    .insert({

      id:

        ranking.id,



      title:

        ranking.title,



      category:

        ranking.category,



      description:

        ranking.description,



      user_id:

        userId,



      views:

        0,



      parent_id:

        ranking.parentId ?? null,



      root_id:

        ranking.rootId ?? ranking.id

    })






  if(error){


    console.error(

      "CREATE RANKING ERROR",

      error

    )


    throw error


  }








  const items =

    ranking.items.map(

      item=>({


        id:

          crypto.randomUUID(),



        ranking_id:

          ranking.id,



        position:

          item.position,



        name:

          item.name,



        votes:

          item.votes ?? 0


      })

    )








  const {

    error:itemError

  } = await supabase

    .from("ranking_items")

    .insert(items)







  if(itemError){


    console.error(

      "CREATE ITEMS ERROR",

      itemError

    )


    throw itemError


  }







  return ranking


}