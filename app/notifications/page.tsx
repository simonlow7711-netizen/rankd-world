import {
  redirect
} from "next/navigation"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import NotificationCard, {
  NotificationCardData
} from "@/components/NotificationCard"

import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"

import {
  getServerNotifications,
  markAllServerNotificationsAsRead,
  markServerNotificationAsRead
} from "@/utils/notificationsServer"

import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


export default async function NotificationsPage() {

  const serverSupabase =
    await createSupabaseServerClient()

  const {
    data: {
      user
    }
  } =
    await serverSupabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const userId =
    user.id

  const notifications =
    await getServerNotifications(
      userId
    )

  const notificationViews:
    NotificationCardData[] =
      await Promise.all(

        notifications.map(

          async notification => {

            let originalRankingTitle:
              string | null =
                null

            let originalRankingCategory:
              string | null =
                null

            let remixRankingTitle:
              string | null =
                null

            let remixRankingCategory:
              string | null =
                null

            if (notification.rankingId) {
              try {
                const originalRanking =
                  await getSupabaseRanking(
                    notification.rankingId
                  )

                originalRankingTitle =
                  originalRanking?.title ??
                  null

                originalRankingCategory =
                  originalRanking?.category ??
                  null
              } catch {
              }
            }

            if (notification.remixRankingId) {
              try {
                const remixRanking =
                  await getSupabaseRanking(
                    notification.remixRankingId
                  )

                remixRankingTitle =
                  remixRanking?.title ??
                  null

                remixRankingCategory =
                  remixRanking?.category ??
                  null
              } catch {
              }
            }

            return {
              id:
                notification.id,
              type:
                notification.type,
              read:
                notification.read,
              createdAt:
                notification.createdAt,
              actorName:
                "Another RANKD user",
              originalRankingId:
                notification.rankingId,
              originalRankingTitle,
              originalRankingCategory,
              remixRankingId:
                notification.remixRankingId,
              remixRankingTitle,
              remixRankingCategory
            }

          }

        )

      )

  const theme =
    getCategoryTheme("General")

  async function markAllRead() {

    "use server"

    await markAllServerNotificationsAsRead(
      userId
    )

  }

  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        px-4
        py-10
        text-black
        md:px-8
        md:py-14
      "
    >

      <div
        className="
          mx-auto
          max-w-4xl
        "
      >

        <section
          className="
            rankd-edition
            relative
            overflow-hidden
            rounded-[28px]
            border
            px-6
            py-10
            text-center
            md:px-12
            md:py-16
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
              category="General"
              bleed="page"
            >

              <p
                className="
                  text-[11px]
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
                  RANKD / ACTIVITY
                </EditionMark>
              </p>

              <h1
                className={`
                  mx-auto
                  mt-5
                  max-w-3xl
                  text-4xl
                  font-black
                  text-balance
                  md:text-6xl
                  ${theme.titleClass}
                `}
              >
                <EditionTitle
                  theme={theme}
                >
                  Notifications
                </EditionTitle>
              </h1>

            </EditionHeader>

            <p
              className="
                relative
                z-10
                mx-auto
                -mt-12
                max-w-md
                text-lg
                leading-relaxed
                text-black/50
                md:text-xl
              "
            >
              See when someone ranks or remixes one of your RANKDs.
            </p>

            {
              notifications.length > 0 && (
                <div
                  className="
                    relative
                    z-10
                    mt-8
                    flex
                    justify-center
                    border-t
                    border-black
                    pt-8
                  "
                >
                  <form action={markAllRead}>
                    <button
                      type="submit"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-full
                        bg-black
                        px-7
                        py-3.5
                        text-sm
                        font-black
                        text-white
                      "
                    >
                      Mark all as read
                    </button>
                  </form>
                </div>
              )
            }

          </div>

        </section>

        {
          notificationViews.length === 0 ? (

            <div
              className="
                rankd-edition
                relative
                mt-6
                overflow-hidden
                rounded-[28px]
                border
                px-6
                py-10
                text-center
                md:px-12
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
                  category="General"
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
                      Nothing yet
                    </EditionMark>
                  </p>

                  <h2
                    className={`
                      mx-auto
                      mt-4
                      max-w-xl
                      text-3xl
                      font-black
                      text-balance
                      md:text-4xl
                      ${theme.titleClass}
                    `}
                  >
                    <EditionTitle
                      theme={theme}
                    >
                      No notifications yet.
                    </EditionTitle>
                  </h2>

                </EditionHeader>

                <p
                  className="
                    relative
                    z-10
                    mx-auto
                    -mt-10
                    max-w-md
                    leading-relaxed
                    text-black/50
                  "
                >
                  When someone ranks or remixes one of your RANKDs, you will see it here.
                </p>

              </div>

            </div>

          ) : (

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {
                notificationViews.map(
                  notification => (
                    <NotificationCard
                      key={
                        notification.id
                      }
                      notification={
                        notification
                      }
                      markReadAction={
                        notification.read
                          ? undefined
                          : async () => {
                              "use server"

                              await markServerNotificationAsRead(
                                notification.id
                              )
                            }
                      }
                    />
                  )
                )
              }

            </div>

          )
        }

      </div>

    </main>

  )

}
