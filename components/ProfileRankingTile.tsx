import Link from "next/link"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import RankingEngagement from "@/components/RankingEngagement"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"

import {
  RankingEngagementData
} from "@/utils/rankingEngagement"


type ProfileRankingTileProps = {
  id: string
  title: string
  category?: string | null
  engagement?: RankingEngagementData
}


export default function ProfileRankingTile({
  id,
  title,
  category,
  engagement
}: ProfileRankingTileProps) {

  const theme =
    getCategoryTheme(
      category
    )

  return (
    <Link
      href={
        `/rank/${id}`
      }
      className="
        rankd-edition
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        p-6
        text-center
        text-black
        md:p-8
      "
      style={{
        backgroundColor:
          theme.paper,
        borderColor:
          "#111111"
      }}
    >

      <EditionChrome
        theme={theme}
      />

      <div
        className="
          relative
          z-10
        "
      >

        <EditionHeader
          theme={theme}
          category={
            category ||
            theme.name
          }
          bleed="tile"
        >

          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
            "
            style={{
              color:
                theme.accent
            }}
          >
            <EditionMark
              theme={theme}
            >
              {theme.index} · RANKD / {theme.label}
            </EditionMark>
          </p>

          <p
            className="
              mt-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
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
              mx-auto
              mt-4
              max-w-xl
              text-3xl
              font-black
              text-balance
              hyphens-none
              md:text-4xl
              ${theme.titleClass}
            `}
          >
            <EditionTitle
              theme={theme}
            >
              {
                formatRankingTitle(
                  title
                )
              }
            </EditionTitle>
          </h3>

        </EditionHeader>

        <div
          className="
            relative
            z-10
            px-6
            pb-7
            md:px-8
          "
        >

          {
            engagement && (
              <div
                className="
                  flex
                  justify-center
                "
              >
                <RankingEngagement
                  views={
                    engagement.views
                  }
                  rankd={
                    engagement.rankd
                  }
                  rerankd={
                    engagement.rerankd
                  }
                  accentColor={
                    theme.accent
                  }
                />
              </div>
            )
          }

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              border-t
              border-black
              pt-5
            "
          >

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              View conversation
            </span>

            <span
              className="
                text-lg
                leading-none
              "
              style={{
                color:
                  theme.accent
              }}
            >
              →
            </span>

          </div>

        </div>

      </div>

    </Link>
  )

}
