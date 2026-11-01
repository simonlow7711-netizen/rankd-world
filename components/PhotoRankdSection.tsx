import Link from "next/link"

import {
  PhotoRankdPreview
} from "@/utils/photoRankds"


type PhotoRankdSectionProps = {
  photoRankds: PhotoRankdPreview[]
  showHeading?: boolean
  showIntro?: boolean
  showIndexLink?: boolean
}


export default function PhotoRankdSection({
  photoRankds,
  showHeading = true,
  showIntro = false,
  showIndexLink = true
}: PhotoRankdSectionProps) {

  if (
    photoRankds.length === 0
  ) {
    return null
  }


  return (
    <div>
      {
        showHeading && (
          <div
            className="
              mb-10
              flex
              flex-col
              items-center
              gap-6
              text-center
              md:mb-12
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-[#FF6B35]
                "
              >
                PHOTO RANKD
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  leading-none
                  tracking-[-0.045em]
                  md:text-6xl
                "
              >
                See it.
                Rank it differently.
              </h2>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-xl
                  text-base
                  leading-relaxed
                  text-black/50
                  md:text-lg
                "
              >
                Explore a photograph and find the
                seven RANKDs hidden in it.
              </p>
            </div>

            <Link
              href="/photo-rankd"
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-black
                bg-black
                px-6
                py-3
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#FF6B35]
                hover:text-black
              "
            >
              <span>
                Explore Photo RANKD
              </span>
              <span className="text-lg leading-none">
                →
              </span>
            </Link>
          </div>
        )
      }

      {
        showIntro && (
          <div
            className="
              mb-8
              text-center
              md:mb-10
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

            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-base
                font-medium
                leading-relaxed
                text-black/50
                md:text-lg
              "
            >
              Photo RANKD turns a photograph into a Top 7.
              Open the image, find the seven things in it,
              and rank them your way.
            </p>
          </div>
        )
      }

      <div
        className={`
          grid
          gap-5
          ${
            photoRankds.length > 1
              ? "md:grid-cols-2"
              : ""
          }
        `}
      >
        {
          photoRankds.map(
            photoRankd => (
              <Link
                key={photoRankd.id}
                href={`/photo-rankd/${photoRankd.id}`}
                className="
                  rankd-edition
                  group
                  block
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-black
                  bg-[#F7F4EE]
                  text-black
                "
              >
                <div
                  className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    border-b
                    border-black
                    bg-[#EFEBE3]
                  "
                >
                  <img
                    src={photoRankd.image_url}
                    alt={photoRankd.title}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </div>

                <div
                  className="
                    px-6
                    py-6
                    text-left
                    md:px-8
                    md:py-7
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-[#FF6B35]
                    "
                  >
                    Photo RANKD
                  </p>

                  <h3
                    className="
                      mt-3
                      text-2xl
                      font-black
                      leading-[0.95]
                      tracking-[-0.045em]
                      text-balance
                      hyphens-none
                      md:text-3xl
                    "
                  >
                    {photoRankd.title}
                  </h3>

                  {
                    photoRankd.description && (
                      <p
                        className="
                          mt-4
                          text-sm
                          leading-relaxed
                          text-black/50
                        "
                      >
                        {photoRankd.description}
                      </p>
                    )
                  }

                  <p
                    className="
                      mt-6
                      text-sm
                      font-black
                    "
                  >
                    Open Photo RANKD →
                  </p>
                </div>
              </Link>
            )
          )
        }
      </div>

      {
        !showHeading &&
        showIndexLink && (
          <div
            className="
              mt-8
              flex
              justify-center
            "
          >
            <Link
              href="/photo-rankd"
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-black
                bg-black
                px-6
                py-3
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#FF6B35]
                hover:text-black
              "
            >
              <span>
                Explore Photo RANKD
              </span>
              <span className="text-lg leading-none">
                →
              </span>
            </Link>
          </div>
        )
      }
    </div>
  )

}
