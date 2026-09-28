"use client"

import {
  useEffect,
  useState
} from "react"

import {
  supabase
} from "@/utils/supabase"


type PhotoRankd = {

  id: string

  title: string

  description: string | null

  image_url: string

}


export default function PhotoRankdIndexPage() {

  const [
    photoRankds,
    setPhotoRankds
  ] =
    useState<PhotoRankd[]>([])


  const [
    loading,
    setLoading
  ] =
    useState(true)


  useEffect(
    () => {

      let cancelled =
        false


      async function loadPhotoRankds() {

        setLoading(true)


        const {
          data,
          error
        } =
          await supabase
            .from("photo_rankds")
            .select(
              `
                id,
                title,
                description,
                image_url
              `
            )


        if (
          cancelled
        ) {
          return
        }


        if (
          error ||
          !data
        ) {
          setPhotoRankds([])
          setLoading(false)
          return
        }


        const loadedPhotoRankds: PhotoRankd[] =
          data.map(
            item => ({
              id:
                item.id,

              title:
                item.title,

              description:
                item.description,

              image_url:
                item.image_url
            })
          )


        setPhotoRankds(
          loadedPhotoRankds
        )

        setLoading(false)

      }


      loadPhotoRankds()


      return () => {
        cancelled = true
      }

    },
    []
  )


  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#F7F4EE",

        color:
          "#111",

        padding:
          "48px 24px 88px"
      }}
    >

      <div
        style={{
          maxWidth:
            "1240px",

          margin:
            "0 auto"
        }}
      >

        <header
          style={{
            maxWidth:
              "900px",

            margin:
              "0 auto 56px"
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              marginBottom:
                "18px"
            }}
          >

            <span
              style={{
                color:
                  "#FF6B35",

                fontSize:
                  "26px",

                lineHeight:
                  1,

                fontWeight:
                  900
              }}
            >
              7
            </span>


            <span
              style={{
                fontSize:
                  "13px",

                lineHeight:
                  1,

                fontWeight:
                  900,

                letterSpacing:
                  "0.14em",

                textTransform:
                  "uppercase"
              }}
            >
              Photo RANKD
            </span>

          </div>


          <h1
            style={{
              margin:
                0,

              fontSize:
                "clamp(46px, 7vw, 82px)",

              lineHeight:
                0.9,

              fontWeight:
                900,

              letterSpacing:
                "-0.065em",

              maxWidth:
                "850px"
            }}
          >
            See it.
            <br />
            Rank it differently.
          </h1>


          <p
            style={{
              margin:
                "26px 0 0",

              maxWidth:
                "700px",

              fontSize:
                "18px",

              lineHeight:
                1.55,

              color:
                "#5F5B56"
            }}
          >
            Photo RANKD turns photographs into Top 7 choices.
            Explore an image, discover the seven things hidden
            within it, and make your own order.
          </p>

        </header>


        {
          loading ? (

            <div
              style={{
                minHeight:
                  "300px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                color:
                  "#777",

                fontSize:
                  "14px"
              }}
            >
              Loading Photo RANKD...
            </div>

          ) : photoRankds.length === 0 ? (

            <div
              style={{
                padding:
                  "64px 0",

                borderTop:
                  "4px solid #111",

                color:
                  "#666",

                fontSize:
                  "15px"
              }}
            >
              No Photo RANKDs yet.
            </div>

          ) : (

            <section
              aria-label="Photo RANKDs"
              className="photo-rankd-grid"
            >

              {
                photoRankds.map(
                  photoRankd => (

                    <a
                      key={
                        photoRankd.id
                      }
                      href={
                        `/photo-rankd/${photoRankd.id}`
                      }
                      className="photo-rankd-card"
                    >

                      <div
                        className="photo-rankd-card-image-wrap"
                      >

                        <img
                          src={
                            photoRankd.image_url
                          }
                          alt={
                            photoRankd.title
                          }
                          className="photo-rankd-card-image"
                        />


                        <div
                          className="photo-rankd-card-number"
                        >
                          7
                        </div>


                        <div
                          className="photo-rankd-card-arrow"
                        >
                          →
                        </div>

                      </div>


                      <div
                        className="photo-rankd-card-content"
                      >

                        <div
                          className="photo-rankd-card-label"
                        >
                          Photo RANKD
                        </div>


                        <h2>
                          {
                            photoRankd.title
                          }
                        </h2>


                        {
                          photoRankd.description && (
                            <p>
                              {
                                photoRankd.description
                              }
                            </p>
                          )
                        }

                      </div>

                    </a>

                  )
                )
              }

            </section>

          )
        }

      </div>


      <style jsx>{`

        .photo-rankd-grid {
          display:
            grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap:
            48px 32px;

          max-width:
            1240px;

          margin:
            0 auto;
        }


        .photo-rankd-card {
          display:
            block;

          color:
            #111;

          text-decoration:
            none;

          min-width:
            0;
        }


        .photo-rankd-card-image-wrap {
          position:
            relative;

          overflow:
            hidden;

          background:
            #E8E3DA;

          aspect-ratio:
            4 / 3;
        }


        .photo-rankd-card-image {
          display:
            block;

          width:
            100%;

          height:
            100%;

          object-fit:
            cover;

          transition:
            transform 280ms ease;
        }


        .photo-rankd-card-number {
          position:
            absolute;

          left:
            18px;

          top:
            18px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          width:
            42px;

          height:
            42px;

          border-radius:
            50%;

          background:
            #111;

          color:
            #F7F4EE;

          font-size:
            20px;

          font-weight:
            900;

          line-height:
            1;
        }


        .photo-rankd-card-arrow {
          position:
            absolute;

          right:
            18px;

          bottom:
            18px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          width:
            46px;

          height:
            46px;

          border-radius:
            50%;

          background:
            #FF6B35;

          color:
            #111;

          font-size:
            24px;

          font-weight:
            900;

          line-height:
            1;

          opacity:
            0;

          transform:
            translateX(-6px);

          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }


        .photo-rankd-card-content {
          padding:
            18px 0 0;
        }


        .photo-rankd-card-label {
          margin-bottom:
            8px;

          color:
            #FF6B35;

          font-size:
            11px;

          line-height:
            1;

          font-weight:
            900;

          letter-spacing:
            0.14em;

          text-transform:
            uppercase;
        }


        .photo-rankd-card-content h2 {
          margin:
            0;

          font-size:
            clamp(25px, 3vw, 36px);

          line-height:
            0.98;

          font-weight:
            900;

          letter-spacing:
            -0.045em;
        }


        .photo-rankd-card-content p {
          margin:
            12px 0 0;

          max-width:
            620px;

          color:
            #625E59;

          font-size:
            14px;

          line-height:
            1.5;
        }


        .photo-rankd-card:hover
        .photo-rankd-card-image {
          transform:
            scale(1.025);
        }


        .photo-rankd-card:hover
        .photo-rankd-card-arrow {
          opacity:
            1;

          transform:
            translateX(0);
        }


        @media (max-width: 700px) {

          main {
            padding:
              32px 16px 64px !important;
          }


          .photo-rankd-grid {
            grid-template-columns:
              minmax(0, 1fr);

            gap:
              40px;
          }


          .photo-rankd-card-image-wrap {
            aspect-ratio:
              4 / 3;
          }


          .photo-rankd-card-arrow {
            opacity:
              1;

            transform:
              translateX(0);
          }

        }

      `}</style>

    </main>
  )
}