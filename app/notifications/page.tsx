import type {
  Metadata
} from "next"


import Link from "next/link"


import {
  redirect
} from "next/navigation"


import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "@/utils/notifications"


export const metadata: Metadata = {

  title:
    "Notifications | RANKD",

  description:
    "Your RANKD notifications."

}


export const revalidate =
  0


export default async function NotificationsPage() {

  const supabase =
    await createSupabaseServerClient()


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


                      const serverSupabase =
                        await createSupabaseServerClient()


                      const {
                        data: {
                          user: currentUser
                        }
                      } =
                        await serverSupabase.auth.getUser()


                      if (
                        !currentUser
                      ) {

                        return

                      }


                      await markAllNotificationsAsRead(

                        currentUser.id

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


                    const isRemix =
                      notification.type ===
                      "remix"


                    const remixUrl =
                      notification.remixRankingId
                        ? `/rank/${notification.remixRankingId}`
                        : null


                    const originalUrl =
                      notification.rankingId
                        ? `/rank/${notification.rankingId}`
                        : null


                    const originalTitle =
                      originalRanking?.title ??
                      "Your RANKD"


                    const remixTitle =
                      remixRanking?.title ??
                      "New Remix"


                    return (

                      <article
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

                            {
                              isRemix
                                ? "🔄"
                                : "🔔"
                            }

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

                                  {
                                    isRemix
                                      ? "Your RANKD was remixed."
                                      : "You have a new notification."
                                  }

                                </p>


                                {
                                  isRemix ? (

                                    <div
                                      className={`
                                        mt-4
                                        rounded-2xl
                                        p-5
                                        ${
                                          notification.read
                                            ? "bg-[#F7F4EE]"
                                            : "bg-white/10"
                                        }
                                      `}
                                    >

                                      <p
                                        className={`
                                          text-xs
                                          uppercase
                                          tracking-[0.2em]
                                          font-black
                                          ${
                                            notification.read
                                              ? "text-gray-500"
                                              : "text-white/60"
                                          }
                                        `}
                                      >

                                        Original RANKD

                                      </p>


                                      {
                                        originalUrl ? (

                                          <Link
                                            href={
                                              originalUrl
                                            }
                                            className="
                                              block
                                              mt-2
                                              text-lg
                                              font-black
                                              hover:opacity-60
                                              transition
                                            "
                                          >

                                            {originalTitle}

                                          </Link>

                                        ) : (

                                          <p
                                            className="
                                              mt-2
                                              text-lg
                                              font-black
                                            "
                                          >

                                            {originalTitle}

                                          </p>

                                        )
                                      }


                                      <div
                                        className="
                                          flex
                                          items-center
                                          gap-3
                                          my-4
                                        "
                                      >

                                        <span
                                          className={`
                                            h-px
                                            flex-1
                                            ${
                                              notification.read
                                                ? "bg-black/10"
                                                : "bg-white/20"
                                            }
                                          `}
                                        />


                                        <span
                                          className="
                                            text-xl
                                          "
                                        >

                                          ↓

                                        </span>


                                        <span
                                          className={`
                                            h-px
                                            flex-1
                                            ${
                                              notification.read
                                                ? "bg-black/10"
                                                : "bg-white/20"
                                            }
                                          `}
                                        />

                                      </div>


                                      <p
                                        className={`
                                          text-xs
                                          uppercase
                                          tracking-[0.2em]
                                          font-black
                                          ${
                                            notification.read
                                              ? "text-gray-500"
                                              : "text-white/60"
                                          }
                                        `}
                                      >

                                        Remix

                                      </p>


                                      {
                                        remixUrl ? (

                                          <Link
                                            href={
                                              remixUrl
                                            }
                                            className="
                                              block
                                              mt-2
                                              text-lg
                                              font-black
                                              hover:opacity-60
                                              transition
                                            "
                                          >

                                            {remixTitle}

                                          </Link>

                                        ) : (

                                          <p
                                            className="
                                              mt-2
                                              text-lg
                                              font-black
                                            "
                                          >

                                            {remixTitle}

                                          </p>

                                        )
                                      }

                                    </div>

                                  ) : (

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

                                      You have a new RANKD notification.

                                    </p>

                                  )
                                }

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
                              isRemix && (

                                <div
                                  className="
                                    flex
                                    flex-wrap
                                    gap-3
                                    mt-6
                                  "
                                >

                                  {
                                    remixUrl && (

                                      <Link
                                        href={
                                          remixUrl
                                        }
                                        className={`
                                          rounded-full
                                          px-6
                                          py-3
                                          font-black
                                          transition
                                          ${
                                            notification.read
                                              ? "bg-black text-white hover:opacity-70"
                                              : "bg-white text-black hover:bg-white/80"
                                          }
                                        `}
                                      >

                                        View Remix →

                                      </Link>

                                    )
                                  }


                                  {
                                    originalUrl && (

                                      <Link
                                        href={
                                          originalUrl
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

                                        View Original

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


                            {
                              !isRemix && (

                                <div
                                  className="
                                    mt-6
                                  "
                                >

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
                                          className="
                                            rounded-full
                                            border
                                            border-black
                                            px-5
                                            py-3
                                            font-black
                                          "
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

                      </article>

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