import Link from "next/link"


import {
  categories
} from "@/utils/categories"


import {
  categoryMetadata
} from "@/utils/categoryMetadata"


import {
  categoryToSlug
} from "@/utils/categorySlug"


export default function Categories() {


  return (

    <section
      className="
        bg-[#F7F4EE]
        text-black
        rounded-3xl
        p-8
      "
    >


      <div
        className="
          flex
          items-end
          justify-between
          gap-6
          mb-8
        "
      >

        <div>

          <p
            className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            "
          >

            Explore RANKD

          </p>


          <h2
            className="
              mt-2
              text-4xl
              font-black
            "
          >

            Browse Categories

          </h2>

        </div>


        <Link

          href="/categories"

          className="
            hidden
            md:block
            text-sm
            font-black
            uppercase
            tracking-[0.15em]
            hover:underline
          "
        >

          View all →

        </Link>

      </div>


      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-5
        "
      >


        {
          categories.map(

            category => {

              const metadata =
                categoryMetadata[
                  category
                ]


              const slug =
                categoryToSlug(
                  category
                )


              return (

                <Link

                  key={
                    category
                  }

                  href={
                    `/category/${slug}`
                  }

                  className="
                    bg-white
                    rounded-3xl
                    p-6
                    font-black
                    hover:-translate-y-1
                    hover:shadow-lg
                    transition
                  "
                >


                  <div
                    className="
                      text-4xl
                    "
                  >

                    {
                      metadata.emoji
                    }

                  </div>


                  <h3
                    className="
                      mt-4
                      text-xl
                    "
                  >

                    {
                      category
                    }

                  </h3>


                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-500
                      line-clamp-2
                    "
                  >

                    {
                      metadata.description
                    }

                  </p>


                  <p
                    className="
                      mt-4
                      text-sm
                      rankd-accent
                    "
                  >

                    Explore Top 7s →

                  </p>


                </Link>

              )

            }

          )
        }


      </div>


      <Link

        href="/categories"

        className="
          md:hidden
          block
          mt-8
          text-center
          font-black
          uppercase
          tracking-[0.15em]
          text-sm
        "
      >

        View all categories →

      </Link>


    </section>

  )

}