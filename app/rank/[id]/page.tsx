import type { Metadata } from "next"

import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"

import RankClient from "./RankClient"





type Props = {

  params: Promise<{
    id:string
  }>

}







export async function generateMetadata(

  {
    params

  }:Props

):Promise<Metadata>{



  const {

    id

  } = await params







  const ranking =

    await getSupabaseRanking(id)








  if(!ranking){


    return {

      title:

        "RANKD | Top 7 everything"

    }


  }








  return {


    title:

      `${ranking.title} | RANKD`,



    description:

      ranking.description

      ||

      `Discover ${ranking.title} on RANKD.`


  }


}









export default function RankPage(){


  return (

    <RankClient />

  )

}