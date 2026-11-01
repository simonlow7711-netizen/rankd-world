import CategoryMark, {
  categoryMarkJokes
} from "@/components/CategoryMark"

import {
  categories
} from "@/utils/categories"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


export const metadata = {
  title: "Category marks | RANKD",
  robots: {
    index: false,
    follow: false
  }
}


export default function CategoryMarksPage() {

  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        px-5
        py-12
        text-black
        sm:px-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >
        <header
          className="
            mb-10
            max-w-2xl
          "
        >
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.22em]
              text-black/45
            "
          >
            RANKD / MARKS / 20
          </p>
          <h1
            className="
              mt-3
              text-4xl
              font-black
              tracking-[-0.05em]
              text-balance
            "
          >
            Spine marks
          </h1>
          <p
            className="
              mt-4
              text-base
              leading-7
              text-black/55
            "
          >
            Graphic, not cartoon. The 7 is the joke. Title stays at the top of
            the card; these sit as a vertical spine. Working set — some will
            change.
          </p>
        </header>

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {
            categories.map(
              category => {

                const theme =
                  getCategoryTheme(
                    category
                  )

                return (
                  <article
                    key={category}
                    className="
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-black
                    "
                    style={{
                      backgroundColor:
                        theme.paper
                    }}
                  >
                    <div
                      className="
                        grid
                        grid-cols-[72px_1fr]
                        min-h-[280px]
                      "
                    >
                      <div
                        className="
                          border-r
                          border-black
                        "
                      >
                        <CategoryMark
                          category={category}
                          className="h-full w-full"
                        />
                      </div>
                      <div
                        className="
                          flex
                          flex-col
                          justify-end
                          px-4
                          py-4
                        "
                      >
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                          "
                          style={{
                            color:
                              theme.accent
                          }}
                        >
                          {theme.index} / {theme.label}
                        </p>
                        <h2
                          className="
                            mt-2
                            text-lg
                            font-black
                            leading-tight
                            tracking-[-0.04em]
                          "
                        >
                          {category}
                        </h2>
                        <p
                          className="
                            mt-2
                            text-sm
                            leading-5
                            text-black/55
                          "
                        >
                          {categoryMarkJokes[category]}
                        </p>
                      </div>
                    </div>
                  </article>
                )

              }
            )
          }
        </div>
      </div>
    </main>
  )

}
