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
        bg-[#F7F4EE]
        px-4
        py-10
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

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-black/10
            bg-white/30
            px-6
            py-8
            md:px-10
            md:py-10
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              right-[-1rem]
              top-[-2.5rem]
              select-none
              text-[11rem]
              font-black
              leading-none
              tracking-[-0.12em]
              text-[#FF6B35]/[0.10]
              md:right-4
              md:top-[-3.5rem]
              md:text-[14rem]
            "
            aria-hidden="true"
          >

            7

          </div>


          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-8
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#FF6B35]
                "
              >

                RANKD / ACTIVITY

              </p>


              <h1
                className="
                  mt-3
                  text-4xl
                  font-black
                  leading-[0.95]
                  tracking-[-0.05em]
                  text-black
                  md:text-6xl
                "
              >

                Notifications.

              </h1>


              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-black/60
                  md:text-base
                "
              >

                See when someone ranks or remixes one of
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
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      bg-black
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-[#FF6B35]
                    "
                  >

                    Mark all as read

                  </button>

                </form>

              )
            }

          </div>

        </div>


        {
          notificationViews.length === 0 ? (

            <div
              className="
                relative
                mt-6
                overflow-hidden
                rounded-[28px]
                border
                border-black/10
                bg-white/40
                p-8
                md:p-10
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  right-5
                  top-2
                  select-none
                  text-8xl
                  font-black
                  leading-none
                  tracking-[-0.12em]
                  text-[#FF6B35]/[0.08]
                "
                aria-hidden="true"
              >

                7

              </div>


              <div
                className="
                  relative
                  z-10
                "
              >

                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[#FF6B35]
                  "
                >

                  Nothing yet

                </p>


                <h2
                  className="
                    mt-3
                    text-2xl
                    font-black
                    tracking-[-0.03em]
                    text-black
                  "
                >

                  No notifications yet.

                </h2>


                <p
                  className="
                    mt-3
                    max-w-lg
                    leading-relaxed
                    text-black/60
                  "
                >

                  When someone ranks or remixes one of
                  your RANKDs, you will see it here.

                </p>

              </div>

            </div>

          ) : (

            <div
              className="
                mt-6
                space-y-4
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
                        overflow-hidden
                        rounded-[28px]
                        border
                        bg-white/50
                        transition
                        ${
                          notification.read
                            ? "border-black/10"
                            : "border-[#FF6B35]/30 bg-white/70"
                        }
                      `}
                    >

                      {
                        notification.type ===
                        "remix" ? (

                          <div
                            className="
                              p-6
                              md:p-8
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-5
                              "
                            >

                              <div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-3
                                  "
                                >

                                  <p
                                    className="
                                      text-xs
                                      font-black
                                      uppercase
                                      tracking-[0.2em]
                                      text-[#FF6B35]
                                    "
                                  >

                                    Remix

                                  </p>


                                  {
                                    !notification.read && (

                                      <span
                                        className="
                                          rounded-full
                                          bg-[#FF6B35]
                                          px-2.5
                                          py-1
                                          text-[10px]
                                          font-black
                                          uppercase
                                          tracking-[0.14em]
                                          text-white
                                        "
                                      >

                                        New

                                      </span>

                                    )
                                  }

                                </div>


                                <h2
                                  className="
                                    mt-3
                                    max-w-2xl
                                    text-xl
                                    font-black
                                    leading-tight
                                    tracking-[-0.03em]
                                    text-black
                                    md:text-2xl
                                  "
                                >

                                  {notification.actorName}

                                  {" "}
                                  remixed your RANKD.

                                </h2>

                              </div>


                              <span
                                className="
                                  hidden
                                  shrink-0
                                  select-none
                                  text-5xl
                                  font-black
                                  leading-none
                                  tracking-[-0.1em]
                                  text-[#FF6B35]/20
                                  md:block
                                "
                                aria-hidden="true"
                              >

                                7

                              </span>

                            </div>


                            {
                              notification.originalRankingTitle && (

                                <div
                                  className="
                                    mt-7
                                    rounded-[22px]
                                    border
                                    border-black/10
                                    bg-[#F7F4EE]/70
                                    p-5
                                    md:p-6
                                  "
                                >

                                  <p
                                    className="
                                      text-[10px]
                                      font-black
                                      uppercase
                                      tracking-[0.18em]
                                      text-black/45
                                    "
                                  >

                                    Your original RANKD

                                  </p>


                                  <p
                                    className="
                                      mt-2
                                      font-black
                                      leading-tight
                                      tracking-[-0.02em]
                                      text-black
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
                                          mt-3
                                          inline-flex
                                          text-sm
                                          font-black
                                          text-black
                                          underline
                                          decoration-[#FF6B35]
                                          decoration-2
                                          underline-offset-4
                                          transition
                                          hover:text-[#FF6B35]
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
                                    mt-3
                                    rounded-[22px]
                                    border
                                    border-[#FF6B35]/20
                                    bg-[#FF6B35]/[0.05]
                                    p-5
                                    md:p-6
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
                                          text-[10px]
                                          font-black
                                          uppercase
                                          tracking-[0.18em]
                                          text-[#FF6B35]
                                        "
                                      >

                                        Their remix

                                      </p>


                                      <p
                                        className="
                                          mt-2
                                          text-lg
                                          font-black
                                          leading-tight
                                          tracking-[-0.02em]
                                          text-black
                                          md:text-xl
                                        "
                                      >

                                        {notification.remixRankingTitle}

                                      </p>

                                    </div>


                                    <span
                                      className="
                                        select-none
                                        text-4xl
                                        font-black
                                        leading-none
                                        tracking-[-0.1em]
                                        text-[#FF6B35]/15
                                      "
                                      aria-hidden="true"
                                    >

                                      07

                                    </span>

                                  </div>


                                  {
                                    notification.remixRankingId && (

                                      <Link
                                        href={
                                          `/rank/${notification.remixRankingId}`
                                        }
                                        className="
                                          mt-5
                                          inline-flex
                                          items-center
                                          justify-center
                                          rounded-full
                                          bg-black
                                          px-5
                                          py-3
                                          text-sm
                                          font-black
                                          text-white
                                          transition
                                          hover:bg-[#FF6B35]
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
                                    mt-6
                                    inline-flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    transition
                                    hover:bg-[#FF6B35]
                                  "
                                >

                                  View Remix →

                                </Link>

                              )
                            }


                            <div
                              className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-black/10
                                pt-4
                                text-xs
                                text-black/45
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >

                              <span
                                className="
                                  font-medium
                                "
                              >

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
                                        text-black
                                        transition
                                        hover:text-[#FF6B35]
                                      "
                                    >

                                      Mark as read

                                    </button>

                                  </form>

                                )
                              }

                            </div>

                          </div>

                        ) : notification.type ===
                        "rank" ? (

                          <div
                            className="
                              p-6
                              md:p-8
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-5
                              "
                            >

                              <div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-3
                                  "
                                >

                                  <p
                                    className="
                                      text-xs
                                      font-black
                                      uppercase
                                      tracking-[0.2em]
                                      text-[#FF6B35]
                                    "
                                  >

                                    RANKD

                                  </p>


                                  {
                                    !notification.read && (

                                      <span
                                        className="
                                          rounded-full
                                          bg-[#FF6B35]
                                          px-2.5
                                          py-1
                                          text-[10px]
                                          font-black
                                          uppercase
                                          tracking-[0.14em]
                                          text-white
                                        "
                                      >

                                        New

                                      </span>

                                    )
                                  }

                                </div>


                                <h2
                                  className="
                                    mt-3
                                    max-w-2xl
                                    text-xl
                                    font-black
                                    leading-tight
                                    tracking-[-0.03em]
                                    text-black
                                    md:text-2xl
                                  "
                                >

                                  {notification.actorName}

                                  {" "}
                                  ranked your RANKD.

                                </h2>

                              </div>


                              <span
                                className="
                                  hidden
                                  shrink-0
                                  select-none
                                  text-5xl
                                  font-black
                                  leading-none
                                  tracking-[-0.1em]
                                  text-[#FF6B35]/20
                                  md:block
                                "
                                aria-hidden="true"
                              >

                                7

                              </span>

                            </div>


                            {
                              notification.originalRankingTitle && (

                                <div
                                  className="
                                    mt-7
                                    rounded-[22px]
                                    border
                                    border-black/10
                                    bg-[#F7F4EE]/70
                                    p-5
                                    md:p-6
                                  "
                                >

                                  <p
                                    className="
                                      text-[10px]
                                      font-black
                                      uppercase
                                      tracking-[0.18em]
                                      text-black/45
                                    "
                                  >

                                    Your RANKD

                                  </p>


                                  <p
                                    className="
                                      mt-2
                                      font-black
                                      leading-tight
                                      tracking-[-0.02em]
                                      text-black
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
                                          mt-4
                                          inline-flex
                                          items-center
                                          justify-center
                                          rounded-full
                                          bg-black
                                          px-5
                                          py-3
                                          text-sm
                                          font-black
                                          text-white
                                          transition
                                          hover:bg-[#FF6B35]
                                        "
                                      >

                                        View RANKD →

                                      </Link>

                                    )
                                  }

                                </div>

                              )
                            }


                            <div
                              className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-black/10
                                pt-4
                                text-xs
                                text-black/45
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >

                              <span
                                className="
                                  font-medium
                                "
                              >

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
                                        text-black
                                        transition
                                        hover:text-[#FF6B35]
                                      "
                                    >

                                      Mark as read

                                    </button>

                                  </form>

                                )
                              }

                            </div>

                          </div>

                        ) : (

                          <div
                            className="
                              p-6
                              md:p-8
                            "
                          >

                            <p
                              className="
                                text-xs
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-[#FF6B35]
                              "
                            >

                              Activity

                            </p>


                            <p
                              className="
                                mt-3
                                text-lg
                                font-black
                                tracking-[-0.02em]
                                text-black
                              "
                            >

                              You have a new notification.

                            </p>


                            <p
                              className="
                                mt-3
                                text-xs
                                text-black/45
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