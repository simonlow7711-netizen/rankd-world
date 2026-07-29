import { Ranking } from "@/types/ranking"


export const rankings: Ranking[] = [

  {
    id: "best-burgers-london",

    title: "Top 7 Burgers In London",

    category: "Food",

    creator: "Simon",

    description:
      "The ultimate burger ranking.",

    items: [

      {
        position: 1,
        name: "Patty & Bun",
        votes: 342
      },

      {
        position: 2,
        name: "Bleecker Burger",
        votes: 315
      },

      {
        position: 3,
        name: "Burger & Beyond",
        votes: 280
      },

      {
        position: 4,
        name: "Black Bear Burger",
        votes: 245
      },

      {
        position: 5,
        name: "Honest Burgers",
        votes: 220
      },

      {
        position: 6,
        name: "MeatLiquor",
        votes: 190
      },

      {
        position: 7,
        name: "Flat Iron",
        votes: 170
      }

    ]

  }

]