import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

import { seedRankings } from "../data/seedRankings"


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









async function seed(){


console.log(
  "🚀 Starting RANKD seed..."
)







//
// Ensure RAND Team profile exists
//


const {

error:profileError

}=await supabase

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







for(const ranking of seedRankings){



const {

data:existing

}=await supabase

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

}=await supabase

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

source_type:"team"

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

(item,index)=>({

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

}=await supabase

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