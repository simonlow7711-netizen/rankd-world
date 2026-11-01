import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

import {
  parseRankingDescription
} from "../utils/rankingMedia"


dotenv.config({
  path: ".env.local"
})


const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL


const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY


if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}


const supabase =
  createClient(
    supabaseUrl,
    serviceRoleKey
  )


async function main() {

  const {
    data,
    error
  } =
    await supabase
      .from("rankings")
      .select(
        "id, description, hero_media_url"
      )


  if (error) {
    console.error(
      "Could not read rankings.hero_media_url. Run scripts/add-hero-media-url.sql in the Supabase SQL editor first."
    )
    console.error(error.message)
    process.exit(1)
  }


  let updated = 0


  for (const row of data ?? []) {

    const parsed =
      parseRankingDescription(
        row.description
      )

    const nextUrl =
      (row.hero_media_url as string | null)?.trim() ||
      parsed.mediaUrl

    const descriptionChanged =
      parsed.text !==
      (row.description ?? "").trim()

    const urlChanged =
      nextUrl !==
      (row.hero_media_url as string | null)


    if (!descriptionChanged && !urlChanged) {
      continue
    }


    const {
      error: updateError
    } =
      await supabase
        .from("rankings")
        .update({
          description:
            parsed.text ||
            null,
          hero_media_url:
            nextUrl
        })
        .eq(
          "id",
          row.id
        )


    if (updateError) {
      console.error(
        "Update failed for",
        row.id,
        updateError.message
      )
      continue
    }


    updated += 1

  }


  console.log(
    `Migrated ${updated} ranking${updated === 1 ? "" : "s"} to hero_media_url.`
  )

}


main()
