import type {
  Metadata
} from "next"


import Link from "next/link"


import {
  redirect
} from "next/navigation"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "@/utils/notifications"


import {
  supabase
} from "@/utils/supabase"


export const metadata: Metadata = {

  title:
    "Notifications | RANKD",

  description:
    "Your RANKD notifications."

}


export const revalidate =
  0


export default async function NotificationsPage() {

  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser()


  if (
    !user
  ) {

    redirect(
      "/"
    )

  }


  const notifications =
    await getNotifications(
      user.id
    )


  const rankingIds =

    notifications

      .flatMap(

        notification => [

          notification.rankingId,

          notification.remixRankingId

        ]

      )

      .filter(

        (
          id
        ): id is string =>

          Boolean(
            id
          )

      )


  const uniqueRankingIds =
    Array.from(
      new Set(
        rankingIds
      )
    )


  const rankings =

    await Promise.all(

      uniqueRankingIds.map(

        async rankingId => {

          const ranking =
            await getSupabaseRanking(
              rankingId
            )


          return [

            rankingId,

            ranking

          ] as const

        }

      )

    )


  const rankingMap =
    new Map(

      rankings

    )


  const unreadCount =

    notifications.filter(

      notification =>
        !notification.read

    ).length


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
        px-6
        py-16
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        <header
          className="
            mb-12
          "
        >

          <p
            className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            "
          >

            Notifications

          </p>


          <div
            className="
              flex
              items-end
              justify-between
              gap-6
              mt-4
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  font-black
                "
              >

                Your notifications.

              </h1>


              <p
                className="
                  mt-4
                  text-lg
                  text-gray-500
                "
              >

                See what is happening with your RANKDs.

              </p>

            </div>


            {
              unreadCount > 0 && (

                <form
                  action={
                    async () => {

                      "use server"

                      await markAllNotificationsAsRead(
                        user.id
                      )

                    }
                  }
                >

                  <button
                    type="submit"
                    className="
                      rounded-full
                      border
                      border-black
                      px-5
                      py-3
                      text-sm
                      font-black
                      hover:bg-black
                      hover:text-white
                      transition
                      whitespace-nowrap
                    "
                  >

                    Mark all as read

                  </button>

                </form>

              )
            }

          </div>

        </header>


        {
          notifications.length === 0 ? (

            <section
              className="
                bg-white
                rounded-[32px]
                p-10
                md:p-14
                text-center
              "
            >

              <div
                className="
                  text-5xl
                "
              >

                🔔

              </div>


              <h2
                className="
                  mt-6
                  text-3xl
                  font-black
                "
              >

                No notifications yet.

              </h2>


              <p
                className="
                  mt-3
                  text-gray-500
                "
              >

                When someone remixes one of your RANKDs,
                you will see it here.

              </p>

            </section>

          ) : (

            <section
              className="
                space-y-4
              "
            >

              {
                notifications.map(

                  notification => {

                    const originalRanking =
                      notification.rankingId
                        ? rankingMap.get(
                            notification.rankingId
                          )
                        : null


                    const remixRanking =
                      notification.remixRankingId
                        ? rankingMap.get(
                            notification.remixRankingId
                          )
                        : null


                    const originalTitle =
                      originalRanking?.title ??
                      "your RANKD"


                    const remixTitle =
                      remixRanking?.title ??
                      "a new RANKD"


                    return (

                      <div
                        key={
                          notification.id
                        }
                        className={`
                          rounded-[28px]
                          p-6
                          md:p-8
                          transition
                          ${
                            notification.read
                              ? "bg-white"
                              : "bg-black text-white"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            items-start
                            gap-5
                          "
                        >

                          <div
                            className={`
                              shrink-0
                              w-12
                              h-12
                              rounded-full
                              flex
                              items-center
                              justify-center
                              text-xl
                              ${
                                notification.read
                                  ? "bg-[#F7F4EE]"
                                  : "bg-white text-black"
                              }
                            `}
                          >

                            🔄

                          </div>


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-xl
                                    font-black
                                  "
                                >

                                  Someone remixed your RANKD.

                                </p>


                                <p
                                  className={`
                                    mt-2
                                    ${
                                      notification.read
                                        ? "text-gray-500"
                                        : "text-white/70"
                                    }
                                  `}
                                >

                                  Your RANKD{" "}

                                  <span
                                    className="
                                      font-bold
                                    "
                                  >

                                    {originalTitle}

                                  </span>

                                  {" "}was remixed into{" "}

                                  <span
                                    className="
                                      font-bold
                                    "
                                  >

                                    {remixTitle}

                                  </span>

                                  .

                                </p>

                              </div>


                              {
                                !notification.read && (

                                  <span
                                    className="
                                      shrink-0
                                      w-2
                                      h-2
                                      rounded-full
                                      bg-white
                                      mt-3
                                    "
                                    aria-label="Unread"
                                  />

                                )
                              }

                            </div>


                            {
                              notification.remixRankingId && (

                                <div
                                  className="
                                    flex
                                    flex-wrap
                                    gap-3
                                    mt-6
                                  "
                                >

                                  <Link
                                    href={
                                      `/rank/${notification.remixRankingId}`
                                    }
                                    className={`
                                      rounded-full
                                      px-5
                                      py-3
                                      font-black
                                      transition
                                      ${
                                        notification.read
                                          ? "bg-black text-white"
                                          : "bg-white text-black"
                                      }
                                    `}
                                  >

                                    See the remix →

                                  </Link>


                                  {
                                    notification.rankingId && (

                                      <Link
                                        href={
                                          `/rank/${notification.rankingId}`
                                        }
                                        className={`
                                          rounded-full
                                          border
                                          px-5
                                          py-3
                                          font-black
                                          transition
                                          ${
                                            notification.read
                                              ? "border-black hover:bg-black hover:text-white"
                                              : "border-white hover:bg-white hover:text-black"
                                          }
                                        `}
                                      >

                                        View your RANKD

                                      </Link>

                                    )
                                  }


                                  {
                                    !notification.read && (

                                      <form
                                        action={
                                          async () => {

                                            "use server"

                                            await markNotificationAsRead(

                                              notification.id

                                            )

                                          }
                                        }
                                      >

                                        <button
                                          type="submit"
                                          className={`
                                            rounded-full
                                            border
                                            px-5
                                            py-3
                                            font-black
                                            transition
                                            ${
                                              notification.read
                                                ? "border-black"
                                                : "border-white"
                                            }
                                          `}
                                        >

                                          Mark as read

                                        </button>

                                      </form>

                                    )
                                  }

                                </div>

                              )
                            }

                          </div>

                        </div>

                      </div>

                    )

                  }

                )
              }

            </section>

          )
        }

      </div>

    </main>

  )

}