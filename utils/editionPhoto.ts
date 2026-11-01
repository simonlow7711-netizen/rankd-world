import {
  categoryToSlug
} from "@/utils/categorySlug"


export function getEditionPhoto(
  category?: string | null
) {

  const slug =
    categoryToSlug(
      category || "General"
    )

  return `/editions/${slug}.jpg`

}
