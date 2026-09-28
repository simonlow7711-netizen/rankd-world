export function getYouTubeVideoId(
  url?:string
):string | null {

  if(!url){
    return null
  }


  try{

    const parsed =
      new URL(
        url
      )


    const hostname =
      parsed.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        )


    if(
      hostname ===
      "youtu.be"
    ){

      const id =
        parsed.pathname
          .split("/")
          .filter(Boolean)[0]


      return id ||
        null

    }


    if(
      hostname ===
        "youtube.com" ||
      hostname ===
        "m.youtube.com" ||
      hostname ===
        "youtube-nocookie.com"
    ){

      const watchId =
        parsed.searchParams.get(
          "v"
        )


      if(watchId){

        return watchId

      }


      const pathParts =
        parsed.pathname
          .split("/")
          .filter(Boolean)


      const pathType =
        pathParts[0]


      if(
        pathType ===
          "shorts" ||
        pathType ===
          "embed" ||
        pathType ===
          "live"
      ){

        return (
          pathParts[1] ||
          null
        )

      }

    }

  }
  catch{

    return null

  }


  return null

}


export function getYouTubeThumbnailUrl(
  url?:string
):string | null {

  const videoId =
    getYouTubeVideoId(
      url
    )


  if(!videoId){
    return null
  }


  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

}