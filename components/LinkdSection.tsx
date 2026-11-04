import Link from "next/link"

import TrackedLink from "@/components/TrackedLink"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import {
  LinkdThread
} from "@/utils/linkd"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type LinkdSectionProps = {
  thread: LinkdThread
}


const bondCopy: Record<
  LinkdThread["kind"],
  string
> = {
  photo:
    "LINKD by a photograph",
  entry:
    "LINKD by an entry",
  location:
    "LINKD by a place",
  category:
    "LINKD by a category"
}


export default function LinkdSection({
  thread
}: LinkdSectionProps) {

  return (
    <section
      className="
        border-b
        border-black/10
        py-16
        md:py-24
      "
    >

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
              rankd-accent
            "
          >
            LINKD
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
            Seven RANKDs. One bond.
          </h2>

          <p
            className="
              mt-4
              max-w-xl
              text-base
              leading-relaxed
              text-black/50
              md:text-lg
            "
          >
            {`${bondCopy[thread.kind]}: `}
            {
              thread.href
                ? (
                    <Link
                      href={
                        thread.href
                      }
                      className="
                        font-black
                        text-black
                      "
                    >
                      {thread.label}
                    </Link>
                  )
                : (
                    <span
                      className="
                        font-black
                        text-black
                      "
                    >
                      {thread.label}
                    </span>
                  )
            }
          </p>

        </div>

      </div>

      <div
        className="
          -mx-6
          flex
          snap-x
          snap-mandatory
          gap-4
          overflow-x-auto
          px-6
          pb-2
          md:-mx-0
          md:px-0
        "
      >
        {
          thread.rankings.map(
            (ranking, index) => {

              const theme =
                getCategoryTheme(
                  ranking.category
                )

              return (
                <TrackedLink
                  key={
                    ranking.id
                  }
                  href={
                    `/rank/${ranking.id}`
                  }
                  event="linkd_opened"
                  eventProps={{
                    rankingId:
                      ranking.id,
                    bondKind:
                      thread.kind,
                    bondLabel:
                      thread.label,
                    position:
                      index + 1
                  }}
                  className="
                    rankd-edition
                    group
                    relative
                    w-[min(78vw,300px)]
                    shrink-0
                    snap-start
                    overflow-hidden
                    rounded-[28px]
                    border
                    p-5
                    text-left
                    text-black
                    md:p-6
                  "
                  style={{
                    backgroundColor:
                      theme.paper,
                    borderColor:
                      "#111111"
                  }}
                >

                  <div
                    className="
                      relative
                      z-10
                    "
                  >

                    <EditionHeader
                      theme={theme}
                      category={
                        ranking.category
                      }
                      bleed="tile"
                    >

                      <p
                        className="
                          text-[11px]
                          font-black
                          tracking-[0.18em]
                        "
                        style={{
                          color:
                            theme.accent
                        }}
                      >
                        <EditionMark
                          theme={theme}
                        >
                          {
                            String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )
                          }
                        </EditionMark>
                      </p>

                      <p
                        className="
                          mt-3
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
                        <EditionMark
                          theme={theme}
                        >
                          {theme.name}
                        </EditionMark>
                      </p>

                      <h3
                        className={`
                          mt-2
                          text-xl
                          font-black
                          text-balance
                          hyphens-none
                          ${theme.titleClass}
                        `}
                      >
                        <EditionTitle
                          theme={theme}
                        >
                          {
                            formatRankingTitle(
                              ranking.title
                            )
                          }
                        </EditionTitle>
                      </h3>

                    </EditionHeader>

                  </div>

                </TrackedLink>
              )

            }
          )
        }
      </div>

    </section>
  )

}
