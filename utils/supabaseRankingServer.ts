import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


import {
  Ranking
} from "@/types/ranking"


type RankingRow = {
  id:string
  title:string
  category:string
  description:string | null
  views:number | null
  user_id:string | null
  parent_id:string | null
  root_id:string | null
  source_type:string | null
  created_at:string | null
  location_name:string | null
  location_city:string | null
  location_country:string | null
}


function mapRanking(
  row:RankingRow,
  items:any[]
):Ranking{

  const ranking:Ranking = {
    id:row.id,
    title:row.title,
    category:row.category,
    creator:"",
    description:row.description ?? "",
    items:items.map(
      item => ({
        position:item.position,
        name:item.name,
        votes:item.votes ?? 0
      })
    ),
    creatorId:row.user_id ?? undefined,
    parentId:row.parent_id,
    rootId:row.root_id,
    source:
      row.source_type === "remix"
        ? "remix"
        : row.source_type === "challenge"
          ? "challenge"
          : row.source_type === "seed"
            ? "seed"
            : "community",
    createdAt:row.created_at ?? undefined,
    views:row.views ?? 0
  }


  if(
    row.location_name ||
    row.location_city ||
    row.location_country
  ){

    ranking.location = {
      name:
        row.location_name ??
        "",
      city:
        row.location_city ??
        undefined,
      country:
        row.location_country ??
        undefined
    }

  }


  return ranking

}


export async function getSupabaseRankingServer(
  id:string
):Promise<Ranking | null>{

  const supabase =
    await createSupabaseServerClient()


  const {
    data:rankingRow,
    error:rankingError
  } = await supabase
    .from("rankings")
    .select(
      `
        id,
        title,
        category,
        description,
        views,
        user_id,
        parent_id,
        root_id,
        source_type,
        created_at,
        location_name,
        location_city,
        location_country
      `
    )
    .eq(
      "id",
      id
    )
    .single()


  if(rankingError){

    console.error(
      "SERVER RANKING LOAD ERROR",
      JSON.stringify(
        {
          id,
          message:
            rankingError.message,
          code:
            rankingError.code,
          details:
            rankingError.details,
          hint:
            rankingError.hint
        },
        null,
        2
      )
    )

    return null

  }


  if(!rankingRow){

    console.error(
      "SERVER RANKING LOAD ERROR: NO ROW",
      id
    )

    return null

  }


  const {
    data:items,
    error:itemsError
  } = await supabase
    .from("ranking_items")
    .select(
      `
        position,
        name,
        votes
      `
    )
    .eq(
      "ranking_id",
      id
    )
    .order(
      "position",
      {
        ascending:true
      }
    )


  if(itemsError){

    console.error(
      "SERVER RANKING ITEMS LOAD ERROR",
      JSON.stringify(
        {
          id,
          message:
            itemsError.message,
          code:
            itemsError.code,
          details:
            itemsError.details,
          hint:
            itemsError.hint
        },
        null,
        2
      )
    )

  }


  const ranking =
    mapRanking(
      rankingRow as RankingRow,
      items ?? []
    )


  if(rankingRow.user_id){

    const {
      data:profile,
      error:profileError
    } = await supabase
      .from("profiles")
      .select(
        `
          username,
          display_name
        `
      )
      .eq(
        "id",
        rankingRow.user_id
      )
      .maybeSingle()


    if(profileError){

      console.error(
        "SERVER PROFILE LOAD ERROR",
        JSON.stringify(
          {
            id,
            userId:
              rankingRow.user_id,
            message:
              profileError.message,
            code:
              profileError.code,
            details:
              profileError.details,
            hint:
              profileError.hint
          },
          null,
          2
        )
      )

    }


    if(profile){

      ranking.creatorUsername =
        profile.username ??
        undefined

      ranking.creatorDisplayName =
        profile.display_name ??
        undefined

      ranking.creator =
        profile.display_name ||
        profile.username ||
        ""

    }

  }


  return ranking

}