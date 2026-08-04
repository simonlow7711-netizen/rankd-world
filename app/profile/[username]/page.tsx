import type { Metadata } from "next"

import ProfileClient from "./ProfileClient"





type Props = {

  params: Promise<{
    username:string
  }>

}








export async function generateMetadata({

  params

}:Props):Promise<Metadata>{



  const {

    username

  } = await params



  return {

    title:

      `${username}'s RANKD Profile | RANKD`,

    description:

      `Discover ${username}'s Top 7 rankings and taste profile.`

  }

}








export default async function PublicProfilePage({

  params

}:Props){



  const {

    username

  } = await params





  return (

    <ProfileClient

      username={username}

    />

  )

}