import Link from "next/link"


import {
  redirect
} from "next/navigation"


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


type NotificationView = {

  id: string

  type: string

  read: boolean

  createdAt: string

  actorUserId: string

  actorName: string

  originalRankingId: string | null

  originalRankingTitle: string | null

  remixRankingId: string | null

  remixRankingTitle: string | null

}


function formatNotificationDate(
  value: string
) {

  const date =
    new Date(
      value
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return ""

  }


  return date.toLocaleDateString(
    "en-GB",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric"
    }
  )

}


export default async function NotificationsPage() {

  const serverSupabase =
    await createSupabaseServerClient()


  const {
    data: {
      user
    }
  } =
    await serverSupabase.auth.getUser()


  if (
    !user
  ) {

    redirect(
      "/"
    )

  }


  const notifications =
    await getServerNotifications(
      user.id
    )


  const notificationViews:
    NotificationView[] =
      await Promise.all(

        notifications.map(

          async notification => {

            let originalRankingTitle:
              string | null =
                null


            let remixRankingTitle:
              string | null =
                null


            if (
              notification.rankingId
            ) {

              try {

                const originalRanking =
                  await getSupabaseRanking(
                    notification.rankingId
                  )


                originalRankingTitle =
                  originalRanking?.title ??
                  null

              }

              catch {

              }

            }


            if (
              notification.remixRankingId
            ) {

              try {

                const remixRanking =
                  await getSupabaseRanking(
                    notification.remixRankingId
                  )


                remixRankingTitle =
                  remixRanking?.title ??
                  null

              }

              catch {

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

              actorUserId:
                notification.actorUserId,

              actorName:
                "Another RANKD user",

              originalRankingId:
                notification.rankingId,

              originalRankingTitle,

              remixRankingId:
                notification.remixRankingId,

              remixRankingTitle

            }

          }

        )

      )


  return (

    <main
      className="
        min-h-screen
        px-4
        py-12
        md:px-8
        md:py-16
      "
    >

      <div
        className="
          mx-auto
          max-w-4xl
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-6
            mb-10
          "
        >

          <div>

            <p
              className="
                rankd-accent
                uppercase
                tracking-widest
                text-sm
                font-black
              "
            >

              Activity

            </p>


            <h1
              className="
                mt-3
                text-4xl
                md:text-5xl
                font-black
              "
            >

              Notifications

            </h1>


            <p
              className="
                mt-3
                opacity-70
                max-w-xl
              "
            >

              See when someone remixes one of
              your RANKDs.

            </p>

          </div>


          {
            notifications.length > 0 && (

              <form
                action={
                  async () => {

                    "use server"


                    await markAllServerNotificationsAsRead(
                      user.id
                    )

                  }
                }
              >

                <button
                  type="submit"
                  className="
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    font-black
                    hover:opacity-70
                    transition
                  "
                >

                  Mark all as read

                </button>

              </form>

            )
          }

        </div>


        {
          notificationViews.length === 0 ? (

            <div
              className="
                rankd-card
                p-8
                md:p-10
              "
            >

              <div
                className="
                  text-4xl
                "
              >

                🔔

              </div>


              <h2
                className="
                  mt-4
                  text-2xl
                  font-black
                "
              >

                No notifications yet.

              </h2>


              <p
                className="
                  mt-3
                  opacity-70
                "
              >

                When someone remixes one of your
                RANKDs, you will see it here.

              </p>

            </div>

          ) : (

            <div
              className="
                space-y-5
              "
            >

              {
                notificationViews.map(

                  notification => (

                    <div
                      key={
                        notification.id
                      }
                      className={`
                        rankd-card
                        p-6
                        md:p-8
                        ${
                          notification.read
                            ? ""
                            : "ring-2 ring-black/10"
                        }
                      `}
                    >

                      {
                        notification.type ===
                        "remix" ? (

                          <>

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
                                    text-sm
                                    font-black
                                    uppercase
                                    tracking-widest
                                    rankd-accent
                                  "
                                >

                                  Remix

                                </p>


                                <h2
                                  className="
                                    mt-2
                                    text-xl
                                    md:text-2xl
                                    font-black
                                  "
                                >

                                  {notification.actorName}

                                  {" "}
                                  remixed your RANKD.

                                </h2>

                              </div>


                              {
                                !notification.read && (

                                  <span
                                    className="
                                      shrink-0
                                      rounded-full
                                      bg-black
                                      px-3
                                      py-1
                                      text-xs
                                      font-black
                                      text-white
                                    "
                                  >

                                    NEW

                                  </span>

                                )
                              }

                            </div>


                            {
                              notification.originalRankingTitle && (

                                <div
                                  className="
                                    mt-6
                                    rounded-2xl
                                    border
                                    p-5
                                  "
                                >

                                  <p
                                    className="
                                      text-xs
                                      font-black
                                      uppercase
                                      tracking-widest
                                      opacity-50
                                    "
                                  >

                                    Your original RANKD

                                  </p>


                                  <p
                                    className="
                                      mt-2
                                      font-black
                                    "
                                  >

                                    {notification.originalRankingTitle}

                                  </p>


                                  {
                                    notification.originalRankingId && (

                                      <Link
                                        href={
                                          `/rank/${notification.originalRankingId}`
                                        }
                                        className="
                                          inline-block
                                          mt-3
                                          text-sm
                                          font-black
                                          underline
                                          underline-offset-4
                                        "
                                      >

                                        View original

                                      </Link>

                                    )
                                  }

                                </div>

                              )
                            }


                            {
                              notification.remixRankingTitle && (

                                <div
                                  className="
                                    mt-4
                                    rounded-2xl
                                    border
                                    p-5
                                  "
                                >

                                  <p
                                    className="
                                      text-xs
                                      font-black
                                      uppercase
                                      tracking-widest
                                      opacity-50
                                    "
                                  >

                                    Their remix

                                  </p>


                                  <p
                                    className="
                                      mt-2
                                      text-lg
                                      font-black
                                    "
                                  >

                                    {notification.remixRankingTitle}

                                  </p>


                                  {
                                    notification.remixRankingId && (

                                      <Link
                                        href={
                                          `/rank/${notification.remixRankingId}`
                                        }
                                        className="
                                          inline-flex
                                          items-center
                                          justify-center
                                          mt-4
                                          rounded-xl
                                          px-5
                                          py-3
                                          rankd-primary
                                          font-black
                                        "
                                      >

                                        View Remix →

                                      </Link>

                                    )
                                  }

                                </div>

                              )
                            }


                            {
                              !notification.remixRankingTitle
                              &&
                              notification.remixRankingId && (

                                <Link
                                  href={
                                    `/rank/${notification.remixRankingId}`
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    mt-6
                                    rounded-xl
                                    px-5
                                    py-3
                                    rankd-primary
                                    font-black
                                  "
                                >

                                  View Remix →

                                </Link>

                              )
                            }


                            <div
                              className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                                opacity-50
                              "
                            >

                              <span>

                                {
                                  formatNotificationDate(
                                    notification.createdAt
                                  )
                                }

                              </span>


                              {
                                !notification.read && (

                                  <form
                                    action={
                                      async () => {

                                        "use server"


                                        await markServerNotificationAsRead(
                                          notification.id
                                        )

                                      }
                                    }
                                  >

                                    <button
                                      type="submit"
                                      className="
                                        font-black
                                        hover:opacity-70
                                      "
                                    >

                                      Mark as read

                                    </button>

                                  </form>

                                )
                              }

                            </div>

                          </>

                        ) : (

                          <div>

                            <p
                              className="
                                font-bold
                              "
                            >

                              You have a new notification.

                            </p>


                            <p
                              className="
                                mt-2
                                text-sm
                                opacity-60
                              "
                            >

                              {
                                formatNotificationDate(
                                  notification.createdAt
                                )
                              }

                            </p>

                          </div>

                        )
                      }

                    </div>

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