import {
  RankingCategory
} from "@/utils/categories"


export type CategoryMetadata = {

  emoji: string

  description: string

  label: string

}


export const categoryMetadata: Record<
  RankingCategory,
  CategoryMetadata
> = {

  "Food & Drink": {

    emoji:
      "🍕",

    description:
      "The best food, restaurants, dishes, drinks and culinary experiences.",

    label:
      "Eat & drink"

  },


  "Film & TV": {

    emoji:
      "🎬",

    description:
      "The films, TV shows, characters and moments worth ranking.",

    label:
      "Watch"

  },


  "Music": {

    emoji:
      "🎵",

    description:
      "Artists, albums, songs, genres and the sounds that matter.",

    label:
      "Listen"

  },


  "Sport": {

    emoji:
      "⚽",

    description:
      "The greatest athletes, teams, moments, venues and sporting debates.",

    label:
      "Compete"

  },


  "Gaming": {

    emoji:
      "🎮",

    description:
      "Games, consoles, characters, worlds and everything gaming.",

    label:
      "Play"

  },


  "Travel": {

    emoji:
      "🌍",

    description:
      "Places, destinations, experiences and journeys worth discovering.",

    label:
      "Explore"

  },


  "Technology": {

    emoji:
      "💡",

    description:
      "Technology, gadgets, apps, platforms and the ideas shaping tomorrow.",

    label:
      "Innovate"

  },


  "Lifestyle": {

    emoji:
      "✨",

    description:
      "The things, habits, experiences and choices that make life better.",

    label:
      "Live"

  },


  "Books": {

    emoji:
      "📚",

    description:
      "Books, authors, characters, stories and ideas worth reading.",

    label:
      "Read"

  },


  "Art & Design": {

    emoji:
      "🎨",

    description:
      "Artists, designers, movements, creations and visual inspiration.",

    label:
      "Create"

  },


  "Fashion": {

    emoji:
      "👗",

    description:
      "Brands, designers, looks, trends and the style worth talking about.",

    label:
      "Style"

  },


  "Beauty": {

    emoji:
      "💄",

    description:
      "Beauty brands, products, routines, trends and personal style.",

    label:
      "Glow"

  },


  "Health & Fitness": {

    emoji:
      "💪",

    description:
      "Fitness, wellbeing, healthy habits, activities and performance.",

    label:
      "Move"

  },


  "Business": {

    emoji:
      "💼",

    description:
      "Companies, entrepreneurs, brands, industries and business ideas.",

    label:
      "Build"

  },


  "Science": {

    emoji:
      "🔬",

    description:
      "Discoveries, inventions, theories, experiments and the world of science.",

    label:
      "Discover"

  },


  "History": {

    emoji:
      "🏛️",

    description:
      "People, places, events and moments that shaped the world.",

    label:
      "Remember"

  },


  "Nature & Animals": {

    emoji:
      "🌿",

    description:
      "Animals, wildlife, landscapes, plants and the natural world.",

    label:
      "Wild"

  },


  "Cars & Transport": {

    emoji:
      "🚗",

    description:
      "Cars, motorcycles, trains, planes and the world's greatest machines.",

    label:
      "Move"

  },


  "Home & Garden": {

    emoji:
      "🏡",

    description:
      "Homes, interiors, gardens, design ideas and everyday living.",

    label:
      "Create"

  },


  "General": {

    emoji:
      "🔥",

    description:
      "Everything else worth debating, ranking and putting into a Top 7.",

    label:
      "Anything"

  }

}