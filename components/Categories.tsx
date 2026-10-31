import Link from "next/link"

import CategoryTile from "@/components/CategoryTile"

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
        px-6
        py-20
        md:py-24
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            border-b
            border-black/10
            pb-8
            text-center
            md:mb-12
            md:items-center
          "
        >

          <div>

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                rankd-accent
              "
            >
              EXPLORE RANKD
            </p>

            <h2
              className="
                mt-4
                text-4xl
                font-black
                leading-[1]
                tracking-[-0.045em]
                md:text-6xl
              "
            >
              Find something to rank.
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
              Twenty editorial collections. Every RANKD lives in one of them.
            </p>

          </div>

          <Link
            href="/categories"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              text-sm
              font-black
              transition
              hover:opacity-50
            "
          >

            <span>
              View all categories
            </span>

            <span
              className="
                text-lg
                leading-none
                rankd-accent
              "
            >
              →
            </span>

          </Link>

        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {categories.map(
            category => {

              const metadata =
                categoryMetadata[
                  category
                ]

              return (

                <CategoryTile
                  key={category}
                  category={category}
                  description={
                    metadata.description
                  }
                  href={
                    `/category/${categoryToSlug(category)}`
                  }
                />

              )

            }
          )}

        </div>

        <div
          className="
            mt-10
            border-t
            border-black/10
            pt-6
            text-center
          "
        >

          <Link
            href="/categories"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              transition
              hover:opacity-50
            "
          >

            <span>
              Explore all 20 categories
            </span>

            <span
              className="
                text-lg
                leading-none
                rankd-accent
              "
            >
              →
            </span>

          </Link>

        </div>

      </div>

    </section>

  )

}
