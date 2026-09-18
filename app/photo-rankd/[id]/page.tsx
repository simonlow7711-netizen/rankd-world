"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useParams
} from "next/navigation"

import Link from "next/link"

import {
  supabase
} from "@/utils/supabase"


type Hotspot = {
  id:number
  x:number
  y:number
}


type PhotoRankd = {
  id:string
  title:string
  description:string | null
  image_url:string
  ranking_ids:string[]
  hotspots:Hotspot[]
}


type Ranking = {
  id:string
  title:string
}


export default function PhotoRankdPage(){

  const params =
    useParams<{
      id:string
    }>()


  const id =
    params?.id


  const [
    experience,
    setExperience
  ] = useState<PhotoRankd | null>(null)


  const [
    rankings,
    setRankings
  ] = useState<Ranking[]>([])


  const [
    loading,
    setLoading
  ] = useState(true)


  const [
    error,
    setError
  ] = useState(false)


  useEffect(() => {

    if(!id){

      return

    }


    async function loadExperience(){

      setLoading(true)

      setError(false)


      const {
        data,
        error:experienceError
      } = await supabase
        .from("photo_rankds")
        .select(
          `
            id,
            title,
            description,
            image_url,
            ranking_ids,
            hotspots
          `
        )
        .eq(
          "id",
          id
        )
        .eq(
          "published",
          true
        )
        .maybeSingle()


      if(experienceError){

        console.error(
          "PHOTO RANKD LOAD ERROR",
          experienceError
        )

        setError(true)
        setLoading(false)

        return

      }


      if(!data){

        setError(true)
        setLoading(false)

        return

      }


      const loadedExperience =
        data as PhotoRankd


      setExperience(
        loadedExperience
      )


      const rankingIds =
        loadedExperience.ranking_ids ?? []


      if(
        rankingIds.length > 0
      ){

        const {
          data:rankingRows,
          error:rankingError
        } = await supabase
          .from("rankings")
          .select(
            `
              id,
              title
            `
          )
          .in(
            "id",
            rankingIds
          )


        if(rankingError){

          console.error(
            "PHOTO RANKD RANKINGS LOAD ERROR",
            rankingError
          )

        }


        setRankings(
          rankingRows ?? []
        )

      }


      setLoading(false)

    }


    loadExperience()

  },[id])


  if(loading){

    return (
      <main
        style={{
          minHeight:"100vh",
          background:"#F7F4EE",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:"32px"
        }}
      >

        <div
          style={{
            textAlign:"center"
          }}
        >

          <div
            style={{
              fontSize:"48px",
              fontWeight:900,
              color:"#FF6B35",
              lineHeight:1
            }}
          >
            7
          </div>

          <p
            style={{
              marginTop:"16px",
              color:"#111"
            }}
          >
            Loading Photo RANKD…
          </p>

        </div>

      </main>
    )

  }


  if(
    error ||
    !experience
  ){

    return (
      <main
        style={{
          minHeight:"100vh",
          background:"#F7F4EE",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:"32px"
        }}
      >

        <div
          style={{
            maxWidth:"520px",
            textAlign:"center"
          }}
        >

          <div
            style={{
              fontSize:"72px",
              fontWeight:900,
              color:"#FF6B35",
              lineHeight:1
            }}
          >
            7
          </div>

          <h1
            style={{
              marginTop:"24px",
              fontSize:"32px",
              fontWeight:800,
              color:"#111"
            }}
          >
            Photo RANKD not found
          </h1>

          <p
            style={{
              marginTop:"12px",
              color:"#666",
              lineHeight:1.6
            }}
          >
            This Photo RANKD may no longer be published
            or the link may be incorrect.
          </p>

          <Link
            href="/"
            style={{
              display:"inline-flex",
              marginTop:"24px",
              padding:"12px 18px",
              borderRadius:"999px",
              background:"#111",
              color:"#fff",
              textDecoration:"none",
              fontWeight:700
            }}
          >
            Back to RANKD
          </Link>

        </div>

      </main>
    )

  }


  const rankingById =
    new Map(
      rankings.map(
        ranking => [
          ranking.id,
          ranking
        ]
      )
    )


  const hotspots =
    experience.hotspots ?? []


  return (
    <main
      style={{
        minHeight:"100vh",
        background:"#F7F4EE",
        padding:"24px"
      }}
    >

      <div
        style={{
          maxWidth:"1400px",
          margin:"0 auto"
        }}
      >

        <header
          style={{
            marginBottom:"24px"
          }}
        >

          <div
            style={{
              display:"flex",
              alignItems:"center",
              gap:"12px"
            }}
          >

            <div
              style={{
                fontSize:"42px",
                fontWeight:900,
                color:"#FF6B35",
                lineHeight:1
              }}
            >
              7
            </div>

            <div
              style={{
                fontSize:"22px",
                fontWeight:900,
                letterSpacing:"-0.02em"
              }}
            >
              RANKD
            </div>

          </div>


          <h1
            style={{
              marginTop:"20px",
              fontSize:"clamp(28px,5vw,56px)",
              lineHeight:1,
              fontWeight:900,
              letterSpacing:"-0.04em"
            }}
          >
            {experience.title}
          </h1>


          {
            experience.description && (

              <p
                style={{
                  maxWidth:"760px",
                  marginTop:"14px",
                  fontSize:"18px",
                  lineHeight:1.5,
                  color:"#555"
                }}
              >
                {experience.description}
              </p>

            )
          }

        </header>


        <div
          style={{
            position:"relative",
            width:"100%",
            overflow:"hidden",
            borderRadius:"24px",
            background:"#111",
            boxShadow:"0 20px 60px rgba(0,0,0,0.18)"
          }}
        >

          <img
            src={experience.image_url}
            alt={experience.title}
            style={{
              display:"block",
              width:"100%",
              height:"auto"
            }}
          />


          {
            hotspots.map(
              hotspot => {

                const ranking =
                  rankingById.get(
                    experience.ranking_ids[
                      hotspot.id - 1
                    ]
                  )


                if(!ranking){

                  return null

                }


                return (
                  <Link
                    key={hotspot.id}
                    href={`/rank/${ranking.id}`}
                    aria-label={
                      ranking.title
                    }
                    style={{
                      position:"absolute",
                      left:`${hotspot.x}%`,
                      top:`${hotspot.y}%`,
                      transform:"translate(-50%,-50%)",
                      width:"64px",
                      height:"64px",
                      borderRadius:"50%",
                      background:"#FF6B35",
                      color:"#111",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      textDecoration:"none",
                      fontSize:"30px",
                      fontWeight:900,
                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.28)",
                      border:"4px solid #F7F4EE",
                      zIndex:10
                    }}
                  >
                    7
                  </Link>
                )

              }
            )
          }

        </div>


        <section
          style={{
            marginTop:"32px",
            display:"grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap:"14px"
          }}
        >

          {
            experience.ranking_ids.map(
              (
                rankingId,
                index
              ) => {

                const ranking =
                  rankingById.get(
                    rankingId
                  )


                if(!ranking){

                  return null

                }


                return (
                  <Link
                    key={rankingId}
                    href={`/rank/${rankingId}`}
                    style={{
                      display:"block",
                      padding:"18px",
                      background:"#fff",
                      color:"#111",
                      borderRadius:"16px",
                      textDecoration:"none",
                      boxShadow:
                        "0 4px 16px rgba(0,0,0,0.08)"
                    }}
                  >

                    <div
                      style={{
                        display:"flex",
                        alignItems:"center",
                        gap:"10px",
                        marginBottom:"8px"
                      }}
                    >

                      <span
                        style={{
                          width:"32px",
                          height:"32px",
                          borderRadius:"50%",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",
                          background:"#FF6B35",
                          fontWeight:900
                        }}
                      >
                        7
                      </span>

                      <span
                        style={{
                          fontSize:"12px",
                          fontWeight:800,
                          textTransform:"uppercase",
                          letterSpacing:"0.08em",
                          color:"#777"
                        }}
                      >
                        RANKD {index + 1}
                      </span>

                    </div>


                    <div
                      style={{
                        fontSize:"18px",
                        lineHeight:1.25,
                        fontWeight:800
                      }}
                    >
                      {ranking.title}
                    </div>

                  </Link>
                )

              }
            )
          }

        </section>

      </div>

    </main>
  )

}