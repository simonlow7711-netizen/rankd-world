import {
  categoryToSlug
} from "@/utils/categorySlug"


export function editionPhotoFilename(
  category?: string | null
) {

  const slug =
    categoryToSlug(
      category || "General"
    )

  if (
    slug ===
    "health-and-fitness"
  ) {
    return "health-fitness.jpg"
  }

  return `${slug}.jpg`

}


export function getEditionPhoto(
  category?: string | null
) {

  return `/editions/${editionPhotoFilename(category)}`

}
