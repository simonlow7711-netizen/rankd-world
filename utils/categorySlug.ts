export function categoryToSlug(
  category: string
) {

  return category

    .toLowerCase()

    .replace(
      /&/g,
      "and"
    )

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      ""
    )

}