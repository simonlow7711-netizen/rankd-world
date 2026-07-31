import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"


dotenv.config({
  path: ".env.local"
})



const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL


const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY



if (!supabaseUrl || !serviceRoleKey) {

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





const rankings = [

  {
    title: "Best Burgers London",
    category: "Food",
    description:
      "The ultimate ranking of London's best burgers.",
    items: [
      "Patty & Bun",
      "Bleecker Burger",
      "Honest Burgers",
      "Burger & Beyond",
      "Black Bear Burger",
      "Shake Shack",
      "Five Guys"
    ]
  },


  {
    title: "Greatest Films Ever",
    category: "Film",
    description:
      "The greatest films ranked by RANKD.",
    items: [
      "The Shawshank Redemption",
      "The Godfather",
      "The Dark Knight",
      "Pulp Fiction",
      "Goodfellas",
      "Inception",
      "The Lord of the Rings"
    ]
  },


  {
    title: "Greatest Footballers Ever",
    category: "Sport",
    description:
      "The greatest footballers of all time.",
    items: [
      "Lionel Messi",
      "Diego Maradona",
      "Pelé",
      "Cristiano Ronaldo",
      "Johan Cruyff",
      "Zinedine Zidane",
      "Ronaldinho"
    ]
  },


  {
    title: "Places Everyone Should Visit",
    category: "Travel",
    description:
      "Seven places everyone should experience.",
    items: [
      "Kyoto",
      "Rome",
      "New York",
      "Iceland",
      "Paris",
      "Cape Town",
      "Sydney"
    ]
  },


  {
    title: "Greatest Albums Ever",
    category: "Music",
    description:
      "The greatest albums ranked by RANKD.",
    items: [
      "Pink Floyd - The Dark Side of the Moon",
      "Michael Jackson - Thriller",
      "The Beatles - Abbey Road",
      "Nirvana - Nevermind",
      "Fleetwood Mac - Rumours",
      "Bob Dylan - Highway 61 Revisited",
      "Radiohead - OK Computer"
    ]
  }

]







async function seed(){


  console.log(
    "Creating RANKD Team profile..."
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
      "PROFILE ERROR:",
      profileError
    )

    process.exit(1)

  }





  console.log(
    "Creating rankings..."
  )





  for(const ranking of rankings){


    const {
      data:existing,
      error:existingError

    } = await supabase

      .from("rankings")

      .select("id")

      .eq(
        "title",
        ranking.title
      )

      .eq(
        "user_id",
        RANKD_TEAM_ID
      )

      .maybeSingle()






    if(existingError){

      console.error(
        existingError
      )

      continue

    }






    if(existing){

      console.log(
        `Skipping existing: ${ranking.title}`
      )

      continue

    }







    const rankingId =
      crypto.randomUUID()







    const {
      error:rankingError

    } = await supabase

      .from("rankings")

      .insert({

        id: rankingId,

        user_id: RANKD_TEAM_ID,

        title: ranking.title,

        category: ranking.category,

        description: ranking.description,

        views: 0

      })






    if(rankingError){

      console.error(
        "RANKING ERROR:",
        rankingError
      )

      continue

    }







    const items =
      ranking.items.map(
        (item,index)=>({

          ranking_id: rankingId,

          position: index + 1,

          name: item,

          votes: 0

        })
      )






    const {
      error:itemError

    } = await supabase

      .from("ranking_items")

      .insert(items)






    if(itemError){

      console.error(
        "ITEM ERROR:",
        itemError
      )

      continue

    }






    console.log(
      `Created: ${ranking.title}`
    )


  }





  console.log(
    "RANKD seed complete 🚀"
  )


}





seed()