import { Ranking } from "@/types/ranking"


export const rankings: Ranking[] = [

  {
    id: "best-burgers-london",

    title: "Top 7 Burgers In London",

    category: "Food",

    creator: "Simon",

    source: "official",

    createdAt: "2026-07-01",

    views: 1200,

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
  },


  {
    id: "best-nolan-films",

    title: "Top 7 Christopher Nolan Films",

    category: "Movies",

    creator: "RANKD Community",

    source: "official",

    createdAt: "2026-07-02",

    views: 1800,

    description:
      "The ultimate Christopher Nolan film ranking.",

    items: [
      {
        position: 1,
        name: "The Dark Knight",
        votes: 520
      },
      {
        position: 2,
        name: "Inception",
        votes: 480
      },
      {
        position: 3,
        name: "Interstellar",
        votes: 450
      },
      {
        position: 4,
        name: "Oppenheimer",
        votes: 410
      },
      {
        position: 5,
        name: "Dunkirk",
        votes: 330
      },
      {
        position: 6,
        name: "Memento",
        votes: 290
      },
      {
        position: 7,
        name: "Tenet",
        votes: 250
      }
    ]
  },


  {
    id: "best-games-ever",

    title: "Top 7 Games Of All Time",

    category: "Gaming",

    creator: "RANKD Community",

    source: "official",

    createdAt: "2026-07-03",

    views: 2200,

    description:
      "The games that defined generations.",

    items: [
      {
        position: 1,
        name: "Minecraft",
        votes: 600
      },
      {
        position: 2,
        name: "The Legend of Zelda",
        votes: 560
      },
      {
        position: 3,
        name: "Grand Theft Auto V",
        votes: 520
      },
      {
        position: 4,
        name: "Tetris",
        votes: 480
      },
      {
        position: 5,
        name: "Red Dead Redemption 2",
        votes: 430
      },
      {
        position: 6,
        name: "Portal",
        votes: 350
      },
      {
        position: 7,
        name: "Super Mario Bros.",
        votes: 320
      }
    ]
  }

]