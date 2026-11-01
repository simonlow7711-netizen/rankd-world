import PhotoRankdSection from "@/components/PhotoRankdSection"

import {
  getPublishedPhotoRankds
} from "@/utils/photoRankds"


export const dynamic =
  "force-dynamic"


export default async function PhotoRankdIndexPage() {

  const photoRankds =
    await getPublishedPhotoRankds()


  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        px-6
        py-12
        text-black
        md:px-8
        md:py-16
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <header
          className="
            mx-auto
            mb-12
            max-w-3xl
            text-center
            md:mb-16
          "
        >

          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.3em]
              text-[#FF6B35]
            "
          >
            Photo RANKD
          </p>


          <h1
            className="
              mt-3
              text-4xl
              font-black
              leading-[0.88]
              tracking-[-0.06em]
              md:text-6xl
              lg:text-7xl
            "
          >
            See it.
            <br />
            Rank it differently.
          </h1>


          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              text-base
              leading-relaxed
              text-black/50
              md:text-lg
            "
          >
            Photo RANKD turns photographs into Top 7 choices.
            Explore an image, discover the seven things hidden
            within it, and make your own order.
          </p>

        </header>


        {
          photoRankds.length > 0 ? (

            <PhotoRankdSection
              photoRankds={photoRankds}
              showHeading={false}
              showIndexLink={false}
            />

          ) : (

            <p
              className="
                border
                border-black
                px-6
                py-16
                text-center
                text-sm
                text-black/50
              "
            >
              No Photo RANKDs yet.
            </p>

          )
        }

      </div>

    </main>
  )

}
