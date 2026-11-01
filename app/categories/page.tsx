import CategoryTile from "@/components/CategoryTile"

import {
  categoryToSlug
} from "@/utils/categorySlug"

import {
  sharePreviewImage,
  sharePreviewUrl
} from "@/utils/ogImage"


type Category = {
  name: string
  slug: string
  description: string
}


const categories: Category[] = [
  {
    name: "Food & Drink",
    slug: "food-drink",
    description:
      "Restaurants, dishes, drinks and the places worth arguing about."
  },
  {
    name: "Film & TV",
    slug: "film-tv",
    description:
      "Films, television, characters, scenes and everything worth watching."
  },
  {
    name: "Music",
    slug: "music",
    description:
      "Artists, albums, songs, sounds and the records that define your taste."
  },
  {
    name: "Sport",
    slug: "sport",
    description:
      "Teams, players, moments, rivalries and sporting greatness."
  },
  {
    name: "Gaming",
    slug: "gaming",
    description:
      "Games, consoles, characters and the experiences worth playing."
  },
  {
    name: "Travel",
    slug: "travel",
    description:
      "Cities, destinations, journeys and places worth discovering."
  },
  {
    name: "Technology",
    slug: "technology",
    description:
      "Products, platforms, inventions and the technology shaping everyday life."
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description:
      "Everyday choices, experiences and the things that make life better."
  },
  {
    name: "Books",
    slug: "books",
    description:
      "Novels, non-fiction, authors and the books that stay with you."
  },
  {
    name: "Art & Design",
    slug: "art-design",
    description:
      "Artists, objects, buildings, graphics and ideas worth looking at."
  },
  {
    name: "Fashion",
    slug: "fashion",
    description:
      "Designers, labels, looks and the clothes that define an era."
  },
  {
    name: "Beauty",
    slug: "beauty",
    description:
      "Products, routines, brands and the beauty choices worth ranking."
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    description:
      "Training, wellbeing, habits and the choices that help you feel better."
  },
  {
    name: "Business",
    slug: "business",
    description:
      "Companies, founders, ideas and the businesses shaping the world."
  },
  {
    name: "Science",
    slug: "science",
    description:
      "Discoveries, ideas, questions and the science behind the world."
  },
  {
    name: "History",
    slug: "history",
    description:
      "People, events, places and moments that changed the course of history."
  },
  {
    name: "Nature & Animals",
    slug: "nature-animals",
    description:
      "Wildlife, landscapes, species and the natural world."
  },
  {
    name: "Cars & Transport",
    slug: "cars-transport",
    description:
      "Cars, trains, planes, bikes and the machines that move us."
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description:
      "Interiors, gardens, objects and the spaces we choose to live in."
  },
  {
    name: "General",
    slug: "general",
    description:
      "Everything else. If it can be ranked, it belongs on RANKD."
  }
]


export const metadata = {
  title:
    "RANKD Categories | Explore Top 7 Rankings",

  description:
    "Explore RANKD by category and discover the Top 7 opinions shaping conversations.",

  openGraph: {
    title:
      "RANKD Categories | Explore Top 7 Rankings",
    description:
      "Explore RANKD by category and discover the Top 7 opinions shaping conversations.",
    images: [
      sharePreviewImage(
        "RANKD Categories"
      )
    ]
  },

  twitter: {
    card: "summary_large_image" as const,
    images: [
      sharePreviewUrl()
    ]
  }
}


export default function CategoriesPage() {

  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >

        <section
          className="
            rankd-edition
            relative
            mb-12
            overflow-hidden
            rounded-[28px]
            border
            border-[#FF6B35]
            bg-[#F7F4EE]
            px-6
            py-12
            text-center
            md:mb-16
            md:px-12
            md:py-16
          "
        >

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-3xl
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.24em]
                text-[#FF6B35]
              "
            >
              RANKD / 20 EDITIONS
            </p>

            <h1
              className="
                mt-4
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.06em]
                md:text-7xl
              "
            >
              Find your
              <br />
              next debate.
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-lg
                leading-relaxed
                text-black/55
                md:text-xl
              "
            >
              Twenty designed collections. Same RANKD system. A different cover
              for every debate.
            </p>

          </div>

        </section>

        <section
          className="
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
            md:gap-5
          "
        >

          {categories.map(
            category => (
              <CategoryTile
                key={category.slug}
                category={category.name}
                description={
                  category.description
                }
                href={
                  `/category/${categoryToSlug(category.name)}`
                }
                size="index"
              />
            )
          )}

        </section>

      </div>

    </main>
  )
}
