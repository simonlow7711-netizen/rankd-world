import {
  supabase
} from "@/utils/supabase"


import {
  Ranking
} from "@/types/ranking"


import {
  LocationConfig
} from "@/utils/locations"


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


async function attachProfiles(
  rankings:Ranking[],
  rows:RankingRow[]
):Promise<Ranking[]>{

  const userIds =
    rows
      .map(
        row => row.user_id
      )
      .filter(
        (
          userId
        ):userId is string =>
          Boolean(userId)
      )


  const uniqueUserIds =
    Array.from(
      new Set(
        userIds
      )
    )


  if(
    uniqueUserIds.length === 0
  ){

    return rankings

  }


  const {
    data:profiles,
    error:profilesError
  } = await supabase
    .from("profiles")
    .select(
      `
        id,
        username,
        display_name
      `
    )
    .in(
      "id",
      uniqueUserIds
    )


  if(profilesError){

    console.error(
      "PROFILES LOAD ERROR",
      profilesError
    )

    return rankings

  }


  const profilesByUser =
    new Map<
      string,
      {
        username:string
        display_name:string
      }
    >()


  ;(profiles ?? []).forEach(
    profile => {

      profilesByUser.set(
        profile.id,
        {
          username:
            profile.username,
          display_name:
            profile.display_name
        }
      )

    }
  )


  rankings.forEach(
    ranking => {

      if(!ranking.creatorId){

        return

      }


      const profile =
        profilesByUser.get(
          ranking.creatorId
        )


      if(!profile){

        return

      }


      ranking.creatorUsername =
        profile.username

      ranking.creatorDisplayName =
        profile.display_name

      ranking.creator =
        profile.display_name ||
        profile.username ||
        ""

    }
  )


  return rankings

}


async function attachRankingItems(
  rankingRows:RankingRow[]
):Promise<Ranking[]>{

  if(
    rankingRows.length === 0
  ){

    return []

  }


  const rankingIds =
    rankingRows.map(
      row => row.id
    )


  /*
   *
   * Load ranking items in batches.
   *
   * A single .in() query containing hundreds
   * of ranking IDs can produce a URL large
   * enough to exceed the HTTP header limit.
   *
   */
  const rankingItems:any[] = []

  const batchSize = 50


  for(
    let i = 0;
    i < rankingIds.length;
    i += batchSize
  ){

    const batchIds =
      rankingIds.slice(
        i,
        i + batchSize
      )


    const {
      data:batchItems,
      error:batchItemsError
    } = await supabase
      .from("ranking_items")
      .select(
        `
          ranking_id,
          position,
          name,
          votes
        `
      )
      .in(
        "ranking_id",
        batchIds
      )
      .order(
        "position",
        {
          ascending:true
        }
      )


    if(batchItemsError){

      console.error(
        "ALL RANKING ITEMS LOAD ERROR",
        batchItemsError
      )

    }
    else if(batchItems){

      rankingItems.push(
        ...batchItems
      )

    }

  }


  const itemsByRanking =
    new Map<
      string,
      any[]
    >()


  rankingItems.forEach(
    item => {

      const existing =
        itemsByRanking.get(
          item.ranking_id
        ) ?? []

      existing.push(
        item
      )

      itemsByRanking.set(
        item.ranking_id,
        existing
      )

    }
  )


  const rankings =
    rankingRows.map(
      row => {

        return mapRanking(
          row,
          itemsByRanking.get(
            row.id
          ) ?? []
        )

      }
    )


  return attachProfiles(
    rankings,
    rankingRows
  )

}


export async function getSupabaseRanking(
  id:string
):Promise<Ranking | null>{

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
      "RANKING LOAD ERROR",
      rankingError
    )

    return null

  }


  if(!rankingRow){

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
      "RANKING ITEMS LOAD ERROR",
      itemsError
    )

  }


  const ranking =
    mapRanking(
      rankingRow as RankingRow,
      items ?? []
    )


  if(rankingRow.user_id){

    const {
      data:profile
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


export async function getAllSupabaseRankings():Promise<Ranking[]>{

  const {
    data:rankingRows,
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
    .order(
      "created_at",
      {
        ascending:false
      }
    )


  if(rankingError){

    console.error(
      "ALL RANKINGS LOAD ERROR",
      rankingError
    )

    return []

  }


  if(!rankingRows){

    return []

  }


  return attachRankingItems(
    rankingRows as RankingRow[]
  )

}


export async function getRankingsForLocation(
  location:LocationConfig
):Promise<Ranking[]>{

  let query =
    supabase
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


  if(location.cityLevel){

    query =
      query
        .eq(
          "location_city",
          location.city
        )
        .eq(
          "location_country",
          location.country
        )

  }
  else{

    query =
      query
        .eq(
          "location_name",
          location.name
        )
        .eq(
          "location_city",
          location.city
        )
        .eq(
          "location_country",
          location.country
        )

  }


  const {
    data:rankingRows,
    error:rankingError
  } = await query
    .order(
      "created_at",
      {
        ascending:false
      }
    )


  if(rankingError){

    console.error(
      "LOCATION RANKINGS LOAD ERROR",
      rankingError
    )

    return []

  }


  if(!rankingRows){

    return []

  }


  return attachRankingItems(
    rankingRows as RankingRow[]
  )

}


export async function getAllRankings():Promise<Ranking[]>{

  return getAllSupabaseRankings()

}


export async function createSupabaseRanking(
  ranking:Ranking,
  userId:string
):Promise<Ranking | null>{

  const {
    data:rankingRow,
    error:rankingError
  } = await supabase
    .from("rankings")
    .insert(
      {
        title:ranking.title,
        category:ranking.category,
        description:ranking.description,
        views:ranking.views ?? 0,
        user_id:userId,
        parent_id:ranking.parentId,
        root_id:ranking.rootId,
        source_type:
          ranking.source === "remix"
            ? "remix"
            : ranking.source === "challenge"
              ? "challenge"
              : ranking.source === "seed"
                ? "seed"
                : "community",

        location_name:
          ranking.location?.name ??
          null,

        location_city:
          ranking.location?.city ??
          null,

        location_country:
          ranking.location?.country ??
          null
      }
    )
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
    .single()


  if(rankingError){

    console.error(
      "RANKING CREATE ERROR",
      rankingError
    )

    return null

  }


  if(!rankingRow){

    return null

  }


  const rankingItems =
    ranking.items.map(
      item => ({
        ranking_id:
          rankingRow.id,
        position:
          item.position,
        name:
          item.name,
        votes:
          item.votes ?? 0
      })
    )


  const {
    error:itemsError
  } = await supabase
    .from("ranking_items")
    .insert(
      rankingItems
    )


  if(itemsError){

    console.error(
      "RANKING ITEMS CREATE ERROR",
      itemsError
    )

    return null

  }


  return getSupabaseRanking(
    rankingRow.id
  )

}