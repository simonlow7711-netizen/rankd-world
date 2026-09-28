export function getGoogleMapsQuery(
  url?: string
): string | null {

  if(
    !url
  ){
    return null
  }

  try{
    const parsed =
      new URL(
        url
      )

    const hostname =
      parsed.hostname.toLowerCase()

    const pathname =
      parsed.pathname

    const isGoogleMapsHost =
      hostname === "maps.google.com" ||
      hostname === "google.com" ||
      hostname === "www.google.com"

    if(
      !isGoogleMapsHost ||
      !pathname.startsWith(
        "/maps"
      )
    ){
      return null
    }

    /*
      Prefer exact coordinates from the Google Maps URL.

      Example:
      /maps/place/Dubrovnik/@42.6507,18.0944,14z/...

      Using coordinates removes ambiguity and prevents
      Google Maps from choosing the viewer's current location.
    */

    const coordinateMatch =
      url.match(
        /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/
      )

    if(
      coordinateMatch?.[1] &&
      coordinateMatch?.[2]
    ){
      return (
        `${coordinateMatch[1]},${coordinateMatch[2]}`
      )
    }

    /*
      Some Google Maps URLs contain coordinates in
      embedded map data rather than the @lat,lng format.
    */

    const embeddedCoordinateMatch =
      url.match(
        /!3d(-?\d+(?:\.\d+)?).*?!4d(-?\d+(?:\.\d+)?)/
      )

    if(
      embeddedCoordinateMatch?.[1] &&
      embeddedCoordinateMatch?.[2]
    ){
      return (
        `${embeddedCoordinateMatch[1]},${embeddedCoordinateMatch[2]}`
      )
    }

    const query =
      parsed.searchParams.get(
        "q"
      ) ??
      parsed.searchParams.get(
        "query"
      ) ??
      parsed.searchParams.get(
        "destination"
      )

    if(
      query
    ){
      return query
    }

    const placeMatch =
      pathname.match(
        /\/maps\/place\/([^/]+)/
      )

    if(
      placeMatch?.[1]
    ){
      return decodeURIComponent(
        placeMatch[1]
          .replace(
            /\+/g,
            " "
          )
      )
    }

    const searchMatch =
      pathname.match(
        /\/maps\/search\/([^/]+)/
      )

    if(
      searchMatch?.[1]
    ){
      return decodeURIComponent(
        searchMatch[1]
          .replace(
            /\+/g,
            " "
          )
      )
    }

    return null
  }
  catch{
    return null
  }
}


export function getGoogleMapsEmbedUrl(
  url?: string
): string | null {

  const query =
    getGoogleMapsQuery(
      url
    )

  if(
    !query
  ){
    return null
  }

  return (
    "https://www.google.com/maps" +
    `?q=${encodeURIComponent(
      query
    )}` +
    "&z=15" +
    "&output=embed"
  )
}