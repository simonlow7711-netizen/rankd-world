import {
  supabase
} from "@/utils/supabase"


export type PhotoRankdPreview = {
  id: string
  title: string
  description: string | null
  image_url: string
  ranking_ids: string[]
}


export async function getPublishedPhotoRankds(): Promise<PhotoRankdPreview[]> {

  const {
    data,
    error
  } =
    await supabase
      .from("photo_rankds")
      .select(
        `
          id,
          title,
          description,
          image_url,
          ranking_ids
        `
      )


  if (
    error ||
    !Array.isArray(data)
  ) {
    return []
  }


  return data.map(
    item => ({
      id:
        item.id,
      title:
        item.title,
      description:
        item.description,
      image_url:
        item.image_url,
      ranking_ids:
        Array.isArray(
          item.ranking_ids
        )
          ? item.ranking_ids
          : []
    })
  )

}
