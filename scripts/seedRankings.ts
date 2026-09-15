import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

import { seedRankings } from "../data/seedRankings"
import { seedRankingsWilliamsburg } from "../data/seedRankingsWilliamsburg"
import { seedRankingsPoblacion } from "../data/seedRankingPoblacion"


dotenv.config({
  path: ".env.local"
})


const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL


const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY


if(!supabaseUrl || !serviceRoleKey){

  console.error(
    "Missing Supabase environment variables"
  )

  process.exit(1)

}


const supabase =
  createClient(
    supabaseUrl,
    serviceRoleKey
  )


const RANKD_TEAM_ID =
  "00000000-0000-0000-0000-000000000001"


type SeedRanking = {
  title:string
  category:string
  description:string
  items:string[]
  location_name?:string
  location_city?:string
  location_country?:string
}


const seedRankingsLeedsSheffield:SeedRanking[] = [


  {
    title:"Leeds Connections to the Invention of Film",
    category:"Film & TV",
    description:"Leeds was remarkably close to the birth of moving pictures, from Louis Le Prince's experiments to some of the earliest surviving film footage.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "Roundhay Garden Scene",
      "Leeds Bridge",
      "Le Prince's single-lens camera",
      "Le Prince's 16-lens camera",
      "Wordsworth Donisthorpe",
      "Le Prince's Woodhouse Lane workshop",
      "Leeds Industrial Museum"
    ]
  },


  {
    title:"People Whose Leeds Work Had Outsized Consequences",
    category:"History",
    description:"Seven people whose work in or through Leeds produced consequences far beyond the city.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "Joseph Aspdin",
      "The Braggs",
      "Matthew Murray",
      "Michael Marks",
      "Anthony Pratt",
      "Denys Fisher",
      "James Henry Atkinson"
    ]
  },


  {
    title:"Objects That Tell the Story of Leeds",
    category:"History",
    description:"Seven objects that reveal surprisingly different sides of Leeds' industrial, commercial, scientific and cultural history.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "The Little Nipper mousetrap",
      "A Spirograph",
      "A Cluedo board",
      "A piece of Portland cement",
      "A Blackburn Type D component",
      "A Chippendale piece of furniture",
      "The Chapeltown cauldron"
    ]
  },


  {
    title:"Leeds Businesses That Started Much Smaller Than You Think",
    category:"Business",
    description:"From a market stall to global businesses and engineering firms, these Leeds origins are smaller than their eventual reputations suggest.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "Marks & Spencer",
      "Waddingtons",
      "Freeserve and Planet Online",
      "Tetley",
      "Burton",
      "Hunslet Engine Company",
      "Job Day & Sons"
    ]
  },


  {
    title:"Leeds Stories That Sound Too Strange to Be True",
    category:"General",
    description:"Seven Leeds stories that sound invented until you discover that the underlying history really is there.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "Sheep on the roof of Temple Works",
      "A protective cauldron sealed inside a Leeds house",
      "Leeds' Victorian zoo and bear pit",
      "Louis Le Prince's disappearance",
      "The Blackburn Type D",
      "The accidental invention of Jelly Tots",
      "A Leeds-made Chippendale commode selling for millions"
    ]
  },


  {
    title:"Times Leeds Was Surprisingly First",
    category:"History",
    description:"Leeds has a remarkable record of early railways, photography, transport technology, engineering and industry.",
    location_name:"Leeds",
    location_city:"Leeds",
    location_country:"United Kingdom",
    items:[
      "The Salamanca steam locomotive",
      "The Middleton Railway",
      "Washington Teasdale's photographic self-portrait",
      "Leeds' permanently automated traffic lights",
      "Leeds' early colour-printing industry",
      "Leeds' early steam-tram engineering",
      "The Blackburn Type D"
    ]
  },


  {
    title:"Sheffield Things That Changed the World",
    category:"Science",
    description:"Seven Sheffield metallurgical breakthroughs and techniques that helped change manufacturing around the world.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Sheffield plate",
      "Crucible steel",
      "The Bessemer process",
      "Stainless steel",
      "18/8 stainless steel",
      "Hadfield manganese steel",
      "High-strength alloy steels"
    ]
  },


  {
    title:"Sheffield Discoveries You Would Never Associate With the City",
    category:"Science",
    description:"Sheffield's scientific legacy stretches far beyond steel, including Nobel-winning discoveries in medicine, chemistry and molecular science.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Cecil Paine and therapeutic penicillin",
      "Howard Florey and clinical penicillin",
      "Hans Krebs and the Krebs Cycle",
      "Lord Porter and flash photolysis",
      "Richard Roberts and split genes",
      "Harry Kroto and buckminsterfullerene",
      "Fraser Stoddart and molecular machines"
    ]
  },


  {
    title:"Sheffield Stories That Sound Completely Impossible",
    category:"History",
    description:"Seven Sheffield stories that seem improbable until the historical record catches up with them.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Penicillin successfully used therapeutically in Sheffield in 1930",
      "Sheffield FC founded before modern football rules",
      "The Youdan Cup before the FA Cup",
      "Stainless steel emerging from a gun-barrel problem",
      "More than 160 water-powered industrial sites",
      "The Great Sheffield Flood",
      "The Benty Grange helmet"
    ]
  },


  {
    title:"Objects That Explain Why Sheffield Became Sheffield",
    category:"History",
    description:"Seven real objects and industrial survivals that make Sheffield's transformation into a global manufacturing city tangible.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Benjamin Huntsman's clock",
      "The Bessemer converter",
      "An Old Sheffield Plate object",
      "The Abbeydale crucible-steel furnace",
      "An Abbeydale waterwheel",
      "An Abbeydale tilt hammer",
      "A Sheffield-made cutlery object"
    ]
  },


  {
    title:"Places Where You Can Still See Sheffield's Industrial Past",
    category:"Travel",
    description:"Seven Sheffield places where the city's industrial history is still visible, tangible and explorable.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Abbeydale Industrial Hamlet",
      "Kelham Island Museum",
      "Shepherd Wheel",
      "Globe Works",
      "Cornish Place",
      "Victoria Quays",
      "Sheaf Works"
    ]
  },


  {
    title:"Sheffield Music Stories That Changed British Music",
    category:"Music",
    description:"Seven Sheffield stories showing how an industrial city became one of Britain's most influential musical cities.",
    location_name:"Sheffield",
    location_city:"Sheffield",
    location_country:"United Kingdom",
    items:[
      "Cabaret Voltaire",
      "The Human League",
      "Warp Records",
      "Pulp",
      "Arctic Monkeys",
      "Sheffield's Bleeps & Bass scene",
      "The Leadmill"
    ]
  }

]


const allSeedRankings:SeedRanking[] = [

  ...seedRankings,

  ...seedRankingsWilliamsburg,

  ...seedRankingsPoblacion,

  ...seedRankingsLeedsSheffield

]


async function seed(){


  console.log(
    "🚀 Starting RANKD seed..."
  )


  const {

    error:profileError

  } = await supabase

    .from("profiles")

    .upsert({

      id:RANKD_TEAM_ID,

      username:"rankd",

      display_name:"RANKD Team"

    })


  if(profileError){

    console.error(
      "Profile error:",
      profileError
    )

    process.exit(1)

  }


  console.log(
    "✅ RANKD Team ready"
  )


  let created = 0

  let skipped = 0


  for(const ranking of allSeedRankings){


    const {

      data:existing,

      error:existingError

    } = await supabase

      .from("rankings")

      .select("id")

      .eq(
        "user_id",
        RANKD_TEAM_ID
      )

      .eq(
        "title",
        ranking.title
      )

      .maybeSingle()


    if(existingError){

      console.error(

        "Lookup error:",

        ranking.title,

        existingError

      )

      continue

    }


    if(existing){

      console.log(
        `⏭ Skipping ${ranking.title}`
      )

      skipped++

      continue

    }


    const rankingId =
      crypto.randomUUID()


    const views =
      Math.floor(
        Math.random()*900
      )+100


    const {

      error:rankingError

    } = await supabase

      .from("rankings")

      .insert({

        id:rankingId,

        user_id:RANKD_TEAM_ID,

        title:ranking.title,

        category:ranking.category,

        description:ranking.description,

        views,

        parent_id:null,

        root_id:rankingId,

        source_type:"team",

        location_name:
          ranking.location_name ?? null,

        location_city:
          ranking.location_city ?? null,

        location_country:
          ranking.location_country ?? null

      })


    if(rankingError){

      console.error(

        "Ranking error:",

        ranking.title,

        rankingError

      )

      continue

    }


    const rankingItems =

      ranking.items.map(

        (item,index) => ({

          ranking_id:rankingId,

          position:index+1,

          name:item,

          votes:

            Math.floor(
              Math.random()*200
            )

        })

      )


    const {

      error:itemError

    } = await supabase

      .from("ranking_items")

      .insert(

        rankingItems

      )


    if(itemError){

      console.error(

        "Items error:",

        ranking.title,

        itemError

      )

      continue

    }


    console.log(
      `✅ Created ${ranking.title}`
    )


    created++


  }


  console.log(

    `

🎉 RANKD seed complete

Created:
${created}

Skipped:
${skipped}

`

  )


}


seed()