export const categories = [

  "Food & Drink",
  "Film & TV",
  "Music",
  "Sport",
  "Gaming",
  "Travel",
  "Technology",
  "Lifestyle",
  "Books",
  "Art & Design",
  "Fashion",
  "Beauty",
  "Health & Fitness",
  "Business",
  "Science",
  "History",
  "Nature & Animals",
  "Cars & Transport",
  "Home & Garden",
  "General"

] as const


export type RankingCategory =
  typeof categories[number]


export function isValidRankingCategory(
  value: string
): value is RankingCategory {

  return categories.includes(
    value as RankingCategory
  )

}